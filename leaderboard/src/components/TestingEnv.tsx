import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ChevronRight, Activity, ChevronLeft } from "lucide-react";
import { BattlefieldContent } from "./ui/slides/BattlefieldContent";
import { MechanicsContent } from "./ui/slides/MechanicsContent";
import { StrategyExamplesContent } from "./ui/slides/StrategyExamplesContent";
import { SimAnimatorContent } from "./ui/slides/SimAnimatorContent";
import { ProblemContent } from "./ui/slides/ProblemContent";
import { SpecsContent } from "./ui/slides/SpecsContent";
import { TrainingContent } from "./ui/slides/TrainingContent";
import { TournamentContent } from "./ui/slides/TournamentContent";

export function TestingEnv() {
	const [currentSlide, setCurrentSlide] = useState(0);

	const slides = [
		{
			id: "mission",
			title: "Mission Briefing",
			component: <ProblemContent />,
		},
		{
			id: "tournament",
			title: "Tournament Structure",
			component: <TournamentContent />,
		},
		{ id: "arena", title: "The Arena", component: <BattlefieldContent /> },
		{
			id: "mechanics",
			title: "Core Mechanics",
			component: <MechanicsContent />,
		},
		{ id: "specs", title: "Tech Specs", component: <SpecsContent /> },
		{
			id: "strategy",
			title: "Strategic Intel",
			component: <StrategyExamplesContent />,
		},
		{
			id: "sim",
			title: "Sim Animator",
			component: <SimAnimatorContent />,
		},
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

	return (
		<div className="w-full flex flex-col bg-[#050505] border border-white/10 rounded-xl overflow-hidden shadow-2xl backdrop-blur-sm relative">
			{/* Top Header with Pagination & Launch Button */}
			<div className="h-auto md:h-20 py-4 md:py-0 border-b border-white/10 bg-black/40 flex flex-col md:flex-row md:items-center px-4 md:px-8 backdrop-blur-md z-10 w-full gap-4 md:gap-8 shrink-0">
				<div className="flex w-full md:w-auto justify-between items-center">
					<h2 className="text-lg md:text-xl font-bold uppercase tracking-[0.2em] text-white flex items-center gap-2 md:gap-3">
						<BookOpen className="text-emerald-500 w-5 h-5 md:w-6 md:h-6" />
						<span className="md:hidden">Rules</span>
						<span className="hidden md:inline">Rulebook</span>
					</h2>
					{/* Launch Simulator Button Mobile */}
					<button
						onClick={() => window.open("/sim", "_blank")}
						className="md:hidden cursor-target bg-emerald-600/90 hover:bg-emerald-500 text-white px-3 py-2 rounded-sm text-[10px] font-bold uppercase tracking-[0.1em] transition-all shadow-lg active:scale-95 flex items-center gap-2 border border-emerald-400/30"
					>
						<Activity size={14} className="animate-pulse" />
						<span className="whitespace-nowrap">Sim</span>
					</button>
				</div>

				<div className="flex w-full md:w-auto md:flex-1 items-center gap-2 md:gap-3">
					{/* Previous Button */}
					<button
						onClick={prevSlide}
						className="cursor-target flex items-center gap-1 md:gap-3 text-white/40 hover:text-white transition-colors group px-2 md:px-4 py-2 hover:bg-white/5 border border-transparent hover:border-white/10"
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
					<div className="flex flex-1 items-center gap-1 md:gap-3 h-8 md:h-12 w-full">
						{slides.map((_, idx) => (
							<button
								key={idx}
								onClick={() => setCurrentSlide(idx)}
								className={`cursor-target h-1.5 md:h-2 flex-1 rounded-full transition-all duration-500 ${
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
						className="cursor-target flex items-center gap-1 md:gap-3 text-white/40 hover:text-white transition-colors group px-2 md:px-4 py-2 hover:bg-white/5 rounded-lg border border-transparent hover:border-white/10"
					>
						<span className="font-mono text-sm uppercase tracking-[0.2em] hidden md:block">
							Next
						</span>
						<ChevronRight
							size={22}
							className="group-hover:translate-x-1 transition-transform"
						/>
					</button>
				</div>

				{/* Launch Simulator Button Desktop */}
				<button
					onClick={() => window.open("/sim", "_blank")}
					className="hidden md:flex cursor-target bg-emerald-600/90 hover:bg-emerald-500 text-white px-4 py-3 rounded-sm text-xs font-bold uppercase tracking-[0.15em] transition-all shadow-lg hover:shadow-emerald-500/40 active:scale-95 items-center gap-3 border border-emerald-400/30 ml-auto"
				>
					<Activity size={16} className="animate-pulse" />
					<span className="whitespace-nowrap">Launch Simulator</span>
				</button>
			</div>

			{/* Slide Content with Swipe & Click Navigation */}
			<div className="w-full relative group/container bg-black/60">
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
						className="w-full p-6 md:p-12 relative z-10"
					>
						<div className="max-w-4xl mx-auto flex flex-col pointer-events-none">
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
							<div className="pointer-events-auto">
								{slides[currentSlide].component}
							</div>
						</div>
					</motion.div>
				</AnimatePresence>
			</div>
		</div>
	);
}
