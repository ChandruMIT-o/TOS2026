import { motion } from "framer-motion";
import {
	useEffect,
	useRef,
	useState,
	type ReactNode,
	createContext,
	useContext,
} from "react";

// Context to communicate hover state from Card to ScrambleText
const CardHoverContext = createContext(false);

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

export const ScrambleText = ({
	text,
	className = "",
	CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+-=[]{}|;:,.<>?",
}: {
	text: string;
	className?: string;
	CHARS?: string;
}) => {
	const [display, setDisplay] = useState(text);
	const [isHovered, setIsHovered] = useState(false);
	const contextHover = useContext(CardHoverContext);

	const active = isHovered || contextHover;

	useEffect(() => {
		let iteration = 0;
		let frameCount = 0;

		// Run the logic at a high frequency (30ms) for a responsive transition
		const interval = setInterval(() => {
			frameCount++;

			setDisplay((currentDisplay) => {
				return text
					.split("")
					.map((_, index) => {
						// 1. If we've "passed" this letter during hover, show the real letter
						if (active && index < iteration) {
							return text[index];
						}

						// 2. Slow down the scramble: only change random chars every 4 frames (~120ms)
						// This keeps the "loop" feeling slow and readable
						if (frameCount % 16 !== 0) {
							return currentDisplay[index] || CHARS[0];
						}

						if (text[index] === " ") return " ";
						return CHARS[Math.floor(Math.random() * CHARS.length)];
					})
					.join("");
			});

			if (active) {
				// 3. Fast Transition: Reveal 1 letter every 30ms
				if (iteration < text.length) {
					iteration += 1;
				}
			} else {
				iteration = 0;
			}
		}, 30);

		return () => clearInterval(interval);
	}, [active, text, CHARS]);

	return (
		<span
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			className={`cursor-crosshair font-mono inline-block whitespace-pre ${className}`}
		>
			{display}
		</span>
	);
};

// --- 4. BRUTALIST CARD (The container) ---
interface Position {
	x: number;
	y: number;
}

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
	const divRef = useRef<HTMLDivElement>(null);
	const [isFocused, setIsFocused] = useState<boolean>(false);
	const [isHovered, setIsHovered] = useState<boolean>(false);
	const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
	const [opacity, setOpacity] = useState<number>(0);

	const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
		if (!divRef.current || isFocused) return;

		const rect = divRef.current.getBoundingClientRect();
		setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
	};

	const handleFocus = () => {
		setIsFocused(true);
		setOpacity(0.15);
	};

	const handleBlur = () => {
		setIsFocused(false);
		setOpacity(0);
	};

	const handleMouseEnter = () => {
		setOpacity(0.15);
		setIsHovered(true);
	};

	const handleMouseLeave = () => {
		setOpacity(0);
		setIsHovered(false);
	};

	return (
		<CardHoverContext.Provider value={isHovered}>
			<motion.div
				ref={divRef}
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.5, delay, ease: "circOut" }}
				whileHover={{ scale: 1.02 }}
				onMouseMove={handleMouseMove}
				onFocus={handleFocus}
				onBlur={handleBlur}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				className={`cursor-target relative group bg-black border border-white/10 p-6 overflow-hidden ${className}`}
			>
				<div
					className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out rounded-[inherit]"
					style={{
						opacity,
						background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${primaryColor}, transparent 100%)`,
					}}
				/>
				{/* Content */}
				<div className="relative z-10 h-full flex flex-col justify-between">
					{children}
				</div>
			</motion.div>
		</CardHoverContext.Provider>
	);
};
