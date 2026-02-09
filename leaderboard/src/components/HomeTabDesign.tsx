import { motion } from "framer-motion";
import {
	useEffect,
	useRef,
	useState,
	useMemo,
	type ReactNode,
	createContext,
	useContext,
} from "react";

// Context to communicate hover state from Card to ScrambleText
const CardHoverContext = createContext(false);

// ... [Keep InfiniteTicker and ScrambleText exactly as they were] ...
// (I will re-include them if you need the full file, but assuming you just need the Card update below)

// --- 2. INFINITE TICKER (Constant horizontal flow) ---
// --- 2. INFINITE TICKER (Constant horizontal flow) ---
export const InfiniteTicker = ({
	text,
	primaryColor,
	reverse = false,
}: {
	text: string;
	primaryColor: string;
	reverse?: boolean;
}) => {
	// Optimization: Memoize the repeated text to prevent re-creation on every render
	const tickerContent = useMemo(() => {
		return Array(20)
			.fill(text)
			.map((t, i) => (
				<span key={i} className="flex items-center gap-4">
					{t} <span className="w-2 h-2 bg-white/20 rotate-45" />
				</span>
			));
	}, [text]);

	return (
		<div className="relative flex overflow-hidden py-2 bg-white/5 border-y border-white/10 select-none group hover:bg-white/10 transition-colors">
			{/* Optimization: Inject keyframes locally to avoid global CSS pollution */}
			<style>
				{`
          @keyframes ticker-scroll {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          @keyframes ticker-scroll-reverse {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0%); }
          }
        `}
			</style>
			<div
				className="flex whitespace-nowrap gap-8 font-mono text-xs font-bold uppercase tracking-widest"
				style={{
					color: primaryColor,
					willChange: "transform", // Optimization: Promote to compositor layer
					animation: `${reverse ? "ticker-scroll-reverse" : "ticker-scroll"} 100s linear infinite`,
				}}
			>
				{tickerContent}
			</div>
			{/* Scanline overlay on ticker */}
			<div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black z-10" />
		</div>
	);
};

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

		const interval = setInterval(() => {
			frameCount++;

			setDisplay((currentDisplay) => {
				return text
					.split("")
					.map((_, index) => {
						if (active && index < iteration) {
							return text[index];
						}
						if (frameCount % 16 !== 0) {
							return currentDisplay[index] || CHARS[0];
						}
						if (text[index] === " ") return " ";
						return CHARS[Math.floor(Math.random() * CHARS.length)];
					})
					.join("");
			});

			if (active) {
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

// --- 4. BRUTALIST CARD (UPDATED) ---
interface Position {
	x: number;
	y: number;
}

export const BrutalistCard = ({
	children,
	primaryColor,
	className = "",
	delay = 0,
	bgVector,
	bgVectors = [],
}: {
	children: ReactNode;
	primaryColor: string;
	className?: string;
	delay?: number;
	bgVector?: string;
	bgVectors?: string[];
}) => {
	const divRef = useRef<HTMLDivElement>(null);
	const [isFocused, setIsFocused] = useState<boolean>(false);
	const [isHovered, setIsHovered] = useState<boolean>(false);
	const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
	const [opacity, setOpacity] = useState<number>(0);
	const [currentVector, setCurrentVector] = useState<string | undefined>(
		bgVector,
	);

	// Reset currentVector when bgVector prop changes (rare but good practice)
	useEffect(() => {
		setCurrentVector(bgVector);
	}, [bgVector]);

	const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
		if (!divRef.current || isFocused) return;

		const rect = divRef.current.getBoundingClientRect();
		// Increased dampening for smoother effect
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
		if (bgVectors.length > 0) {
			const randomIndex = Math.floor(Math.random() * bgVectors.length);
			setCurrentVector(bgVectors[randomIndex]);
		}
	};

	const handleMouseLeave = () => {
		setOpacity(0);
		setIsHovered(false);
		setCurrentVector(bgVector);
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
				{/* --- 5X IMPROVED: HOLOGRAPHIC GRAIN GLOW --- */}
				<div className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden">
					{/* Layer 1: The "Hot" Core (Creates the 3D bulb effect) */}
					<div
						className="absolute inset-0 transition-opacity duration-300 ease-out"
						style={{
							opacity: opacity * 0.8, // Slightly more subtle
							background: `radial-gradient(150px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.2), transparent 100%)`,
						}}
					/>

					{/* Layer 2: The Colored Flood (The main glow) */}
					<div
						className="absolute inset-0 transition-opacity duration-500 ease-out mix-blend-plus-lighter"
						style={{
							opacity: opacity, // Full opacity on hover
							background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${primaryColor}, transparent 100%)`,
						}}
					/>

					{/* Layer 3: The Texture (Film Grain) */}
					{/* This makes the light feel "physical" and organic */}
					<div
						className="absolute inset-0 opacity-[0.15] mix-blend-overlay"
						style={{
							backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
							backgroundSize: "100px",
							// Only show grain where the light hits (using mask)
							maskImage: `radial-gradient(400px circle at ${position.x}px ${position.y}px, black, transparent 100%)`,
							WebkitMaskImage: `radial-gradient(400px circle at ${position.x}px ${position.y}px, black, transparent 100%)`,
						}}
					/>

					{/* Layer 4: Subtle Border Reflection (Highlights edges near mouse) */}
					<div
						className="absolute inset-0 border border-white/5 rounded-[inherit]"
						style={{
							maskImage: `radial-gradient(300px circle at ${position.x}px ${position.y}px, black, transparent 100%)`,
							WebkitMaskImage: `radial-gradient(300px circle at ${position.x}px ${position.y}px, black, transparent 100%)`,
							borderColor: "rgba(255,255,255,0.3)",
						}}
					/>
				</div>

				{/* --- 5. ORGANIC SMOKEY SVG --- */}
				{currentVector && (
					<motion.div
						className="absolute -top-10 -right-10 pointer-events-none z-0"
						// 1. Faster Initial Reveal (The "Puff" effect)
						initial={{ opacity: 0, scale: 0.2, rotate: -10 }}
						animate={{
							opacity: 1,
							scale: 1,
							rotate: 0,
							// 2. The Continuous Organic Loop (Independent of hover)
							y: [0, -15, 0], // Moves up and down smoothly
							x: [0, -15, 0], // Moves side to side smoothly
						}}
						transition={{
							// Reveal transition
							opacity: {
								duration: 0.6,
								delay: delay,
								ease: "easeOut",
							},
							scale: {
								duration: 0.6,
								delay: delay,
								ease: "backOut",
							},
							rotate: {
								duration: 0.6,
								delay: delay,
								ease: "easeOut",
							},

							// Loop transition (The "Floating")
							y: {
								duration: 6,
								repeat: Infinity,
								ease: "easeInOut",
							},
							x: {
								duration: 7,
								repeat: Infinity,
								ease: "easeInOut",
							}, // Different duration creates randomness
						}}
					>
						<motion.img
							key={currentVector} // Add key to force animation restart or proper diffing
							src={currentVector}
							alt=""
							className="w-[18rem] h-[18rem] object-contain"
							// 3. Hover States (Smokey Physics)
							variants={{
								idle: {
									x: 0,
									y: 0,
									scale: 0.8,
									opacity: 0.4,
									rotate: -10,
									filter: "blur(5px) brightness(0.8)", // Smokey haze
								},
								hover: {
									x: -(position.x - 150) / 12, // Parallax movement
									y: -(position.y - 150) / 12,
									scale: 1.4,
									opacity: 1,
									rotate: 10,
									filter: "blur(0px) brightness(1.5)", // Clears up
								},
							}}
							initial="idle"
							animate={isHovered ? "hover" : "idle"}
							transition={{
								// This ensures the Enter and Exit are mirror opposites
								type: "spring",
								stiffness: 50, // Higher stiffness = faster reaction
								damping: 20, // Medium damping = no crazy bouncing, just fluid settling
								mass: 1, // Standard weight
							}}
						/>
					</motion.div>
				)}

				{/* Content */}
				<div className="relative z-10 h-full flex flex-col justify-between">
					{children}
				</div>
			</motion.div>
		</CardHoverContext.Provider>
	);
};
