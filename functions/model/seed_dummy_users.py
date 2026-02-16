import firebase_admin
from firebase_admin import firestore
from datetime import datetime


def get_firestore_client():
    try:
        app = firebase_admin.get_app()
    except ValueError:
        app = firebase_admin.initialize_app()
    return firestore.client(app)


# 🔹 All UIDs used in dummy teams
DUMMY_USERS = [
    ("uid_vikram", "Vikram"),
    ("uid_rameez", "Rameez"),
    ("uid_rahul", "Rahul"),
    ("uid_kavin", "Kavin"),
    ("uid_sanjay", "Sanjay"),
    ("uid_amit", "Amit"),
    ("uid_sid", "Siddharth"),
]


def make_user(uid: str, name: str):
    now = firestore.SERVER_TIMESTAMP

    return {
        "uid": uid,
        "name": name,
        "email": f"{name.lower()}@example.com",
        "phone": f"9{hash(uid) % 1_000_000_000:09d}",  # dummy 10-digit
        "role": "PARTICIPANT",
        "institute": "Madras Institute of Technology Campus",
        "year": 3,
        "createdAt": now,
        "updatedAt": now,
    }


def upload_dummy_users():
    db = get_firestore_client()
    users_ref = db.collection("users")

    batch = db.batch()

    for uid, name in DUMMY_USERS:
        doc_ref = users_ref.document(uid)
        batch.set(doc_ref, make_user(uid, name))

    batch.commit()
    print("Dummy users uploaded.")


if __name__ == "__main__":
    upload_dummy_users()
