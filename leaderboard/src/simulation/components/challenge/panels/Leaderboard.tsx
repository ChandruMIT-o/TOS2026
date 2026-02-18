import { Terminal } from "lucide-react";
import { CollapsiblePanel } from "../layout/CollapsiblePanel";
import { cn } from "../../../../lib/utils";
import type { LeaderboardEntry } from "../../../types/challenge";

interface LeaderboardProps {
	isCollapsed: boolean;
	onToggle: () => void;
	entries: LeaderboardEntry[];
}

export function Leaderboard({
	isCollapsed,
	onToggle,
	entries,
}: LeaderboardProps) {
	const HIGHLIGHT_TARGET = "CYBER_GHOST";

	return (
		<CollapsiblePanel
			title="Test Tournament Ranks [Matches 10]"
			icon={Terminal}
			isCollapsed={isCollapsed}
			onToggle={onToggle}
			className="bg-[#050505] border-[#1f1f22] overflow-hidden"
		>
			<div className="flex flex-col w-full font-mono text-xs bg-[#1A1A1A]">
				{/* Terminal Header Row */}
				<div className="sticky top-0 z-20 grid grid-cols-12 gap-2 px-4 py-3 bg-[#09090b]/90 backdrop-blur-md border-b border-[#27272a] text-[#52525b] uppercase tracking-[0.15em] font-black select-none text-xs">
					<div className="col-span-1 flex items-center justify-center">
						Rank
					</div>
					<div className="col-span-4 flex items-center gap-2">
						Strategy
					</div>
					<div className="col-span-1 text-center text-[#e4e4e7]">
						Points
					</div>
					<div className="col-span-4 text-center">
						(Win/Draw/Loss)
					</div>
					<div className="col-span-2 text-right">Total Nodes</div>
				</div>

				{/* Data Rows */}
				<div className="flex flex-col overflow-y-auto max-h-[500px] custom-scrollbar divide-y divide-[#161618]">
					{entries.map((entry) => {
						const isTarget = entry.strategy === HIGHLIGHT_TARGET;
						const total =
							entry.wins + entry.draws + entry.losses || 1;

						return (
							<div
								key={entry.strategy}
								className={cn(
									"grid grid-cols-12 gap-2 items-center px-4 py-4 transition-all duration-300 group relative",
									isTarget
										? "bg-[#F70001]/[0.05] border-y border-y-[#F70001]/40 z-10 shadow-[inset_0_0_20px_rgba(247,0,1,0.05)]"
										: "hover:bg-white/[0.02]",
								)}
							>
								{/* Visual Accent for Highlighted Row */}
								{isTarget && (
									<div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#F70001] shadow-[0_0_12px_#F70001]" />
								)}

								{/* Rank */}
								<div
									className={cn(
										"col-span-1 text-center font-bold tabular-nums text-base",
										entry.rank <= 3
											? "text-amber-500"
											: "text-[#3f3f46]",
										isTarget && "text-[#F70001]",
									)}
								>
									{String(entry.rank).padStart(2, "0")}
								</div>

								{/* Strategy Name */}
								<div className="col-span-4 flex items-left gap-3 overflow-hidden">
									<span
										className={cn(
											"truncate font-medium tracking-tight uppercase text-sm",
											isTarget
												? "text-white font-black tracking-widest text-base"
												: "text-[#a1a1aa] group-hover:text-white",
										)}
									>
										{entry.strategy}
									</span>
								</div>

								{/* Points */}
								<div
									className={cn(
										"col-span-1 text-center font-black tabular-nums text-base",
										isTarget
											? "text-[#F70001] drop-shadow-[0_0_8px_rgba(247,0,1,0.5)]"
											: "text-[#e4e4e7]",
									)}
								>
									{entry.points}
								</div>

								{/* W/D/L Performance Visual */}
								<div className="col-span-4 px-4">
									<div className="flex h-2 w-full bg-[#161618] rounded-full overflow-hidden border border-white/5">
										<div
											style={{
												width: `${(entry.wins / total) * 100}%`,
											}}
											className="bg-emerald-500/70"
										/>
										<div
											style={{
												width: `${(entry.draws / total) * 100}%`,
											}}
											className="bg-yellow-500/50"
										/>
										<div
											style={{
												width: `${(entry.losses / total) * 100}%`,
											}}
											className="bg-red-500/40"
										/>
									</div>
									<div className="flex justify-between mt-1 text-sm font-bold tracking-tighter tabular-nums text-[#52525b]">
										<span className="text-emerald-500/80">
											{entry.wins}W
										</span>
										<span className="text-yellow-500/80">
											{entry.draws}D
										</span>
										<span className="text-red-500/80">
											{entry.losses}L
										</span>
									</div>
								</div>

								{/* Total Nodes / Capacity */}
								<div className="col-span-2 text-right leading-none">
									<div
										className={cn(
											"tabular-nums font-black text-sm",
											isTarget
												? "text-white"
												: "text-[#71717a]",
										)}
									>
										{entry.total_nodes.toLocaleString()}
									</div>
									<span className="text-[10px] text-[#3f3f46] uppercase font-bold">
										Nodes
									</span>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</CollapsiblePanel>
	);
}
