import os
import base64
from dotenv import load_dotenv
from openai import OpenAI
import requests

load_dotenv()

client = OpenAI()  
g_cse_key = os.getenv["GOOGLE_CSE_API_KEY"]
g_cse_cx = os.getenv["GOOGLE_CSE_CX"]


def process_bill_image(image_path: str) -> str:
    """
    Reads the image file and returns a base64‐encoded string.
    """
    with open(image_path, "rb") as img_f:
        return base64.b64encode(img_f.read()).decode("utf-8")

def perform_search(query: str, num_results: int = 3) -> list[dict]:
    """
    Calls Google Custom Search JSON API with `query`, returns a list of:
    [
      {
         "title": "...",
         "snippet": "...",
         "link": "https://..."
      },
      ...
    ]
    """
    url = "https://www.googleapis.com/customsearch/v1"
    params = {
        "key":   g_cse_key,
        "cx":    g_cse_cx,
        "q":     query,
        "num":   num_results,
    }

    r = requests.get(url, params=params)
    r.raise_for_status()
    data = r.json()

    hits = []
    for item in data.get("items", [])[:num_results]:
        hits.append({
            "title":   item.get("title"),
            "snippet": item.get("snippet"),
            "link":    item.get("link")
        })
    return hits

def identify_CPT_codes(base64_image: str) -> str:
    """
    Sends a system prompt + user prompt (including the base64 image)
    to gpt-4o-mini (vision) using the v1 Chat Completions API.
    """
    with open("prompt_CPT.txt", "r", encoding="utf-8") as f:
        prompt_CPT = f.read()

    messages = [
        {
            "role": "system",
            "content": prompt_CPT
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

    code_string = response.choices[0].message.content

    arr = [code.strip() for code in code_string.split(",") if code.strip()]

    with (open("CPT_codes.txt", "r", encoding="utf-8") as f):
        cpt_dict = f.read()

    context = ""
    for code in arr:
        query = "CPT code " + code + " description"
        hits = perform_search(query, num_results=1)

        specific_context = f"CPT Code: {code}\n"
        for hit in hits:
            specific_context += f"Title: {hit('title')} \n Snippet: {hit('snippet')} \n Link: {hit('link')}\n"
        context += specific_context + "\n"
    return context

def identify_clerical_errors(base64_image: str, context: str) -> str:
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
                    "text": f"Here are the CPT codes and descriptions according to google: {context}"
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
    context = identify_CPT_codes(b64)
    output = identify_clerical_errors(b64, context)
    print("=== Model Output ===")
    print(output)
