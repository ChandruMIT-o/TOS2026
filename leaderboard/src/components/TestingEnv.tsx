import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	BookOpen,
	Target,
	ChevronRight,
	Activity,
	ChevronLeft,
	Shield,
} from "lucide-react";
import { BattlefieldContent } from "./ui/slides/BattlefieldContent";
import { MechanicsContent } from "./ui/slides/MechanicsContent";
import { StrategyContent } from "./ui/slides/StrategyContent";
import { ProblemContent } from "./ui/slides/ProblemContent";
import { SpecsContent } from "./ui/slides/SpecsContent";
import { TrainingContent } from "./ui/slides/TrainingContent";

export function TestingEnv() {
	const [currentSlide, setCurrentSlide] = useState(0);

	const slides = [
		{
			id: "mission",
			title: "Mission Briefing",
			component: <ProblemContent />,
		},
		{ id: "arena", title: "The Arena", component: <BattlefieldContent /> },
		{
			id: "mechanics",
			title: "Core Mechanics",
			component: <MechanicsContent />,
		},
		{
			id: "strategy",
			title: "Strategic Intel",
			component: <StrategyContent />,
		},
		{ id: "specs", title: "Tech Specs", component: <SpecsContent /> },
		{
			id: "training",
			title: "Training Sim",
			component: <TrainingContent />,
		},
	];

	const nextSlide = () => {
		setCurrentSlide((prev) => (prev + 1) % slides.length);
	};

	const prevSlide = () => {
		setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
	};

	const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);

	return (
		<div className="w-full h-full flex bg-[#050505] border border-white/10 rounded-xl overflow-hidden shadow-2xl backdrop-blur-sm relative">
			{/* --- LEFT PANEL: Rules --- */}
			<motion.div
				initial={false}
				animate={{
					width: isLeftPanelOpen ? "25%" : "0%",
					opacity: isLeftPanelOpen ? 1 : 0,
				}}
				transition={{ duration: 0.4, ease: "easeInOut" }}
				className="flex flex-col border-r border-white/10 bg-black/40 relative overflow-hidden"
			>
				<div className="p-6 border-b border-white/10 bg-white/5 min-w-[300px]">
					<h2 className="text-xl font-bold uppercase tracking-[0.2em] text-white flex items-center gap-3">
						<BookOpen className="text-emerald-500" size={24} />
						Rulebook
					</h2>
					<p className="text-white/40 font-mono text-xs mt-2">
						TACTICAL MANUAL v2.4
					</p>
				</div>

				<div className="flex-1 overflow-y-auto p-6 custom-scrollbar text-white/80 space-y-8 min-w-[300px]">
					<section className="space-y-3">
						<h4 className="text-emerald-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
							<Target size={14} /> The Arena
						</h4>
						<p className="text-xs leading-relaxed text-white/60">
							A circular network of <strong>26 nodes</strong>.
							<br />
							<span className="text-emerald-500/80">
								• P1 Base:
							</span>{" "}
							Node 1
							<br />
							<span className="text-red-500/80">
								• P2 Base:
							</span>{" "}
							Node 14
							<br />
							<span className="text-purple-400/80">
								• Power Nodes:
							</span>{" "}
							4, 7, 11, 17, 20, 24
						</p>
					</section>

					<section className="space-y-3">
						<h4 className="text-emerald-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
							<Activity size={14} /> Actions
						</h4>

						<div className="space-y-4">
							<div className="bg-white/5 p-3 rounded border-l border-emerald-500/50">
								<strong className="text-white block text-xs font-mono mb-1">
									HARVEST
								</strong>
								<p className="text-xs text-white/50">
									Gain energy from owned nodes.
									<br />
									<span className="opacity-70">
										Home/Power: +5E | Normal: +1E
									</span>
								</p>
							</div>

							<div className="bg-white/5 p-3 rounded border-l border-blue-500/50">
								<strong className="text-white block text-xs font-mono mb-1">
									EXPAND
								</strong>
								<p className="text-xs text-white/50">
									Claim empty nodes. Higher bid wins.
									<br />
									<span className="opacity-70">
										Cost: 5E (Normal) / 15E (Power)
									</span>
								</p>
							</div>

							<div className="bg-white/5 p-3 rounded border-l border-red-500/50">
								<strong className="text-white block text-xs font-mono mb-1">
									CONQUER
								</strong>
								<p className="text-xs text-white/50">
									Attack enemy nodes.
									<br />
									<span className="opacity-70">
										Cost: 8E/20E + Defense Tax
									</span>
								</p>
							</div>
						</div>
					</section>

					<section className="space-y-3">
						<h4 className="text-emerald-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
							<Shield size={14} /> Defense
						</h4>
						<p className="text-xs leading-relaxed text-white/60">
							Own adjacent nodes to boost defense.
							<br />
							<span className="text-white/40">
								+1 Defense per friendly neighbor.
							</span>
						</p>
					</section>
				</div>

				{/* Decorative Footer for Left Panel */}
				<div className="p-4 border-t border-white/10 bg-white/5 text-[10px] items-center flex justify-between text-white/30 font-mono min-w-[300px]">
					<span>SECURE CON.</span>
					<span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
				</div>
			</motion.div>

			{/* Toggle Button Absolute */}
			<button
				onClick={() => setIsLeftPanelOpen(!isLeftPanelOpen)}
				className="absolute top-1/2 -translate-y-1/2 z-20 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/20 p-1.5 rounded-full backdrop-blur-md transition-all hover:scale-110 active:scale-95"
				style={{
					left: isLeftPanelOpen ? "25%" : "0%",
					marginLeft: isLeftPanelOpen ? "-12px" : "12px",
				}}
			>
				{isLeftPanelOpen ? (
					<ChevronLeft size={16} />
				) : (
					<ChevronRight size={16} />
				)}
			</button>

			{/* --- RIGHT PANEL: Slides --- */}
			<div className="flex-1 flex flex-col bg-black/60 relative overflow-hidden">
				{/* Top Header with Pagination & Launch Button */}
				<div className="h-20 border-b border-white/10 bg-black/40 flex items-center px-8 backdrop-blur-md z-10 w-full gap-8">
					{/* Previous Button */}
					<button
						onClick={prevSlide}
						className="cursor-target flex items-center gap-3 text-white/40 hover:text-white transition-colors group px-4 py-2 hover:bg-white/5 border border-transparent hover:border-white/10"
					>
						<ChevronLeft
							size={22}
							className="group-hover:-translate-x-1 transition-transform"
						/>
						<span className="font-mono text-sm uppercase tracking-[0.2em] hidden md:block">
							Prev
						</span>
					</button>

					{/* Stretched Pagination Indicators */}
					<div className="flex flex-1 items-center gap-3 h-12">
						{slides.map((_, idx) => (
							<button
								key={idx}
								onClick={() => setCurrentSlide(idx)}
								className={`cursor-target h-2 flex-1 rounded-full transition-all duration-500 ${
									currentSlide === idx
										? "bg-emerald-500 opacity-100"
										: "bg-white/30 hover:bg-white/20 opacity-50"
								}`}
								aria-label={`Go to slide ${idx + 1}`}
							/>
						))}
					</div>

					{/* Next Button */}
					<button
						onClick={nextSlide}
						className="cursor-target flex items-center gap-3 text-white/40 hover:text-white transition-colors group px-4 py-2 hover:bg-white/5 rounded-lg border border-transparent hover:border-white/10"
					>
						<span className="font-mono text-sm uppercase tracking-[0.2em] hidden md:block">
							Next
						</span>
						<ChevronRight
							size={22}
							className="group-hover:translate-x-1 transition-transform"
						/>
					</button>
					{/* Launch Simulator Button */}
					<button
						onClick={() => (window.location.href = "/sim")}
						className="cursor-target bg-emerald-600/90 hover:bg-emerald-500 text-white px-4 py-3 rounded-sm text-xs font-bold uppercase tracking-[0.15em] transition-all shadow-lg hover:shadow-emerald-500/40 active:scale-95 flex items-center gap-3 border border-emerald-400/30 ml-4"
					>
						<Activity size={16} className="animate-pulse" />
						<span className="whitespace-nowrap">
							Launch Simulator
						</span>
					</button>
				</div>

				{/* Slide Content with Swipe & Click Navigation */}
				<div className="flex-1 overflow-hidden relative group/container">
					<AnimatePresence mode="wait">
						<motion.div
							key={currentSlide}
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -20 }}
							transition={{ duration: 0.3 }}
							drag="x"
							dragConstraints={{ left: 0, right: 0 }}
							dragElastic={0.2}
							onDragEnd={(_, { offset }) => {
								const swipe = offset.x;
								if (swipe < -50) nextSlide();
								else if (swipe > 50) prevSlide();
							}}
							/* Note: z-10 so it stays behind the click zones but remains visible */
							className="absolute inset-0 p-12 overflow-y-auto custom-scrollbar z-10"
						>
							<div className="max-w-4xl mx-auto h-full flex flex-col pointer-events-none">
								{/* Content Header */}
								<div className="flex items-center gap-4 mb-8 text-white/40 uppercase tracking-widest text-sm font-mono shrink-0">
									<span className="text-emerald-500/50">
										0{currentSlide + 1}
									</span>
									<div className="h-px w-12 bg-white/10"></div>
									<span className="text-white/80">
										{slides[currentSlide].title}
									</span>
								</div>

								{/* Component Content - pointer-events-auto allows buttons inside content to work */}
								<div className="flex-1 pointer-events-auto">
									{slides[currentSlide].component}
								</div>
							</div>
						</motion.div>
					</AnimatePresence>
					{/* Directional Overlay Nav (Left/Right Click Zones) */}
					<div className="absolute inset-0 flex pointer-events-none">
						{/* Left Zone */}
						<div
							onClick={prevSlide}
							className="flex-1 pointer-events-auto"
							title="Previous"
						/>

						{/* Right Zone */}
						<div
							onClick={nextSlide}
							className="flex-1 pointer-events-auto"
							title="Next"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
