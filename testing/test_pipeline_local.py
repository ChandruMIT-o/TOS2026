import requests
import pandas as pd
import json

PROJECT_ID = "tekhora-26"   # Matches your project
REGION = "us-central1"      # Default emulator region
FUNCTION_NAME = "submit_draft"

URL = f"http://127.0.0.1:5001/{PROJECT_ID}/{REGION}/{FUNCTION_NAME}"

def print_leaderboard(leaderboard_data):
    if not leaderboard_data:
        print("   [Leaderboard is empty]")
        return

    data_list = list(leaderboard_data.values())
    
    df = pd.DataFrame(data_list)
    
    # Select and Reorder columns for readability
    cols_to_show = ["rank", "strategy", "points", "wins", "losses", "total_nodes"]
    
    # Filter to ensure columns exist (avoids errors if data is missing)
    existing_cols = [c for c in cols_to_show if c in df.columns]
    
    # Sort by Rank
    if "rank" in df.columns:
        df = df.sort_values(by="rank")

    print("\n   --- TOURNAMENT RESULTS ---")
    print(df[existing_cols].to_string(index=False))
    print("\n")

def test_draft_submission():
    print(f"Testing Function: {FUNCTION_NAME}")
    print(f"Target URL: {URL}\n")

    # --- TEST CASE 1: GENERATE FROM DESCRIPTION ---
    print("1. Sending 'Description' Payload...")
    
    payload_desc = {
        "team_name": "Vikram",         # Ensure this Doc ID exists in 'tos_teams'
        "draft_id": "draft_1",
        "strategy_name": "Pacifist_Bot",
        "strategy_desc": "I want to collect energy and expand to normal nodes only. I never conquer and I never attack."
    }

    try:
        response = requests.post(URL, json=payload_desc)

        if response.status_code == 200:
            data = response.json()
            print(f"   SUCCESS: {data.get('message')}")
            print(f"   Unique Strategy: {data.get('is_unique')}")
            print_leaderboard(data.get("leaderboard"))
        else:
            print(f"   FAILED: Status {response.status_code}")
            print(f"   Response: {response.text}")

    except requests.exceptions.ConnectionError:
        print("\nERROR: Could not connect. Is 'firebase emulators:start' running?")
        return

    # --- TEST CASE 2: SUBMIT RAW CODE ---
    print("-" * 50)
    print("2. Sending 'Raw Code' Payload...")

    # A simple raw code snippet (Python style for this example)
    raw_code_snippet = """
def Aggro_Viper(free, opp, mine, energy):
    # Attack power nodes if possible
    power_nodes = [4, 7, 11, 17, 20, 24]
    
    # Try to conquer opponent power nodes
    opp_power = [n for n in opp if n in power_nodes]
    if opp_power and energy >= 25:
        return ["CONQUER", opp_power[0]]
        
    # Default harvest
    return ["HARVEST"]
    """

    payload_code = {
        "team_name": "Vikram",
        "draft_id": "draft_2",
        "strategy_name": "Aggro_Viper",
        "strategy_code": raw_code_snippet
    }

    try:
        response = requests.post(URL, json=payload_code)

        if response.status_code == 200:
            data = response.json()
            print(f"   SUCCESS: {data.get('message')}")
            print(f"   Unique Strategy: {data.get('is_unique')}")
            print_leaderboard(data.get("leaderboard"))
        else:
            print(f"   FAILED: Status {response.status_code}")
            print(f"   Response: {response.text}")

    except requests.exceptions.ConnectionError:
        print("\nERROR: Could not connect.")

if __name__ == "__main__":
    test_draft_submission()