import requests
import pandas as pd
import types
import ast
import json
from tournament import run_league

# --- CONFIGURATION ---
PROJECT_ID = "tekhora-26"
COLLECTION_NAME = "strategies"
FIRESTORE_URL = f"https://firestore.googleapis.com/v1/projects/{PROJECT_ID}/databases/(default)/documents/{COLLECTION_NAME}"

def validate_signature(func):
    """Checks if the function accepts the 4 required arguments."""
    try:
        # Get argument count
        code = func.__code__
        # We expect 4 arguments: free, opp, mine, energy
        return code.co_argcount == 4
    except AttributeError:
        return False

def fetch_strategies_from_firestore():
    print(f"🔄 Fetching strategies from Firestore ({PROJECT_ID})...")
    try:
        response = requests.get(FIRESTORE_URL)
        response.raise_for_status()
        data = response.json()
        
        documents = data.get('documents', [])
        print(f"📂 Found {len(documents)} strategies in Firestore...")
        
        strategies = []
        
        for doc in documents:
            # Document name format: projects/{projectId}/databases/{databaseId}/documents/{collectionId}/{documentId}
            # We can extract the ID from the end, or use the 'name' field if we stored it.
            # In seed_strategies.js, we stored 'name' in the fields as well.
            
            fields = doc.get('fields', {})
            
            # Extract name
            if 'name' in fields and 'stringValue' in fields['name']:
                strat_name = fields['name']['stringValue']
            else:
                # Fallback to document ID from the resource name
                strat_name = doc['name'].split('/')[-1]
                
            # Extract code
            if 'code' in fields and 'stringValue' in fields['code']:
                source_code = fields['code']['stringValue']
            else:
                print(f"  ⚠️  Skipping {strat_name}: No 'code' field found.")
                continue

            # Load the strategy dynamically
            try:
                # 1. Create a dynamic module
                module_name = f"dynamic_strat_{strat_name}"
                mod = types.ModuleType(module_name)
                
                # 2. Execute code
                exec(source_code, mod.__dict__)
                
                # 3. Find function
                found_func = None
                
                # Priority: 'strategy' function
                if "strategy" in mod.__dict__ and callable(mod.strategy):
                    if validate_signature(mod.strategy):
                        found_func = mod.strategy
                
                # Fallback: First valid function
                if not found_func:
                    for name, obj in mod.__dict__.items():
                        if isinstance(obj, types.FunctionType):
                            if validate_signature(obj) and name != "strategy":
                                found_func = obj
                                break
                
                if found_func:
                    strategies.append({
                        "name": strat_name,
                        "func": found_func
                    })
                    print(f"  ✅ Loaded: {strat_name}")
                else:
                    print(f"  ❌ Skipped {strat_name}: No valid function found (must accept 4 args).")
                    
            except Exception as e:
                print(f"  🔥 Error loading {strat_name}: {e}")
                
        return strategies

    except requests.exceptions.RequestException as e:
        print(f"❌ Error fetching from Firestore: {e}")
        return []
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return []

if __name__ == "__main__":
    # 1. Load from Firestore
    competitors = fetch_strategies_from_firestore()
    
    if len(competitors) < 2:
        print("\n⚠️  Need at least 2 strategies to run a tournament.")
    else:
        # 2. Run League
        results = run_league(competitors)
        
        if not results.empty:
            print("\n" + "="*50)
            print(" 🏆 FINAL LEAGUE STANDINGS (FIRESTORE EDITION) 🏆")
            print(" (Win = 3pts, Draw = 1pt, Loss = 0pts)")
            print("="*50)
            print(results.to_string(index=False))
