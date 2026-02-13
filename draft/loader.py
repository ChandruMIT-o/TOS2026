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

        # 1. Create a dynamic module to hold the code
        # This isolates the strategy code from the main game loop
        module_name = f"dynamic_strat_{strat_name}"
        mod = types.ModuleType(module_name)
        
        try:
            # 2. Execute the code string into the module's dictionary
            exec(source_code, mod.__dict__)
            
            # 3. Hunt for the strategy function
            # We look for ANY function that accepts 4 arguments.
            found_func = None
            
            # Priority: Look for a function named 'strategy'
            if "strategy" in mod.__dict__ and callable(mod.strategy):
                if validate_signature(mod.strategy):
                    found_func = mod.strategy
            
            # Fallback: Look for the first valid function we find
            if not found_func:
                for name, obj in mod.__dict__.items():
                    if isinstance(obj, types.FunctionType):
                        if validate_signature(obj) and name != "strategy":
                            found_func = obj
                            break
            
            if found_func:
                strategies.append({
                    "name": strat_name,
                    "func": found_func
                })
                print(f"  ✅ Loaded: {strat_name}")
            else:
                print(f"  ❌ Skipped {strat_name}: No valid function found (must accept 4 args).")

        except Exception as e:
            print(f"  🔥 Error loading {strat_name}: {e}")

    return strategies