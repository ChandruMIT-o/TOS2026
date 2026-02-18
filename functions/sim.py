import pandas as pd
import numpy as np
from config import GAME_CONFIG

class GameSimRecorded:
    def __init__(self, strat_a, strat_b, config=GAME_CONFIG):
        self.config = config
        self.strat_a = strat_a
        self.strat_b = strat_b
        
        # Initialize State
        self.nodes = {i: None for i in range(1, self.config["num_nodes"] + 1)}
        self.energy = {'A': 0, 'B': 0}
        self.nodes[self.config["home_a"]] = 'A'
        self.nodes[self.config["home_b"]] = 'B'
        
        # Metrics Log
        self.metrics = {
            "round": [], "score_a": [], "score_b": [],
            "energy_a": [], "energy_b": [],
            "move_a": [], "move_b": [],
            "nodes_a": [], "nodes_b": []
        }

    def get_neighbors(self, node_id):
        n = self.config["num_nodes"]
        prev_n = node_id - 1 if node_id > 1 else n
        next_n = node_id + 1 if node_id < n else 1
        return [prev_n, next_n]

    def get_node_cost(self, node_id, mode="EXPAND"):
        """Centralized cost calculator to prevent inconsistencies."""
        is_power = node_id in self.config["power_nodes"]
        if mode == "EXPAND":
            return self.config["cost_expand_power"] if is_power else self.config["cost_expand_normal"]
        if mode == "CONQUER":
            return self.config["cost_conquer_power_base"] if is_power else self.config["cost_conquer_normal_base"]
        return 0

    def calculate_defense(self, target_node, defender_id):
        bonus = 0
        for n in self.get_neighbors(target_node):
            if self.nodes[n] == defender_id:
                bonus += self.config["defense_bonus_per_neighbor"]
        return bonus

    def get_view(self, player_id):
        free = [k for k, v in self.nodes.items() if v is None]
        mine = [k for k, v in self.nodes.items() if v == player_id]
        opp_id = 'B' if player_id == 'A' else 'A'
        opp = [k for k, v in self.nodes.items() if v == opp_id]
        return free, opp, mine, self.energy[player_id]

    def resolve_harvest(self, player_id):
        income = 0
        home_node = self.config["home_a"] if player_id == 'A' else self.config["home_b"]
        for n, owner in self.nodes.items():
            if owner == player_id:
                if n == home_node: 
                    income += self.config["harvest_home"]
                elif n in self.config["power_nodes"]: 
                    income += self.config["harvest_power"]
                else: 
                    income += self.config["harvest_normal"]
        return income

    def validate_move(self, move, player_id, free, opp, energy):
        if not move or not isinstance(move, list): return False
        action = move[0]
        if action == "HARVEST": return True
        
        try:
            target = move[1]
        except IndexError:
            return False

        if action == "EXPAND":
            cost = self.get_node_cost(target, "EXPAND")
            return target in free and energy >= cost
            
        if action == "CONQUER":
            # Protect Home Bases
            if target in [self.config["home_a"], self.config["home_b"]]:
                return False
            if target not in opp:
                return False 
                
            opp_id = 'B' if player_id == 'A' else 'A'
            total_cost = self.get_node_cost(target, "CONQUER") + self.calculate_defense(target, opp_id)
            return energy >= total_cost

        return False

    def run_round(self, round_num):
        # 1. Snapshot state for strategies
        free_a, opp_a, mine_a, eng_a = self.get_view('A')
        free_b, opp_b, mine_b, eng_b = self.get_view('B')
        
        # 2. Collect and Validate moves
        move_a = self.strat_a(free_a, opp_a, mine_a, eng_a)
        move_b = self.strat_b(free_b, opp_b, mine_b, eng_b)

        if not self.validate_move(move_a, 'A', free_a, opp_a, eng_a): move_a = ["HARVEST"]
        if not self.validate_move(move_b, 'B', free_b, opp_b, eng_b): move_b = ["HARVEST"]

        resolved = {'A': False, 'B': False}

        # 3. Resolve Expansion Collisions (Highest Energy Wins)
        if move_a[0] == "EXPAND" and move_b[0] == "EXPAND" and move_a[1] == move_b[1]:
            target = move_a[1]
            cost = self.get_node_cost(target, "EXPAND")
            penalty = self.config["collision_penalty"]

            if self.energy['A'] > self.energy['B']:
                self.nodes[target] = 'A'
                self.energy['A'] -= cost
                self.energy['B'] = max(0, self.energy['B'] - penalty)
            elif self.energy['B'] > self.energy['A']:
                self.nodes[target] = 'B'
                self.energy['B'] -= cost
                self.energy['A'] = max(0, self.energy['A'] - penalty)
            else:
                # Tie: Both pay penalty, node remains free
                self.energy['A'] = max(0, self.energy['A'] - penalty)
                self.energy['B'] = max(0, self.energy['B'] - penalty)
            
            resolved['A'] = resolved['B'] = True

        # 4. Resolve Independent Actions
        for p, move in [('A', move_a), ('B', move_b)]:
            if resolved[p]: continue
                
            action = move[0]
            if action == "HARVEST":
                self.energy[p] += self.resolve_harvest(p)
                
            elif action == "EXPAND":
                target = move[1]
                self.nodes[target] = p
                self.energy[p] -= self.get_node_cost(target, "EXPAND")
                
            elif action == "CONQUER":
                target = move[1]
                opp_id = 'B' if p == 'A' else 'A'
                total_cost = self.get_node_cost(target, "CONQUER") + self.calculate_defense(target, opp_id)
                self.nodes[target] = p
                self.energy[p] -= total_cost

        # 5. Record state
        self.metrics["round"].append(round_num)
        self.metrics["score_a"].append(len([v for v in self.nodes.values() if v == 'A']))
        self.metrics["score_b"].append(len([v for v in self.nodes.values() if v == 'B']))
        self.metrics["energy_a"].append(self.energy['A'])
        self.metrics["energy_b"].append(self.energy['B'])
        self.metrics["move_a"].append(move_a[0])
        self.metrics["move_b"].append(move_b[0])
        self.metrics["nodes_a"].append([k for k, v in self.nodes.items() if v == 'A'])
        self.metrics["nodes_b"].append([k for k, v in self.nodes.items() if v == 'B'])

    def play_game(self):
        for r in range(1, self.config["max_rounds"] + 1):
            self.run_round(r)
        return pd.DataFrame(self.metrics)



if __name__ == "__main__":
    from strategies import strat_sniper, strat_hoarder
    sim = GameSimRecorded(strat_sniper, strat_hoarder)
    data = sim.play_game()
    print(data)
