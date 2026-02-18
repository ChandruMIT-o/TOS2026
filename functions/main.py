# Welcome to Cloud Functions for Firebase for Python!
from firebase_functions import https_fn, firestore_fn
from firebase_admin import initialize_app
from firebase_functions.options import set_global_options

# Initialize app globally
initialize_app()
set_global_options(max_instances=10)

# Import cloud functions from other modules
from tournament_runner import run_tournament
from draft_pipeline import submit_draft
from draft_locking import lock_selection