import pandas as pd
from sim import GameSimRecorded
from loader import load_strategies

# --- CONFIGURATION ---
ROUNDS_PER_PAIR = 2 # 1 as Home, 1 as Away (Standard)

def run_league(strategy_list):
    # Initialize Stats Dictionary
    league_table = {
        s["name"]: {
            "Points": 0, 
            "Wins": 0, 
            "Draws": 0, 
            "Losses": 0, 
            "Total Nodes": 0, 
            "Matches": 0
        } 
        for s in strategy_list
    }

    print(f"\n⚔️  STARTING LEAGUE WITH {len(strategy_list)} TEAMS ⚔️")
    print("-" * 60)

    # --- MATCH LOOP (Double Round Robin) ---
    # This loop generates every pair (A, B) and later (B, A).
    # Since the game map is asymmetric (Home A vs Home B), these are distinct games.
    
    for i, strat_a in enumerate(strategy_list):
        for j, strat_b in enumerate(strategy_list):
            if i == j: continue 

            name_a = strat_a["name"]
            name_b = strat_b["name"]

            # 1. Run Simulation (A is Home, B is Away)
            sim = GameSimRecorded(strat_a["func"], strat_b["func"])
            data = sim.play_game()
            
            # 2. Get Final Scores
            score_a = data['score_a'].iloc[-1]
            score_b = data['score_b'].iloc[-1]

            # 3. Update Match Counts (For both players)
            league_table[name_a]["Matches"] += 1
            league_table[name_b]["Matches"] += 1

            # 4. Update Territory (Tiebreaker)
            league_table[name_a]["Total Nodes"] += score_a
            league_table[name_b]["Total Nodes"] += score_b
            
            # 5. Assign Points & W/L/D Records
            if score_a > score_b:
                # Player A Wins
                league_table[name_a]["Points"] += 3
                league_table[name_a]["Wins"] += 1
                league_table[name_b]["Losses"] += 1
                outcome = f"{name_a} WINS"
                
            elif score_b > score_a:
                # Player B Wins
                league_table[name_b]["Points"] += 3
                league_table[name_b]["Wins"] += 1
                league_table[name_a]["Losses"] += 1
                outcome = f"{name_b} WINS"
                
            else:
                # Draw
                league_table[name_a]["Points"] += 1
                league_table[name_b]["Points"] += 1
                league_table[name_a]["Draws"] += 1
                league_table[name_b]["Draws"] += 1
                outcome = "DRAW"

            # Optional: Verbose Logging
            # print(f"Match: {name_a} (Home) vs {name_b} (Away) | {score_a}-{score_b} | {outcome}")

    # --- DISPLAY ---
    # Convert dictionary to DataFrame for nice printing
    df_data = []
    for name, stats in league_table.items():
        row = {"Team": name}
        row.update(stats)
        df_data.append(row)

    if not df_data:
        return pd.DataFrame()

    df = pd.DataFrame(df_data)
    
    # Sort: Points (Primary) -> Total Nodes (Secondary) -> Wins (Tertiary)
    df = df.sort_values(by=["Points", "Total Nodes", "Wins"], ascending=[False, False, False])
    
    # Calculate "Games Played" correctly
    # Note: Our loop updates BOTH players per game.
    # Since we iterate (A, B) and later (B, A), we actually simulate 2 games per pair.
    # However, inside the loop we updated both players. 
    # Wait: In (A, B), we updated A and B. In (B, A), we updated B and A.
    # This results in "Matches" being double the actual count if not careful.
    # CORRECTION:
    # Game (A, B) is distinct from Game (B, A). 
    # If we update both players in (A, B), we record the result of Game 1.
    # If we update both players in (B, A), we record the result of Game 2.
    # This is correct. "Matches" will equal (N-1) * 2. 
    
    return df

if __name__ == "__main__":
    import random
    import numpy as np
    random.seed(42)       # Standard Python random
    np.random.seed(42)    # Numpy random (if used)
    # 1. Dynamic Load from folder
    competitors = load_strategies("raw_code")
    
    if len(competitors) < 2:
        print("\n⚠️  Need at least 2 strategies in 'raw_code/' to run a tournament.")
        print("   (Create .txt files in that folder with your strategy code)")
    else:
        # 2. Run League
        results = run_league(competitors)
        
        print("\n" + "="*50)
        print(" 🏆 FINAL LEAGUE STANDINGS 🏆")
        print(" (Win = 3pts, Draw = 1pt, Loss = 0pts)")
        print("="*50)
        print(results.to_string(index=False))