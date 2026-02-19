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
	return (
		<CollapsiblePanel
			title="Test Tournament Ranks [Matches 10]"
			icon={Terminal}
			isCollapsed={isCollapsed}
			onToggle={onToggle}
			// Harsh container styling
			className="bg-zinc-950 border-4 border-zinc-100 text-zinc-100 font-sans overflow-hidden"
		>
			<div className="flex flex-col w-full font-mono text-sm bg-zinc-950 relative">
				{/* Terminal Header Row */}
				<div className="sticky top-0 z-20 grid grid-cols-12 gap-2 px-4 py-4 bg-zinc-100 border-b-4 border-zinc-100 text-black uppercase tracking-[0.15em] font-black select-none text-xs">
					<div className="col-span-1 flex items-center justify-center">
						Rank
					</div>
					<div className="col-span-4 flex items-center">Strategy</div>
					<div className="col-span-1 text-center">Points</div>
					<div className="col-span-4 text-center">
						Win / Draw / Loss
					</div>
					<div className="col-span-2 text-right">Nodes</div>
				</div>

				{/* Data Rows */}
				<div className="flex flex-col overflow-y-auto max-h-[500px] custom-scrollbar bg-zinc-950">
					{entries.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-16 m-6 border-4 border-dashed border-zinc-700 bg-zinc-900/50 gap-4">
							<Terminal
								className="w-10 h-10 text-zinc-500"
								strokeWidth={3}
							/>
							<span className="text-sm bg-zinc-950 text-zinc-300 border-2 border-zinc-700 px-4 py-2 uppercase tracking-widest font-black shadow-[4px_4px_0px_0px_#3f3f46]">
								Run Test to show leaderboard
							</span>
						</div>
					) : (
						entries.map((entry) => {
							const isTarget = entry.isPlayer;
							const total =
								entry.wins + entry.draws + entry.losses || 1;

							return (
								<div
									key={entry.strategy}
									className={cn(
										"grid grid-cols-12 gap-2 items-center px-4 py-4 border-b-2 border-zinc-800 transition-colors group relative",
										isTarget
											? "bg-zinc-900"
											: "hover:bg-zinc-900/40 text-zinc-300",
									)}
								>
									{/* Visual Accent for Highlighted Row */}
									{isTarget && (
										<div className="absolute left-0 top-0 bottom-0 w-2 bg-rose-500 shadow-[4px_0_0_0_#f4f4f5]" />
									)}

									{/* Rank Badge */}
									<div className="col-span-1 flex justify-center">
										<span
											className={cn(
												"flex items-center justify-center w-8 h-8 font-black text-sm border-2",
												entry.rank === 1
													? "bg-yellow-400 text-black border-yellow-400 shadow-[3px_3px_0px_0px_#facc15]"
													: entry.rank === 2
														? "bg-zinc-300 text-black border-zinc-300 shadow-[3px_3px_0px_0px_#d4d4d8]"
														: entry.rank === 3
															? "bg-orange-500 text-black border-orange-500 shadow-[3px_3px_0px_0px_#f97316]"
															: "bg-zinc-950 text-zinc-400 border-zinc-700 shadow-[3px_3px_0px_0px_#3f3f46]",
												isTarget &&
													entry.rank > 3 &&
													"border-rose-500 text-rose-500 shadow-[3px_3px_0px_0px_#f43f5e]",
											)}
										>
											{entry.rank}
										</span>
									</div>

									{/* Strategy Name */}
									<div className="col-span-4 flex items-center overflow-hidden pl-2">
										<span
											className={cn(
												"truncate uppercase tracking-wider",
												isTarget
													? "text-white font-black text-base bg-rose-500/10 px-2 py-1 border border-rose-500"
													: "font-bold group-hover:text-white",
											)}
										>
											{entry.strategy}
										</span>
									</div>

									{/* Points */}
									<div
										className={cn(
											"col-span-1 text-center font-black tabular-nums text-lg",
											isTarget
												? "text-rose-500"
												: "text-zinc-100",
										)}
									>
										{entry.points}
									</div>

									{/* W/D/L Performance Visual */}
									<div className="col-span-4 px-4">
										{/* Hard-edged bar */}
										<div className="flex h-3 w-full bg-zinc-950 border-2 border-zinc-700 shadow-[2px_2px_0px_0px_#3f3f46] overflow-hidden mb-2">
											{entry.wins > 0 && (
												<div
													style={{
														width: `${(entry.wins / total) * 100}%`,
													}}
													className="bg-lime-400 border-r border-zinc-950"
												/>
											)}
											{entry.draws > 0 && (
												<div
													style={{
														width: `${(entry.draws / total) * 100}%`,
													}}
													className="bg-yellow-400 border-r border-zinc-950"
												/>
											)}
											{entry.losses > 0 && (
												<div
													style={{
														width: `${(entry.losses / total) * 100}%`,
													}}
													className="bg-rose-500"
												/>
											)}
										</div>
										{/* Stats */}
										<div className="flex justify-between text-xs font-black tracking-widest uppercase">
											<span className="text-lime-400">
												{entry.wins}W
											</span>
											<span className="text-yellow-400">
												{entry.draws}D
											</span>
											<span className="text-rose-500">
												{entry.losses}L
											</span>
										</div>
									</div>

									{/* Total Nodes */}
									<div className="col-span-2 text-right pr-2">
										<div
											className={cn(
												"inline-flex flex-col items-end px-2 py-1 border-2 shadow-[2px_2px_0px_0px]",
												isTarget
													? "border-rose-500 shadow-rose-500 bg-zinc-950"
													: "border-cyan-400 shadow-cyan-400 bg-zinc-950",
											)}
										>
											<span
												className={cn(
													"tabular-nums font-black text-sm leading-none",
													isTarget
														? "text-rose-500"
														: "text-cyan-400",
												)}
											>
												{entry.total_nodes.toLocaleString()}
											</span>
										</div>
									</div>
								</div>
							);
						})
					)}
				</div>
			</div>
		</CollapsiblePanel>
	);
}
