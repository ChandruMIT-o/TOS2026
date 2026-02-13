import ast
import hashlib

def get_strategy_signature(source_code: str) -> str:
    """
    Generates a unique signature for a strategy based on its AST.
    This effectively ignores comments, whitespace, and formatting.
    """
    if not source_code:
        return ""
        
    try:
        # 1. Parse into AST
        tree = ast.parse(source_code)
        
        # 2. Dump AST structure
        # We use a robust dump that ignores line numbers and column offsets
        # so that formatting changes don't affect the signature.
        serialized = ast.dump(tree, include_attributes=False)
        
        # 3. Hash
        return hashlib.sha256(serialized.encode('utf-8')).hexdigest()
    except SyntaxError:
        # Fallback for invalid syntax (just hash the stripped content)
        # Ideally, we should enable syntax checking before this.
        return hashlib.sha256(source_code.strip().encode('utf-8')).hexdigest()
    except TypeError:
         # Fallback for older python versions where include_attributes might not be supported (unlikely in CF)
        serialized = ast.dump(tree)
        return hashlib.sha256(serialized.encode('utf-8')).hexdigest()
