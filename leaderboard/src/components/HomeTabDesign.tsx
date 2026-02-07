import { motion, useAnimation, type Variants } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";

// --- 2. INFINITE TICKER (Constant horizontal flow) ---
export const InfiniteTicker = ({
	text,
	primaryColor,
	reverse = false,
}: {
	text: string;
	primaryColor: string;
	reverse?: boolean;
}) => (
	<div className="relative flex overflow-hidden py-2 bg-white/5 border-y border-white/10 select-none group hover:bg-white/10 transition-colors">
		<motion.div
			className="flex whitespace-nowrap gap-8 font-mono text-xs font-bold uppercase tracking-widest"
			style={{ color: primaryColor }}
			animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
			transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
		>
			{Array(20)
				.fill(text)
				.map((t, i) => (
					<span key={i} className="flex items-center gap-4">
						{t} <span className="w-2 h-2 bg-white/20 rotate-45" />
					</span>
				))}
		</motion.div>
		{/* Scanline overlay on ticker */}
		<div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black z-10" />
	</div>
);

// --- 3. SCRAMBLE TEXT (Hover Interaction) ---
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+-=[]{}|;:,.<>?";
export const ScrambleText = ({
	text,
	className = "",
}: {
	text: string;
	className?: string;
}) => {
	const [display, setDisplay] = useState(text);
	const [trigger, setTrigger] = useState(0);

	useEffect(() => {
		let iteration = 0;
		const interval = setInterval(() => {
			setDisplay(
				text
					.split("")
					.map((char, index) => {
						if (index < iteration) return text[index];
						return CHARS[Math.floor(Math.random() * CHARS.length)];
					})
					.join(""),
			);
			if (iteration >= text.length) clearInterval(interval);
			iteration += 1 / 2; // Speed
		}, 30);
		return () => clearInterval(interval);
	}, [text, trigger]);

	return (
		<span
			onMouseEnter={() => setTrigger((p) => p + 1)}
			className={`cursor-crosshair ${className}`}
		>
			{display}
		</span>
	);
};

// --- 4. BRUTALIST CARD (The container) ---
export const BrutalistCard = ({
	children,
	primaryColor,
	className = "",
	delay = 0,
}: {
	children: ReactNode;
	primaryColor: string;
	className?: string;
	delay?: number;
}) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.5, delay, ease: "circOut" }}
			whileHover={{ scale: 1.02 }}
			className={`relative group bg-black border border-white/10 p-6 overflow-hidden ${className}`}
		>
			{/* Active Corner Markers */}
			<span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white/20 group-hover:border-white transition-colors duration-300" />
			<span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white/20 group-hover:border-white transition-colors duration-300" />

			{/* Content */}
			<div className="relative z-10 h-full flex flex-col justify-between">
				{children}
			</div>
		</motion.div>
	);
};
