// File: leaderboard/src/components/ui/slides/StrategyExamplesContent.tsx

import { Crosshair, ShieldAlert, Cpu } from "lucide-react";

export function StrategyExamplesContent() {
	return (
		<div className="space-y-8 animate-in fade-in zoom-in-95 duration-500 h-full flex flex-col">
			<div className="flex items-center gap-3 mb-4">
				<Cpu className="text-white/80" size={28} />
				<h2 className="text-3xl font-black text-white uppercase tracking-tighter">
					Archetype Analysis
				</h2>
			</div>

			<div className="grid grid-cols-2 gap-8 flex-1">
				{/* STRATEGY: THE SNIPER */}
				<div className="bg-black/50 border border-red-500/20 rounded-xl flex flex-col overflow-hidden">
					<div className="bg-[#F70001]/10 px-4 py-3 border-b border-[#F70001]/20 flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Crosshair size={18} className="text-[#F70001]" />
							<h3 className="font-bold text-white uppercase tracking-wider text-sm">
								The Sniper
							</h3>
						</div>
						<span className="text-[10px] text-[#F70001]/70 font-mono border border-[#F70001]/30 px-2 py-0.5 rounded">
							AGGRESSIVE
						</span>
					</div>
					<div className="p-4 flex-1 overflow-y-auto font-mono text-xs text-white/70">
						<pre className="space-y-1">
							<span className="text-blue-400">def</span>{" "}
							<span className="text-yellow-200">
								strat_sniper
							</span>
							(free, opp, mine, energy):
							<span className="text-white/40">
								# 1. Target vulnerable isolated nodes
							</span>
							valid_opp = get_valid_targets(opp)
							<span className="text-pink-400">
								if
							</span> valid_opp{" "}
							<span className="text-pink-400">and</span> energy
							&gt;= <span className="text-orange-300">10</span>:
							isolated = []
							<span className="text-pink-400">for</span> t{" "}
							<span className="text-pink-400">in</span> valid_opp:
							neighbors = get_neighbors(t) defense ={" "}
							<span className="text-blue-400">sum</span>(
							<span className="text-orange-300">1</span>{" "}
							<span className="text-pink-400">for</span> n{" "}
							<span className="text-pink-400">in</span> neighbors{" "}
							<span className="text-pink-400">if</span> n{" "}
							<span className="text-pink-400">in</span> opp)
							<span className="text-pink-400">if</span> defense =={" "}
							<span className="text-orange-300">0</span>:
							isolated.append(t)
							<span className="text-pink-400">if</span> isolated:
							<span className="text-pink-400">return</span> [
							<span className="text-green-300">"CONQUER"</span>,
							isolated[<span className="text-orange-300">0</span>
							]]
							<span className="text-white/40">
								# 2. Hoard for Power Node snipes
							</span>
							opp_power = [n{" "}
							<span className="text-pink-400">for</span> n{" "}
							<span className="text-pink-400">in</span> valid_opp{" "}
							<span className="text-pink-400">if</span> n{" "}
							<span className="text-pink-400">in</span>{" "}
							POWER_NODES]
							<span className="text-pink-400">
								if
							</span> opp_power{" "}
							<span className="text-pink-400">and</span> energy
							&gt;= <span className="text-orange-300">25</span>:
							<span className="text-pink-400">return</span> [
							<span className="text-green-300">"CONQUER"</span>,
							opp_power[<span className="text-orange-300">0</span>
							]]
							<span className="text-pink-400">if</span> free{" "}
							<span className="text-pink-400">and</span> energy
							&gt;= <span className="text-orange-300">5</span>:
							<span className="text-pink-400">return</span> [
							<span className="text-green-300">"EXPAND"</span>,
							free[<span className="text-orange-300">0</span>]]
							<span className="text-pink-400">return</span> [
							<span className="text-green-300">"HARVEST"</span>]
						</pre>
					</div>
				</div>

				{/* STRATEGY: THE HOARDER */}
				<div className="bg-black/50 border border-blue-500/20 rounded-xl flex flex-col overflow-hidden">
					<div className="bg-blue-500/10 px-4 py-3 border-b border-blue-500/20 flex items-center justify-between">
						<div className="flex items-center gap-2">
							<ShieldAlert size={18} className="text-blue-400" />
							<h3 className="font-bold text-white uppercase tracking-wider text-sm">
								The Hoarder
							</h3>
						</div>
						<span className="text-[10px] text-blue-400/70 font-mono border border-blue-400/30 px-2 py-0.5 rounded">
							ECONOMY
						</span>
					</div>
					<div className="p-4 flex-1 overflow-y-auto font-mono text-xs text-white/70">
						<pre className="space-y-1">
							<span className="text-blue-400">def</span>{" "}
							<span className="text-yellow-200">
								strat_hoarder
							</span>
							(free, opp, mine, energy):
							<span className="text-white/40">
								# 1. Prioritize Power Nodes when affordable
							</span>
							<span className="text-pink-400">if</span> energy
							&gt;= <span className="text-orange-300">16</span>{" "}
							<span className="text-pink-400">and</span> free:
							free_power = [n{" "}
							<span className="text-pink-400">for</span> n{" "}
							<span className="text-pink-400">in</span> free{" "}
							<span className="text-pink-400">if</span> n{" "}
							<span className="text-pink-400">in</span>{" "}
							POWER_NODES]
							<span className="text-pink-400">if</span>{" "}
							free_power:
							<span className="text-pink-400">return</span> [
							<span className="text-green-300">"EXPAND"</span>,
							free_power[
							<span className="text-orange-300">0</span>]]
							<span className="text-pink-400">else</span>:
							<span className="text-pink-400">return</span> [
							<span className="text-green-300">"EXPAND"</span>,
							free[<span className="text-orange-300">0</span>]]
							<span className="text-white/40">
								# 2. Steady normal expansion
							</span>
							<span className="text-pink-400">if</span> energy
							&gt;= <span className="text-orange-300">6</span>{" "}
							<span className="text-pink-400">and</span> energy
							&lt; <span className="text-orange-300">15</span>:
							normal = [n{" "}
							<span className="text-pink-400">for</span> n{" "}
							<span className="text-pink-400">in</span> free{" "}
							<span className="text-pink-400">if</span> n{" "}
							<span className="text-pink-400">not in</span>{" "}
							POWER_NODES]
							<span className="text-pink-400">if</span> normal:
							<span className="text-pink-400">return</span> [
							<span className="text-green-300">"EXPAND"</span>,
							normal[<span className="text-orange-300">0</span>]]
							<span className="text-white/40">
								# 3. Late-game energy dump
							</span>
							valid_opp = get_valid_targets(opp)
							<span className="text-pink-400">if</span> energy
							&gt; <span className="text-orange-300">30</span>{" "}
							<span className="text-pink-400">and</span>{" "}
							valid_opp:
							<span className="text-pink-400">return</span> [
							<span className="text-green-300">"CONQUER"</span>,
							valid_opp[<span className="text-orange-300">0</span>
							]]
							<span className="text-pink-400">return</span> [
							<span className="text-green-300">"HARVEST"</span>]
						</pre>
					</div>
				</div>
			</div>
		</div>
	);
}
