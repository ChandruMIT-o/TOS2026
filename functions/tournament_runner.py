from firebase_functions import firestore_fn
from firebase_admin import initialize_app
from tournament import fetch_strategies_from_firestore, run_league

# --- FUNCTION 1: TOURNAMENT TRIGGER (Background) ---
# Triggers on Create, Update, or Delete in 'strategies' collection
@firestore_fn.on_document_written(document="strategies/{strat_id}")
def run_tournament(event: firestore_fn.Event[firestore_fn.Change[firestore_fn.DocumentSnapshot]]) -> None:
    """
    Automatic Tournament Runner:
    1. Listens for ANY change in the 'strategies' collection.
    2. Fetches all active strategies.
    3. Runs the league and updates the 'tos_leaderboard' collection.
    """
    print(f"Triggered by change in strategies/{event.params['strat_id']}")

    try:
        # 1. Fetch ALL strategies
        competitors = fetch_strategies_from_firestore()
        
        # 2. Validation
        if len(competitors) < 2:
            print("[WARN] Not enough strategies to run a tournament (need 2+).")
            return

        # 3. Run League & Update DB
        # run_league now writes directly to Firestore and returns the list of stats
        leaderboard = run_league(competitors)
        
        print(f"[SUCCESS] Tournament completed. Leaderboard updated with {len(leaderboard)} entries.")

    except Exception as e:
        print(f"[ERROR] Tournament failed: {e}")
