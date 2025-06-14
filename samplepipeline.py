import os
import base64
import requests
from dotenv import load_dotenv
from openai import OpenAI, APIConnectionError
from pdf2image import convert_from_path
from PIL import Image
import pytesseract
from io import BytesIO
import json

load_dotenv()

# Setup API keys
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
openai_client = OpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")  # Set in .env
if not OPENROUTER_API_KEY:
    raise EnvironmentError(
        "OPENROUTER_API_KEY is missing. Set it in your environment or .env file."
    )


def process_bill_image(image_path: str):
    ext = os.path.splitext(image_path)[1].lower()
    if ext == ".pdf":
        return process_bill_image_pdf(image_path)
    else:
        with open(image_path, "rb") as img_f:
            return base64.b64encode(img_f.read()).decode("utf-8")


def process_bill_image_pdf(pdf_path: str) -> list:
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


def extract_text_from_image(base64_image: str) -> str:
    """Uses OpenAI GPT-4o to extract full bill text from an image."""
    messages = [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "If you are unable to read the bill, say 'I am unable.' Otherwise, provide the total price of the bill",
                },
                {
                    "type": "image_url",
                    "image_url": {"url": f"data:image/png;base64,{base64_image}"},
                },
            ],
        }
    ]

    try:
        if openai_client is None:
            raise APIConnectionError(
                message="OPENAI_API_KEY not configured", request=None
            )
        response = openai_client.chat.completions.create(
            model="gpt-4o", messages=messages
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"[WARN] OpenAI API failed ({e}), falling back to pytesseract")
        try:
            image_bytes = base64.b64decode(base64_image)
            image = Image.open(BytesIO(image_bytes))
            return pytesseract.image_to_string(image)
        except Exception as fallback_error:
            raise Exception(f"Fallback OCR failed: {fallback_error}")


def analyze_with_web_search(bill_text: str) -> str:
    """Uses OpenRouter to search the web for additional context or errors."""
    if not OPENROUTER_API_KEY:
        raise EnvironmentError(
            "OPENROUTER_API_KEY is not configured. Set it in your environment or .env file."
        )

    with open("prompt_clerical.txt", "r", encoding="utf-8") as f:
        prompt_clerical = f.read()

    search_prompt = (
        f"{prompt_clerical}\n\n"
        "You are connected to Perplexity's Sonar Deep Research engine. "
        "Search the web thoroughly for each billing code and any known clerical errors, "
        "typical pricing ranges, or duplicate charge issues. "
        "Use this information to provide the most comprehensive analysis possible.\n"
        f"Medical bill text:\n{bill_text}"
    )

    payload = {
        "model": "perplexity/sonar-deep-research",  # Web search model
        "messages": [{"role": "user", "content": search_prompt}],
    }

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "HTTP-Referer": "https://yourdomain.com",  # Replace appropriately
        "X-Title": "Medical Bill Analyzer",
        "Content-Type": "application/json",
    }

    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions", headers=headers, json=payload
    )

    if response.status_code != 200:
        raise Exception(f"Search model error: {response.status_code} - {response.text}")

    return response.json()["choices"][0]["message"]["content"]


if __name__ == "__main__":
    image_path = "medicalbills/4_18_25.png"
    ext = os.path.splitext(image_path)[1].lower()

    if ext == ".pdf":
        base64_images = process_bill_image(image_path)
        combined_text = ""
        for b64 in base64_images:
            combined_text += extract_text_from_image(b64) + "\n"
    else:
        base64_image = process_bill_image(image_path)
        combined_text = extract_text_from_image(base64_image)

    print("=== Extracted Bill Text ===")
    print(combined_text)

    print("\n=== Web-Enhanced Analysis ===")
    search_output = analyze_with_web_search(combined_text)
    print(search_output)
