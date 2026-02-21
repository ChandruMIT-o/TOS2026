import { Code2 } from "lucide-react";

export function SpecsContent() {
	return (
		<div className="space-y-8 pb-6">
			<h1 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-tight flex items-center gap-3">
				<Code2 className="text-purple-500 w-6 h-6 md:w-8 md:h-8" />
				Technical Specifications
			</h1>

			<div className="font-mono text-sm bg-black/50 border border-white/10 rounded-lg overflow-hidden">
				<div className="bg-white/5 px-4 py-2 border-b border-white/10 text-white/50 text-xs">
					player_strategy.py
				</div>
				<div className="cursor-target p-6 text-white/80 overflow-x-auto">
					<pre>{`def strategy_name(free: list, mine: list, opp: list, energy: int) -> list:
    """
    Determines the next move based on current game state.
    
    Args:
        "free": [1, 5, 8...], // List of all currently unoccupied nodes.
        "mine": [2, 3], // List of all nodes currently occupied by you.
        "opp": [14], // List of all nodes currently occupied by the opponent.
        "energy": 50, // The amount of energy you currently have.
        
    Returns:
        One of:
        - ["HARVEST"]
        - ["EXPAND", target_id] (e.g., ["EXPAND", 3])
        - ["CONQUER", target_id] (e.g., ["CONQUER", 14])
    """
    `}</pre>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="cursor-target bg-white/5 p-5 rounded-lg border border-white/10 hover:border-white/20 transition-colors">
					<h4 className="text-emerald-400 font-bold mb-2">
						Input Parameters
					</h4>
					<ul className="space-y-2 text-xs text-white/60 font-mono">
						<li className="flex justify-between border-b border-white/5 pb-1">
							<span>free</span>
							<span>List[int]</span>
						</li>
						<li className="flex justify-between border-b border-white/5 pb-1">
							<span>mine</span>
							<span>List[int]</span>
						</li>
						<li className="flex justify-between border-b border-white/5 pb-1">
							<span>opp</span>
							<span>List[int]</span>
						</li>
						<li className="flex justify-between border-b border-white/5 pb-1">
							<span>energy</span>
							<span>Integer</span>
						</li>
					</ul>
				</div>

				<div className="cursor-target bg-white/5 p-5 rounded-lg border border-white/10 hover:border-white/20 transition-colors">
					<h4 className="text-purple-400 font-bold mb-2">
						Return Format
					</h4>
					<div className="space-y-2 text-xs text-white/60 font-mono">
						<div className="bg-black/30 p-2 rounded border border-white/5">
							["HARVEST"]
						</div>
						<div className="bg-black/30 p-2 rounded border border-white/5">
							["EXPAND", int]
						</div>
						<div className="bg-black/30 p-2 rounded border border-white/5">
							["CONQUER", int]
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
