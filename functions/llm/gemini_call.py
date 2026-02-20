# File: functions/llm/gemini_call.py
import os
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

# 1. Configuration
# Retrieve API key from environment variables
API_KEY = os.getenv("GEMINI_API")

# Initialize the Client (Stateless, unified client)
client = None

def get_gemini_client():
    global client
    if client is None:
        if not API_KEY:
            raise ValueError("Error: GEMINI_API environment variable is not set.")
        client = genai.Client(api_key=API_KEY)
    return client

# Define the model ID (Using the one from your snippet, or fallback to stable flash)
MODEL_ID = os.getenv("GEMINI_MODEL", "gemini-2.5-flash") 

# --- PATH CONFIGURATION ---
# Get the directory where THIS script (gemini_call.py) is located.
# This ensures we can find prompt.md and prompt_2.md regardless of where the code is executed from.
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def _clean_response(text: str) -> str:
    """
    Helper to strip Markdown formatting (backticks) from the LLM response.
    """
    if not text: return ""
    text = text.strip()
    if text.startswith("```python"):
        text = text[9:]
    elif text.startswith("```"):
        text = text[3:]
    if text.endswith("```"):
        text = text[:-3]
    return text.strip()

def generate_strategy_from_desc(strategy_name: str, strategy_desc: str) -> str:
    """
    Reads prompt.md, injects the description, and generates a Python strategy function.
    """
    # Construct absolute path to prompt.md
    prompt_path = os.path.join(BASE_DIR, "prompt.md")

    try:
        with open(prompt_path, "r", encoding="utf-8") as f:
            prompt_template = f.read()
    except FileNotFoundError:
        return f"Error: prompt.md file not found at {prompt_path}"

    # Inject variables
    final_prompt = prompt_template.replace("{STRATEGY_NAME}", strategy_name)
    final_prompt = final_prompt.replace("{USER_STRATEGY_DESCRIPTION}", strategy_desc)

    try:
        # NEW SDK CALL
        client = get_gemini_client()
        response = client.models.generate_content(
            model=MODEL_ID,
            contents=final_prompt,
            config=types.GenerateContentConfig(
                temperature=0.1,        # Low temp for code precision
                max_output_tokens=4096,
                top_p=0.95,
            )
        )
        return _clean_response(response.text)
    except Exception as e:
        return f"Error generating code: {str(e)}"

def generate_strategy_from_code(strategy_name: str, strategy_code: str) -> str:
    """
    Reads prompt_2.md, injects the raw code, and generates/validates a Python strategy function.
    """
    # Construct absolute path to prompt_2.md
    prompt_path = os.path.join(BASE_DIR, "prompt_2.md")

    try:
        with open(prompt_path, "r", encoding="utf-8") as f:
            prompt_template = f.read()
    except FileNotFoundError:
        return f"Error: prompt_2.md file not found at {prompt_path}"

    # Inject variables
    final_prompt = prompt_template.replace("{STRATEGY_NAME}", strategy_name)
    final_prompt = final_prompt.replace("{USER_CODE}", strategy_code)

    try:
        # NEW SDK CALL
        client = get_gemini_client()
        response = client.models.generate_content(
            model=MODEL_ID,
            contents=final_prompt,
            config=types.GenerateContentConfig(
                temperature=0.1,
                max_output_tokens=4096,
                top_p=0.95,
            )
        )
        return _clean_response(response.text)
    except Exception as e:
        return f"Error translating/validating code: {str(e)}"

# --- Example Usage ---
if __name__ == "__main__":
    print(f"Using Model: {MODEL_ID}")
    
    # Test 1: From Description
    print("\n--- Generating from Description ---")
    desc_code = generate_strategy_from_desc(
        "Aggressive_Bot", 
        "Always attack the first opponent I see if I have energy."
    )
    print(desc_code)

    # Test 2: From Raw Code
    print("\n--- Generating from Raw Code ---")
    raw_input = """
    function play(nrg, opps) {
        if (nrg > 50) return CONQUER(opps[0]);
        else return HARVEST;
    }
    """
    transpiled_code = generate_strategy_from_code("JS_Converter_Bot", raw_input)
    print(transpiled_code)