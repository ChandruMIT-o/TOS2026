import { Terminal, AlertCircle, CheckCircle2 } from "lucide-react";
import { CollapsiblePanel } from "../layout/CollapsiblePanel";
import { Badge } from "../../ui/Badge";

interface CodePreviewProps {
	isCollapsed: boolean;
	onToggle: () => void;
	isValidatedByAI: boolean;
	logs?: string;
}

export function CodePreview({
	isCollapsed,
	onToggle,
	isValidatedByAI,
	logs,
}: CodePreviewProps) {
	return (
		<CollapsiblePanel
			title="System Output Log"
			icon={Terminal}
			isCollapsed={isCollapsed}
			onToggle={onToggle}
			actionElement={
				// Status Badge in Header
				<div className="group relative">
					<Badge
						variant={isValidatedByAI ? "warning" : "success"}
						className="cursor-help"
					>
						{isValidatedByAI ? "AI VALIDATED" : "HUMAN VERIFIED"}
					</Badge>
					{/* Hover Tooltip */}
					<div className="absolute right-0 top-full mt-2 w-64 p-3 bg-popover text-popover-foreground text-xs rounded-md shadow-lg border border-border opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
						{isValidatedByAI ? (
							<span className="flex gap-2">
								<AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
								Warning: Automated validation may have false
								positives. Consult event coordinator if output
								seems incorrect.
							</span>
						) : (
							<span className="flex gap-2">
								<CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
								Verified by Site Reliability Engineer.
							</span>
						)}
					</div>
				</div>
			}
		>
			<div className="h-full bg-black/40 rounded-md border border-white/5 p-4 font-mono text-sm overflow-auto custom-scrollbar">
				<div className="text-emerald-500 mb-2">
					# EXECUTION STARTED AT {new Date().toLocaleTimeString()}
				</div>
				<pre className="text-muted-foreground whitespace-pre-wrap">
					{logs ||
						`def optimize_strategy(market_data):
    """
    Generated Strategy Logic
    """
    risk_factor = calculate_risk(market_data)
    
    if risk_factor > 0.8:
        return "HOLD"
        
    # Optimizing for volatility
    return "BUY" if market_data.trend > 0 else "SELL"
    
# ... awaiting input stream ...`}
				</pre>
				<div className="text-emerald-500/50 mt-2 animate-pulse">_</div>
			</div>
		</CollapsiblePanel>
	);
}
