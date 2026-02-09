import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { X, AlertCircle } from "lucide-react";

interface ToastProps {
	message: string;
	isVisible: boolean;
	onClose: () => void;
	duration?: number;
}

export function Toast({
	message,
	isVisible,
	onClose,
	duration = 3000,
}: ToastProps) {
	useEffect(() => {
		if (isVisible) {
			const timer = setTimeout(onClose, duration);
			return () => clearTimeout(timer);
		}
	}, [isVisible, duration, onClose]);

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.div
					initial={{ opacity: 0, y: 50, scale: 0.9 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					exit={{ opacity: 0, y: 20, scale: 0.9 }}
					className="fixed bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 sm:px-6 bg-black/90 border border-emerald-500/30 text-emerald-400 backdrop-blur-md rounded-sm font-mono text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.1)] w-[90vw] sm:w-auto sm:max-w-md"
				>
					<AlertCircle size={18} className="shrink-0" />
					<span className="flex-1 text-center sm:text-left">
						{message}
					</span>
					<button
						onClick={onClose}
						className="ml-2 hover:text-emerald-300 transition-colors shrink-0"
					>
						<X size={16} />
					</button>
					{/* Scanline effect */}
					<div className="absolute inset-0 pointer-events-none bg-[linear-gradient(90deg,transparent_0%,rgba(16,185,129,0.05)_50%,transparent_100%)] animate-[shimmer_2s_infinite]" />
				</motion.div>
			)}
		</AnimatePresence>
	);
}
