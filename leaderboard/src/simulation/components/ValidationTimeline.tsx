import {
	CheckCircle2,
	Circle,
	Loader2,
	AlertTriangle,
	XCircle,
} from "lucide-react";
import { cn } from "../../lib/utils";

export type TimelineStep = {
	id: string;
	label: string;
	status: "pending" | "loading" | "success" | "error" | "warning";
};

interface ValidationTimelineProps {
	steps: TimelineStep[];
	className?: string;
}

// Map out the neo-brutalist color palettes and icons for each state
const statusConfig = {
	pending: {
		bg: "bg-white",
		icon: Circle,
		iconClass: "text-black",
	},
	loading: {
		bg: "bg-cyan-300",
		icon: Loader2,
		iconClass: "text-black animate-spin",
	},
	success: {
		bg: "bg-lime-400", // Vibrant green
		icon: CheckCircle2,
		iconClass: "text-black",
	},
	error: {
		bg: "bg-rose-400", // Stark red/pink
		icon: XCircle,
		iconClass: "text-black",
	},
	warning: {
		bg: "bg-yellow-400",
		icon: AlertTriangle,
		iconClass: "text-black",
	},
};

export function ValidationTimeline({
	steps,
	className,
}: ValidationTimelineProps) {
	return (
		<div className={cn("relative flex flex-col gap-5 py-2", className)}>
			{/* Hard black vertical connecting line */}
			<div className="absolute left-[23px] top-6 bottom-6 w-1 bg-black z-0" />

			{steps.map((step) => {
				const config = statusConfig[step.status];
				const Icon = config.icon;

				return (
					<div
						key={step.id}
						className="relative z-10 flex items-center gap-4 group"
					>
						{/* Icon Box */}
						<div
							className={cn(
								"flex-shrink-0 w-12 h-12 flex items-center justify-center rounded border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
								config.bg,
							)}
						>
							<Icon
								className={cn("w-6 h-6", config.iconClass)}
								strokeWidth={2.5}
							/>
						</div>

						{/* Text Box */}
						<div
							className={cn(
								"flex-1 border-2 border-black rounded shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-4 py-3",
								config.bg,
							)}
						>
							<p className="text-sm md:text-base font-bold text-black tracking-wide uppercase">
								{step.label}
							</p>
						</div>
					</div>
				);
			})}
		</div>
	);
}
