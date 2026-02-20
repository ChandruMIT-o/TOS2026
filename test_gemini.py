import os
import sys

# Add functions to path so we can import gemini_call
sys.path.append(os.path.join(os.path.abspath('.'), 'functions'))

import llm.gemini_call as gc

raw_code_snippet = """def strategy_titan(mine, opp, free, energy):
    all_nodes = set(range(1, 27))
    power_nodes = {4, 7, 11, 17, 20, 24}
    home_base = 1
    opp_home = 14
    return ["HARVEST"]
"""

print("Testing raw API call...")
prompt_path = os.path.join(gc.BASE_DIR, "prompt_2.md")
with open(prompt_path, "r", encoding="utf-8") as f:
    prompt_template = f.read()

final_prompt = prompt_template.replace("{STRATEGY_NAME}", "Aggro_Viper")
final_prompt = final_prompt.replace("{USER_CODE}", raw_code_snippet)

client = gc.get_gemini_client()

import re
def my_clean(text):
    if not text: return ""
    match = re.search(r"```python\n(.*?)\n```", text, re.DOTALL)
    if match: return match.group(1).strip(), True
    match = re.search(r"```(.*?)```", text, re.DOTALL)
    if match: return match.group(1).strip(), True
    return text.strip(), False

for model_id in gc.MODELS_TO_TRY:
    try:
        print(f"Call {model_id}")
        response = client.models.generate_content(
            model=model_id,
            contents=final_prompt,
            config=gc.types.GenerateContentConfig(
                temperature=0.1,
                max_output_tokens=4096,
                top_p=0.95,
            )
        )
        print("--- RAW ---")
        print(response.text)
        print("--- CLEANED ---")
        cleaned, did_match = my_clean(response.text)
        print(cleaned)
        print(f"Regex Matched: {did_match}")
        break
    except Exception as e:
        print(e)
