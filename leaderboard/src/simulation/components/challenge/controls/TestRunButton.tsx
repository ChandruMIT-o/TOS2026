import { Play, Lock } from "lucide-react";
import { Button } from "../../ui/Button";

interface TestRunButtonProps {
	onRun: () => void;
	disabled?: boolean;
}

export function TestRunButton({ onRun, disabled }: TestRunButtonProps) {
	return (
		<div className="flex flex-col items-center justify-center h-full relative font-sans group">
			{/* The Brutalist Button */}
			<Button
				onClick={onRun}
				disabled={disabled}
				className={`
                    relative h-24 w-24 rounded-none border-4 transition-all duration-75 p-0 flex items-center justify-center
                    ${
						!disabled
							? "bg-lime-400 border-zinc-100 text-black hover:hover:translate-y-[2px] active:active:translate-y-[8px] active:shadow-none"
							: "bg-zinc-900 border-zinc-800 text-zinc-600 cursor-not-allowed shadow-none"
					}
                `}
			>
				{disabled ? (
					<Lock fill="currentColor" className="w-10 h-10" />
				) : (
					<Play fill="currentColor" className="w-12 h-12 ml-2" /> // ml-2 optically centers the asymmetrical play triangle
				)}
			</Button>

			{/* Technical Label */}
			<div className="mt-6">
				<span
					className={`
                        inline-block font-mono font-black uppercase tracking-widest text-xs px-4 py-1.5 transition-all
                        ${
							!disabled
								? "bg-zinc-100 text-black border-2 border-zinc-100" // Uses a lime shadow to visually tie it to the button above
								: "bg-zinc-950 text-zinc-700 border-2 border-zinc-800"
						}
                    `}
				>
					{disabled ? "SYS_LOCKED" : "INIT_RUN"}
				</span>
			</div>
		</div>
	);
}
