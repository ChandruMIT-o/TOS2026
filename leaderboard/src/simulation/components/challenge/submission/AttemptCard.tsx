import { Trophy, Target, Activity, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/Card";
import { cn } from "../../../../lib/utils";

export interface AttemptStats {
	id: number;
	strategyName: string;
	rank: number;
	points: number;
	wins: number;
	draws: number;
	losses: number;
	total_nodes: number;
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
	const totalGames = attempt.wins + attempt.draws + attempt.losses || 1;

	return (
		<div
			onClick={onSelect}
			className={cn(
				"relative cursor-pointer group transition-all duration-300",
				isSelected ? "scale-[1.02] z-10" : "hover:-translate-y-1",
			)}
		>
			<Card
				className={cn(
					"h-full border-2 rounded-none transition-all duration-300 relative overflow-hidden",
					isSelected
						? "bg-black text-white border-emerald-500 shadow-[8px_8px_0px_#10b981]"
						: "bg-slate-200 text-black border-black hover:bg-black hover:text-white shadow-[4px_4px_0px_black] hover:shadow-[8px_8px_0px_white]",
				)}
			>
				{/* Brutalist Diagonal Stripe for selected */}
				{isSelected && (
					<div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500 transform rotate-45 translate-x-8 -translate-y-8" />
				)}

				<CardHeader className="pb-2 relative z-10">
					<div className="flex justify-between items-start">
						<div>
							<div className="text-xs font-mono uppercase tracking-widest mb-1 opacity-60 group-hover:opacity-100 transition-opacity">
								Attempt {String(attempt.id).padStart(2, "0")}
							</div>
							<CardTitle
								className={cn(
									"text-2xl font-black uppercase tracking-tighter leading-none",
									isSelected ? "text-emerald-400" : "",
								)}
							>
								{attempt.strategyName}
							</CardTitle>
						</div>
					</div>
				</CardHeader>

				<CardContent className="space-y-6 pt-4 relative z-10">
					<div className="grid grid-cols-2 gap-4">
						<div
							className={cn(
								"p-3 border transition-colors",
								isSelected
									? "border-white/20 bg-white/5"
									: "border-black/10 bg-black/5 group-hover:border-white/20 group-hover:bg-white/10",
							)}
						>
							<div className="flex items-center gap-2 text-xs opacity-70 mb-1 font-mono uppercase">
								<Trophy size={14} /> Rank
							</div>
							<div className="text-3xl font-black leading-none">
								#{attempt.rank}
							</div>
						</div>
						<div
							className={cn(
								"p-3 border transition-colors",
								isSelected
									? "border-white/20 bg-white/5"
									: "border-black/10 bg-black/5 group-hover:border-white/20 group-hover:bg-white/10",
							)}
						>
							<div className="flex items-center gap-2 text-xs opacity-70 mb-1 font-mono uppercase">
								<Target size={14} /> Points
							</div>
							<div className="text-3xl font-black leading-none">
								{attempt.points}
							</div>
						</div>
					</div>

					{/* W/D/L Visual */}
					<div className="space-y-2">
						<div className="flex justify-between text-xs font-bold font-mono tracking-tight uppercase opacity-80">
							<span>Performance</span>
							<span className="flex gap-2">
								<span className="text-emerald-500">
									{attempt.wins}W
								</span>
								<span className="text-yellow-500">
									{attempt.draws}D
								</span>
								<span className="text-red-500">
									{attempt.losses}L
								</span>
							</span>
						</div>
						<div className="flex h-2 w-full bg-black/20 rounded-full overflow-hidden border border-current/10">
							<div
								style={{
									width: `${(attempt.wins / totalGames) * 100}%`,
								}}
								className="bg-emerald-500"
							/>
							<div
								style={{
									width: `${(attempt.draws / totalGames) * 100}%`,
								}}
								className="bg-yellow-500"
							/>
							<div
								style={{
									width: `${(attempt.losses / totalGames) * 100}%`,
								}}
								className="bg-red-500"
							/>
						</div>
					</div>

					<div className="space-y-2 pt-2 border-t border-current opacity-80">
						<div className="flex justify-between text-sm uppercase font-mono font-bold">
							<span className="flex items-center gap-2 opacity-70">
								<Activity size={14} /> Total Nodes
							</span>
							<span>{attempt.total_nodes.toLocaleString()}</span>
						</div>
						<div className="flex justify-between text-sm uppercase font-mono font-bold">
							<span className="flex items-center gap-2 opacity-70">
								<Calendar size={14} /> Date
							</span>
							<span className="text-xs">{attempt.date}</span>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
