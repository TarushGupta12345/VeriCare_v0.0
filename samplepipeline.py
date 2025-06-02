import os
import pytesseract
from PIL import Image
from langchain.prompts import PromptTemplate
from dotenv import load_dotenv
from langchain_community.chat_models import ChatOpenAI
from langchain_openai import ChatOpenAI
from langchain.chains import LLMChain
load_dotenv()


os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")

llm = ChatOpenAI(model_name="gpt-o4-mini", openai_api_key=os.environ["OPENAI_API_KEY"])

def process_bill_image(image_path: str) -> str:
    try:
        image = Image.open(image_path)
    except Exception as e:
        print(f"Error opening image: {e}")
        return
    
    bill_text = pytesseract.image_to_string(image)

    bill_lines = [line.strip() for line in bill_text.splitlines() if line.strip()]
    bill_lines_block = "\n".join(bill_lines)
    return bill_lines_block
    

def identify_clerical_errors(bill_lines_block: str) -> str:

    with open("prompt_clerical.txt", "r", encoding="utf-8") as f:
        prompt_clerical = f.read()


    prompt_template = PromptTemplate(
        input_variables=["bill_lines_joined"],
        template=prompt_clerical
    )

    chain = LLMChain(llm=llm, prompt=prompt_template)

    clerical_errors_output = chain.run(bill_lines_joined=bill_lines_block)

    return "Clerical Errors Found: \n" + clerical_errors_output

def identify_goodfaith_errors(bill_lines_block: str) -> str:
    with open("prompt_faith.txt", "r", encoding="utf-8") as f:
        prompt_faith = f.read()
    prompt_template = PromptTemplate(
        input_variables=["bill_lines_joined"],
        template=prompt_faith
    )

    chain = LLMChain(llm=llm, prompt=prompt_template)

    goodfaith_errors_output = chain.run(bill_lines_joined=bill_lines_block)

    return "Identiffied Good Faith Errors: \n" + goodfaith_errors_output

def run_bill_analysis(image_path: str):
    bill_lines_block = process_bill_image(image_path)
    print(identify_clerical_errors(bill_lines_block))

image_path = "4:18:25 copy.png"
run_bill_analysis(image_path)
