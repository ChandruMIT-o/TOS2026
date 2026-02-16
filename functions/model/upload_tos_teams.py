import firebase_admin
from firebase_admin import firestore
from dataclasses import asdict, is_dataclass
from dummy_teams_data import get_dummy_teams


def get_firestore_client():
    try:
        app = firebase_admin.get_app()
    except ValueError:
        app = firebase_admin.initialize_app()
    return firestore.client(app)


def convert(obj):
    """Recursively convert dataclasses to dict."""
    if is_dataclass(obj):
        return {k: convert(v) for k, v in asdict(obj).items()}
    if isinstance(obj, dict):
        return {k: convert(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [convert(i) for i in obj]
    return obj


def upload():
    db = get_firestore_client()
    collection = db.collection("tos_teams")

    batch = db.batch()

    for team in get_dummy_teams():
        ref = collection.document(team.team_name)  # team_name == teamId
        batch.set(ref, convert(team))

    batch.commit()
    print("Dummy teams uploaded.")


if __name__ == "__main__":
    upload()
