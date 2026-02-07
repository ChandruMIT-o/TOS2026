import { useState, useEffect, useCallback } from "react";
import { Tabs } from "./components/Tabs";
import { Registration } from "./components/Registration";
import { TestingEnv } from "./components/TestingEnv";
import { Leaderboard } from "./components/Leaderboard";
import LetterGlitch from "./components/LetterGlitch";
import { TacticalGrid } from "./components/TacticalGrid";
import { motion, AnimatePresence } from "framer-motion";
import { charList, colorPairs } from "./Config";
import { HomeTab } from "./components/HomeTab";

function Home() {
	const [activeTab, setActiveTab] = useState("home");

	const tabs = [
		{ id: "home", label: "Briefing" },
		{ id: "registration", label: "Registration" },
		{ id: "testing", label: "Testing Env" },
		{ id: "leaderboard", label: "Leaderboard" },
	];

	const [glitchColors, setGlitchColors] = useState(colorPairs[0]);
	const [glitchChars, setGlitchChars] = useState(charList[0]);

	// Extract the primary color for dynamic UI accents
	const primaryColor = glitchColors[0];

	const changeBackground = useCallback(() => {
		const randomColors =
			colorPairs[Math.floor(Math.random() * colorPairs.length)];
		const randomChars =
			charList[Math.floor(Math.random() * charList.length)];
		setGlitchColors(randomColors);
		setGlitchChars(randomChars);
	}, [colorPairs, charList]);

	useEffect(() => {
		const interval = setInterval(changeBackground, 5000);
		return () => clearInterval(interval);
	}, [changeBackground, glitchColors, glitchChars]);

	const handleBackgroundClick = (e: React.MouseEvent) => {
		const target = e.target as HTMLElement;
		if (
			target.tagName === "INPUT" ||
			target.tagName === "BUTTON" ||
			target.closest("button")
		) {
			return;
		}
		changeBackground();
	};

	return (
		<div
			onClick={handleBackgroundClick}
			className="min-h-screen text-slate-200 flex flex-col font-sans relative overflow-hidden cursor-crosshair bg-[#050505]"
		>
			{/* Background Layer */}
			{activeTab === "testing" ? (
				<TacticalGrid />
			) : (
				<div className="fixed inset-0 z-0 opacity-80">
					<LetterGlitch
						glitchSpeed={100}
						glitchColors={glitchColors}
						characters={glitchChars}
						outerVignette={true}
					/>
				</div>
			)}

			{/* Main Interface */}
			<div className="relative z-10 flex flex-col items-center w-full min-h-screen p-4 md:p-8">
				{/* Header HUD */}
				<header className="mb-8 w-full max-w-4xl flex flex-col items-center">
					<div className="w-full flex justify-between text-[10px] md:text-xs font-mono text-white/90 mb-2 tracking-widest uppercase">
						<span className="bg-[#000]">SYS.VER.2.0.4</span>
						<span className="animate-pulse bg-[#000]">
							● SIGNAL ESTABLISHED
						</span>
						<span className="bg-[#000]">SECURE//ENCRYPTED</span>
					</div>

					<div
						className="relative px-12 py-6 border-y border-white/90 bg-black/30 backdrop-blur-[2px] w-full text-center group transition-colors duration-500"
						style={{ borderColor: `${primaryColor}33` }} // 33 is approx 20% opacity
					>
						{/* Decorative Brackets */}
						<div
							className="absolute top-0 left-0 w-3 h-3 border-l-3 border-t-3 transition-colors duration-500"
							style={{ borderColor: primaryColor }}
						/>
						<div
							className="absolute top-0 right-0 w-3 h-3 border-r-3 border-t-3 transition-colors duration-500"
							style={{ borderColor: primaryColor }}
						/>
						<div
							className="absolute bottom-0 left-0 w-3 h-3 border-l-3 border-b-3 transition-colors duration-500"
							style={{ borderColor: primaryColor }}
						/>
						<div
							className="absolute bottom-0 right-0 w-3 h-3 border-r-3 border-b-3 transition-colors duration-500"
							style={{ borderColor: primaryColor }}
						/>

						<h1 className="text-3xl md:text-5xl font-black tracking-widest text-white uppercase drop-shadow-2xl">
							Tournament
							<span style={{ color: primaryColor }}>.OS</span>
						</h1>
						<div className="mt-2 flex items-center justify-center gap-3">
							<div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-white/50" />
							<span
								style={{ color: primaryColor }}
								className="text-[15px] tracking-[0.6em] uppercase text-white/60 font-medium"
							>
								Warfare Edition
							</span>
							<div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-white/50" />
						</div>
					</div>
				</header>

				{/* Tab Navigation */}
				<div className="w-full max-w-4xl">
					<Tabs
						tabs={tabs}
						activeTab={activeTab}
						onTabChange={setActiveTab}
						primaryColor={primaryColor}
					/>
				</div>

				{/* Main Content "Glass Panel" */}
				<main
					className={`flex-1 w-full relative group ${
						activeTab === "testing" || activeTab === "home"
							? "max-w-[98vw] px-0"
							: activeTab === "leaderboard"
								? "max-w-4xl"
								: "max-w-3xl"
					}`}
				>
					<AnimatePresence mode="popLayout">
						<motion.div
							key={activeTab}
							initial={{
								opacity: 0,
								scale: 0.98,
								filter: "blur(10px)",
							}}
							animate={{
								opacity: 1,
								scale: 1,
								filter: "blur(0px)",
							}}
							exit={{
								opacity: 0,
								scale: 0.98,
								filter: "blur(10px)",
							}}
							transition={{ duration: 0.4, ease: "circOut" }}
							className="relative w-full overflow-hidden"
						>
							<div
								className={`relative ${
									activeTab === "testing"
										? ""
										: "bg-[#0a0a0a]/98 backdrop-blur-xl border border-white/10 p-6 md:p-10 shadow-2xl rounded-sm"
								}`}
							>
								{/* Decorative Brackets */}
								<div
									className="absolute top-0 left-0 w-5 h-5 border-l-3 border-t-3 transition-colors duration-500"
									style={{ borderColor: primaryColor }}
								/>
								<div
									className="absolute top-0 right-0 w-5 h-5 border-r-3 border-t-3 transition-colors duration-500"
									style={{ borderColor: primaryColor }}
								/>
								<div
									className="absolute bottom-0 left-0 w-5 h-5 border-l-3 border-b-3 transition-colors duration-500"
									style={{ borderColor: primaryColor }}
								/>
								<div
									className="absolute bottom-0 right-0 w-5 h-5 border-r-3 border-b-3 transition-colors duration-500"
									style={{ borderColor: primaryColor }}
								/>
								{/* Glowing border accent based on active color */}
								<div
									className="absolute top-0 left-0 w-full h-[1px] opacity-50"
									style={{
										background: `linear-gradient(90deg, transparent, ${primaryColor}, transparent)`,
									}}
								/>

								{/* Content Render */}
								<div className="relative z-10">
									{activeTab === "home" && (
										<HomeTab primaryColor={primaryColor} />
									)}
									{activeTab === "registration" && (
										<Registration
											primaryColor={primaryColor}
										/>
									)}
									{activeTab === "testing" && <TestingEnv />}
									{activeTab === "leaderboard" && (
										<Leaderboard />
									)}
								</div>

								{/* Background Grid Pattern inside container */}
								<div
									className="absolute inset-0 z-0 opacity-[0.03]"
									style={{
										backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`,
										backgroundSize: "40px 40px",
									}}
								/>
							</div>
						</motion.div>
					</AnimatePresence>
				</main>

				<footer className="mt-12 mb-4 text-[10px] font-mono text-white/30 uppercase flex flex-col items-center gap-2">
					<div className="flex gap-4">
						<span>LAT: 34.0522 N</span>
						<span>LON: 118.2437 W</span>
						<span>SECURE</span>
					</div>
					<p>© 2026 TOS // OPERATIONAL PROTOCOL v1.0</p>
				</footer>
			</div>
		</div>
	);
}

export default Home;
