import { Play } from "lucide-react";
import { Button } from "../../ui/Button";

interface TestRunButtonProps {
	onRun: () => void;
	disabled?: boolean;
}

export function TestRunButton({ onRun, disabled }: TestRunButtonProps) {
	return (
		<div className="flex flex-col items-center justify-center h-full relative p-6">
			{/* The Button */}
			<Button
				onClick={onRun}
				disabled={disabled}
				variant="ghost" // Use ghost to override default styles, or justClassName
				className={`
					relative h-24 w-24 rounded-none border-4 transition-all duration-200 p-0
					${
						!disabled
							? "bg-emerald-500 border-black text-black shadow-[8px_8px_0px_black] hover:bg-emerald-400 hover:translate-y-1 hover:shadow-none active:translate-y-2"
							: "bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed shadow-none"
					}
				`}
			>
				<Play fill="currentColor" className="w-10 h-10 ml-1" />
			</Button>

			{/* Technical Label */}
			<div className="mt-6">
				<span
					className={`
						inline-block font-mono font-black uppercase tracking-widest text-xs px-3 py-1 transition-all
						${
							!disabled
								? "bg-black text-white shadow-[4px_4px_0px_#10b981]"
								: "bg-slate-200 text-slate-400 border border-slate-300"
						}
					`}
				>
					{disabled ? "System_Lock" : "Run_Test"}
				</span>
			</div>
		</div>
	);
}
