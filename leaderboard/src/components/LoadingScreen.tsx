import { useState, useEffect } from "react";
import { Cpu, Radio, Terminal, Crosshair } from "lucide-react";

const LoadingScreen = ({ onComplete }: { onComplete?: () => void }) => {
	const [progress, setProgress] = useState(0);
	const [currentTask, setCurrentTask] = useState("INITIALIZING KERNEL");

	// Data fragments that "flash" during loading
	const dataFragments = [
		"FETCHING_EVENT_ID: TEKHORA_26",
		"SYNCING_DATE: 21_FEB",
		"CALIBRATING_BOUNTY: ₹3.5K",
		"PINGING_HOST: CHANDRU...",
		"PINGING_HOST: MIRSHA...",
		"ALLOCATING_TEAMS: SIZE_1-2",
		"LOADING_ASSETS...",
		"VERIFYING_INTEGRITY...",
	];

	useEffect(() => {
		// Simulate a fast loading process to mimic actual initialization
		// Total duration approx 1.5s
		const timer = setInterval(() => {
			setProgress((prev) => {
				// Much faster increment
				const increment = Math.random() * 10 + 5;
				const nextValue = prev + increment;

				if (nextValue >= 100) {
					clearInterval(timer);
					setTimeout(() => {
						if (onComplete) onComplete();
					}, 200); // Slight delay at 100% before unmount
					return 100;
				}
				return nextValue;
			});

			// Change the "current task" text rapidly
			if (Math.random() > 0.5) {
				setCurrentTask(
					dataFragments[
						Math.floor(Math.random() * dataFragments.length)
					],
				);
			}
		}, 50);

		return () => clearInterval(timer);
	}, []);

	// Format progress to always show 2 decimal places or 3 chars
	const displayProgress = Math.min(progress, 100).toFixed(0).padStart(3, "0");

	return (
		<div className="fixed inset-0 w-screen h-screen bg-slate-200 text-black font-sans overflow-hidden flex flex-col z-50 selection:bg-black selection:text-white">
			{/* --- TOP BAR: Header Info --- */}
			<div className="w-full h-16 border-b border-black flex items-center justify-between px-4 md:px-8 bg-slate-200 z-10 box-border">
				<div className="flex items-center gap-2">
					<div className="w-3 h-3 bg-black animate-pulse" />
					<span className="font-mono text-xs font-bold tracking-widest uppercase">
						Tekhora_OS v2.0.26
					</span>
				</div>
				<div className="font-mono text-xs opacity-60 hidden md:block">
					MEM: {Math.floor(progress * 42)}MB / 4096MB
				</div>
			</div>

			{/* --- MAIN CONTENT GRID --- */}
			<div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-black w-full box-border">
				{/* LEFT COLUMN: Large Vertical Text (Hidden on mobile, visible on desktop) */}
				<div className="hidden md:flex col-span-1 md:col-span-2 flex-col justify-between p-4 bg-slate-200 overflow-hidden">
					<div className="writing-mode-vertical-rl transform rotate-180 text-xs font-mono tracking-widest opacity-40 h-full flex items-center whitespace-nowrap">
						ESTABLISHED CONNECTION // SECURE // 2026
					</div>
				</div>

				{/* CENTER COLUMN: The Main Loader */}
				<div className="col-span-1 md:col-span-6 flex flex-col relative overflow-hidden">
					{/* Background Grid Pattern */}
					<div
						className="absolute inset-0 opacity-5 pointer-events-none"
						style={{
							backgroundImage:
								"linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)",
							backgroundSize: "40px 40px",
						}}
					/>

					{/* Main Percentage Display */}
					<div className="flex-1 flex flex-col items-center justify-center p-8 z-10 overflow-hidden">
						<div className="relative">
							<h1 className="text-[25vw] md:text-[18vw] font-black tracking-tighter leading-none select-none">
								{displayProgress}
								<span className="text-[5vw] align-top opacity-50">
									%
								</span>
							</h1>
							{/* Decorative overlay lines */}
							<div className="absolute top-1/2 left-0 w-full h-px bg-black opacity-20 mix-blend-difference" />
						</div>
					</div>

					{/* Bottom Status Bar in Center */}
					<div className="border-t border-black p-4 md:p-6 bg-slate-100 shrink-0">
						<div className="flex items-center justify-between mb-2">
							<span className="font-mono text-xs uppercase font-bold flex items-center gap-2">
								<Terminal size={14} />
								Status_Log
							</span>
							<span className="font-mono text-xs opacity-50">
								{new Date().toLocaleTimeString()}
							</span>
						</div>
						<div className="font-mono text-sm md:text-base font-bold uppercase tracking-tight text-black truncate">
							{">"} {currentTask}
							<span className="animate-ping inline-block ml-1 w-1 h-4 bg-black align-middle" />
						</div>
					</div>
				</div>

				{/* RIGHT COLUMN: Technical specs & Controls */}
				<div className="col-span-1 md:col-span-4 flex flex-col divide-y divide-black bg-slate-200 overflow-hidden">
					{/* 1. System Health */}
					<div className="flex-1 p-6 md:p-8 flex flex-col justify-between hover:bg-white transition-colors overflow-hidden">
						<div className="flex justify-between items-start">
							<Cpu size={24} strokeWidth={1.5} />
							<span className="font-mono text-xs uppercase opacity-50">
								CPU_Load
							</span>
						</div>
						<div className="space-y-2 mt-4">
							<div className="w-full bg-slate-300 h-2 overflow-hidden">
								<div
									className="h-full bg-black transition-all duration-100 ease-linear"
									style={{
										width: `${Math.random() * 40 + 40}%`,
									}}
								/>
							</div>
							<div className="w-full bg-slate-300 h-2 overflow-hidden">
								<div
									className="h-full bg-black transition-all duration-100 ease-linear"
									style={{
										width: `${Math.random() * 60 + 20}%`,
									}}
								/>
							</div>
							<div className="w-full bg-slate-300 h-2 overflow-hidden">
								<div
									className="h-full bg-black transition-all duration-100 ease-linear"
									style={{
										width: `${Math.random() * 30 + 10}%`,
									}}
								/>
							</div>
						</div>
					</div>

					{/* 2. Network */}
					<div className="flex-1 p-6 md:p-8 flex flex-col justify-between hover:bg-white transition-colors group overflow-hidden">
						<div className="flex justify-between items-start">
							<Radio
								size={24}
								strokeWidth={1.5}
								className="group-hover:animate-pulse"
							/>
							<span className="font-mono text-xs uppercase opacity-50">
								Net_Stat
							</span>
						</div>
						<div className="grid grid-cols-2 gap-4 mt-4 font-mono text-xs uppercase">
							<div>
								<div className="opacity-50">Ping</div>
								<div className="font-bold text-lg">14ms</div>
							</div>
							<div>
								<div className="opacity-50">Down</div>
								<div className="font-bold text-lg">1.2Gb</div>
							</div>
						</div>
					</div>

					{/* 3. Coordinates / Unique ID */}
					<div className="p-6 md:p-8 flex flex-col justify-center bg-black text-white hover:invert transition-all cursor-wait overflow-hidden">
						<div className="flex items-center justify-between">
							<div>
								<div className="font-mono text-[10px] uppercase opacity-60 mb-1">
									Target_Event
								</div>
								<div className="text-3xl font-black uppercase tracking-tighter leading-none">
									Tekhora
								</div>
							</div>
							<Crosshair className="animate-spin-slow" />
						</div>
					</div>
				</div>
			</div>

			{/* --- BOTTOM PROGRESS BAR --- */}
			<div className="h-2 w-full bg-slate-300 relative shrink-0">
				<div
					className="h-full bg-black absolute top-0 left-0 transition-all duration-200 ease-out"
					style={{ width: `${progress}%` }}
				/>
			</div>

			{/* CSS for custom utilities not in standard Tailwind */}
			<style>{`
        .writing-mode-vertical-rl {
            writing-mode: vertical-rl;
        }
        .animate-spin-slow {
            animation: spin 8s linear infinite;
        }
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
      `}</style>
		</div>
	);
};

export default LoadingScreen;
