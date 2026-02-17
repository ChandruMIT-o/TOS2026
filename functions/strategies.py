# strategies.py
import random

# set random seed as 42
random.seed(42)

# --- HELPER: Safe Target Filter ---
def get_valid_targets(targets):
    # Exclude Home Bases (1 and 14) from potential target lists
    # This fixes the "Target Fixation Bug"
    return [t for t in targets if t not in [1, 14]]

# --- STRATEGY 1: RANDOM (Smart Random) ---
def strat_random(free, opp, mine, energy):
    actions = ["HARVEST"]
    
    # 1. EXPANSION
    if free and energy >= 5:
        power_nodes = [4, 7, 11, 17, 20, 24]
        available_power = [n for n in free if n in power_nodes]
        available_normal = [n for n in free if n not in power_nodes]
        
        possible_targets = []
        if available_power and energy >= 16: possible_targets.extend(available_power)
        if available_normal and energy >= 5: possible_targets.extend(available_normal)
            
        if possible_targets:
            target = random.choice(possible_targets)
            cost = 15 if target in power_nodes else 5
            if energy >= cost: return ["EXPAND", target]

    # 2. CONQUEST
    valid_opp = get_valid_targets(opp)
    if not free and valid_opp:
        affordable_targets = []
        for t in valid_opp:
            base = 20 if t in [4, 7, 11, 17, 20, 24] else 8
            if energy >= base + 1: affordable_targets.append(t)
        
        if affordable_targets: return ["CONQUER", random.choice(affordable_targets)]

    return ["HARVEST"]

# --- STRATEGY 2: POWER RUSHER (The Overbidder) ---
def strat_power_rush(free, opp, mine, energy):
    power_nodes = [4, 7, 11, 17, 20, 24]
    free_power = [n for n in free if n in power_nodes]
    
    if free_power:
        if energy >= 16: return ["EXPAND", random.choice(free_power)]
        elif energy >= 5 and energy < 15:
            if len(free_power) > 2:
                normal_nodes = [n for n in free if n not in power_nodes]
                if normal_nodes: return ["EXPAND", random.choice(normal_nodes)]
        return ["HARVEST"]

    if free and energy >= 5: return ["EXPAND", free[0]]
        
    opp_power = [n for n in get_valid_targets(opp) if n in power_nodes]
    if opp_power and energy >= 25: return ["CONQUER", opp_power[0]]

    return ["HARVEST"]

# --- STRATEGY 3: THE HOARDER (The Capitalist) ---
def strat_hoarder(free, opp, mine, energy):
    if energy >= 16 and free:
        power_nodes = [4, 7, 11, 17, 20, 24]
        free_power = [n for n in free if n in power_nodes]
        if free_power: return ["EXPAND", free_power[0]]
        else: return ["EXPAND", free[0]]

    if energy >= 6 and energy < 15:
        normal_nodes = [n for n in free if n not in [4, 7, 11, 17, 20, 24]]
        if normal_nodes: return ["EXPAND", normal_nodes[0]]
             
    valid_opp = get_valid_targets(opp)
    if energy > 30 and valid_opp:
        return ["CONQUER", valid_opp[0]]

    return ["HARVEST"]

# --- STRATEGY 4: THE NEIGHBOR (The Fortress Builder) ---
def strat_neighbor(free, opp, mine, energy):
    def get_neighbors(n): return [n-1 if n>1 else 26, n+1 if n<26 else 1]

    high_value_targets = []
    normal_targets = []
    
    for node in free:
        neighbors = get_neighbors(node)
        my_neighbors = sum(1 for n in neighbors if n in mine)
        if my_neighbors > 0:
            if node in [4, 7, 11, 17, 20, 24]: high_value_targets.append(node)
            elif my_neighbors == 2: normal_targets.insert(0, node) 
            else: normal_targets.append(node)

    if high_value_targets and energy >= 16: return ["EXPAND", high_value_targets[0]]
    if normal_targets and energy >= 5: return ["EXPAND", normal_targets[0]]
    if free and energy >= 5 and not mine: return ["EXPAND", random.choice(free)]

    return ["HARVEST"]

# --- STRATEGY 5: THE SNIPER (The Eco-Terrorist) ---
def strat_sniper(free, opp, mine, energy):
    def get_neighbors(n): return [n-1 if n>1 else 26, n+1 if n<26 else 1]
    
    valid_opp = get_valid_targets(opp)
    
    if valid_opp and energy >= 10:
        isolated_targets = []
        for t in valid_opp:
            neighbors = get_neighbors(t)
            defense = sum(1 for n in neighbors if n in opp)
            if defense == 0 and t not in [4, 7, 11, 17, 20, 24]: isolated_targets.append(t)
        if isolated_targets: return ["CONQUER", isolated_targets[0]]

    opp_power = [n for n in valid_opp if n in [4, 7, 11, 17, 20, 24]]
    if opp_power and energy >= 25: return ["CONQUER", opp_power[0]]

    if free and energy >= 5: return ["EXPAND", free[0]]
        
    return ["HARVEST"]