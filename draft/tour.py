import pandas as pd
from sim import GameSimRecorded
from strategies import strat_random, strat_power_rush, strat_hoarder, strat_neighbor, strat_sniper

def run_tournament(strategy_list):
    # Initialize the League Table
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

    results = []

    # --- MATCH LOOP ---
    for i, strat_a in enumerate(strategy_list):
        for j, strat_b in enumerate(strategy_list):
            if i == j: continue  # No self-play

            # 1. Play the Match
            sim = GameSimRecorded(strat_a["func"], strat_b["func"])
            data = sim.play_game()

            # 2. Get Final Scores
            score_a = data['score_a'].iloc[-1]
            score_b = data['score_b'].iloc[-1]
            name_a = strat_a["name"]
            name_b = strat_b["name"]

            # 3. Update Territory Stats (Tiebreaker)
            league_table[name_a]["Total Nodes"] += score_a
            league_table[name_b]["Total Nodes"] += score_b
            league_table[name_a]["Matches"] += 1
            league_table[name_b]["Matches"] += 1

            # 4. Assign League Points
            if score_a > score_b:
                # Player A Wins
                league_table[name_a]["Points"] += 3
                league_table[name_a]["Wins"] += 1
                league_table[name_b]["Losses"] += 1
                winner = name_a
            elif score_b > score_a:
                # Player B Wins
                league_table[name_b]["Points"] += 3
                league_table[name_b]["Wins"] += 1
                league_table[name_a]["Losses"] += 1
                winner = name_b
            else:
                # Draw
                league_table[name_a]["Points"] += 1
                league_table[name_b]["Points"] += 1
                league_table[name_a]["Draws"] += 1
                league_table[name_b]["Draws"] += 1
                winner = "Draw"

            # Log match result for debugging
            results.append({
                "Match": f"{name_a} vs {name_b}",
                "Score": f"{score_a}-{score_b}",
                "Winner": winner
            })

    # --- FORMATTING THE LEADERBOARD ---
    df_data = []
    for name, stats in league_table.items():
        row = {"Strategy": name}
        row.update(stats)
        df_data.append(row)

    df = pd.DataFrame(df_data)
    
    # Sort by Points (Primary) -> Total Nodes (Secondary)
    df = df.sort_values(by=["Points", "Total Nodes"], ascending=[False, False])
    
    return df

if __name__ == "__main__":
    # Define our competitors
    competitors = [
        {"name": "Random", "func": strat_random},
        {"name": "Power Rush", "func": strat_power_rush},
        {"name": "Hoarder", "func": strat_hoarder},
        {"name": "Neighbor", "func": strat_neighbor},
        {"name": "Sniper", "func": strat_sniper}
    ]

    leaderboard = run_tournament(competitors)
    
    print("\n--- 🏆 TOURNAMENT LEAGUE TABLE 🏆 ---")
    print("(Win = 3pts, Draw = 1pt, Loss = 0pts)\n")
    print(leaderboard.to_string(index=False))