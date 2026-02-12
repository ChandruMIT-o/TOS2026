import { Trophy, User } from "lucide-react";
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
			title="Global Rankings"
			icon={Trophy}
			isCollapsed={isCollapsed}
			onToggle={onToggle}
			className="bg-[#09090b] border-[#27272a]"
		>
			<div className="flex flex-col w-full font-mono text-sm bg-[#09090b]">
				{/* Terminal Header Row */}
				<div className="grid grid-cols-12 gap-2 px-3 py-2 border-b border-[#27272a] text-[10px] tracking-widest text-[#52525b] uppercase font-bold select-none">
					<div className="col-span-2 text-center">Rnk</div>
					<div className="col-span-7">Operative ID</div>
					<div className="col-span-3 text-right">Eff.</div>
				</div>

				{/* Data Rows */}
				<div className="flex flex-col py-1">
					{entries.map((entry) => {
						const isTop = entry.rank === 1;
						const isPlayer = entry.isPlayer;

						return (
							<div
								key={entry.name}
								className={cn(
									"grid grid-cols-12 gap-2 items-center px-3 py-2 transition-all duration-200 border-l-[3px]",
									// Base State (Idle Opponents)
									"border-transparent hover:bg-[#27272a]/40 text-[#a1a1aa]",

									// Active Player State (The Hero Row)
									isPlayer && [
										"bg-[#10b981]/10", // Emerald Tint Background
										"border-l-[#10b981]", // Emerald Status Bar
										"text-[#ecfdf5]", // Bright Text
										"shadow-[0_0_15px_rgba(16,185,129,0.05)]", // Subtle Glow
									],
								)}
							>
								{/* Rank Column */}
								<div
									className={cn(
										"col-span-2 text-center font-bold flex justify-center",
										isTop
											? "text-[#fbbf24] drop-shadow-sm"
											: "opacity-40",
									)}
								>
									{isTop
										? "👑"
										: String(entry.rank).padStart(2, "0")}
								</div>

								{/* Name Column */}
								<div className="col-span-7 flex items-center gap-3 truncate">
									{isPlayer ? (
										<User
											size={14}
											className="text-[#10b981] shrink-0"
										/>
									) : (
										// Subtle decorative line for non-players
										<div className="w-3.5 h-[1px] bg-[#27272a] shrink-0" />
									)}

									<span
										className={cn(
											"truncate",
											isPlayer &&
												"font-bold text-[#10b981] drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]",
										)}
									>
										{entry.name}
									</span>
								</div>

								{/* Score Column */}
								<div
									className={cn(
										"col-span-3 text-right font-medium tabular-nums",
										isPlayer
											? "text-[#ecfdf5]"
											: "text-[#52525b]",
									)}
								>
									{entry.score.toFixed(1)}
									<span className="text-[10px] opacity-50 ml-0.5">
										%
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
