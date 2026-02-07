import { Play } from "lucide-react";
import { Button } from "../../ui/Button";

interface TestRunButtonProps {
	onRun: () => void;
	disabled?: boolean;
}

export function TestRunButton({ onRun, disabled }: TestRunButtonProps) {
	return (
		<div className="flex flex-col items-center justify-center h-full relative px-6 py-4">
			{/* 1. Contextual Timeline Line: Dimmed when disabled */}
			<div
				className={`absolute inset-y-0 w-[1px] bg-border/40 z-0 transition-opacity duration-300 ${
					disabled ? "opacity-30" : "opacity-100"
				}`}
			/>

			<div className="relative z-10 group">
				{/* 3. The Button */}
				<Button
					onClick={onRun}
					disabled={disabled}
					size="icon"
					className={`
            relative h-16 w-16 rounded-full border-4 border-background z-20
            transition-all duration-300 ease-out
            
            /* -- Active/Enabled State -- */
            ${
				!disabled
					? "bg-gradient-to-br from-emerald-400 to-emerald-600 hover:to-emerald-500 text-white shadow-[0_4px_20px_rgba(16,185,129,0.4)] hover:shadow-[0_4px_25px_rgba(16,185,129,0.6)] hover:scale-105 active:scale-95 ring-1 ring-inset ring-white/20"
					: ""
			}

            /* -- Disabled State -- */
            ${
				disabled
					? "bg-muted text-muted-foreground shadow-none cursor-not-allowed opacity-50 grayscale border-border/50"
					: ""
			}
          `}
				>
					{/* Play Icon: Optically centered with ml-1 */}
					<Play
						fill="currentColor"
						className={`w-7 h-7 ml-1 transition-transform duration-300 ${!disabled ? "group-hover:scale-110" : ""}`}
					/>
				</Button>

				{/* 4. Technical Label */}
				<div
					className={`absolute top-full left-1/2 -translate-x-1/2 mt-4 whitespace-nowrap transition-all duration-300 ${disabled ? "opacity-40" : "opacity-100"}`}
				>
					<div
						className={`
            px-3 py-1 rounded-full border backdrop-blur-sm
            ${disabled ? "bg-muted border-transparent" : "bg-background/80 border-emerald-500/30 shadow-sm"}
          `}
					>
						<span
							className={`
              text-[10px] font-mono font-bold uppercase tracking-widest flex align-center justify-center
              ${disabled ? "text-muted-foreground" : "text-emerald-600 dark:text-emerald-400"}
            `}
						>
							{disabled ? "Not Ready" : "Run Test"}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
