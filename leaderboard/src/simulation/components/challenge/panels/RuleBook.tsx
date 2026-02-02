import { BookOpen } from "lucide-react";
import { CollapsiblePanel } from "../layout/CollapsiblePanel";

interface RuleBookProps {
	isCollapsed: boolean;
	onToggle: () => void;
}

export function RuleBook({ isCollapsed, onToggle }: RuleBookProps) {
	return (
		<CollapsiblePanel
			title="Mission Brief / Rules"
			icon={BookOpen}
			isCollapsed={isCollapsed}
			onToggle={onToggle}
		>
			<div className="prose prose-invert prose-sm max-w-none text-muted-foreground">
				{/* Placeholder Markdown Content */}
				<h3>Objective</h3>
				<p>
					Optimize the trading algorithm to maximize returns over a
					30-day simulated period. Your code must adhere to strict
					complexity limits.
				</p>

				<h4>Constraints</h4>
				<ul className="list-disc pl-4 space-y-1">
					<li>
						Time Limit: <strong>200ms</strong> per execution.
					</li>
					<li>
						Memory Limit: <strong>128MB</strong>.
					</li>
					<li>Standard Python 3.10 libraries only.</li>
				</ul>

				<h4>Scoring</h4>
				<p>
					Score is calculated as:{" "}
					<code>(Net Profit * 0.7) + (Efficiency Bonus * 0.3)</code>.
				</p>
			</div>
		</CollapsiblePanel>
	);
}
