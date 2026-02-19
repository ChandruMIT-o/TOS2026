import json
from datetime import datetime, timezone
from firebase_functions import https_fn, options
from firebase_admin import firestore, get_app, initialize_app
from google.cloud.firestore_v1.base_query import FieldFilter
from firebase_functions.options import MemoryOption

# Internal Imports
from loader import load_strategy_from_code
from signature_check import generate_strategy_signature

# Initialize App
try:
    app = get_app()
except ValueError:
    app = initialize_app()

def get_unique_strategy_name(db, base_name: str) -> str:
    """
    Checks if 'base_name' exists in 'strategies' collection.
    If it exists, appends '_o' recursively until a unique name is found.
    """
    new_name = base_name
    # Safety limit to prevent infinite loops (though unlikely)
    for _ in range(10): 
        doc_ref = db.collection("strategies").document(new_name)
        if not doc_ref.get().exists:
            return new_name
        new_name += "_o"
    
    # Fallback with timestamp if someone really spammed "_o"
    return f"{base_name}_{int(datetime.now().timestamp())}"

@https_fn.on_request(
    memory=MemoryOption.MB_512,
    cors=options.CorsOptions(cors_origins="*", cors_methods=["get", "post", "options"])
)
def lock_selection(req: https_fn.Request) -> https_fn.Response:
    """
    Payload:
    {
        "team_name": "Vikram",
        "draft_id": "draft_1"  # or "draft_2"
    }
    """
    try:
        # 1. Parse Payload
        req_json = req.get_json()
        team_name = req_json.get("team_name")
        draft_id = req_json.get("draft_id")

        if not team_name or draft_id not in ["draft_1", "draft_2"]:
            return https_fn.Response(
                json.dumps({"error": "Invalid payload. Required: team_name, draft_id ('draft_1'/'draft_2')"}),
                status=400
            )

        db = firestore.client()

        # 2. Fetch Team Draft
        team_ref = db.collection("tos_teams").document(team_name)
        team_doc = team_ref.get()

        if not team_doc.exists:
            return https_fn.Response(json.dumps({"error": f"Team '{team_name}' not found."}), status=404)

        team_data = team_doc.to_dict()
        drafts = team_data.get("drafts", {})
        selected_draft = drafts.get(draft_id)

        if not selected_draft:
            return https_fn.Response(
                json.dumps({"error": f"Draft '{draft_id}' does not exist for team '{team_name}'."}),
                status=404
            )

        # Extract Data
        # Default to "Unnamed" if missing, though pipeline ensures it's there
        original_name = selected_draft.get("strategy_name", "Unnamed_Strategy")
        code = selected_draft.get("code", "")

        if not code:
            return https_fn.Response(json.dumps({"error": "Selected draft has no code."}), status=400)

        # 3. Generate Signature
        # We need to load the function to hash its logic
        func_obj = load_strategy_from_code(code, original_name)
        if not func_obj:
            return https_fn.Response(json.dumps({"error": "Code in draft is invalid/unparseable."}), status=400)
        
        signature = generate_strategy_signature(func_obj)

        # 4. Check Signature against Global Pool (Plagiarism Check)
        # We allow the lock-in but flag it if logic is identical to an EXISTING strategy
        is_logic_unique = True
        sig_docs = db.collection("strategies").where(filter=FieldFilter("signature", "==", signature)).limit(1).stream()
        for _ in sig_docs:
            is_logic_unique = False
            # We don't break here, just one match is enough to flag

        # 5. Determine Unique Strategy Name
        final_strategy_name = get_unique_strategy_name(db, original_name)
        name_changed = (final_strategy_name != original_name)

        # 6. Save to 'strategies' Collection
        strategy_data = {
            "name": final_strategy_name,
            "code": code,
            "signature": signature,
            "team_name": team_name,
            "original_draft_id": draft_id,
            "is_logic_unique": is_logic_unique,
            "updatedAt": datetime.now(timezone.utc)
        }

        db.collection("strategies").document(final_strategy_name).set(strategy_data)

        # 7. Update Team Document (Finalize)
        team_ref.update({
            "finalized_strategy": final_strategy_name,
            "finalized_at": datetime.now(timezone.utc)
        })

        return https_fn.Response(
            json.dumps({
                "status": "success",
                "message": f"Strategy locked in as '{final_strategy_name}'.",
                "final_name": final_strategy_name,
                "name_changed": name_changed,
                "is_logic_unique": is_logic_unique
            }),
            status=200,
            headers={"Content-Type": "application/json"}
        )

    except Exception as e:
        print(f"[ERROR] Lock selection failed: {e}")
        return https_fn.Response(json.dumps({"error": str(e)}), status=500)
