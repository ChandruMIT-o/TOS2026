// File: leaderboard/src/components/ui/slides/StrategyExamplesContent.tsx

import { Crosshair, ShieldAlert, Cpu } from "lucide-react";

const sniperCode = `def strat_sniper(free, opp, mine, energy):
    # 1. Target vulnerable isolated nodes
    valid_opp = get_valid_targets(opp)

    if valid_opp and energy >= 10:
        isolated = []

        for t in valid_opp:
            neighbors = get_neighbors(t)
            defense = sum(1 for n in neighbors if n in opp)

            if defense == 0:
                isolated.append(t)

        if isolated:
            return ["CONQUER", isolated[0]]

    # 2. Hoard for Power Node snipes
    opp_power = [n for n in valid_opp if n in POWER_NODES]

    if opp_power and energy >= 25:
        return ["CONQUER", opp_power[0]]

    if free and energy >= 5:
        return ["EXPAND", free[0]]

    return ["HARVEST"]`;

const hoarderCode = `def strat_hoarder(free, opp, mine, energy):
    # 1. Prioritize Power Nodes when affordable
    if energy >= 16 and free:
        free_power = [n for n in free if n in POWER_NODES]

        if free_power:
            return ["EXPAND", free_power[0]]
        else:
            return ["EXPAND", free[0]]

    # 2. Steady normal expansion
    if energy >= 6 and energy < 15:
        normal = [n for n in free if n not in POWER_NODES]

        if normal:
            return ["EXPAND", normal[0]]

    # 3. Late-game energy dump
    valid_opp = get_valid_targets(opp)

    if energy > 30 and valid_opp:
        return ["CONQUER", valid_opp[0]]

    return ["HARVEST"]`;

export function StrategyExamplesContent() {
	return (
		<div className="space-y-6 md:space-y-8 animate-in fade-in zoom-in-95 duration-500 h-full flex flex-col pb-8 md:pb-0">
			{/* HEADER */}
			<div className="flex items-center gap-3">
				<Cpu className="text-white/80 w-6 h-6 md:w-7 md:h-7" />
				<h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter">
					Example Strategies
				</h2>
			</div>

			{/* DESCRIPTIONS */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="bg-[#F70001]/10 border border-[#F70001]/20 rounded-xl p-4">
					<div className="flex items-center gap-2 mb-2">
						<Crosshair size={16} className="text-[#F70001]" />
						<h3 className="text-sm font-bold text-white uppercase tracking-wider">
							The Sniper – Tactical Aggression
						</h3>
					</div>
					<p className="text-sm text-white/70 leading-relaxed">
						A precision strike strategy that avoids prolonged fights
						and instead waits for high-value opportunities. It hunts
						isolated enemy nodes, saves energy for decisive Power
						Node captures, and expands only when efficient. Designed
						for players who prefer calculated bursts of dominance
						over steady growth.
					</p>
				</div>

				<div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
					<div className="flex items-center gap-2 mb-2">
						<ShieldAlert size={16} className="text-blue-400" />
						<h3 className="text-sm font-bold text-white uppercase tracking-wider">
							The Hoarder – Economic Scaling
						</h3>
					</div>
					<p className="text-sm text-white/70 leading-relaxed">
						A resource-first strategy focused on long-term
						advantage. It prioritizes affordable Power Nodes,
						expands in controlled phases, and converts large energy
						reserves into late-game conquests. Ideal for players who
						win through superior economy rather than early conflict.
					</p>
				</div>
			</div>

			{/* CODE GRID */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
				{/* SNIPER */}
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

					<div className="p-4 flex-1 overflow-y-auto">
						<pre className="whitespace-pre text-xs font-mono text-white/70 leading-relaxed">
							<code>{sniperCode}</code>
						</pre>
					</div>
				</div>

				{/* HOARDER */}
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

					<div className="p-4 flex-1 overflow-y-auto">
						<pre className="whitespace-pre text-xs font-mono text-white/70 leading-relaxed">
							<code>{hoarderCode}</code>
						</pre>
					</div>
				</div>
			</div>
		</div>
	);
}
