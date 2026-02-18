import firebase_admin
from firebase_admin import firestore
import pandas as pd
import types
import itertools
from dataclasses import dataclass, asdict
from typing import Dict, List
from sim import GameSimRecorded

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
    team_name: str

    def to_firestore(self) -> Dict:
        return asdict(self)

# --- FIREBASE SETUP ---
def get_firestore_client():
    try:
        app = firebase_admin.get_app()
    except ValueError:
        app = firebase_admin.initialize_app()
    return firestore.client(app)

COLLECTION_Strategies = "strategies"
COLLECTION_LEADERBOARD = "tos_leaderboard"

# --- HELPER FUNCTIONS ---
def validate_signature(func):
    try:
        code = func.__code__
        return code.co_argcount == 4
    except AttributeError:
        return False

def fetch_strategies_from_firestore():
    db = get_firestore_client()
    strategies_ref = db.collection(COLLECTION_Strategies)
    docs = strategies_ref.stream()
    
    strategies = []
    print(f"[INFO] Fetching strategies from Firestore ({COLLECTION_Strategies})...")
    
    count = 0
    for doc in docs:
        data = doc.to_dict()
        strat_name = data.get("name", doc.id)
        source_code = data.get("code", "")
        team_name = data.get("team_name", "Unknown Team")
        
        if not source_code:
            print(f"   [WARN] Skipping {strat_name}: No 'code' field found.")
            continue

        try:
            module_name = f"dynamic_strat_{strat_name}"
            mod = types.ModuleType(module_name)
            exec(source_code, mod.__dict__)
            
            found_func = None
            if "strategy" in mod.__dict__ and callable(mod.strategy):
                if validate_signature(mod.strategy):
                    found_func = mod.strategy
            
            if not found_func:
                for name, obj in mod.__dict__.items():
                    if isinstance(obj, types.FunctionType):
                        if validate_signature(obj) and name != "strategy":
                            found_func = obj
                            break
            
            if found_func:
                strategies.append({
                    "name": strat_name,
                    "func": found_func,
                    "id": doc.id,
                    "team_name": team_name
                })
                count += 1
                print(f"   [OK] Loaded: {strat_name}")
            else:
                print(f"   [SKIP] Skipped {strat_name}: No valid function.")
                
        except Exception as e:
            print(f"   [ERR] Error loading {strat_name}: {e}")
            
    print(f"[INFO] Loaded {count} strategies.")
    return strategies

def run_league(competitors, draft = False):
    if len(competitors) < 2:
        print("[WARN] Not enough competitors.")
        return []

    # Initialize stats
    stats = {
        c['name']: {
            'points': 0, 'played': 0, 'won': 0, 'lost': 0, 'drawn': 0, 
            'total_nodes': 0, 'team_name': c.get('team_name', 'Unknown')
        } 
        for c in competitors
    }

    matchups = list(itertools.permutations(competitors, 2))
    print(f"[INFO] Starting League with {len(competitors)} strategies ({len(matchups)} matches)...")

    for home, away in matchups:
        try:
            sim = GameSimRecorded(home['func'], away['func'])
            game_data = sim.play_game()
            
            final_round = game_data.iloc[-1]
            
            # Cast NumPy types to Python Ints
            score_a = int(final_round['score_a'])
            score_b = int(final_round['score_b'])
            
            stats[home['name']]['total_nodes'] += score_a
            stats[away['name']]['total_nodes'] += score_b
            
            if score_a > score_b:
                stats[home['name']]['points'] += 3
                stats[home['name']]['won'] += 1
                stats[away['name']]['lost'] += 1
            elif score_b > score_a:
                stats[away['name']]['points'] += 3
                stats[away['name']]['won'] += 1
                stats[home['name']]['lost'] += 1
            else:
                stats[home['name']]['points'] += 1
                stats[away['name']]['points'] += 1
                stats[home['name']]['drawn'] += 1
                stats[away['name']]['drawn'] += 1
            
            stats[home['name']]['played'] += 1
            stats[away['name']]['played'] += 1
            
        except Exception as e:
            print(f"   [ERR] Match failed: {home['name']} vs {away['name']} - {e}")

    # --- RESULTS PROCESSING ---
    raw_results = []
    for name, s in stats.items():
        raw_results.append({
            "strategy": name,
            "points": s['points'],
            "wins": s['won'],
            "draws": s['drawn'],
            "losses": s['lost'],
            "total_nodes": s['total_nodes'],
            "matches": s['played'],
            "team_name": s['team_name']
        })

    sorted_results = sorted(
        raw_results, 
        key=lambda x: (x['points'], x['wins'], x['total_nodes']), 
        reverse=True
    )

    if draft:
        return sorted_results

    # --- DATABASE SYNC (CLEANUP + UPLOAD) ---
    db = get_firestore_client()
    collection = db.collection(COLLECTION_LEADERBOARD)
    
    # 1. Fetch ALL existing documents in the leaderboard
    existing_docs = collection.stream()
    existing_ids = set(doc.id for doc in existing_docs)
    
    # 2. Identify active IDs from current tournament
    current_active_ids = set(res['strategy'] for res in sorted_results)
    
    # 3. Identify obsolete IDs (to be deleted)
    ids_to_delete = existing_ids - current_active_ids
    
    batch = db.batch()
    
    # A. Queue Deletions
    if ids_to_delete:
        print(f"[INFO] Cleaning up {len(ids_to_delete)} obsolete entries...")
        for obsolete_id in ids_to_delete:
            doc_ref = collection.document(obsolete_id)
            batch.delete(doc_ref)

    # B. Queue Updates/Inserts
    final_leaderboard_data = []
    print(f"[INFO] Uploading {len(sorted_results)} results to '{COLLECTION_LEADERBOARD}'...")
    
    for rank, res in enumerate(sorted_results, 1):
        stat_obj = StrategyStats(
            strategy=res['strategy'],
            rank=int(rank),
            points=int(res['points']),
            wins=int(res['wins']),
            draws=int(res['draws']),
            losses=int(res['losses']),
            total_nodes=int(res['total_nodes']),
            matches=int(res['matches']),
            team_name=str(res['team_name'])
        )
        
        doc_ref = collection.document(res['strategy'])
        batch.set(doc_ref, stat_obj.to_firestore())
        final_leaderboard_data.append(stat_obj.to_firestore())

    # C. Commit Everything
    batch.commit()
    print("[SUCCESS] Leaderboard synced successfully.")

    return final_leaderboard_data