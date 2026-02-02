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
		>
			<div className="space-y-1">
				{/* Header Row */}
				<div className="grid grid-cols-6 text-xs text-muted-foreground font-semibold px-2 pb-2 border-b border-border/50">
					<div className="col-span-1">#</div>
					<div className="col-span-3">OPERATIVE</div>
					<div className="col-span-2 text-right">EFFICIENCY</div>
				</div>

				{/* Rows */}
				{entries.map((entry) => (
					<div
						key={entry.name}
						className={cn(
							"grid grid-cols-6 items-center px-2 py-2 rounded-sm text-sm font-mono",
							entry.isPlayer
								? "bg-primary/10 text-primary border border-primary/20"
								: "text-muted-foreground hover:bg-white/5",
						)}
					>
						<div className="col-span-1 opacity-70">
							{entry.rank === 1
								? "👑"
								: String(entry.rank).padStart(2, "0")}
						</div>
						<div className="col-span-3 flex items-center gap-2">
							{entry.isPlayer && <User size={12} />}
							<span className="truncate">{entry.name}</span>
						</div>
						<div className="col-span-2 text-right opacity-90">
							{entry.score.toFixed(1)}%
						</div>
					</div>
				))}
			</div>
		</CollapsiblePanel>
	);
}
