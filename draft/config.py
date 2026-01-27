# config.py

GAME_CONFIG = {
    # --- MAP SETTINGS ---
    "num_nodes": 26,
    "max_rounds": 100,
    "home_a": 1,
    "home_b": 14,
    "power_nodes": [4, 7, 11, 17, 20, 24],
    
    # --- ECONOMY ---
    "harvest_home": 5,         # Income from Home Base
    "harvest_power": 5,        # Income from Power Node
    "harvest_normal": 1,       # Income from Normal Node
    
    # --- COSTS ---
    "cost_expand_normal": 5,
    "cost_expand_power": 15,
    "cost_conquer_normal_base": 8,
    "cost_conquer_power_base": 20,
    
    # --- COMBAT MECHANICS ---
    "collision_penalty": 5,         # Energy lost by loser (or both if tie) in expansion conflict
    "defense_bonus_per_neighbor": 1 # Extra cost per neighbor owned by defender
}