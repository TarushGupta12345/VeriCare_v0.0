import os
import base64
from dotenv import load_dotenv
from openai import OpenAI
from pdf2image import convert_from_path
from PIL import Image
from pillow_heif import register_heif_opener
import tempfile
import searchpipeline

load_dotenv()
register_heif_opener()

client = OpenAI()

def process_bill_image(image_path: str):
    """
    Determines whether the input is a PDF or image and processes accordingly.
    Returns a single base64 string for image or a list of base64 strings for PDF.
    """
    ext = os.path.splitext(image_path)[1].lower()
    if ext == ".pdf":
        return process_bill_image_pdf(image_path)
    elif ext in [".heic", ".heif"]:
        with Image.open(image_path) as img:
            with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp:
                img.save(tmp.name, format="PNG")
                tmp.seek(0)
                encoded = base64.b64encode(tmp.read()).decode("utf-8")
        os.remove(tmp.name)
        return encoded
    else:
        with open(image_path, "rb") as img_f:
            return base64.b64encode(img_f.read()).decode("utf-8")

def process_bill_image_pdf(pdf_path: str) -> list:
    """
    Converts each page of a PDF into an image and returns a list of base64-encoded strings.
    """
    pages = convert_from_path(pdf_path, dpi=150)
    base64_images = []

    for i, page in enumerate(pages):
        temp_image_path = f"temp_page_{i}.png"
        page.save(temp_image_path, "PNG")
        with open(temp_image_path, "rb") as img_f:
            encoded = base64.b64encode(img_f.read()).decode("utf-8")
            base64_images.append(encoded)
        os.remove(temp_image_path) 

    return base64_images

def search_up_codes(base64_image: str) -> str:
    with open("prompt_search.txt", "r", encoding="utf-8") as f:
        prompt_search = f.read()
    
    messages = [
        {
            "role":"system",
            "content": prompt_search
        },
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "Please analyze the provided bill."},
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/png;base64,{base64_image}"
                    }
                }
            ]
        }
    ]

    response = client.chat.completions.create(
        model="gpt-4.1",
        messages=messages
    )

    s = response.choices[0].message.content
    results = [
    f"{s.split(':', 1)[0].strip()} code {item.strip()}"
    for item in s.split(":", 1)[1].split(",")
    ]

    full_context = "Identified clerical errors:\n"

    for result in results:
        query = f"Query: '{result} description' \n Country: US \n Language: English \n Limit: 2"
        single_context = f"{result}: {searchpipeline.search_up_codes(query)}\n"
        full_context += single_context + "\n\n"
    return full_context

def search_up_codes_pdf(base64_images: list) -> str:
    total = "Identified codes: "
    for base64_image in base64_images:
        total += search_up_codes(base64_image) + "\n\n"
    return total

def identify_clerical_errors(base64_image: str) -> str:
    """
    Sends a system prompt + user prompt (including a single base64 image)
    to gpt-4.1 using the v1 Chat Completions API.
    """
    with open("prompt_clerical.txt", "r", encoding="utf-8") as f:
        prompt_clerical = f.read()

    messages = [
        {
            "role": "system",
            "content": prompt_clerical
        },
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "Please analyze the provided bill."},
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/png;base64,{base64_image}"
                    }
                },
                {
                    "type": "text",
                    "text": f"Here are the list of codes and specific descriptions: {search_up_codes(base64_image)}"
                }
            ]
        }
    ]

    response = client.chat.completions.create(
        model="gpt-4.1",
        messages=messages
    )
    return response.choices[0].message.content

def identify_clerical_errors_pdf(base64_images: list) -> str:
    """
    Handles multiple base64-encoded images from a multi-page PDF.
    Sends them all in one prompt.
    """
    with open("prompt_clerical.txt", "r", encoding="utf-8") as f:
        prompt_clerical = f.read()

    user_content = [{"type": "text", "text": "Please analyze the provided bill."}]
    codes_context = search_up_codes_pdf(base64_images)

    for b64 in base64_images:
        user_content.append({
            "type": "image_url",
            "image_url": {
                "url": f"data:image/png;base64,{b64}"
            }
        })

    user_content.append({
        "type": "text",
        "text": f"Here are the list of codes and specific descriptions: {codes_context}"
    })

    messages = [
        {"role": "system", "content": prompt_clerical},
        {"role": "user", "content": user_content}
    ]

    response = client.chat.completions.create(
        model="gpt-4.1",
        messages=messages
    )

    return response.choices[0].message.content

if __name__ == "__main__":
    image_path = "medicalbills/4_18_25.pdf"
    ext = os.path.splitext(image_path)[1].lower()

    if ext == ".pdf":
        base64_images = process_bill_image(image_path)
        output = identify_clerical_errors_pdf(base64_images)
    else:
        base64_image = process_bill_image(image_path)
        output = identify_clerical_errors(base64_image)

    print("=== Model Output ===")
    print(output)