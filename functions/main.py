# Welcome to Cloud Functions for Firebase for Python!
from firebase_functions import https_fn
from firebase_functions.options import set_global_options
from firebase_admin import initialize_app, firestore
import json
import pandas as pd

# Import your custom modules
from tournament import fetch_strategies_from_firestore, run_league
from loader import load_strategy_from_code
from sim import GameSimRecorded

# Import the 5 defaulters explicitly
from strategies import (
    strat_random, 
    strat_power_rush, 
    strat_hoarder, 
    strat_neighbor, 
    strat_sniper
)

set_global_options(max_instances=10)
initialize_app()

# --- FUNCTION 1: TOURNAMENT (Existing) ---
@https_fn.on_request()
def run_tournament(req: https_fn.Request) -> https_fn.Response:
    """
    1. Fetches ALL strategies from Firestore.
    2. Runs a round-robin league.
    3. Returns the leaderboard.
    """
    try:
        competitors = fetch_strategies_from_firestore()
        if len(competitors) < 2:
            return https_fn.Response(
                json.dumps({"status": "error", "message": "Not enough strategies (need 2+)."}),
                status=400, headers={"Content-Type": "application/json"}
            )
        
        results_df = run_league(competitors)
        leaderboard = results_df.to_dict(orient="records")
        
        return https_fn.Response(
            json.dumps({"status": "success", "leaderboard": leaderboard}),
            status=200, headers={"Content-Type": "application/json"}
        )
    except Exception as e:
        return https_fn.Response(
            json.dumps({"status": "error", "message": str(e)}),
            status=500, headers={"Content-Type": "application/json"}
        )

# --- FUNCTION 2: BENCHMARK (Updated) ---
@https_fn.on_request()
def benchmark_strategy(req: https_fn.Request) -> https_fn.Response:
    """
    1. Accepts a Strategy ID (from Firestore).
    2. Loads that single strategy.
    3. Creates a 'Mini-League' with the User vs. 5 Defaulter Bots.
    4. Returns the leaderboard (same format as tournament).
    """
    try:
        # 1. Parse Request for Strategy ID
        req_json = req.get_json()
        target_id = req_json.get('id')
        
        if not target_id:
             return https_fn.Response(
                json.dumps({"error": "Missing 'id' in request body."}),
                status=400, headers={"Content-Type": "application/json"}
            )

        # 2. Fetch the Target Strategy from Firestore
        db = firestore.client()
        doc_ref = db.collection("strategies").document(target_id)
        doc = doc_ref.get()

        if not doc.exists:
            return https_fn.Response(
                json.dumps({"error": f"Strategy with ID {target_id} not found."}),
                status=404, headers={"Content-Type": "application/json"}
            )
        
        data = doc.to_dict()
        user_code = data.get("code", "")
        user_strat_name = data.get("name", "Unknown Strategy")

        # 3. Load the User's Strategy Function
        user_func = load_strategy_from_code(user_code, user_strat_name)
        if not user_func:
             return https_fn.Response(
                json.dumps({"error": "Could not parse valid python code from this strategy."}),
                status=400, headers={"Content-Type": "application/json"}
            )

        # 4. format the User into a Competitor Object
        user_competitor = {
            "name": user_strat_name, 
            "func": user_func, 
            "id": target_id
        }

        # 5. Define the Defaulters (formatted exactly like Firestore results)
        defaulters = [
            {"name": "Random Bot", "func": strat_random, "id": "sys_random"},
            {"name": "Power Rusher", "func": strat_power_rush, "id": "sys_power"},
            {"name": "The Hoarder", "func": strat_hoarder, "id": "sys_hoarder"},
            {"name": "The Neighbor", "func": strat_neighbor, "id": "sys_neighbor"},
            {"name": "The Sniper", "func": strat_sniper, "id": "sys_sniper"}
        ]

        # 6. Combine them into a League
        # The user will play against all defaulters, and defaulters will play against each other
        league_participants = [user_competitor] + defaulters

        # 7. Run the standard League logic
        results_df = run_league(league_participants)
        
        # 8. Return Leaderboard
        leaderboard = results_df.to_dict(orient="records")

        return https_fn.Response(
            json.dumps({"status": "success", "leaderboard": leaderboard}),
            status=200, headers={"Content-Type": "application/json"}
        )

    except Exception as e:
        return https_fn.Response(
            json.dumps({"status": "error", "message": str(e)}),
            status=500, headers={"Content-Type": "application/json"}
        )

# --- HELPER: Verification Endpoint (Existing) ---
@https_fn.on_request()
def verify_strategy(req: https_fn.Request) -> https_fn.Response:
    # ... (Keep your existing verify_strategy code here) ...
    from firebase_admin import firestore
    from signature_check import generate_strategy_signature
    from loader import load_strategy_from_code

    try:
        req_json = req.get_json()
        if not req_json or 'code' not in req_json:
            return https_fn.Response(json.dumps({"error": "Missing 'code'"}), 400)
        candidate_code = req_json['code']
    except Exception:
        return https_fn.Response(json.dumps({"error": "Invalid JSON"}), 400)

    try:
        candidate_func = load_strategy_from_code(candidate_code)
        if not candidate_func:
             return https_fn.Response(json.dumps({"error": "Invalid strategy function"}), 400)

        candidate_sig = generate_strategy_signature(candidate_func)
        
        db = firestore.client()
        docs = db.collection("strategies").select(["code"]).stream()
        
        is_unique = True
        match_id = None
        
        for doc in docs:
            data = doc.to_dict()
            existing_code = data.get("code", "")
            if not existing_code: continue
            
            existing_func = load_strategy_from_code(existing_code)
            if existing_func:
                existing_sig = generate_strategy_signature(existing_func)
                if candidate_sig == existing_sig:
                    is_unique = False
                    match_id = doc.id
                    break
        
        return https_fn.Response(
            json.dumps({"is_unique": is_unique, "signature": candidate_sig, "match_id": match_id}),
            200, headers={"Content-Type": "application/json"}
        )
    except Exception as e:
        return https_fn.Response(json.dumps({"error": str(e)}), 500)