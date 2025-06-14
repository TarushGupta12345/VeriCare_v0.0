import os
import base64
import requests
from dotenv import load_dotenv
from openai import OpenAI
from pdf2image import convert_from_path
from PIL import Image

load_dotenv()

# Setup API client
openai_client = OpenAI()

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


PROMPT_TRANSCRIBE = "Transcribe the bill"


def transcribe_bill_image(base64_image: str) -> str:
    """Send a single image to GPT-4.1 for transcription."""
    messages = [
        {"role": "system", "content": PROMPT_TRANSCRIBE},
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

    response = openai_client.chat.completions.create(
        model="gpt-4.1", messages=messages
    )
    return response.choices[0].message.content


def transcribe_bill_pdf(base64_images: list) -> str:
    """Send all PDF pages to GPT-4.1 in a single prompt."""
    user_content = [{"type": "text", "text": "Please analyze the provided bill."}]
    for b64 in base64_images:
        user_content.append(
            {
                "type": "image_url",
                "image_url": {"url": f"data:image/png;base64,{b64}"},
            }
        )

    messages = [
        {"role": "system", "content": PROMPT_TRANSCRIBE},
        {"role": "user", "content": user_content},
    ]

    response = openai_client.chat.completions.create(
        model="gpt-4.1", messages=messages
    )
    return response.choices[0].message.content


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
        combined_text = transcribe_bill_pdf(base64_images)
    else:
        base64_image = process_bill_image(image_path)
        combined_text = transcribe_bill_image(base64_image)

    print("=== Extracted Bill Text ===")
    print(combined_text)

    print("\n=== Web-Enhanced Analysis ===")
    search_output = analyze_with_web_search(combined_text)
    print(search_output)
