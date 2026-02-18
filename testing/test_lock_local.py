import requests
import json

# Config
PROJECT_ID = "tekhora-26"  # CHANGE THIS TO MATCH YOURS
REGION = "us-central1"
FUNCTION_NAME = "lock_selection"
URL = f"http://127.0.0.1:5001/{PROJECT_ID}/{REGION}/{FUNCTION_NAME}"

def test_lock_in():
    print(f"Testing Function: {FUNCTION_NAME}")
    print(f"Target URL: {URL}\n")

    # Assuming 'Vikram' team exists and has 'draft_1' from the previous test
    payload = {
        "team_name": "Vikram",
        "draft_id": "draft_1"
    }

    try:
        response = requests.post(URL, json=payload)

        if response.status_code == 200:
            data = response.json()
            print("SUCCESS:")
            print(json.dumps(data, indent=2))
            
            if data.get("name_changed"):
                print(f"\n[NOTE] Name conflict detected. Renamed to: {data.get('final_name')}")
                
            if not data.get("is_logic_unique"):
                print("\n[WARN] Logic duplicate detected! This code matches an existing strategy.")

        else:
            print(f"FAILED: Status {response.status_code}")
            print(response.text)

    except requests.exceptions.ConnectionError:
        print("\nERROR: Could not connect to Emulator.")

if __name__ == "__main__":
    test_lock_in()