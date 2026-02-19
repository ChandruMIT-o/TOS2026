import { Terminal, AlertCircle, CheckCircle2 } from "lucide-react";
import { CollapsiblePanel } from "../layout/CollapsiblePanel";
import { cn } from "../../../../lib/utils"; // Preserving your util import if needed

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
			// Harsh container styling matching the RuleBook and Leaderboard
			className="bg-zinc-950 border-4 border-zinc-100 text-zinc-100 font-sans overflow-visible"
			actionElement={
				// Status Badge in Header
				<div className="group relative flex items-center">
					<div
						className={cn(
							"cursor-help px-3 py-1 font-black text-xs uppercase tracking-widest border-2 flex items-center gap-2",
							isValidatedByAI
								? "bg-yellow-400 text-black border-yellow-400 shadow-[3px_3px_0px_0px_#facc15]"
								: "bg-lime-400 text-black border-lime-400 shadow-[3px_3px_0px_0px_#a3e635]",
						)}
					>
						{isValidatedByAI ? "AI VALIDATED" : "HUMAN VERIFIED"}
					</div>

					{/* Hover Tooltip - Brutalist Style */}
					<div className="absolute right-0 top-full mt-4 w-72 p-4 bg-zinc-950 text-zinc-100 text-xs font-mono border-4 border-zinc-100 shadow-[6px_6px_0px_0px_#f4f4f5] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
						{isValidatedByAI ? (
							<span className="flex gap-3 font-bold uppercase leading-relaxed">
								<AlertCircle
									className="w-5 h-5 text-yellow-400 shrink-0"
									strokeWidth={3}
								/>
								<span>
									<strong className="text-yellow-400 block mb-1">
										Warning:
									</strong>
									Automated validation may have false
									positives. Consult event coordinator if
									output seems incorrect.
								</span>
							</span>
						) : (
							<span className="flex gap-3 font-bold uppercase leading-relaxed">
								<CheckCircle2
									className="w-5 h-5 text-lime-400 shrink-0"
									strokeWidth={3}
								/>
								<span>
									<strong className="text-lime-400 block mb-1">
										Secure:
									</strong>
									Verified by Site Reliability Engineer.
								</span>
							</span>
						)}
					</div>
				</div>
			}
		>
			<div className="bg-zinc-950 p-6">
				{/* Terminal Window Box */}
				<div className="h-full bg-zinc-950 border-4 border-cyan-400 p-5 font-mono text-sm overflow-auto custom-scrollbar shadow-[6px_6px_0px_0px_#22d3ee] relative">
					{/* Decorative Terminal Header */}
					<div className="flex gap-2 border-b-4 border-cyan-400/30 pb-3 mb-4 sticky top-0 bg-zinc-950 z-10">
						<div className="w-3 h-3 bg-rose-500 border border-rose-500" />
						<div className="w-3 h-3 bg-yellow-400 border border-yellow-400" />
						<div className="w-3 h-3 bg-lime-400 border border-lime-400" />
						<span className="ml-auto text-xs font-black text-cyan-400 uppercase tracking-widest">
							SYS_TERM_v2.0
						</span>
					</div>

					<div className="text-fuchsia-400 mb-4 font-black tracking-wider uppercase flex items-center gap-2">
						<span className="bg-fuchsia-400 text-black px-2 py-0.5">
							INFO
						</span>
						EXECUTION STARTED AT {new Date().toLocaleTimeString()}
					</div>

					<pre className="whitespace-pre-wrap text-cyan-400 font-bold leading-loose">
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
						{/* Solid block pulsing cursor */}
						<span className="inline-block w-2.5 h-4 bg-cyan-400 ml-1 translate-y-1 animate-pulse" />
					</pre>
				</div>
			</div>
		</CollapsiblePanel>
	);
}
