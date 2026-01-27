import hashlib
import os
from sim import GameSimRecorded

# 1. Define two simple, deterministic tester strategies
def tester_strat_a(free, opp, mine, energy):
    # Always tries to expand to the lowest ID node, then harvests
    if free and energy >= 15:
        return ["EXPAND", min(free)]
    return ["HARVEST"]

def tester_strat_b(free, opp, mine, energy):
    # Always tries to expand to the highest ID node, then harvests
    if free and energy >= 15:
        return ["EXPAND", max(free)]
    return ["HARVEST"]

def generate_logical_signature():
    """Runs a controlled match and generates a hash of the play-by-play data."""
    sim = GameSimRecorded(tester_strat_a, tester_strat_b)
    df = sim.play_game()
    
    # Create a string representation of the critical game results
    # We include round, scores, and energy to capture any logic shifts
    signature_base = df[['round', 'score_a', 'score_b', 'energy_a', 'energy_b']].to_string()
    
    # Return an MD5 hash of this result string
    return hashlib.md5(signature_base.encode()).hexdigest()

def verify_logic():
    sig_file = "signature.txt"
    current_sig = generate_logical_signature()
    
    if os.path.exists(sig_file):
        with open(sig_file, 'r') as f:
            saved_sig = f.read().strip()
        
        if current_sig == saved_sig:
            print("✅ Logical Signature Match: Game rules are identical.")
            return True
        else:
            print("⚠️ LOGIC BREACH DETECTED!")
            print("The game rules (costs, yields, or mechanics) have changed.")
            return False
    else:
        with open(sig_file, 'w') as f:
            f.write(current_sig)
        print(f"📝 New logical signature stored: {current_sig}")
        return True

if __name__ == "__main__":
    verify_logic()