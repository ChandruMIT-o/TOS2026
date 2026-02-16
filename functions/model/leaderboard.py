import firebase_admin
from firebase_admin import firestore
from dataclasses import dataclass, asdict
from typing import Dict

def get_firestore_client():
    try:
        app = firebase_admin.get_app()
    except ValueError:
        app = firebase_admin.initialize_app()
    return firestore.client(app)

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

def upload_leaderboard():
    db = get_firestore_client()
    collection = db.collection("tos_leaderboard")

    strategies = [
        StrategyStats("strat_sniper", 1, 23, 7, 2, 1, 125, 10, "Vikram"),
        StrategyStats("strat_plague", 2, 21, 6, 3, 1, 165, 10, "Rameez"),
        StrategyStats("strat_power_rush", 3, 15, 5, 0, 5, 109, 10, "Kavin"),
        StrategyStats("strat_hoarder", 4, 12, 4, 0, 6, 143, 10, "Sanjay"),
        StrategyStats("strat_random", 5, 12, 4, 0, 6, 110, 10, "Siddharth"),
        StrategyStats("strat_neighbor", 6, 3, 0, 3, 7, 32, 10, "Sathish"),
    ]

    for strat in strategies:
        doc_id = strat.strategy
        collection.document(doc_id).set(strat.to_firestore())

    print("Leaderboard uploaded.")

if __name__ == "__main__":
    upload_leaderboard()
