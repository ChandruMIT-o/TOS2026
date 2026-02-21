import { RefreshCw, Trophy, BarChart3, Scale } from "lucide-react";

export function TournamentContent() {
	return (
		<div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
			<div className="flex flex-col md:flex-row items-start justify-between gap-4 md:gap-0">
				<div className="space-y-2">
					<h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight flex items-center gap-4">
						<Trophy className="text-yellow-500" size={30} />
						League Structure
					</h1>
					<p className="text-white/50 max-w-xl text-sm">
						Your strategy is entered into a global pool where it
						competes in a Double Round Robin. Survival is about
						consistency across dozens of matches.
					</p>
				</div>
				<div className="bg-yellow-500/10 border border-yellow-500/20 px-4 py-2 rounded flex items-center gap-2">
					<div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
					<span className="text-yellow-400 text-[10px] font-mono font-bold tracking-widest uppercase">
						Tournament Mode: Active
					</span>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Point System Card */}
				<div className="cursor-target bg-white/5 border border-white/10 rounded-sm overflow-hidden">
					<div className="bg-white/5 px-4 py-2 border-b border-white/10 flex items-center gap-2">
						<Scale size={14} className="text-blue-400" />
						<span className="text-[10px] font-bold uppercase tracking-widest text-white/70">
							Point Distribution
						</span>
					</div>
					<div className="p-6">
						<table className="w-full text-left">
							<thead>
								<tr className="text-[10px] text-white/30 uppercase tracking-widest border-b border-white/5">
									<th className="pb-3">Result</th>
									<th className="pb-3 text-right">Points</th>
								</tr>
							</thead>
							<tbody className="text-sm font-mono">
								<tr className="border-b border-white/5">
									<td className="py-3 text-emerald-400 font-bold italic">
										VICTORY
									</td>
									<td className="py-3 text-right text-white">
										3 PTS
									</td>
								</tr>
								<tr className="border-b border-white/5">
									<td className="py-3 text-white/60">DRAW</td>
									<td className="py-3 text-right text-white">
										1 PT
									</td>
								</tr>
								<tr>
									<td className="py-3 text-red-500/60">
										DEFEAT
									</td>
									<td className="py-3 text-right text-white">
										0 PTS
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>

				{/* Tie-Breaker Card */}
				<div className="cursor-target bg-white/5 border border-white/10 rounded-sm overflow-hidden">
					<div className="bg-white/5 px-4 py-2 border-b border-white/10 flex items-center gap-2">
						<BarChart3 size={14} className="text-purple-400" />
						<span className="text-[10px] font-bold uppercase tracking-widest text-white/70">
							The Tie-Breaker
						</span>
					</div>
					<div className="p-6 space-y-4">
						<p className="text-xs text-white/50 leading-relaxed">
							If two strategies are tied on total league points,
							we look at
							<span className="text-white font-bold">
								{" "}
								Total Node Captured{" "}
							</span>
							across all matches.
						</p>
						<div className="bg-black/40 p-4 rounded border border-white/5 space-y-3">
							<div className="flex justify-between items-center text-[10px] font-mono">
								<span className="text-white/40">
									CALCULATION
								</span>
								<span className="text-purple-400">
									SUM(Total Nodes Captured)
								</span>
							</div>
							<div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
								<div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 w-2/3" />
							</div>
							<p className="text-sm text-white/30 italic">
								Strategy: Even if you can't win a match,
								capturing as many nodes as possible before Turn
								100 protects your rank.
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Operational Logic Footer */}
			<div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
				<div className="shrink-0 w-10 h-10 md:w-12 md:h-12 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500">
					<RefreshCw size={24} className="w-5 h-5 md:w-6 md:h-6" />
				</div>
				<div>
					<h4 className="text-white font-bold text-sm uppercase">
						Symmetric Fairness
					</h4>
					<p className="text-xs text-white/40 leading-relaxed">
						Each pair of strategies plays{" "}
						<span className="text-white">two games</span> per
						tournament. One starting at Node 1, one starting at Node
						14. Your total result for the pairing is the sum of
						points from both individual legs.
					</p>
				</div>
			</div>
		</div>
	);
}
