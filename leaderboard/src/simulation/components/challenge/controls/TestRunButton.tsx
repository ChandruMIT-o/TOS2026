import { Play } from "lucide-react";
import { Button } from "../../ui/Button";

interface TestRunButtonProps {
	onRun: () => void;
	disabled?: boolean;
}

export function TestRunButton({ onRun, disabled }: TestRunButtonProps) {
	return (
		<div className="flex flex-col items-center justify-center h-full relative px-2">
			{/* Decorative vertical line connecting top and bottom */}
			<div className="h-[120%] w-[1px] bg-border/40 absolute z-0 pointer-events-none" />

			<div className="relative z-10 group">
				<Button
					onClick={onRun}
					disabled={disabled}
					size="icon"
					className="h-14 w-14 rounded-full shadow-[0_0_20px_rgba(var(--primary),0.2)] border-4 border-background transition-transform hover:scale-110 active:scale-95 z-20"
				>
					<Play fill="currentColor" className="ml-1 w-6 h-6" />
				</Button>

				{/* Label with technical background styling */}
				<div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 whitespace-nowrap">
					<div className="bg-background px-2 py-0.5 border border-border/50 rounded-sm">
						<span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">
							Test Run
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
