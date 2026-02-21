// File: leaderboard/src/components/ui/slides/StrategyExamplesContent.tsx

import { useState } from "react";
import {
	Crosshair,
	ShieldAlert,
	Cpu,
	Shuffle,
	Zap,
	Grid3x3,
} from "lucide-react";

const STRATEGIES = [
	{
		id: "random",
		name: "Smart Random",
		icon: Shuffle,
		color: "text-purple-400",
		bgColor: "bg-purple-500/10",
		borderColor: "border-purple-500/20",
		badgeColor: "text-purple-400/70 border-purple-400/30",
		badgeText: "UNPREDICTABLE",
		description:
			"A versatile random approach that makes semi-intelligent choices. It expands and conquers randomly but considers energy costs and avoids home bases to prevent fixation.",
		code: `def strat_random(free, opp, mine, energy):
    actions = ["HARVEST"]
    
    # 1. EXPANSION
    if free and energy >= 5:
        power_nodes = [4, 7, 11, 17, 20, 24]
        available_power = [n for n in free if n in power_nodes]
        available_normal = [n for n in free if n not in power_nodes]
        
        possible_targets = []
        if available_power and energy >= 16: possible_targets.extend(available_power)
        if available_normal and energy >= 5: possible_targets.extend(available_normal)
            
        if possible_targets:
            import random
            target = random.choice(possible_targets)
            cost = 15 if target in power_nodes else 5
            if energy >= cost: return ["EXPAND", target]

    # 2. CONQUEST
    valid_opp = get_valid_targets(opp)
    if not free and valid_opp:
        affordable_targets = []
        for t in valid_opp:
            base = 20 if t in [4, 7, 11, 17, 20, 24] else 8
            if energy >= base + 1: affordable_targets.append(t)
        
        if affordable_targets:
            import random 
            return ["CONQUER", random.choice(affordable_targets)]

    return ["HARVEST"]`,
	},
	{
		id: "rusher",
		name: "Power Rusher",
		icon: Zap,
		color: "text-yellow-400",
		bgColor: "bg-yellow-500/10",
		borderColor: "border-yellow-500/20",
		badgeColor: "text-yellow-400/70 border-yellow-400/30",
		badgeText: "AGGRESSIVE",
		description:
			"Focuses relentlessly on acquiring and maintaining Power Nodes. It hoards energy early to grab high-value nodes and aggressively snipes opponent's Power Nodes once it builds enough reserves.",
		code: `def strat_power_rush(free, opp, mine, energy):
    power_nodes = [4, 7, 11, 17, 20, 24]
    free_power = [n for n in free if n in power_nodes]
    
    import random
    if free_power:
        if energy >= 16: return ["EXPAND", random.choice(free_power)]
        elif energy >= 5 and energy < 15:
            if len(free_power) > 2:
                normal_nodes = [n for n in free if n not in power_nodes]
                if normal_nodes: return ["EXPAND", random.choice(normal_nodes)]
        return ["HARVEST"]

    if free and energy >= 5: return ["EXPAND", free[0]]
        
    opp_power = [n for n in get_valid_targets(opp) if n in power_nodes]
    if opp_power and energy >= 25: return ["CONQUER", opp_power[0]]

    return ["HARVEST"]`,
	},
	{
		id: "hoarder",
		name: "The Hoarder",
		icon: ShieldAlert,
		color: "text-blue-400",
		bgColor: "bg-blue-500/10",
		borderColor: "border-blue-500/20",
		badgeColor: "text-blue-400/70 border-blue-400/30",
		badgeText: "ECONOMY",
		description:
			"A resource-first strategy focused on long-term advantage. It prioritizes affordable Power Nodes, expands in controlled phases, and converts large energy reserves into late-game conquests.",
		code: `def strat_hoarder(free, opp, mine, energy):
    if energy >= 16 and free:
        power_nodes = [4, 7, 11, 17, 20, 24]
        free_power = [n for n in free if n in power_nodes]
        if free_power: return ["EXPAND", free_power[0]]
        else: return ["EXPAND", free[0]]

    if energy >= 6 and energy < 15:
        normal_nodes = [n for n in free if n not in [4, 7, 11, 17, 20, 24]]
        if normal_nodes: return ["EXPAND", normal_nodes[0]]
             
    valid_opp = get_valid_targets(opp)
    if energy > 30 and valid_opp:
        return ["CONQUER", valid_opp[0]]

    return ["HARVEST"]`,
	},
	{
		id: "neighbor",
		name: "The Neighbor",
		icon: Grid3x3,
		color: "text-emerald-400",
		bgColor: "bg-emerald-500/10",
		borderColor: "border-emerald-500/20",
		badgeColor: "text-emerald-400/70 border-emerald-400/30",
		badgeText: "DEFENSIVE",
		description:
			"A territorial builder that expands methodically outward from its established territory. It prefers nodes next to existing controlled nodes, slowly creeping across the map forming defensive clusters.",
		code: `def strat_neighbor(free, opp, mine, energy):
    def get_neighbors(n): return [n-1 if n>1 else 26, n+1 if n<26 else 1]

    high_value_targets = []
    normal_targets = []
    
    for node in free:
        neighbors = get_neighbors(node)
        my_neighbors = sum(1 for n in neighbors if n in mine)
        if my_neighbors > 0:
            if node in [4, 7, 11, 17, 20, 24]: high_value_targets.append(node)
            elif my_neighbors == 2: normal_targets.insert(0, node) 
            else: normal_targets.append(node)

    if high_value_targets and energy >= 16: return ["EXPAND", high_value_targets[0]]
    if normal_targets and energy >= 5: return ["EXPAND", normal_targets[0]]
    if free and energy >= 5 and not mine:
        import random 
        return ["EXPAND", random.choice(free)]

    return ["HARVEST"]`,
	},
	{
		id: "sniper",
		name: "The Sniper",
		icon: Crosshair,
		color: "text-[#F70001]",
		bgColor: "bg-[#F70001]/10",
		borderColor: "border-[#F70001]/20",
		badgeColor: "text-[#F70001]/70 border-[#F70001]/30",
		badgeText: "TACTICAL",
		description:
			"A precision strike strategy that avoids prolonged fights. It hunts isolated enemy nodes, saves energy for decisive Power Node captures, and expands only when efficient.",
		code: `def strat_sniper(free, opp, mine, energy):
    def get_neighbors(n): return [n-1 if n>1 else 26, n+1 if n<26 else 1]
    
    valid_opp = get_valid_targets(opp)
    
    if valid_opp and energy >= 10:
        isolated_targets = []
        for t in valid_opp:
            neighbors = get_neighbors(t)
            defense = sum(1 for n in neighbors if n in opp)
            if defense == 0 and t not in [4, 7, 11, 17, 20, 24]: isolated_targets.append(t)
        if isolated_targets: return ["CONQUER", isolated_targets[0]]

    opp_power = [n for n in valid_opp if n in [4, 7, 11, 17, 20, 24]]
    if opp_power and energy >= 25: return ["CONQUER", opp_power[0]]

    if free and energy >= 5: return ["EXPAND", free[0]]
        
    return ["HARVEST"]`,
	},
];

export function StrategyExamplesContent() {
	const [activeTab, setActiveTab] = useState(STRATEGIES[0].id);

	const activeStrategy =
		STRATEGIES.find((s) => s.id === activeTab) || STRATEGIES[0];
	const ActiveIcon = activeStrategy.icon;

	return (
		<div className="space-y-4 md:space-y-6 animate-in fade-in zoom-in-95 duration-500 h-full flex flex-col pb-8 md:pb-0 max-w-full overflow-hidden">
			{/* HEADER */}
			<div className="flex items-center gap-3 shrink-0">
				<Cpu className="text-white/80 w-6 h-6 md:w-7 md:h-7" />
				<h2 className="text-xl md:text-3xl font-black text-white uppercase tracking-tighter">
					Example Strategies
				</h2>
			</div>

			{/* TABS (Scrollable horizontally on mobile) */}
			<div className="flex overflow-x-auto gap-2 pb-2 shrink-0 w-full scrollbar-thin scrollbar-thumb-white/20">
				{STRATEGIES.map((strategy) => {
					const Icon = strategy.icon;
					const isActive = activeTab === strategy.id;
					return (
						<button
							key={strategy.id}
							onClick={() => setActiveTab(strategy.id)}
							className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg border whitespace-nowrap transition-colors ${
								isActive
									? `${strategy.bgColor} ${strategy.borderColor} ${strategy.color}`
									: "bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white"
							}`}
						>
							<Icon size={16} />
							<span className="text-xs md:text-sm font-bold uppercase tracking-wider">
								{strategy.name}
							</span>
						</button>
					);
				})}
			</div>

			{/* DETAILS SECTION */}
			<div className="flex flex-col flex-1 gap-4 overflow-hidden">
				{/* DESCRIPTION CARD */}
				<div
					className={`${activeStrategy.bgColor} border ${activeStrategy.borderColor} rounded-xl p-4 shrink-0 transition-colors`}
				>
					<div className="flex items-center gap-2 mb-2">
						<ActiveIcon
							size={16}
							className={activeStrategy.color}
						/>
						<h3 className="text-sm font-bold text-white uppercase tracking-wider">
							{activeStrategy.name}
						</h3>
					</div>
					<p className="text-xs md:text-sm text-white/70 leading-relaxed min-h-[60px]">
						{activeStrategy.description}
					</p>
				</div>

				{/* CODE BLOCK */}
				<div className="bg-black/50 border border-white/10 rounded-xl flex flex-col flex-1 overflow-hidden">
					<div
						className={`${activeStrategy.bgColor} px-4 py-3 border-b ${activeStrategy.borderColor} flex items-center justify-between shrink-0 transition-colors`}
					>
						<div className="flex items-center gap-2">
							<ActiveIcon
								size={16}
								className={activeStrategy.color}
							/>
							<h3 className="font-bold text-white uppercase tracking-wider text-xs md:text-sm">
								Code View
							</h3>
						</div>
						<span
							className={`text-[10px] font-mono border px-2 py-0.5 rounded ${activeStrategy.badgeColor}`}
						>
							{activeStrategy.badgeText}
						</span>
					</div>

					<div className="p-4 flex-1 overflow-auto bg-[#0a0a0a]">
						<pre className="text-[10px] md:text-xs font-mono text-white/80 leading-relaxed">
							<code>{activeStrategy.code}</code>
						</pre>
					</div>
				</div>
			</div>
		</div>
	);
}
