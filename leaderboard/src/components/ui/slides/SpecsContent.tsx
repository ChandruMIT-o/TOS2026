import { Code2 } from "lucide-react";

export function SpecsContent() {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white uppercase tracking-tight flex items-center gap-3">
				<Code2 className="text-purple-500" size={32} />
				Technical Specifications
			</h1>

             <div className="font-mono text-sm bg-black/50 border border-white/10 rounded-lg overflow-hidden">
                <div className="bg-white/5 px-4 py-2 border-b border-white/10 text-white/50 text-xs">
                    player_strategy.py
                </div>
                <div className="p-6 text-white/80 overflow-x-auto">
<pre>{`def strategy(state: dict) -> list:
    """
    Determines the next move based on current game state.
    
    Args:
        state (dict): {
            "free_nodes": [1, 5, 8...], 
            "my_nodes": [2, 3],
            "opp_nodes": [14],
            "energy": 50,
            "turn": 12
        }
        
    Returns:
        One of:
        - ["HARVEST"]
        - ["EXPAND", target_id]
        - ["CONQUER", target_id]
    """
    
    # Example: Always expand to first free node
    if state["free_nodes"] and state["energy"] >= 5:
        return ["EXPAND", state["free_nodes"][0]]
        
    return ["HARVEST"]`}</pre>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-white/5 p-5 rounded-lg border border-white/10 hover:border-white/20 transition-colors">
                     <h4 className="text-emerald-400 font-bold mb-2">Input Dictionary</h4>
                     <ul className="space-y-2 text-xs text-white/60 font-mono">
                         <li className="flex justify-between border-b border-white/5 pb-1">
                             <span>free_nodes</span>
                             <span>List[int]</span>
                         </li>
                         <li className="flex justify-between border-b border-white/5 pb-1">
                             <span>my_nodes</span>
                             <span>List[int]</span>
                         </li>
                         <li className="flex justify-between border-b border-white/5 pb-1">
                             <span>energy</span>
                             <span>Integer</span>
                         </li>
                     </ul>
                 </div>
                 
                 <div className="bg-white/5 p-5 rounded-lg border border-white/10 hover:border-white/20 transition-colors">
                     <h4 className="text-purple-400 font-bold mb-2">Return Format</h4>
                     <div className="space-y-2 text-xs text-white/60 font-mono">
                        <div className="bg-black/30 p-2 rounded border border-white/5">
                            ["HARVEST"]
                        </div>
                        <div className="bg-black/30 p-2 rounded border border-white/5">
                            ["EXPAND", int]
                        </div>
                     </div>
                 </div>
            </div>
        </div>
    )
}
