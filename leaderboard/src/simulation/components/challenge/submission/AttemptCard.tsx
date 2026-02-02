import { Trophy, Zap, Terminal, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/Card";
import { Badge } from "../../ui/Badge";
import { cn } from "../../../../lib/utils";

interface AttemptStats {
	id: number;
	strategyName: string;
	score: number;
	rank: number;
	executionTime: string;
	date: string;
}

interface AttemptCardProps {
	attempt: AttemptStats;
	isSelected: boolean;
	onSelect: () => void;
}

export function AttemptCard({
	attempt,
	isSelected,
	onSelect,
}: AttemptCardProps) {
	return (
		<div
			onClick={onSelect}
			className={cn(
				"relative cursor-pointer transition-all duration-300 group",
				isSelected
					? "scale-[1.02]"
					: "hover:scale-[1.01] opacity-60 hover:opacity-100",
			)}
		>
			{/* Selection Indicator */}
			{isSelected && (
				<div className="absolute -top-3 -right-3 z-20 bg-emerald-500 text-black rounded-full p-1 shadow-lg ring-4 ring-background">
					<CheckCircle2
						size={20}
						fill="white"
						className="text-emerald-600"
					/>
				</div>
			)}

			<Card
				className={cn(
					"h-full border-2",
					isSelected
						? "border-emerald-500/50 bg-emerald-950/10 shadow-[0_0_30px_rgba(16,185,129,0.1)]"
						: "border-border bg-card/50",
				)}
			>
				<CardHeader className="pb-2">
					<div className="flex justify-between items-start">
						<div>
							<div className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
								Attempt {String(attempt.id).padStart(2, "0")}
							</div>
							<CardTitle
								className={cn(
									"text-xl font-mono tracking-wider",
									isSelected
										? "text-emerald-400"
										: "text-foreground",
								)}
							>
								{attempt.strategyName}
							</CardTitle>
						</div>
						{isSelected && (
							<Badge variant="success">SELECTED</Badge>
						)}
					</div>
				</CardHeader>

				<CardContent className="space-y-6 pt-4">
					<div className="grid grid-cols-2 gap-4">
						<div className="bg-black/20 p-3 rounded border border-white/5">
							<div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
								<Trophy size={14} /> Global Rank
							</div>
							<div className="text-2xl font-bold">
								#{attempt.rank}
							</div>
						</div>
						<div className="bg-black/20 p-3 rounded border border-white/5">
							<div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
								<Zap size={14} /> Efficiency Score
							</div>
							<div className="text-2xl font-bold">
								{attempt.score}%
							</div>
						</div>
					</div>

					<div className="space-y-2 pt-2 border-t border-white/5">
						<div className="flex justify-between text-sm">
							<span className="text-muted-foreground flex items-center gap-2">
								<Terminal size={14} /> Execution Time
							</span>
							<span className="font-mono">
								{attempt.executionTime}
							</span>
						</div>
						<div className="flex justify-between text-sm">
							<span className="text-muted-foreground">
								Timestamp
							</span>
							<span className="font-mono text-xs opacity-70">
								{attempt.date}
							</span>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
