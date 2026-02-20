import json
from dataclasses import dataclass, asdict
from typing import Dict, List, Optional, Any
from datetime import datetime, timezone

from firebase_functions import https_fn, options
from firebase_admin import firestore, initialize_app, get_app
from google.cloud.firestore_v1.base_query import FieldFilter
from firebase_functions.options import MemoryOption

# Internal Imports
import llm.gemini_call
from loader import load_strategy_from_code, load_strategy_with_error
from signature_check import generate_strategy_signature
from tournament import run_league
from strategies import (
    strat_random, 
    strat_power_rush, 
    strat_hoarder, 
    strat_neighbor, 
    strat_sniper
)

# Initialize Firebase App
try:
    app = get_app()
except ValueError:
    app = initialize_app()

# --- DATA STRUCTURES ---

@dataclass
class StrategyStats:
    strategy: str
    rank: int
    points: int
    wins: int
    draws: int
    losses: int
    total_nodes: int
    matches: int

    def to_dict(self):
        return asdict(self)

@dataclass
class Draft:
    strategy_name: Optional[str]
    strategy_desc: Optional[str]
    code: Optional[str]
    tournament_result: Dict[str, Any]
    created_at: Any 

    def to_dict(self):
        return asdict(self)

# --- HELPER FUNCTIONS ---

def get_defaulters():
    """Returns the list of system bots to play against."""
    return [
        {"name": "Random Bot", "func": strat_random, "id": "sys_random", "team_name": "System"},
        {"name": "Power Rusher", "func": strat_power_rush, "id": "sys_power", "team_name": "System"},
        {"name": "The Hoarder", "func": strat_hoarder, "id": "sys_hoarder", "team_name": "System"},
        {"name": "The Neighbor", "func": strat_neighbor, "id": "sys_neighbor", "team_name": "System"},
        {"name": "The Sniper", "func": strat_sniper, "id": "sys_sniper", "team_name": "System"}
    ]

def check_signature_uniqueness(strategy_code: str) -> bool:
    """
    Generates a signature for the code and checks if it exists in the 
    global 'strategies' collection. Returns True if Unique.
    """
    try:
        func = load_strategy_from_code(strategy_code, "temp_sig_check")
        if not func:
            return False
            
        sig = generate_strategy_signature(func)
        db = firestore.client()
        
        # FIXED: Using FieldFilter to suppress the "positional arguments" warning
        docs = db.collection("strategies").where(filter=FieldFilter("signature", "==", sig)).limit(1).stream()
        for _ in docs:
            return False # Found a match, so not unique
            
        return True
    except Exception as e:
        print(f"[WARN] Signature check failed: {e}")
        return True # Fail open

# --- MAIN CLOUD FUNCTION ---

def update_pipeline_progress(team_name: str, draft_id: str, step: str, details: str = "", status: str = "in_progress"):
    if not team_name or not draft_id:
        return
    try:
        db = firestore.client()
        doc_ref = db.collection("tos_temp").document(f"{team_name}_{draft_id}")
        doc_ref.set({
            "step": step,
            "details": details,
            "status": status,
            "updatedAt": firestore.SERVER_TIMESTAMP
        }, merge=True, timeout=2.0)
    except Exception as e:
        print(f"[WARN] Failed to update progress: {e}")

def submit_draft(req: https_fn.Request) -> https_fn.Response:
    """
    Payload:
    {
        "team_name": "Vikram",
        "draft_id": "draft_1" | "draft_2",
        "strategy_name": "My Cool Bot",
        "strategy_desc": "Attack everyone..." (OPTIONAL),
        "strategy_code": "def strategy..." (OPTIONAL)
    }
    """
    # Handle CORS or health checks early
    if req.method == "OPTIONS":
        return https_fn.Response(status=204)
    if req.method == "GET":
        return https_fn.Response(status=200)
    
    try:
        # 1. Parse Payload safely
        req_json = req.get_json(silent=True)
        if req_json is None:
            req_json = req.get_json(force=True, silent=True)
            
        if not req_json:
            return https_fn.Response(
                json.dumps({"error": "Invalid JSON payload or missing Content-Type."}),
                status=400,
                headers={"Content-Type": "application/json"}
            )
            
        team_name = req_json.get("team_name")
        draft_id = req_json.get("draft_id")
        strat_name = req_json.get("strategy_name")
        strat_desc = req_json.get("strategy_desc")
        strat_code = req_json.get("strategy_code")

        if not team_name or draft_id not in ["draft_1", "draft_2"] or not strat_name:
            return https_fn.Response(
                json.dumps({"error": "Invalid payload. Missing team_name, strategy_name, or invalid draft_id."}),
                status=400,
                headers={"Content-Type": "application/json"}
            )

        if not strat_desc and not strat_code:
            return https_fn.Response(
                json.dumps({"error": "Must provide either strategy_desc or strategy_code."}),
                status=400,
                headers={"Content-Type": "application/json"}
            )

        update_pipeline_progress(team_name, draft_id, "Initializing", "Starting draft submission pipeline...")

        # 2. Generate / Transpile Code
        final_code = ""
        description_used = ""
        
        if strat_desc:
            print(f"[INFO] Generating code from description for {team_name}...")
            update_pipeline_progress(team_name, draft_id, "Generating Logic", "Translating description into python strategy...")
            final_code = llm.gemini_call.generate_strategy_from_desc(strat_name, strat_desc)
            description_used = strat_desc
        else:
            print(f"[INFO] Transpiling raw code for {team_name}...")
            update_pipeline_progress(team_name, draft_id, "Generating Logic", "Translating raw code into strict python strategy...")
            final_code = llm.gemini_call.generate_strategy_from_code(strat_name, strat_code)
            description_used = "Imported from Raw Code"

        # 3. Validate Python Code
        print("[INFO] Validating generated code...")
        update_pipeline_progress(team_name, draft_id, "Validating Logic", "Checking strategy for errors and evaluating strict game rules...")
        print(final_code)
        user_func, error_msg = load_strategy_with_error(final_code, strat_name)
        
        if not user_func:
            print(f"[WARN] Generated code broke: {error_msg}. Making one more attempt to fix it...")
            update_pipeline_progress(team_name, draft_id, "Fixing Logic", "Attempting to auto-correct syntax or logic errors...")
            fixed_code = llm.gemini_call.fix_strategy_code(strat_name, final_code, error_msg)
            print("[INFO] Validating fixed code...")
            print(fixed_code)
            
            user_func, second_error_msg = load_strategy_with_error(fixed_code, strat_name)
            
            if not user_func:
                update_pipeline_progress(team_name, draft_id, "Failed", "Strategy parsing broke completely.", "error")
                return https_fn.Response(
                    json.dumps({
                        "error": f"Generated code broke twice. First attempt error: {error_msg}. Second attempt error: {second_error_msg}",
                        "code_dump": fixed_code
                    }),
                    status=422
                )
            
            # If the fix was successful, use the fixed code for the rest of pipeline
            final_code = fixed_code

        # 4. Signature Verification
        update_pipeline_progress(team_name, draft_id, "Verifying Signature", "Evaluating uniqueness against the global database...")
        is_unique = check_signature_uniqueness(final_code)
        
        # 5. Run Tournament (Simulation)
        print("[INFO] Running simulation against defaulters...")
        update_pipeline_progress(team_name, draft_id, "Running Simulation", "Battling your strategy against system defaulters...")
        user_competitor = {
            "name": strat_name,
            "func": user_func,
            "id": f"{team_name}_{draft_id}",
            "team_name": team_name
        }
        
        league_participants = [user_competitor] + get_defaulters()
        
        # Run league
        raw_leaderboard = run_league(league_participants, draft=True)
        
        # Convert results
        stats_map = {}
        for res in raw_leaderboard:
            s_stat = StrategyStats(
                strategy=res['strategy'],
                rank=0, 
                points=res['points'],
                wins=res['wins'],
                draws=res['draws'],
                losses=res['losses'],
                total_nodes=res['total_nodes'],
                matches=res['matches']
            )
            stats_map[res['strategy']] = s_stat.to_dict()

        # Update ranks
        sorted_keys = sorted(stats_map.keys(), key=lambda k: (stats_map[k]['points'], stats_map[k]['total_nodes']), reverse=True)
        for rank, key in enumerate(sorted_keys, 1):
            stats_map[key]['rank'] = rank

        # 6. Construct Draft Object
        # FIX: Using datetime.now(timezone.utc) instead of firestore.SERVER_TIMESTAMP
        # This prevents the 'Sentinel' serialization error.
        draft_obj = Draft(
            strategy_name=strat_name,
            strategy_desc=description_used,
            code=final_code,
            tournament_result=stats_map,
            created_at=datetime.now(timezone.utc) 
        )

        # 7. Write to Firestore
        print(f"[INFO] Writing result to tos_teams/{team_name}...")
        db = firestore.client()
        team_ref = db.collection("tos_teams").document(team_name)
        
        team_ref.update({
            f"drafts.{draft_id}": draft_obj.to_dict()
        })

        update_pipeline_progress(team_name, draft_id, "Completed", "Draft synchronized successfully.", "success")

        return https_fn.Response(
            json.dumps({
                "status": "success", 
                "message": f"Draft {draft_id} saved successfully.",
                "is_unique": is_unique,
                "leaderboard": stats_map
            }),
            status=200,
            headers={"Content-Type": "application/json"}
        )

    except Exception as e:
        print(f"[ERROR] Pipeline failed: {str(e)}")
        try:
            req_json = req.get_json(silent=True)
            if req_json is None:
                req_json = req.get_json(force=True, silent=True) or {}
            
            if isinstance(req_json, dict):
                t_name = req_json.get("team_name")
                d_id = req_json.get("draft_id")
                if t_name and d_id:
                    update_pipeline_progress(t_name, d_id, "Failed", f"Unexpected pipeline failure: {str(e)}", "error")
        except Exception as inner_e:
            print(f"[WARN] Failed to update progress to failed state: {inner_e}")
            
        return https_fn.Response(
            json.dumps({"error": str(e)}),
            status=500,
            headers={"Content-Type": "application/json"}
        )
