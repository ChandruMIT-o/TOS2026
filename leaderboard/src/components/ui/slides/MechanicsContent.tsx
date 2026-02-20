import { Sprout, Expand, Shield, Info } from "lucide-react";

export function MechanicsContent() {
	return (
		<div className="space-y-10 animate-in fade-in duration-700">
			<div className="text-center space-y-4 mb-10">
				<h2 className="text-3xl font-black text-white uppercase tracking-tighter">
					Player Actions
				</h2>
				<p className="text-white/50 text-md max-w-3xl mx-auto leading-relaxed">
					In each round, both players simultaneously submit one of
					three choices. Strategic success depends on balancing your
					energy economy with aggressive expansion.
				</p>
			</div>

			<div className="grid grid-cols-3 gap-3">
				{/* HARVEST */}
				<div className="cursor-target group relative bg-white/5 p-4 rounded-xl border border-white/10 hover:border-emerald-500/50 transition-all">
					<div className="flex items-center gap-4 mb-6">
						<div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400">
							<Sprout size={26} />
						</div>
						<h3 className="text-xl font-black text-white uppercase">
							Harvest
						</h3>
					</div>

					<p className="text-sm text-white/60 mb-3 leading-relaxed">
						Your primary way to gain energy. There is{" "}
						<span className="text-emerald-400 font-bold">
							no passive income
						</span>
						; if you do not harvest, your energy will not increase.
					</p>

					<div className="space-y-3 bg-black/40 p-4 rounded-xl border border-white/5 font-mono text-sm">
						<div className="flex justify-between items-center">
							<span className="text-white/40">Home Node</span>
							<span className="text-emerald-400 font-bold">
								+5E
							</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-white/40">Power Nodes</span>
							<span className="text-purple-400 font-bold">
								+5E
							</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-white/40">Normal Nodes</span>
							<span className="text-white font-bold">+1E</span>
						</div>
					</div>
				</div>

				{/* EXPAND */}
				<div className="cursor-target group relative bg-white/5 p-4 rounded-xl border border-white/10 hover:border-blue-500/50 transition-all">
					<div className="flex items-center gap-4 mb-6">
						<div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">
							<Expand size={26} />
						</div>
						<h3 className="text-xl font-black text-white uppercase">
							Expand
						</h3>
					</div>

					<p className="text-sm text-white/60 mb-3 leading-relaxed">
						Claim any unoccupied node. You do{" "}
						<span className="text-blue-400 font-bold">not</span>{" "}
						need to be adjacent to a node to expand to it.
					</p>

					<div className="space-y-4">
						<div className="bg-black/40 p-4 rounded-xl border border-white/5 font-mono text-sm space-y-2">
							<div className="flex justify-between items-center">
								<span className="text-white/40 text-xs">
									COST (NORMAL)
								</span>
								<span className="text-white font-bold text-sm">
									5E
								</span>
							</div>
							<div className="flex justify-between items-center">
								<span className="text-white/40 text-xs">
									COST (POWER)
								</span>
								<span className="text-purple-400 font-bold text-sm">
									15E
								</span>
							</div>
						</div>
						<div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
							<p className="text-xs leading-tight text-red-200 font-mono">
								<span className="font-bold uppercase block mb-1">
									Conflict (Collision)
								</span>
								Higher energy wins. Loser (or both if tied) is
								penalized <span className="font-bold">-5E</span>
								.
							</p>
						</div>
					</div>
				</div>

				{/* CONQUER */}
				<div className="cursor-target group relative bg-white/5 p-4 rounded-xl border border-white/10 hover:border-red-500/50 transition-all">
					<div className="flex items-center gap-4 mb-6">
						<div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center text-red-400">
							<Shield size={26} />
						</div>
						<h3 className="text-xl font-black text-white uppercase">
							Conquer
						</h3>
					</div>

					<p className="text-sm text-white/60 mb-3 leading-relaxed">
						Steal a node owned by your opponent.{" "}
						<span className="text-red-400 font-bold italic">
							Home bases are immune.
						</span>
					</p>

					<div className="space-y-4">
						<div className="bg-black/40 p-4 rounded-xl border border-white/5 font-mono text-sm space-y-2">
							<div className="flex justify-between items-center">
								<span className="text-white/40 text-xs">
									BASE (NORMAL)
								</span>
								<span className="text-white font-bold text-sm">
									8E
								</span>
							</div>
							<div className="flex justify-between items-center">
								<span className="text-white/40 text-xs">
									BASE (POWER)
								</span>
								<span className="text-purple-400 font-bold text-sm">
									20E
								</span>
							</div>
						</div>
						<div className="flex flex-col gap-2 p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
							<div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-tighter">
								<Info size={12} /> Defense Bonus
							</div>
							<p className="text-xs text-emerald-100/70 leading-relaxed font-mono">
								Cost = Base + (1E x Neighbors Owned)
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
