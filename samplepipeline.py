import os
import base64
from dotenv import load_dotenv
from openai import OpenAI
from pdf2image import convert_from_path
from PIL import Image
from pillow_heif import register_heif_opener
import tempfile

load_dotenv()
register_heif_opener()

client = OpenAI()
'''
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
        os.remove(temp_image_path)  # Clean up temp file

    return base64_images
'''

def identify_clerical_errors(image_path: str) -> str:
    """
    Sends a system prompt + user prompt (including a single base64 image)
    to gpt-4.1 using the v1 Chat Completions API.
    """
    with open("prompt_clerical.txt", "r", encoding="utf-8") as f:
        prompt_clerical = f.read()


    ext = os.path.splitext(image_path)[1].lower()
    if ext in [".heic", ".heif"]:
        with Image.open(image_path) as img:
            with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp:
                img.save(tmp.name, format="PNG")
                image_path = tmp.name

    file = client.files.create(
    file=open(image_path, "rb"),
    purpose="user_data"
)
    message = client.responses.create(
    model="gpt-4.1",
    tools=[{"type": "web_search_preview"}],
    input=[
        {
            "role": "system",  
            "content": prompt_clerical
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "input_file",
                    "file_id": file.id,
                },
                {
                    "type": "input_text",
                    "text": "Please analyze the provided bill.",
                },
            ]
        }
    ]
)
    response = client.chat.completions.create(
        model="gpt-4.1",
        messages=message
    )

    return response.choices[0].message.content


if __name__ == "__main__":
    image_path = "medicalbills/4_18_25.pdf"
    ext = os.path.splitext(image_path)[1].lower()
    output = identify_clerical_errors(image_path)

    print("=== Model Output ===")
    print(output)