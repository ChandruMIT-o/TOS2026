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

	return (
		<div className="w-full h-full flex bg-[#050505] border border-white/10 rounded-xl overflow-hidden shadow-2xl backdrop-blur-sm">
			{/* --- LEFT PANEL: Rules (1/4 ratio) --- */}
			<div className="w-1/4 flex flex-col border-r border-white/10 bg-black/40 relative">
				<div className="p-6 border-b border-white/10 bg-white/5">
					<h2 className="text-xl font-bold uppercase tracking-[0.2em] text-white flex items-center gap-3">
						<BookOpen className="text-emerald-500" size={24} />
						Rulebook
					</h2>
					<p className="text-white/40 font-mono text-xs mt-2">
						TACTICAL MANUAL v2.4
					</p>
				</div>

				<div className="flex-1 overflow-y-auto p-6 custom-scrollbar text-white/80 space-y-8">
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
				<div className="p-4 border-t border-white/10 bg-white/5 text-[10px] items-center flex justify-between text-white/30 font-mono">
					<span>SECURE CON.</span>
					<span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
				</div>
			</div>

			{/* --- RIGHT PANEL: Slides (3/4 ratio) --- */}
			<div className="w-3/4 flex flex-col bg-black/60 relative">
				{/* Slide Content */}
				<div className="flex-1 overflow-hidden relative">
					<AnimatePresence mode="wait">
						<motion.div
							key={currentSlide}
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -20 }}
							transition={{ duration: 0.3 }}
							className="absolute inset-0 p-12 overflow-y-auto custom-scrollbar"
						>
							<div className="max-w-4xl mx-auto">
								<div className="flex items-center gap-4 mb-8 text-white/40 uppercase tracking-widest text-sm font-mono">
									<span>0{currentSlide + 1}</span>
									<div className="h-px w-12 bg-white/20"></div>
									<span>{slides[currentSlide].title}</span>
								</div>
								{slides[currentSlide].component}
							</div>
						</motion.div>
					</AnimatePresence>
				</div>

				{/* Pagination Controls */}
				<div className="h-20 border-t border-white/10 bg-black/40 flex items-center justify-between px-8 backdrop-blur-md">
					<button
						onClick={prevSlide}
						className="flex items-center gap-3 text-white/40 hover:text-white transition-colors group px-4 py-2 hover:bg-white/5 rounded-lg"
					>
						<ChevronLeft
							size={20}
							className="group-hover:-translate-x-1 transition-transform"
						/>
						<span className="font-mono text-sm uppercase tracking-wider">
							Previous
						</span>
					</button>

					<div className="flex gap-2">
						{slides.map((_, idx) => (
							<button
								key={idx}
								onClick={() => setCurrentSlide(idx)}
								className={`h-1.5 rounded-full transition-all duration-300 ${
									currentSlide === idx
										? "w-8 bg-emerald-500"
										: "w-1.5 bg-white/20 hover:bg-white/40"
								}`}
							/>
						))}
					</div>

					<button
						onClick={nextSlide}
						className="flex items-center gap-3 text-white/40 hover:text-white transition-colors group px-4 py-2 hover:bg-white/5 rounded-lg"
					>
						<span className="font-mono text-sm uppercase tracking-wider">
							Next
						</span>
						<ChevronRight
							size={20}
							className="group-hover:translate-x-1 transition-transform"
						/>
					</button>
				</div>
			</div>
		</div>
	);
}
