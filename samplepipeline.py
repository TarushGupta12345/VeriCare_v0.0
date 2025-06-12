import os
import base64
from typing import Union
from openai import OpenAI
from dotenv import load_dotenv
from pdf2image import convert_from_path

POPPLER_PATH = os.getenv("POPPLER_PATH")

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
# Default to the GPT-4o search preview endpoint as documented by OpenRouter
OPENROUTER_BASE_URL = os.getenv(
    "OPENROUTER_BASE_URL",
    "https://openrouter.ai/openai/gpt-4o-search-preview/api",
)
MODEL_NAME = "gpt-4o-search-preview"


def _openrouter_chat_completion(messages):
    """Send chat completion request to OpenRouter via the openai client."""
    if not OPENROUTER_API_KEY:
        raise ValueError("OPENROUTER_API_KEY not set")

    client = OpenAI(base_url=OPENROUTER_BASE_URL, api_key=OPENROUTER_API_KEY)

    completion = client.chat.completions.create(
        model=MODEL_NAME,
        messages=messages,
        extra_headers={"X-Title": "VeriCare"},
    )

    return completion.choices[0].message.content





def process_bill_image(image_path: str) -> Union[str, list[str]]:
    """Process a single image or PDF and return base64 encoded string(s)."""
    ext = os.path.splitext(image_path)[1].lower()
    if ext == ".pdf":
        return process_bill_image_pdf(image_path)
    with open(image_path, "rb") as img_f:
        return base64.b64encode(img_f.read()).decode("utf-8")


def process_bill_image_pdf(pdf_path: str) -> list[str]:
    """Convert each page of a PDF into a base64 encoded PNG string."""
    kwargs = {"dpi": 150}
    if POPPLER_PATH:
        kwargs["poppler_path"] = POPPLER_PATH
    pages = convert_from_path(pdf_path, **kwargs)
    base64_images = []
    for i, page in enumerate(pages):
        temp_image_path = f"temp_page_{i}.png"
        page.save(temp_image_path, "PNG")
        with open(temp_image_path, "rb") as img_f:
            encoded = base64.b64encode(img_f.read()).decode("utf-8")
            base64_images.append(encoded)
        os.remove(temp_image_path)
    return base64_images


def identify_clerical_errors(base64_image: str) -> str:
    """Send a single image to OpenRouter and return the analysis."""
    with open("prompt_clerical.txt", "r", encoding="utf-8") as f:
        prompt_clerical = f.read()

    messages = [
        {"role": "system", "content": prompt_clerical},
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "Please analyze the provided bill."},
                {
                    "type": "image_url",
                    "image_url": {"url": f"data:image/png;base64,{base64_image}"},
                },
            ],
        },
    ]

    return _openrouter_chat_completion(messages)


def identify_clerical_errors_pdf(base64_images: list) -> str:
    """Send multiple images (from a PDF) to OpenRouter for analysis."""
    with open("prompt_clerical.txt", "r", encoding="utf-8") as f:
        prompt_clerical = f.read()

    user_content = [{"type": "text", "text": "Please analyze the provided bill."}]
    for b64 in base64_images:
        user_content.append({
            "type": "image_url",
            "image_url": {"url": f"data:image/png;base64,{b64}"},
        })

    messages = [
        {"role": "system", "content": prompt_clerical},
        {"role": "user", "content": user_content},
    ]

    return _openrouter_chat_completion(messages)


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
