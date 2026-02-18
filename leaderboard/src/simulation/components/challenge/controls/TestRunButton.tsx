import { Play } from "lucide-react";
import { Button } from "../../ui/Button";

interface TestRunButtonProps {
	onRun: () => void;
	disabled?: boolean;
}

export function TestRunButton({ onRun, disabled }: TestRunButtonProps) {
	return (
		<div className="flex flex-col items-center justify-center h-full relative">
			{/* The Round Button */}
			<Button
				onClick={onRun}
				disabled={disabled}
				className={`
					relative h-24 w-20 rounded-sm border-4 transition-all duration-200 p-0
					${
						!disabled
							? "bg-emerald-500 border-black text-black shadow-[8px_8px_0px_black] hover:bg-emerald-400 hover:translate-y-1 hover:shadow-none active:translate-y-2"
							: "bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed shadow-none"
					}
				`}
			>
				<Play fill="currentColor" className="w-8 h-8" />
			</Button>

			{/* Technical Label */}
			<div className="mt-2">
				<span
					className={`
						inline-block font-mono font-black uppercase tracking-widest text-xs px-3 py-1 transition-all
						${
							!disabled
								? "bg-black text-white"
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
