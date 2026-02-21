import { useState, useEffect, useCallback, useRef } from "react";
import { useLoading } from "./context/LoadingContext";
import { Tabs } from "./components/Tabs";
import { TacticalGrid } from "./components/TacticalGrid";
import { charList, colorPairs } from "./Config";
import TargetCursor from "./components/TargetCursor";
import { HomeHeader } from "./components/HomeHeader";
import { HomeContent } from "./components/HomeContent";
import { Toast } from "./components/Toast";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import LetterGlitch from "./components/LetterGlitch";

function Home() {
	const { setPageLoaded } = useLoading();
	useEffect(() => {
		setPageLoaded(true);
	}, [setPageLoaded]);

	const [activeTab, setActiveTab] = useState("home");
	const [isPerformanceMode, setIsPerformanceMode] = useState(false);
	const [isBriefing, setIsBriefing] = useState(false); // Controls "Briefing state" vs "Interactive State"
	const [isBackgroundEnabled, setIsBackgroundEnabled] = useState(false);
	const [secretClicks, setSecretClicks] = useState(0);
	const [toastMessage, setToastMessage] = useState<string | null>(null);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const contentRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setIsLoggedIn(!!user);
		});
		return () => unsubscribe();
	}, []);

	const tabs = [
		{ id: "home", label: "Briefing", disabled: false },
		{ id: "registration", label: "Registration", disabled: isBriefing },
		{ id: "rulebook", label: "Rulebook", disabled: !isLoggedIn },
		{ id: "leaderboard", label: "Leaderboard", disabled: isBriefing },
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
	}, []);

	useEffect(() => {
		const interval = setInterval(changeBackground, 5000);
		return () => clearInterval(interval);
	}, [changeBackground]);

	// Scroll Detection for Performance Mode
	useEffect(() => {
		const handleScroll = () => {
			if (activeTab !== "home" && activeTab !== "rulebook") {
				if (isPerformanceMode) setIsPerformanceMode(false);
				return;
			}

			if (!contentRef.current) return;

			const { height } = contentRef.current.getBoundingClientRect();
			const vh = window.innerHeight;
			const scrollY = window.scrollY;

			// Check if tab section is tall enough (occupies > 90% of viewport)
			const isTall = height > vh * 0.9;

			if (isTall && scrollY > 70) {
				if (!isPerformanceMode) setIsPerformanceMode(true);
			} else {
				if (isPerformanceMode) setIsPerformanceMode(false);
			}
		};

		// Run immediately (might be early)
		handleScroll();

		// Delay check to allow layout/animation to settle
		const timer = setTimeout(handleScroll, 150);

		// Observe size changes (content loading, layout shifts)
		const resizeObserver = new ResizeObserver(() => {
			handleScroll();
		});

		if (contentRef.current) {
			resizeObserver.observe(contentRef.current);
		}

		window.addEventListener("scroll", handleScroll);
		window.addEventListener("resize", handleScroll); // Check on resize too
		return () => {
			window.removeEventListener("scroll", handleScroll);
			window.removeEventListener("resize", handleScroll);
			resizeObserver.disconnect();
			clearTimeout(timer);
		};
	}, [activeTab, isPerformanceMode]);

	useEffect(() => {
		const setTabFromHash = () => {
			const hash = window.location.hash.replace("#", "");
			if (hash && tabs.some((t) => t.id === hash)) {
				setActiveTab(hash);
			}
		};

		setTabFromHash(); // initial load
		window.addEventListener("hashchange", setTabFromHash);

		return () => window.removeEventListener("hashchange", setTabFromHash);
	}, []);

	const handleTabChange = (tabId: string) => {
		setActiveTab(tabId);
		window.location.hash = tabId;
	};

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
			className="min-h-screen text-slate-200 flex flex-col font-sans relative overflow-hidden cursor-hidden bg-[#050505]"
		>
			<TargetCursor
				spinDuration={2}
				hideDefaultCursor
				hoverDuration={0.2}
			/>

			{/* Background Toggle Button */}
			<div className="fixed top-4 left-4 z-50 hidden md:flex items-center gap-3 group">
				<button
					type="button"
					onClick={(e) => {
						e.stopPropagation();
						setIsBackgroundEnabled(!isBackgroundEnabled);
					}}
					className={`w-10 h-5 rounded-full p-1 flex items-center transition-colors duration-300 ${
						isBackgroundEnabled
							? "bg-[#33ff33]/40"
							: "bg-slate-700/50"
					}`}
				>
					<div
						className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
							isBackgroundEnabled
								? "translate-x-5"
								: "translate-x-0"
						}`}
					/>
				</button>
				<span
					className="text-xs text-slate-500 font-mono tracking-wider cursor-pointer select-none"
					onClick={(e) => {
						e.stopPropagation();
						setIsBackgroundEnabled(!isBackgroundEnabled);
					}}
				>
					GLITCH
				</span>

				{/* Warning Tooltip */}
				<div className="absolute left-0 top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 border border-orange-900/50 text-orange-400 text-[10px] font-mono py-1.5 px-3 rounded whitespace-nowrap pointer-events-none backdrop-blur-sm shadow-xl">
					[WARNING] Background effect may cause lag issues
				</div>
			</div>

			{/* Background Layer */}
			{activeTab === "rulebook" ||
			(activeTab === "home" && isPerformanceMode) ||
			!isBackgroundEnabled ? (
				<TacticalGrid />
			) : (
				<div className="fixed inset-0 z-0 opacity-80">
					<LetterGlitch
						glitchSpeed={200}
						glitchColors={glitchColors}
						characters={glitchChars}
						outerVignette={true}
					/>
				</div>
			)}

			{/* Main Interface */}
			<div className="relative z-10 flex flex-col items-center w-full min-h-screen p-4 md:p-8">
				<HomeHeader primaryColor={primaryColor} />

				{/* Tab Navigation */}
				<div className="w-full max-w-4xl">
					<Tabs
						tabs={tabs}
						activeTab={activeTab}
						onTabChange={handleTabChange}
						onDisabledTabClick={(id) => {
							if (id === "rulebook") {
								setToastMessage(
									"Please login to view the rulebook.",
								);
							} else {
								setToastMessage(
									"Team reg opens on 21st. But, buy the event ticket in the main website.",
								);
							}
						}}
						primaryColor={primaryColor}
					/>
				</div>

				<Toast
					message={toastMessage || ""}
					isVisible={!!toastMessage}
					onClose={() => setToastMessage(null)}
				/>

				<HomeContent
					activeTab={activeTab}
					isPerformanceMode={isPerformanceMode}
					contentRef={contentRef}
					primaryColor={primaryColor}
					glitchChars={glitchChars}
				/>

				<footer className="mt-12 mb-4 text-[10px] font-mono text-white/30 uppercase flex flex-col items-center gap-2">
					<div className="flex gap-4">
						<span>LAT: 34.0522 N</span>
						<span>LON: 118.2437 W</span>
						<span>SECURE</span>
					</div>
					<p>
						© 2026 T
						<span
							onClick={() => {
								if (secretClicks + 1 === 3) {
									setIsBriefing((prev) => !prev);
									setSecretClicks(0);
								} else {
									setSecretClicks((prev) => prev + 1);
								}
							}}
						>
							O
						</span>
						S // OPERATIONAL PROTOCOL v1.0
					</p>
				</footer>
			</div>
		</div>
	);
}

export default Home;
