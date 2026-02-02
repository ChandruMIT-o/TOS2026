import { ArrowRight } from "lucide-react";
import { Button } from "../../ui/Button";

interface LockInButtonProps {
	onLockIn: () => void;
	isLoading?: boolean;
}

export function LockInButton({ onLockIn, isLoading }: LockInButtonProps) {
	return (
		<Button
			variant="glow"
			size="lg"
			className="w-full h-16 text-lg uppercase tracking-[0.2em] font-black group relative overflow-hidden"
			onClick={onLockIn}
			disabled={isLoading}
		>
			<span className="relative z-10 flex items-center gap-3">
				{isLoading ? "Transmitting..." : "Lock In Protocol"}
				<ArrowRight className="group-hover:translate-x-1 transition-transform" />
			</span>

			{/* Decorative Shine Effect */}
			<div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out mix-blend-overlay" />
		</Button>
	);
}
