import { Brain, Target, Zap } from "lucide-react";

export function ProblemContent() {
	return (
		<div className="space-y-8 animate-in fade-in zoom-in duration-500">
			<h1 className="text-3xl font-black text-white uppercase tracking-tight flex items-center gap-4">
				<Brain className="text-blue-500" size={30} />
				Overall Operational Logic
			</h1>

			<div className="cursor-target p-6 bg-blue-500/10 border border-blue-500/20 rounded-lg backdrop-blur-sm">
				<p className="text-lg text-blue-100/90 leading-relaxed font-light">
					"This is a turn-based, iterated tactical simulation where
					two strategies battle for dominance over a circular network
					of nodes. To win, you must manage your energy economy
					effectively while outmaneuvering your opponent's expansion.
					"
				</p>
			</div>

			<div className="grid grid-cols-2 gap-8">
				<div className="space-y-4">
					<h3 className="text-white font-bold uppercase tracking-wider flex items-center gap-2">
						<Target size={18} className="text-emerald-500" />{" "}
						Objective
					</h3>
					<p className="text-white/60 leading-relaxed">
						Build a bot as a singular function that takes in a
						predefined input. Make a choice in each turn. After 100
						turns, the unit with the most points wins. Your strategy
						fights against every other strategies in a round robin.
					</p>
				</div>
				<div className="space-y-4">
					<h3 className="text-white font-bold uppercase tracking-wider flex items-center gap-2">
						<Zap size={18} className="text-yellow-500" />{" "}
						Constraints
					</h3>
					<ul className="space-y-2 text-white/60">
						<li className="flex items-start gap-2">
							<span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2" />
							<span>Time Limit: 200ms per turn</span>
						</li>
						<li className="flex items-start gap-2">
							<span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2" />
							<span>Memory: 256MB Restricted Heap</span>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}
