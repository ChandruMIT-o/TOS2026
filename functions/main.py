# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

from firebase_functions import https_fn
from firebase_functions.options import set_global_options
from firebase_admin import initialize_app
import json
from tournament import fetch_strategies_from_firestore, run_league

# For cost control, you can set the maximum number of containers that can be
# running at the same time. This helps mitigate the impact of unexpected
# traffic spikes by instead downgrading performance. This limit is a per-function
# limit. You can override the limit for each function using the max_instances
# parameter in the decorator, e.g. @https_fn.on_request(max_instances=5).
set_global_options(max_instances=10)

# Initialize Firebase Admin SDK
initialize_app()

# Set global options if needed, though max_instances=10 was already there
set_global_options(max_instances=10)

@https_fn.on_request()
def run_tournament(req: https_fn.Request) -> https_fn.Response:
    """
    Cloud Function to run a tournament.
    1. Fetches all strategies from Firestore.
    2. Runs a round-robin league.
    3. Returns the leaderboard as JSON.
    """
    try:
        # 1. Fetch Strategies
        competitors = fetch_strategies_from_firestore()
        
        if len(competitors) < 2:
            return https_fn.Response(
                json.dumps({"status": "error", "message": "Not enough strategies to run a tournament (need at least 2)."}),
                status=400,
                headers={"Content-Type": "application/json"}
            )
        
        # 2. Run League
        results_df = run_league(competitors)
        
        # 3. Format Output
        leaderboard = results_df.to_dict(orient="records")
        
        return https_fn.Response(
            json.dumps({"status": "success", "leaderboard": leaderboard}),
            status=200,
            headers={"Content-Type": "application/json"}
        )

    except Exception as e:
        return https_fn.Response(
            json.dumps({"status": "error", "message": str(e)}),
            status=500,
            headers={"Content-Type": "application/json"}
        )

@https_fn.on_request()
def verify_strategy(req: https_fn.Request) -> https_fn.Response:
    """
    Checks if a draft strategy is unique compared to existing strategies in Firestore.
    Expects JSON body: {"code": "def strategy(...)..."}
    argument: code (str)
    
    Returns JSON:
    {
        "is_unique": bool,
        "signature": str,  # The behavioral signature
        "match_id": str|null # ID of the matching strategy if found
    }
    """
    from firebase_admin import firestore
    from signature_check import generate_strategy_signature
    from loader import load_strategy_from_code
    
    # 1. Parse Request
    try:
        req_json = req.get_json()
        if not req_json or 'code' not in req_json:
            return https_fn.Response(
                json.dumps({"error": "Missing 'code' in request body."}),
                status=400,
                headers={"Content-Type": "application/json"}
            )
        candidate_code = req_json['code']
    except Exception:
        return https_fn.Response(
            json.dumps({"error": "Invalid JSON body."}),
            status=400,
            headers={"Content-Type": "application/json"}
        )

    try:
        # 2. Load the Strategy Function
        candidate_func = load_strategy_from_code(candidate_code)
        if not candidate_func:
             return https_fn.Response(
                json.dumps({"error": "Could not parse a valid strategy function (check 4 args)."}),
                status=400,
                headers={"Content-Type": "application/json"}
            )

        # 3. Compute Behavioral Signature
        candidate_sig = generate_strategy_signature(candidate_func)
        
        # 4. Fetch Existing Strategies
        db = firestore.client()
        docs = db.collection("strategies").select(["code", "name"]).stream()
        
        is_unique = True
        match_id = None
        
        for doc in docs:
            data = doc.to_dict()
            existing_code = data.get("code", "")
            if not existing_code: 
                continue
            
            # Optimization: In real world, store 'signature' in DB to avoid re-running simulations.
            # For now, we load and sim.
            existing_func = load_strategy_from_code(existing_code)
            if existing_func:
                existing_sig = generate_strategy_signature(existing_func)
                if candidate_sig == existing_sig:
                    is_unique = False
                    match_id = doc.id
                    break
        
        # 5. Return Result
        return https_fn.Response(
            json.dumps({
                "is_unique": is_unique,
                "signature": candidate_sig,
                "match_id": match_id
            }),
            status=200,
            headers={"Content-Type": "application/json"}
        )

    except Exception as e:
        return https_fn.Response(
            json.dumps({"error": str(e)}),
            status=500,
            headers={"Content-Type": "application/json"}
        )