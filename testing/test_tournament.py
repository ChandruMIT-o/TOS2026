import requests
import pandas as pd
import json

# Configuration
PROJECT_ID = "tekhora-26"   # Matches what you have
REGION = "us-central1"      # <--- CHANGE THIS. Emulators usually default here.
FUNCTION_NAME = "run_tournament"

# The final URL will look like:
# http://127.0.0.1:5001/tekhora-26/us-central1/run_tournament
URL = f"http://127.0.0.1:5001/{PROJECT_ID}/{REGION}/{FUNCTION_NAME}"

def test_tournament():
    print(f"Testing Function: {FUNCTION_NAME}")
    print(f"URL: {URL}")

    try:
        # No payload needed, acts as a trigger
        response = requests.post(URL)

        if response.status_code == 200:
            print("\n SUCCESS: Tournament Complete")
            data = response.json()
            
            leaderboard = data.get("leaderboard", [])
            
            # Use Pandas to print a pretty table
            if leaderboard:
                df = pd.DataFrame(leaderboard)
                # Reorder columns for readability
                cols = ["Strategy", "Points", "Won", "Lost", "Drawn", "Played"]
                # Filter columns to only those that exist in the dataframe
                existing_cols = [col for col in cols if col in df.columns]
                print("\n LEADERBOARD ")
                print(df[existing_cols].to_string(index=False))
            else:
                print("Tournament ran, but leaderboard is empty.")
                
        else:
            print(f"\nFAILED: Status {response.status_code}")
            print(response.text)

    except requests.exceptions.ConnectionError:
        print("\nERROR: Could not connect. Is 'firebase emulators:start' running?")

if __name__ == "__main__":
    test_tournament()
