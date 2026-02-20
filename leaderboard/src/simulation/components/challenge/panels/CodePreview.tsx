import { Terminal, AlertCircle, CheckCircle2 } from "lucide-react";
import { CollapsiblePanel } from "../layout/CollapsiblePanel";
import { cn } from "../../../../lib/utils"; // Preserving your util import if needed
import { simulationTheme } from "../../../theme";

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
			className={`${simulationTheme.colors.panels.bg.base} border-4 ${simulationTheme.colors.panels.border.base} ${simulationTheme.colors.panels.text.base} font-sans overflow-visible`}
			actionElement={
				// Status Badge in Header
				<div className="group relative flex items-center">
					<div
						className={cn(
							"cursor-help px-3 py-1 font-black text-xs uppercase tracking-widest border-2 flex items-center gap-2",
							isValidatedByAI
								? `${simulationTheme.colors.panels.bg.warning} ${simulationTheme.colors.panels.text.dark} border-yellow-400 shadow-[3px_3px_0px_0px_#facc15]`
								: `${simulationTheme.colors.panels.bg.success} ${simulationTheme.colors.panels.text.dark} border-lime-400 shadow-[3px_3px_0px_0px_#a3e635]`,
						)}
					>
						{isValidatedByAI ? "AI VALIDATED" : "HUMAN VERIFIED"}
					</div>

					{/* Hover Tooltip - Brutalist Style */}
					<div
						className={`absolute right-0 top-full mt-4 w-72 p-4 ${simulationTheme.colors.panels.bg.base} ${simulationTheme.colors.panels.text.base} text-xs font-mono border-4 ${simulationTheme.colors.panels.border.base} shadow-[6px_6px_0px_0px_#f4f4f5] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50`}
					>
						{isValidatedByAI ? (
							<span className="flex gap-3 font-bold uppercase leading-relaxed">
								<AlertCircle
									className={`w-5 h-5 ${simulationTheme.colors.panels.text.warning} shrink-0`}
									strokeWidth={3}
								/>
								<span>
									<strong
										className={`${simulationTheme.colors.panels.text.warning} block mb-1`}
									>
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
									className={`w-5 h-5 ${simulationTheme.colors.panels.text.success} shrink-0`}
									strokeWidth={3}
								/>
								<span>
									<strong
										className={`${simulationTheme.colors.panels.text.success} block mb-1`}
									>
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
			<div className={`${simulationTheme.colors.panels.bg.base} p-6`}>
				{/* Terminal Window Box */}
				<div
					className={`h-full ${simulationTheme.colors.panels.bg.base} border-4 ${simulationTheme.colors.panels.border.info} p-5 font-mono text-sm overflow-auto custom-scrollbar shadow-[6px_6px_0px_0px_#22d3ee] relative`}
				>
					{/* Decorative Terminal Header */}
					<div
						className={`flex gap-2 border-b-4 border-cyan-400/30 pb-3 mb-4 sticky top-0 ${simulationTheme.colors.panels.bg.base} z-10`}
					>
						<div
							className={`w-3 h-3 ${simulationTheme.colors.panels.bg.error} border ${simulationTheme.colors.panels.border.error}`}
						/>
						<div
							className={`w-3 h-3 ${simulationTheme.colors.panels.bg.warning} border ${simulationTheme.colors.panels.border.warning}`}
						/>
						<div
							className={`w-3 h-3 ${simulationTheme.colors.panels.bg.success} border ${simulationTheme.colors.panels.border.success}`}
						/>
						<span
							className={`ml-auto text-xs font-black ${simulationTheme.colors.panels.text.info} uppercase tracking-widest`}
						>
							SYS_TERM_v2.0
						</span>
					</div>

					<div
						className={`${simulationTheme.colors.panels.text.accent} mb-4 font-black tracking-wider uppercase flex items-center gap-2`}
					>
						<span
							className={`${simulationTheme.colors.panels.bg.accent} ${simulationTheme.colors.panels.text.dark} px-2 py-0.5`}
						>
							INFO
						</span>
						EXECUTION STARTED AT {new Date().toLocaleTimeString()}
					</div>

					<pre
						className={`whitespace-pre-wrap ${simulationTheme.colors.panels.text.info} font-bold leading-loose`}
					>
						{logs ||
							`def strategy_name(free: list, mine: list, opp: list, energy: int) -> list:
    """
    Determines the next move based on current game state.
    
    Args:
        "free": [1, 5, 8...], // List of all currently unoccupied nodes.
        "mine": [2, 3], // List of all nodes currently occupied by you.
        "opp": [14], // List of all nodes currently occupied by the opponent.
        "energy": 50, // The amount of energy you currently have.
        
    Returns:
        One of:
        - ["HARVEST"]
        - ["EXPAND", target_id] (e.g., ["EXPAND", 3])
        - ["CONQUER", target_id] (e.g., ["CONQUER", 14])`}
						{/* Solid block pulsing cursor */}
						<span
							className={`inline-block w-2.5 h-4 ${simulationTheme.colors.panels.bg.info} ml-1 translate-y-1 animate-pulse`}
						/>
					</pre>
				</div>
			</div>
		</CollapsiblePanel>
	);
}
