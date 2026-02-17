import firebase_admin
from firebase_admin import firestore
import pandas as pd
import types
import itertools
from sim import GameSimRecorded
from datetime import datetime

# Initialize Firebase (if not already initialized) implies
# creating an app context. Since functions environment handles its own context,
# we rely on main.py usually doing initialize_app(), or we check.
# But inside a cloud function, strict initialization is best.
# We'll use get_app or initialize_app cautiously.

def get_firestore_client():
    try:
        app = firebase_admin.get_app()
    except ValueError:
        app = firebase_admin.initialize_app()
    return firestore.client(app)

COLLECTION_NAME = "strategies"

def validate_signature(func):
    """Checks if the function accepts the 4 required arguments."""
    try:
        code = func.__code__
        return code.co_argcount == 4
    except AttributeError:
        return False

def fetch_strategies_from_firestore():
    """Fetches strategies from Firestore and loads them as functions."""
    db = get_firestore_client()
    strategies_ref = db.collection(COLLECTION_NAME)
    docs = strategies_ref.stream()
    
    strategies = []
    print(f"Fetching strategies from Firestore ({COLLECTION_NAME})...")
    
    count = 0
    for doc in docs:
        data = doc.to_dict()
        strat_name = data.get("name", doc.id)
        source_code = data.get("code", "")
        
        if not source_code:
            print(f"Skipping {strat_name}: No 'code' field found.")
            continue

        try:
            # 1. Create dynamic module
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
                    "func": found_func,
                    "id": doc.id
                })
                count += 1
                print(f"Loaded: {strat_name}")
            else:
                print(f"Skipped {strat_name}: No valid function found (must accept 4 args).")
                
        except Exception as e:
            print(f"Error loading {strat_name}: {e}")
            
    print(f"Loaded {count} strategies from Firestore.")
    return strategies

def run_league(competitors):
    """Runs a round-robin league where every strategy plays every other strategy TWICE (Home & Away)."""
    if len(competitors) < 2:
        return pd.DataFrame()

    results = []
    
    # Initialize leaderboard stats
    stats = {c['name']: {'points': 0, 'played': 0, 'won': 0, 'lost': 0, 'drawn': 0} for c in competitors}

    # Generate all pairs (home, away) - permutations ensures (A, B) and (B, A) are both run
    matchups = list(itertools.permutations(competitors, 2))
    
    print(f"Starting League with {len(competitors)} strategies ({len(matchups)} matches)...")

    for home, away in matchups:
        try:
            # Run Simulation
            sim = GameSimRecorded(home['func'], away['func'])
            game_data = sim.play_game()
            
            # Determine Winner (based on final score)
            final_round = game_data.iloc[-1]
            score_a = final_round['score_a']
            score_b = final_round['score_b']
            
            match_result = {
                "home": home['name'],
                "away": away['name'],
                "score_home": score_a,
                "score_away": score_b,
                "winner": None
            }

            if score_a > score_b:
                stats[home['name']]['points'] += 3
                stats[home['name']]['won'] += 1
                stats[away['name']]['lost'] += 1
                match_result['winner'] = home['name']
            elif score_b > score_a:
                stats[away['name']]['points'] += 3
                stats[away['name']]['won'] += 1
                stats[home['name']]['lost'] += 1
                match_result['winner'] = away['name']
            else:
                stats[home['name']]['points'] += 1
                stats[away['name']]['points'] += 1
                stats[home['name']]['drawn'] += 1
                stats[away['name']]['drawn'] += 1
                match_result['winner'] = "Draw"
            
            stats[home['name']]['played'] += 1
            stats[away['name']]['played'] += 1
            results.append(match_result)
            
        except Exception as e:
            print(f"Error in match {home['name']} vs {away['name']}: {e}")

    # Convert Stats to DataFrame
    leaderboard = []
    for name, s in stats.items():
        leaderboard.append({
            "Strategy": name,
            "Points": s['points'],
            "Played": s['played'],
            "Won": s['won'],
            "Lost": s['lost'],
            "Drawn": s['drawn']
        })

    df = pd.DataFrame(leaderboard)
    df = df.sort_values(by=["Points", "Won"], ascending=False).reset_index(drop=True)
    
    return df
