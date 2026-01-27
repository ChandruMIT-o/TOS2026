import pandas as pd
from sim import GameSimRecorded
from strategies import strat_random, strat_power_rush, strat_hoarder, strat_neighbor, strat_sniper

def run_tournament(strategy_list):
    results = []
    
    # Get all unique pairings
    for i, strat_a in enumerate(strategy_list):
        for j, strat_b in enumerate(strategy_list):
            if i == j: continue  # Don't play against self
            
            # Setup Simulation
            sim = GameSimRecorded(strat_a["func"], strat_b["func"])
            data = sim.play_game()
            
            # Extract final state
            final_a = data['score_a'].iloc[-1]
            final_b = data['score_b'].iloc[-1]
            
            winner = strat_a["name"] if final_a > final_b else strat_b["name"]
            if final_a == final_b: winner = "Draw"
            
            results.append({
                "Player A": strat_a["name"],
                "Player B": strat_b["name"],
                "Score A": final_a,
                "Score B": final_b,
                "Winner": winner
            })

    # Summarize Results
    df_results = pd.DataFrame(results)
    
    summary = []
    for s in strategy_list:
        name = s["name"]
        wins = len(df_results[df_results["Winner"] == name])
        matches = len(df_results[(df_results["Player A"] == name) | (df_results["Player B"] == name)])
        win_rate = (wins / matches) * 100 if matches > 0 else 0
        
        summary.append({
            "Strategy": name,
            "Wins": wins,
            "Matches": matches,
            "Win Rate (%)": round(win_rate, 2)
        })

    return pd.DataFrame(summary).sort_values(by="Wins", ascending=False)

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
    print("\n--- TOURNAMENT LEADERBOARD ---")
    print(leaderboard.to_string(index=False))