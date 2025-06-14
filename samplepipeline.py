import os
import base64
import requests
from dotenv import load_dotenv
from openai import OpenAI
from pdf2image import convert_from_path
from PIL import Image

load_dotenv()

OPENROUTER_API_KEY = os.getenv("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")  # Make sure to set this

headers = {
    "Authorization": f"Bearer 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",
    "HTTP-Referer": "https://yourdomain.com",  # Replace with your site or GitHub link
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

def identify_clerical_errors(base64_image: str) -> str:
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
                {"type": "text", "text": "Please provide the complete wording of the bill, word for word."},
                {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{base64_image}"}}
            ]
        }
    ]

    payload = {
        "model": "openai/gpt-4-turbo",  # You can replace this with another OpenRouter-supported model
        "messages": messages
    }

    response = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=payload)

    if response.status_code != 200:
        raise Exception(f"Error: {response.status_code} - {response.text}")

    return response.json()["choices"][0]["message"]["content"]

def identify_clerical_errors_pdf(base64_images: list) -> str:
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

    payload = {
        "model": "openai/gpt-4-turbo",  # Replace if needed
        "messages": messages
    }

    response = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=payload)

    if response.status_code != 200:
        raise Exception(f"Error: {response.status_code} - {response.text}")

    return response.json()["choices"][0]["message"]["content"]

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