import os
import base64
import requests
from dotenv import load_dotenv
from openai import OpenAI
from pdf2image import convert_from_path
from PIL import Image

load_dotenv()

# Setup OpenAI API client
openai_client = OpenAI()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
if not OPENROUTER_API_KEY:
    raise EnvironmentError("OPENROUTER_API_KEY is missing. Set it in your environment or .env file.")

# Load prompts from external text files
with open("prompt_transcribe.txt", "r", encoding="utf-8") as f:
    PROMPT_TRANSCRIBE = f.read()

with open("prompt_analyze.txt", "r", encoding="utf-8") as f:
    PROMPT_ANALYZE = f.read()

with open("prompt_clerical.txt", "r", encoding="utf-8") as f:
    PROMPT_CLERICAL = f.read()


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


def transcribe_bill_image(base64_image: str) -> str:
    messages = [
        {"role": "system", "content": PROMPT_TRANSCRIBE},
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "Please analyze the provided bill and follow the redaction instructions."},
                {
                    "type": "image_url",
                    "image_url": {"url": f"data:image/png;base64,{base64_image}"},
                },
            ],
        },
    ]
    response = openai_client.chat.completions.create(model="o3", messages=messages)
    return response.choices[0].message.content


def transcribe_bill_pdf(base64_images: list) -> str:
    user_content = [{"type": "text", "text": "Please analyze the provided bill and follow the redaction instructions."}]
    for b64 in base64_images:
        user_content.append({
            "type": "image_url",
            "image_url": {"url": f"data:image/png;base64,{b64}"},
        })
    messages = [
        {"role": "system", "content": PROMPT_TRANSCRIBE},
        {"role": "user", "content": user_content},
    ]
    response = openai_client.chat.completions.create(model="o3", messages=messages)
    return response.choices[0].message.content


def analyze_with_multiple_models(bill_text: str) -> list:
    openrouter_models = [
        "microsoft/phi-4-reasoning-plus:free",
        "meta-llama/llama-3.3-8b-instruct:free",
        "microsoft/mai-ds-r1:free",
        "opengvlab/internvl3-14b:free",
    ]

    results = []

    # Use OpenAI's o3 model
    try:
        response = openai_client.chat.completions.create(
            model="o3",
            messages=[
                {"role": "system", "content": PROMPT_ANALYZE},
                {"role": "user", "content": bill_text},
            ],
        )
        o3_result = response.choices[0].message.content
        results.append(o3_result)
    except Exception as e:
        print(f"[Exception] Skipping OpenAI gpt-o3 model: {str(e)}")

    # Use OpenRouter models
    for idx, model in enumerate(openrouter_models):
        try:
            payload = {
                "model": model,
                "messages": [
                    {"role": "system", "content": PROMPT_ANALYZE},
                    {"role": "user", "content": bill_text},
                ],
            }
            headers = {
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "HTTP-Referer": "https://yourdomain.com",
                "X-Title": f"Medical Bill Analyzer - Model {idx+1}",
                "Content-Type": "application/json",
            }
            response = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=payload)

            if response.status_code != 200:
                print(f"[Warning] Model {idx+1} failed with status {response.status_code}")
                continue

            result = response.json().get("choices", [{}])[0].get("message", {}).get("content", "")
            if result:
                results.append(result)
            else:
                print(f"[Warning] Model {idx+1} returned empty content")
        except Exception as e:
            print(f"[Exception] Skipping OpenRouter model {idx+1}: {str(e)}")

    return results


def compile_final_report(results: list) -> str:
    combined_input = "\n\n--- MODEL RESPONSES ---\n\n" + "\n\n".join(
        [f"Model {i+1} Response:\n{res}" for i, res in enumerate(results)]
    )

    messages = [
        {"role": "system", "content": PROMPT_CLERICAL},
        {"role": "user", "content": combined_input},
    ]

    response = openai_client.chat.completions.create(model="o3-mini", messages=messages)
    return response.choices[0].message.content


if __name__ == "__main__":
    image_path = "medicalbills/4_18_25_unredacted.png"
    ext = os.path.splitext(image_path)[1].lower()

    if ext == ".pdf":
        base64_images = process_bill_image(image_path)
        combined_text = transcribe_bill_pdf(base64_images)
    else:
        base64_image = process_bill_image(image_path)
        combined_text = transcribe_bill_image(base64_image)

    print("=== Extracted Bill Text ===")
    print(combined_text)

    print("\n=== Multi-Model Analysis ===")
    model_outputs = analyze_with_multiple_models(combined_text)
    for idx, output in enumerate(model_outputs):
        print(f"\n--- Model {idx+1} Output ---\n{output}")

    print("\n=== Final Compiled Report ===")
    final_summary = compile_final_report(model_outputs)
    print(final_summary)