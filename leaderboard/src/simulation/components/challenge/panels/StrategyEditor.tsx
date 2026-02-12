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
			<div className="flex flex-col h-full gap-4 text-black">
				{/* Name Input */}
				<div>
					<label className="text-[10px] text-white font-black font-mono uppercase mb-2 block tracking-wider opacity-70">
						Strategy_Codename
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
					<label className="text-[10px] text-white font-black font-mono uppercase mb-2 block tracking-wider opacity-70">
						Logic_Documentation (.md)
					</label>
					<Textarea
						placeholder="Describe your algorithmic approach here..."
						value={strategyCode}
						onChange={(e) => setStrategyCode(e.target.value)}
						className="flex-1 font-mono resize-none"
					/>
				</div>
			</div>
		</CollapsiblePanel>
	);
}
