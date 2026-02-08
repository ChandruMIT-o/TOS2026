import { motion, type Variants } from "framer-motion";
import {
	Clock,
	Cpu,
	ShieldAlert,
	Unlock,
	Terminal,
	Activity,
	FileCode,
	ArrowRight,
} from "lucide-react";
import { InfiniteTicker, ScrambleText, BrutalistCard } from "./HomeTabDesign";

type HomeTabProps = {
	primaryColor: string;
	stringList: string;
};

// --- ANIMATION VARIANTS (Fixed TS Error) ---
const containerVariants: Variants = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: { staggerChildren: 0.15 },
	},
};

const textReveal: Variants = {
	hidden: { y: "100%" },
	show: { y: "0%", transition: { ease: [0.33, 1, 0.68, 1], duration: 0.6 } },
};

export function HomeTab({ primaryColor, stringList }: HomeTabProps) {
	return (
		<div className="relative bg-[#050505] min-h-screen text-slate-200 font-sans selection:bg-white selection:text-black overflow-hidden">
			<motion.div
				variants={containerVariants}
				initial="hidden"
				animate="show"
				className="relative z-10 max-w-[1400px] mx-auto p-4 md:p-8 space-y-8"
			>
				{/* --- 1. HERO SECTION --- */}
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 border-b border-white/10 pb-8">
					<div className="lg:col-span-8 space-y-4">
						<div className="flex items-center gap-3">
							<span className="w-2 h-2 bg-green-500 animate-pulse rounded-full" />
							<span
								style={{ color: primaryColor }}
								className="font-mono text-xs uppercase tracking-[0.2em] font-bold"
							>
								Guide // System V.04
							</span>
						</div>

						<div className="overflow-hidden">
							<motion.h1
								variants={textReveal}
								className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] text-white mix-blend-difference"
							>
								Tournament <br />
								<span className="text-white/20">
									Of Strategies
								</span>
							</motion.h1>
						</div>
					</div>

					<div className="lg:col-span-4 flex flex-col justify-end items-start border-l border-white/10 pl-6 space-y-4">
						<Terminal size={24} className="text-white/40 mb-2" />
						<div className="font-mono text-sm uppercase tracking-widest text-white/50">
							Tagline_Sequence:
						</div>
						<div
							className="text-xl md:text-2xl font-bold text-white border-l-4 pl-4"
							style={{ borderColor: primaryColor }}
						>
							<ScrambleText CHARS={stringList} text="No Code." />{" "}
							<br />
							<ScrambleText
								CHARS={stringList}
								text="Build an Idea."
							/>
						</div>
					</div>
				</div>

				{/* --- 2. TICKER --- */}
				<div className="-mx-8">
					<InfiniteTicker
						text="EDITION IV // STRATEGY REQUIRED // NO CODE // 09:00 - 16:00"
						primaryColor={primaryColor}
					/>
				</div>

				{/* --- 3. MAIN GRID --- */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-fr">
					{/* CARD: Execution */}
					<BrutalistCard primaryColor={primaryColor} delay={0.1}>
						<div className="flex justify-between items-start mb-8">
							<Cpu size={28} style={{ color: primaryColor }} />
							<span
								className="font-mono text-sm border border-white/20 px-1 text-white/40"
								style={{ color: primaryColor }}
							>
								01
							</span>
						</div>
						<div>
							<h4 className="font-bold text-xl uppercase mb-2 text-white">
								<ScrambleText
									text="Execution"
									CHARS={stringList}
								/>
							</h4>
							<p className="text-s text-white/60 leading-relaxed">
								Your strategy will compete in the tournament,
								and you can monitor your standing on a
								periodically updated leaderboard.
							</p>
						</div>
					</BrutalistCard>

					{/* CARD: Simulation */}
					<BrutalistCard primaryColor={primaryColor} delay={0.2}>
						<div className="flex justify-between items-start mb-8">
							<Activity
								size={28}
								style={{ color: primaryColor }}
							/>
							<span
								className="font-mono text-sm border border-white/20 px-1 text-white/40"
								style={{ color: primaryColor }}
							>
								02
							</span>
						</div>
						<div>
							<h4 className="font-bold text-xl uppercase mb-2 text-white">
								<ScrambleText
									text="Sim & Lifeline"
									CHARS={stringList}
								/>
							</h4>
							<p className="text-s text-white/60 leading-relaxed">
								You may test your approach in a "Testing
								Tournament" and modify your strategy once using
								a single "lifeline."
							</p>
						</div>
					</BrutalistCard>

					{/* CARD: Operations (Spans 2 cols) */}
					<div className="lg:col-span-2">
						<BrutalistCard
							primaryColor={primaryColor}
							delay={0.3}
							className="h-full"
						>
							<div className="flex justify-between items-start gap-3 mb-6">
								<Clock
									size={28}
									style={{ color: primaryColor }}
								/>
								<span
									className="font-mono text-sm border border-white/20 px-1 text-white/40"
									style={{ color: primaryColor }}
								>
									03
								</span>
							</div>

							<div className="flex flex-col md:flex-row gap-8 items-end  h-full">
								<div className="flex-1">
									<h4 className="font-bold text-xl uppercase mb-2 text-white">
										<ScrambleText
											text="On 21st Feb"
											CHARS={stringList}
										/>
									</h4>
									<p className="text-lg font-light text-white/90 mb-4">
										A rolling event held throughout the day
										(tentatively scheduled from{" "}
										<span className="font-bold text-white bg-white/10 px-2">
											09:00 to 16:00
										</span>
										).
									</p>
									<div className="flex items-center gap-2 text-xs font-mono text-white/50">
										<ArrowRight size={12} />
										<span>DEADLINE: 1600 HRS</span>
									</div>
								</div>
								<div className="flex-1 w-full md:w-1/3 text-s text-white/60 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pl-4 md:pt-0">
									Participants will arrive, learn the game
									mechanics, draft their strategy in plain
									English, and upload it. The entire process
									takes approximately 30 minutes.
								</div>
							</div>
						</BrutalistCard>
					</div>

					{/* CARD: Access Level (Tall) */}
					<div className="lg:row-span-1">
						<BrutalistCard
							primaryColor={primaryColor}
							delay={0.4}
							className="h-full"
						>
							<div className="flex justify-between items-start gap-3 mb-6">
								<FileCode
									size={28}
									style={{ color: primaryColor }}
								/>
								<span
									className="font-mono text-sm border border-white/20 px-1 text-white/40"
									style={{ color: primaryColor }}
								>
									04
								</span>
							</div>
							<h3 className="text-lg font-bold uppercase mb-6 tracking-wide">
								<ScrambleText
									text="Access"
									CHARS={stringList}
								/>
								<br />
								<ScrambleText
									text="Requirements"
									CHARS={stringList}
								/>
							</h3>
							<ul className="space-y-6 font-mono text-sm">
								<li className="group cursor-default">
									<span className="block text-white/30 mb-1 group-hover:text-white transition-colors">
										Skill_Check
									</span>
									<span className="text-white/80">
										// No coding skills are required.
									</span>
								</li>
								<li className="group cursor-default">
									<span className="block text-white/30 mb-1 group-hover:text-white transition-colors">
										Unit_Size
									</span>
									<span className="text-white/80">
										// Participation is open to teams of 1
										or 2 members.
									</span>
								</li>
								<li className="group cursor-default">
									<span className="block text-white/30 mb-1 group-hover:text-white transition-colors">
										Scope
									</span>
									<span className="text-white/80">
										// The tournament consists of a single
										game scenario.
									</span>
								</li>
							</ul>
						</BrutalistCard>
					</div>

					{/* CARD: THE CHEAT SHEET (Danger Zone) */}
					<div className="lg:col-span-2 lg:row-span-1">
						<BrutalistCard
							primaryColor={primaryColor}
							delay={0.5}
							className="h-full bg-gradient-to-br from-[#1a0505] to-black border-red-900/30"
						>
							<div className="absolute top-4 right-4 animate-pulse">
								<Unlock size={20} className="text-red-500" />
							</div>

							<h3 className="text-2xl md:text-4xl font-black uppercase text-white mb-2">
								Protocol{" "}
								<span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
									Unrestricted
								</span>
							</h3>
							<p className="text-white/60 font-mono text-xl uppercase tracking-widest mb-8">
								Warning: All rules disabled
							</p>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
								<div>
									<p className="text-lg leading-relaxed text-white/90 mb-4">
										Tactics conventionally considered
										"cheating" are not only permitted but{" "}
										<ScrambleText
											text="encouraged"
											className="font-bold text-red-400"
											CHARS={stringList}
										/>
										.
									</p>
									<p className="text-xs text-white/40 italic">
										"You are even free to collude with the
										event coordinators."
									</p>
								</div>
								<div className="grid grid-cols-2 gap-2 content-start">
									{[
										"AI Assistance",
										"Google Search",
										"External Consult",
										"Collusion",
									].map((item) => (
										<div
											key={item}
											style={{
												color: primaryColor,
												borderColor: primaryColor,
											}}
											className="border border-white/10 bg-black/40 p-3 text-center text-xs uppercase font-bold text-white/60 hover:text-white transition-all cursor-pointer"
										>
											{item}
										</div>
									))}
								</div>
							</div>
						</BrutalistCard>
					</div>

					{/* CARD: Integrity */}
					<BrutalistCard
						primaryColor={primaryColor}
						delay={0.6}
						className="h-full"
					>
						<div className="flex justify-between items-start mb-6">
							<ShieldAlert
								size={28}
								style={{ color: primaryColor }}
							/>
							<span
								className="font-mono text-sm border border-white/20 px-1 text-white/40"
								style={{ color: primaryColor }}
							>
								05
							</span>
						</div>
						<h4 className="font-bold text-xl uppercase mb-4 text-white border-b border-white/10 pb-2">
							<ScrambleText
								text="System Integrity"
								CHARS={stringList}
							/>
						</h4>
						<div className="space-y-4 text-s text-white/70">
							<p>
								The simulation code will be{" "}
								<span className="text-white font-bold">
									open-source
								</span>{" "}
								and visible to all, but opposing players'
								strategies will remain confidential.
							</p>
							<p className="pt-2 border-t border-white/5">
								No two identical strategies are permitted. A
								dedicated system is in place to detect and
								reject duplicate submissions.
							</p>
						</div>
					</BrutalistCard>
				</div>

				{/* --- 4. BOTTOM TICKER --- */}
				<div className="-mx-8">
					<InfiniteTicker
						text="BUILD // BREAK // COLLUDE // WIN //"
						primaryColor={primaryColor}
						reverse={true}
					/>
				</div>
			</motion.div>
		</div>
	);
}
