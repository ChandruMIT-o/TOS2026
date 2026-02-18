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

export function ValidationTimeline({
	steps,
	className,
}: ValidationTimelineProps) {
	return (
		<div className={cn("space-y-4", className)}>
			{steps.map((step) => (
				<div key={step.id} className="flex items-start gap-3">
					<div className="flex-shrink-0 mt-0.5">
						{step.status === "pending" && (
							<Circle className="w-5 h-5 text-slate-600" />
						)}
						{step.status === "loading" && (
							<Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
						)}
						{step.status === "success" && (
							<CheckCircle2 className="w-5 h-5 text-emerald-400" />
						)}
						{step.status === "error" && (
							<XCircle className="w-5 h-5 text-red-500" />
						)}
						{step.status === "warning" && (
							<AlertTriangle className="w-5 h-5 text-amber-400" />
						)}
					</div>
					<div className="flex-1">
						<p
							className={cn(
								"text-sm font-medium",
								step.status === "pending" && "text-slate-500",
								step.status === "loading" && "text-blue-300",
								step.status === "success" && "text-emerald-300",
								step.status === "error" && "text-red-400",
								step.status === "warning" && "text-amber-300",
							)}
						>
							{step.label}
						</p>
						{/* Optional: progress bar line connecting steps could go here if we wanted complex UI */}
					</div>
				</div>
			))}
		</div>
	);
}
