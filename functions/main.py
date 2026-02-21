# Welcome to Cloud Functions for Firebase for Python!
from firebase_functions import https_fn, firestore_fn, options
from firebase_admin import initialize_app
from firebase_functions.options import set_global_options, MemoryOption

# Initialize app globally
initialize_app()
set_global_options(max_instances=10, timeout_sec=540)

@firestore_fn.on_document_written(document="strategies/{strat_id}", memory=1024)
def run_tournament(event: firestore_fn.Event[firestore_fn.Change[firestore_fn.DocumentSnapshot]]) -> None:
    from tournament_runner import run_tournament as _run_tournament
    return _run_tournament(event)

@https_fn.on_request(
    memory=MemoryOption.MB_512,
    cors=options.CorsOptions(cors_origins="*", cors_methods=["get", "post", "options"])
)
def submit_draft(req: https_fn.Request) -> https_fn.Response:
    from draft_pipeline import submit_draft as _submit_draft
    return _submit_draft(req)

@https_fn.on_request(
    memory=MemoryOption.MB_512,
    cors=options.CorsOptions(cors_origins="*", cors_methods=["get", "post", "options"])
)
def lock_selection(req: https_fn.Request) -> https_fn.Response:
    from draft_locking import lock_selection as _lock_selection
    return _lock_selection(req)