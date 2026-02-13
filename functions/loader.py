import os
import ast
import types

def validate_signature(func):
    """Checks if the function accepts the 4 required arguments."""
    try:
        # Get argument count
        code = func.__code__
        # We expect 4 arguments: free, opp, mine, energy
        return code.co_argcount == 4
    except AttributeError:
        return False

def load_strategy_from_code(source_code, name="uploaded_strategy"):
    """
    Parses a string of Python code and returns the strategy function.
    Returns None if no valid strategy function is found.
    """
    try:
        # 1. Create a dynamic module
        module_name = f"dynamic_strat_{name}"
        mod = types.ModuleType(module_name)
        
        # 2. Execute code
        exec(source_code, mod.__dict__)
        
        # 3. Find function
        found_func = None
        
        # Priority: 'strategy' function
        if "strategy" in mod.__dict__ and callable(mod.strategy):
            if validate_signature(mod.strategy):
                found_func = mod.strategy
        
        # Fallback: First valid function
        if not found_func:
            for n, obj in mod.__dict__.items():
                if isinstance(obj, types.FunctionType):
                    if validate_signature(obj) and n != "strategy":
                        found_func = obj
                        break
        
        return found_func
        
    except Exception as e:
        print(f"Error parsing strategy code: {e}")
        return None

def load_strategies(folder_path="raw_code"):
    strategies = []
    
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)
        print(f"⚠️ Created missing folder: {folder_path}")
        return []

    files = [f for f in os.listdir(folder_path) if f.endswith(".txt")]
    
    print(f"📂 Found {len(files)} strategies in '{folder_path}'...")

    for filename in files:
        filepath = os.path.join(folder_path, filename)
        strat_name = filename.replace(".txt", "")
        
        with open(filepath, "r", encoding="utf-8") as f:
            source_code = f.read()

        found_func = load_strategy_from_code(source_code, strat_name)
            
        if found_func:
            strategies.append({
                "name": strat_name,
                "func": found_func
            })
            print(f"  ✅ Loaded: {strat_name}")
        else:
            print(f"  ❌ Skipped {strat_name}: No valid function found (must accept 4 args).")

    return strategies