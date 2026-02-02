import { FileText } from "lucide-react";
import { CollapsiblePanel } from "../layout/CollapsiblePanel";
import { Input } from "../../ui/Input";
import { Textarea } from "../../ui/Textarea";

interface StrategyEditorProps {
	isCollapsed: boolean;
	onToggle: () => void;
	strategyName: string;
	setStrategyName: (val: string) => void;
	strategyCode: string;
	setStrategyCode: (val: string) => void;
}

export function StrategyEditor({
	isCollapsed,
	onToggle,
	strategyName,
	setStrategyName,
	strategyCode,
	setStrategyCode,
}: StrategyEditorProps) {
	return (
		<CollapsiblePanel
			title="Strategy Definition"
			icon={FileText}
			isCollapsed={isCollapsed}
			onToggle={onToggle}
		>
			<div className="flex flex-col h-full gap-4">
				{/* Name Input */}
				<div>
					<label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">
						Strategy Codename
					</label>
					<Input
						placeholder="E.G. ALPHA_PROTOCOL_V1"
						value={strategyName}
						onChange={(e) =>
							setStrategyName(e.target.value.toUpperCase())
						}
						className="font-mono tracking-widest"
					/>
				</div>

				{/* Markdown Editor Area */}
				<div className="flex-1 flex flex-col">
					<label className="text-xs font-semibold text-muted-foreground uppercase mb-1.5 block">
						Logic Documentation (.md)
					</label>
					<Textarea
						placeholder="Describe your algorithmic approach here..."
						value={strategyCode}
						onChange={(e) => setStrategyCode(e.target.value)}
						className="flex-1 font-mono resize-none bg-black/20"
					/>
				</div>
			</div>
		</CollapsiblePanel>
	);
}
