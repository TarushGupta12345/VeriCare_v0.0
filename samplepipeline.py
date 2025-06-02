import os
import base64
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
client = OpenAI()  

def process_bill_image(image_path: str) -> str:
    """
    Reads the image file and returns a base64‐encoded string.
    """
    with open(image_path, "rb") as img_f:
        return base64.b64encode(img_f.read()).decode("utf-8")

def identify_clerical_errors_2(base64_image: str) -> str:
    """
    Sends a system prompt + user prompt (including the base64 image)
    to gpt-4o-mini (vision) using the v1 Chat Completions API.
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
                {
                    "type": "text",
                    "text": "Here is the bill—please parse it accurately."
                },
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
        model="gpt-4o-mini",  
        messages=messages
    )

    return response.choices[0].message.content

if __name__ == "__main__":
    image_path = "medicalbills/4_18_25.png"
    b64 = process_bill_image(image_path)
    output = identify_clerical_errors_2(b64)
    print("=== Model Output ===")
    print(output)
