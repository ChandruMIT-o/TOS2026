import { ArrowRight } from "lucide-react";
import { Button } from "../../ui/Button";

interface LockInButtonProps {
	onLockIn: () => void;
	isLoading?: boolean;
	disabled?: boolean;
}

export function LockInButton({
	onLockIn,
	isLoading,
	disabled,
}: LockInButtonProps) {
	return (
		<Button
			variant="glow"
			size="lg"
			className="w-full h-20 text-xl uppercase tracking-[0.2em] font-black group relative overflow-hidden rounded-none shadow-[8px_8px_0px_#10b981] hover:shadow-none hover:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-[8px_8px_0px_#10b981] disabled:hover:translate-y-0"
			onClick={onLockIn}
			disabled={isLoading || disabled}
		>
			<span className="relative z-10 flex items-center justify-center gap-3">
				{isLoading ? "Transmitting..." : "Lock In Protocol"}
				<ArrowRight className="group-hover:translate-x-1 transition-transform" />
			</span>

			{/* Decorative Shine Effect */}
			<div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out mix-blend-overlay" />
		</Button>
	);
}
