import os
import pytesseract
from PIL import Image
from langchain import PromptTemplate, LLMChain
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv

load_dotenv()

os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")
llm = ChatOpenAI(model="gpt-4o")


def process_bill_image(image_path: str):
    try:
        image = Image.open(image_path)
    except Exception as e:
        print(f"Error opening image: {e}")
        return
    
    bill_text = pytesseract.image_to_string(image)

    bill_lines = [line.strip() for line in bill_text.splitlines() if line.strip()]

    print("Extracted Lines:")
    for line in bill_lines:
        print(line)
    print("\n" + "="*40 + "\n")

    prompt0 = """
You are an expert in medical billing. Identify if a bill is itemized. An itemized medical bill
is a bill that includes line-by-line descriptions, charges, and CPT codes.
    """

    prompt = """
You are an expert in medical billing. Given the following lines of text extracted from a bill,
identify all CPT billing codes. CPT billing codes are typically 5-digit numeric codes.
List each identified CPT code on a separate line. If none are found, reply "None found."

Bill Lines:
{bill_lines}

Output:
"""
    bill_lines_joined = "\n".join(bill_lines)

    prompt_template = PromptTemplate(
        input_variables=["bill_lines"],
        template=prompt
    )

    chain = LLMChain(llm=llm, prompt=prompt_template)

    cpt_codes_output = chain.run(bill_lines=bill_lines_joined)

    print("Identified CPT Billing Codes:")
    print(cpt_codes_output)

if __name__ == "__samplepipeline__":
    image_path = "4:18:25.png"
    process_bill_image(image_path)
