import requests
import pandas as pd
import json

PROJECT_ID = "tekhora-26"   # Matches your project
REGION = "us-central1"      # Default emulator region
FUNCTION_NAME = "submit_draft"

URL = f"http://127.0.0.1:5001/{PROJECT_ID}/{REGION}/{FUNCTION_NAME}"

def print_leaderboard(leaderboard_data):
    if not leaderboard_data:
        print("   [Leaderboard is empty]")
        return

    data_list = list(leaderboard_data.values())
    
    df = pd.DataFrame(data_list)
    
    # Select and Reorder columns for readability
    cols_to_show = ["rank", "strategy", "points", "wins", "losses", "total_nodes"]
    
    # Filter to ensure columns exist (avoids errors if data is missing)
    existing_cols = [c for c in cols_to_show if c in df.columns]
    
    # Sort by Rank
    if "rank" in df.columns:
        df = df.sort_values(by="rank")

    print("\n   --- TOURNAMENT RESULTS ---")
    print(df[existing_cols].to_string(index=False))
    print("\n")

def test_draft_submission():
    print(f"Testing Function: {FUNCTION_NAME}")
    print(f"Target URL: {URL}\n")

    # --- TEST CASE 1: GENERATE FROM DESCRIPTION ---
    print("1. Sending 'Description' Payload...")
    
    payload_desc = {
        "team_name": "Vikram",         # Ensure this Doc ID exists in 'tos_teams'
        "draft_id": "draft_1",
        "strategy_name": "Pacifist_Bot",
        "strategy_desc": "I want to collect energy and expand to normal nodes only. I never conquer and I never attack."
    }

    # try:
    #     response = requests.post(URL, json=payload_desc)

    #     if response.status_code == 200:
    #         data = response.json()
    #         print(f"   SUCCESS: {data.get('message')}")
    #         print(f"   Unique Strategy: {data.get('is_unique')}")
    #         print_leaderboard(data.get("leaderboard"))
    #     else:
    #         print(f"   FAILED: Status {response.status_code}")
    #         print(f"   Response: {response.text}")

    # except requests.exceptions.ConnectionError:
    #     print("\nERROR: Could not connect. Is 'firebase emulators:start' running?")
    #     return

    # --- TEST CASE 2: SUBMIT RAW CODE ---
    print("-" * 50)
    print("2. Sending 'Raw Code' Payload...")

    # A simple raw code snippet (Python style for this example)
    raw_code_snippet = """
def strategy_titan(mine, opp, free, energy):
    
    # Game state analysis
    all_nodes = set(range(1, 27))
    power_nodes = {4, 7, 11, 17, 20, 24}
    home_base = 1
    opp_home = 14
    
    # Calculate defensive clusters
    def get_clusters(nodes):
        visited = set()
        clusters = []
        nodes_set = set(nodes)
        
        for node in nodes_set:
            if node in visited:
                continue
            
            # BFS to find cluster
            cluster = set()
            queue = [node]
            
            while queue:
                current = queue.pop(0)
                if current in visited:
                    continue
                    
                visited.add(current)
                cluster.add(current)
                
                # Check neighbors (on a ring)
                neighbors = [current-1, current+1]
                if current == 1:
                    neighbors = [26, 2]
                elif current == 26:
                    neighbors = [25, 1]
                else:
                    neighbors = [current-1, current+1]
                
                for neighbor in neighbors:
                    if neighbor in nodes_set and neighbor not in visited:
                        queue.append(neighbor)
            
            if len(cluster) >= 2:  # Only count clusters of size 2+
                clusters.append(cluster)
        
        return clusters
    
    # Calculate defense cost for a node
    def get_defense_bonus(node, owner_nodes):
        bonus = 0
        neighbors = [node-1, node+1]
        if node == 1:
            neighbors = [26, 2]
        elif node == 26:
            neighbors = [25, 1]
        
        for neighbor in neighbors:
            if neighbor in owner_nodes:
                bonus += 1
        return bonus
    
    # Calculate distance from territory
    def min_distance_to_territory(node, territory):
        min_dist = float('inf')
        for t_node in territory:
            # Calculate distance on a ring
            dist = min(abs(node - t_node), 26 - abs(node - t_node))
            min_dist = min(min_dist, dist)
        return min_dist
    
    # Get adjacent unoccupied nodes
    def get_adjacent_free():
        adjacent = []
        for node in mine:
            neighbors = [node-1, node+1]
            if node == 1:
                neighbors = [26, 2]
            elif node == 26:
                neighbors = [25, 1]
            
            for neighbor in neighbors:
                if neighbor in free and neighbor not in adjacent:
                    adjacent.append(neighbor)
        return adjacent
    
    # Get conquerable enemy nodes with defense calculation
    def get_conquerable_enemy():
        targets = []
        for node in opp:
            if node == opp_home:  # Can't capture home base
                continue
            
            defense_bonus = get_defense_bonus(node, opp)
            base_cost = 20 if node in power_nodes else 8
            total_cost = base_cost + defense_bonus
            
            if energy > total_cost + 15:  # Leave buffer
                neighbors = [node-1, node+1]
                if node == 1:
                    neighbors = [26, 2]
                elif node == 26:
                    neighbors = [25, 1]
                
                friendly_neighbors = sum(1 for n in neighbors if n in mine)
                
                targets.append({
                    'node': node,
                    'cost': total_cost,
                    'defense': defense_bonus,
                    'is_power': node in power_nodes,
                    'friendly_neighbors': friendly_neighbors,
                    'value': (5 if node in power_nodes else 1) - defense_bonus * 2
                })
        
        return sorted(targets, key=lambda x: x['value'], reverse=True)
    
    # Calculate round number (estimate based on total nodes)
    total_claimed = len(mine) + len(opp)
    round_num = total_claimed  # Rough estimate
    
    # Phase detection
    if round_num <= 5 and len(mine) < 7 and energy > 15:
        phase = 1  # Initial Expansion
    elif round_num <= 12:
        phase = 2  # Consolidation & Defense
    else:
        phase = 3  # Strategic Conquest
    
    # Get clusters
    clusters = get_clusters(mine)
    has_defensive_cluster = any(len(cluster) >= 3 for cluster in clusters)
    
    # Special Rule: Check for gaps
    my_sorted = sorted(mine)
    gaps = []
    if len(my_sorted) >= 2:
        for i in range(len(my_sorted)-1):
            if my_sorted[i+1] - my_sorted[i] > 2:
                for j in range(my_sorted[i]+1, my_sorted[i+1]):
                    if j in free:
                        gaps.append(j)
        # Check wrap-around gap
        if 26 - my_sorted[-1] + my_sorted[0] > 2:
            for j in range(my_sorted[-1]+1, 27):
                if j in free:
                    gaps.append(j)
            for j in range(1, my_sorted[0]):
                if j in free:
                    gaps.append(j)
    
    # Special Rule: Power node count
    my_power_nodes = [n for n in mine if n in power_nodes]
    
    # Special Rule: Opponent expansion tracking
    opp_expansion_rate = len(opp) / max(1, round_num)
    
    # DECISION MATRIX
    
    # HARVEST CONDITIONS
    should_harvest = False
    harvest_reasons = []
    
    if energy < 20:
        should_harvest = True
        harvest_reasons.append("low energy")
    elif len(mine) >= 3 and not get_adjacent_free() and not get_conquerable_enemy():
        should_harvest = True
        harvest_reasons.append("no targets")
    elif len(opp) > len(mine) and energy < 40:
        should_harvest = True
        harvest_reasons.append("behind in nodes")
    elif opp_expansion_rate > 0.8 and energy < 40:  # Opponent expanding aggressively
        should_harvest = True
        harvest_reasons.append("opponent aggressive")
    
    # Check if we should harvest
    if should_harvest:
        return ["HARVEST"]
    
    # SPECIAL RULE: Fill gaps (The Wall)
    if gaps and energy >= 5:
        # Prioritize gaps near power nodes or clusters
        best_gap = None
        best_score = -1
        
        for gap in gaps:
            score = 0
            if gap in power_nodes:
                score += 10
            # Prefer gaps that connect clusters
            neighbors = [gap-1, gap+1]
            if gap == 1:
                neighbors = [26, 2]
            elif gap == 26:
                neighbors = [25, 1]
            
            friendly_neighbors = sum(1 for n in neighbors if n in mine)
            score += friendly_neighbors * 3
            
            if score > best_score:
                best_score = score
                best_gap = gap
        
        if best_gap and energy >= (15 if best_gap in power_nodes else 5):
            return ["EXPAND", best_gap]
    
    # EXPAND CONDITIONS
    adjacent_free = get_adjacent_free()
    if adjacent_free:
        # Score each expansion target
        best_target = None
        best_score = -1
        
        for target in adjacent_free:
            score = 0
            
            # Power node bonus
            if target in power_nodes:
                score += 20
                # Check energy requirement
                if energy < 25:
                    continue
            
            # Phase-based scoring
            if phase == 1:
                # In phase 1, prefer every other node pattern
                dist_from_home = min(abs(target - home_base), 26 - abs(target - home_base))
                if dist_from_home % 2 == 1:  # Every other node
                    score += 15
                score += 10 - dist_from_home  # Closer to home is better
            else:
                # In later phases, prefer nodes that connect clusters
                score += 5
                
                # Check if this connects clusters
                neighbors = [target-1, target+1]
                if target == 1:
                    neighbors = [26, 2]
                elif target == 26:
                    neighbors = [25, 1]
                
                friendly_neighbors = sum(1 for n in neighbors if n in mine)
                score += friendly_neighbors * 5
            
            # Distance from opponent
            dist_from_opp = min_distance_to_territory(target, opp)
            if dist_from_opp <= 2 and phase >= 2:
                score -= 10  # Too close to opponent in later phases
            elif dist_from_opp > 5:
                score += 5  # Safe distance
            
            if score > best_score:
                best_score = score
                best_target = target
        
        # Check energy requirements
        if best_target:
            cost = 15 if best_target in power_nodes else 5
            if energy >= cost + 15:  # Keep reserve
                return ["EXPAND", best_target]
    
    # CONQUER CONDITIONS
    if phase >= 2 and energy > 35 and has_defensive_cluster:
        conquerable = get_conquerable_enemy()
        
        for target in conquerable:
            # Check all conditions
            if target['defense'] <= 2:  # Target has ≤ 2 defender neighbors
                # Check opponent energy condition
                if energy > 35:  # We already know energy > 35 from outer condition
                    # Special case: enemy power node with weak defense
                    if target['is_power'] and target['defense'] <= 1:
                        if energy >= target['cost'] + 15:
                            return ["CONQUER", target['node']]
                    
                    # Regular conquest
                    if energy >= target['cost'] + 20 and phase == 3:
                        # Prioritize nodes that cut supply lines
                        if target['friendly_neighbors'] > 0:
                            return ["CONQUER", target['node']]
                        elif target['defense'] == 0:  # Isolated enemy node
                            return ["CONQUER", target['node']]
    
    # DEFAULT: Harvest if nothing else
    return ["HARVEST"]
    """

    payload_code = {
        "team_name": "Vikram",
        "draft_id": "draft_2",
        "strategy_name": "Aggro_Viper",
        "strategy_code": raw_code_snippet
    }

    try:
        response = requests.post(URL, json=payload_code)

        if response.status_code == 200:
            data = response.json()
            print(f"   SUCCESS: {data.get('message')}")
            print(f"   Unique Strategy: {data.get('is_unique')}")
            print_leaderboard(data.get("leaderboard"))
        else:
            print(f"   FAILED: Status {response.status_code}")
            print(f"   Response: {response.text}")

    except requests.exceptions.ConnectionError:
        print("\nERROR: Could not connect.")

if __name__ == "__main__":
    test_draft_submission()