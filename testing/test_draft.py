import requests
import json
import pandas as pd

# --- CONFIGURATION ---
# Check "firebase emulators:start" output for these values
PROJECT_ID = "tekhora-26" 
REGION = "us-central1"
FUNCTION_NAME = "benchmark_strategy"
URL = f"http://127.0.0.1:5001/{PROJECT_ID}/{REGION}/{FUNCTION_NAME}"

def test_benchmark():
    print(f"🚀 Testing Function: {FUNCTION_NAME}")
    print(f"📍 URL: {URL}")

    # Use an ID that actually exists in your Firestore
    payload = {"id": "strat_plague"}

    try:
        response = requests.post(
            URL, 
            json=payload,
            headers={"Content-Type": "application/json"}
        )

        if response.status_code == 200:
            print("\n✅ SUCCESS: Benchmark Tournament Complete")
            data = response.json()
            
            leaderboard = data.get("leaderboard", [])
            
            if leaderboard:
                df = pd.DataFrame(leaderboard)
                # Reorder columns for readability
                cols = ["Strategy", "Points", "Won", "Lost", "Drawn", "Played"]
                print("\n🏆 BENCHMARK LEADERBOARD 🏆")
                print(df[cols].to_string(index=False))
            else:
                print("⚠️ Tournament ran, but leaderboard is empty.")
                
        else:
            print(f"\n❌ FAILED: Status {response.status_code}")
            print(response.text)

    except requests.exceptions.ConnectionError:
        print("\n⛔ ERROR: Could not connect. Is 'firebase emulators:start' running?")

if __name__ == "__main__":
    test_benchmark()