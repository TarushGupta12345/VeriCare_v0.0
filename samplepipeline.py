import os
import base64
import requests
from dotenv import load_dotenv
from openai import OpenAI
from pdf2image import convert_from_path
from PIL import Image
import json

load_dotenv()

# Setup API keys
openai_client = OpenAI()
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")  # Set in .env

headers = {
    "Authorization": f"Bearer {OPENROUTER_API_KEY}",
    "HTTP-Referer": "https://yourdomain.com",  # Replace appropriately
    "X-Title": "Medical Bill Analyzer",
    "Content-Type": "application/json",
}

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
        {"role": "user", "content": [
            {"type": "text", "text": "Please provide the complete wording of the bill, word for word."},
            {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{base64_image}"}}
        ]}
    ]

    response = openai_client.chat.completions.create(
        model="gpt-4o",
        messages=messages
    )

    return response.choices[0].message.content

def analyze_with_web_search(bill_text: str) -> str:
    """Uses OpenRouter to search the web for additional context or errors."""
    with open("prompt_clerical.txt", "r", encoding="utf-8") as f:
        prompt_clerical = f.read()

    search_prompt = f"{prompt_clerical}\n\nPlease analyze the following medical bill:\n{bill_text}"

    payload = {
        "model": "openai/gpt-4o:online",  # Or "openai/gpt-4o-search-preview"
        "messages": [
            {"role": "user", "content": search_prompt}
        ]
    }

    response = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=payload)

    if response.status_code != 200:
        raise Exception(f"Search model error: {response.status_code} - {response.text}")

    return response.json()["choices"][0]["message"]["content"]

if __name__ == "__main__":
    image_path = "medicalbills/4_18_25.pdf"
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