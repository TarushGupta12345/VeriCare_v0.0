import os
import base64
from dotenv import load_dotenv
from openai import OpenAI
from pdf2image import convert_from_path
from PIL import Image

load_dotenv()

client = OpenAI()

def process_bill_image(image_path: str):
    """
    Determines whether the input is a PDF or image and processes accordingly.
    Returns a single base64 string for image or a list of base64 strings for PDF.
    """
    ext = os.path.splitext(image_path)[1].lower()
    if ext == ".pdf":
        return process_bill_image_pdf(image_path)
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
        os.remove(temp_image_path)  # Clean up temp file

    return base64_images

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
    for b64 in base64_images:
        user_content.append({
            "type": "image_url",
            "image_url": {
                "url": f"data:image/png;base64,{b64}"
            }
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
    image_path = "medicalbills/kaiser hospital bill.pdf"
    ext = os.path.splitext(image_path)[1].lower()

    if ext == ".pdf":
        base64_images = process_bill_image(image_path)
        output = identify_clerical_errors_pdf(base64_images)
    else:
        base64_image = process_bill_image(image_path)
        output = identify_clerical_errors(base64_image)

    print("=== Model Output ===")
    print(output)