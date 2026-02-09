import { motion } from "framer-motion";
import {
	Clock,
	Cpu,
	ShieldAlert,
	Unlock,
	Activity,
	FileCode,
	ArrowRight,
} from "lucide-react";
import { ScrambleText, BrutalistCard } from "./HomeTabDesign";

// Asset Imports
import path3 from "../assets/path3.svg";
import path4 from "../assets/path4.svg";
import path5 from "../assets/path5.svg";
import path6 from "../assets/path6.svg";
import path7 from "../assets/path7.svg";
import path8 from "../assets/path8.svg";

type HomeBentoProps = {
	primaryColor: string;
	stringList: string;
};

export function HomeBento({ primaryColor, stringList }: HomeBentoProps) {
	const bgVectors = [path3, path4, path5, path6, path7, path8];

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-fr">
			{/* CARD: Execution */}
			<BrutalistCard
				primaryColor={primaryColor}
				delay={0.1}
				bgVector={path3}
				bgVectors={bgVectors}
			>
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
						<ScrambleText text="Execution" CHARS={stringList} />
					</h4>
					<p className="text-s text-white/60 leading-relaxed">
						Your strategy will compete in the tournament, and you
						can monitor your standing on a periodically updated
						leaderboard.
					</p>
				</div>
			</BrutalistCard>

			{/* CARD: Simulation */}
			<BrutalistCard
				primaryColor={primaryColor}
				delay={0.2}
				bgVector={path4}
				bgVectors={bgVectors}
			>
				<div className="flex justify-between items-start mb-8">
					<Activity size={28} style={{ color: primaryColor }} />
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
						You may test your approach in a "Testing Tournament" and
						modify your strategy once using a single "lifeline."
					</p>
				</div>
			</BrutalistCard>

			{/* CARD: Operations (Spans 2 cols) */}
			<div className="lg:col-span-2">
				<BrutalistCard
					primaryColor={primaryColor}
					delay={0.3}
					className="h-full"
					bgVector={path5}
					bgVectors={bgVectors}
				>
					<div className="flex justify-between items-start gap-3 mb-6">
						<Clock size={28} style={{ color: primaryColor }} />
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
							Participants will arrive, learn the game mechanics,
							draft their strategy in plain English, and upload
							it. The entire process takes approximately 30
							minutes.
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
					bgVector={path6}
					bgVectors={bgVectors}
				>
					<div className="flex justify-between items-start gap-3 mb-6">
						<FileCode size={28} style={{ color: primaryColor }} />
						<span
							className="font-mono text-sm border border-white/20 px-1 text-white/40"
							style={{ color: primaryColor }}
						>
							04
						</span>
					</div>
					<h3 className="text-lg font-bold uppercase mb-6 tracking-wide">
						<ScrambleText text="Access" CHARS={stringList} />
						<br />
						<ScrambleText text="Requirements" CHARS={stringList} />
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
								// Participation is open to teams of 1 or 2
								members.
							</span>
						</li>
						<li className="group cursor-default">
							<span className="block text-white/30 mb-1 group-hover:text-white transition-colors">
								Scope
							</span>
							<span className="text-white/80">
								// The tournament consists of a single game
								scenario.
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
					bgVector={path8}
					bgVectors={bgVectors}
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
								Tactics conventionally considered "cheating" are
								not only permitted but{" "}
								<ScrambleText
									text="encouraged"
									className="font-bold text-red-400"
									CHARS={stringList}
								/>
								.
							</p>
							<p className="text-xs text-white/40 italic">
								"You are even free to collude with the event
								coordinators."
							</p>
						</div>
						<div className="grid grid-cols-2 gap-3 w-full mt-4">
							{[
								{
									label: "AI Assistance",
									id: "SYS-01",
								},
								{
									label: "Google Search",
									id: "NET-02",
								},
								{
									label: "External Consult",
									id: "LNK-03",
								},
								{ label: "Collusion", id: "ERR-04" },
							].map((item) => (
								<motion.button
									key={item.label}
									initial="idle"
									whileHover="hover"
									className="relative group overflow-hidden border border-white/10 bg-black/40 p-3 text-left transition-all"
									style={{
										// We use a CSS variable for the hover color so we can use it in pseudo-elements
										// @ts-ignore
										"--active-color": primaryColor,
									}}
								>
									{/* 1. Background Sweep Animation */}
									<motion.div
										variants={{
											idle: {
												x: "-100%",
												opacity: 0,
											},
											hover: {
												x: "0%",
												opacity: 0.1,
											},
										}}
										transition={{
											duration: 0.3,
											ease: "circOut",
										}}
										className="absolute inset-0 bg-[var(--active-color)]"
									/>

									{/* 2. Border Glow (Pseudo-element replacement) */}
									<div className="absolute inset-0 border border-[var(--active-color)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

									{/* Content Container */}
									<div className="relative z-10 flex flex-col gap-1">
										{/* 3. Tech ID (The "Brutalist" Detail) */}
										<div className="flex justify-between items-center">
											<span
												className="text-[0.6rem] font-mono tracking-widest uppercase opacity-40 group-hover:opacity-80 transition-opacity"
												style={{
													color: primaryColor,
												}}
											>
												{item.id}
											</span>

											{/* 4. Status LED */}
											<motion.div
												variants={{
													idle: {
														backgroundColor: "#333",
														boxShadow: "none",
													},
													hover: {
														backgroundColor:
															primaryColor,
														boxShadow: `0 0 8px ${primaryColor}`,
													},
												}}
												className="w-1.5 h-1.5 rounded-full"
											/>
										</div>

										{/* 5. Scramble Title */}
										<div className="text-xs font-bold uppercase tracking-wider text-white/60 group-hover:text-white transition-colors">
											{/* Re-using your ScrambleText component here automatically handles the hover effect */}
											<ScrambleText text={item.label} />
										</div>
									</div>

									{/* Corner Accent (Decor) */}
									<div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20 group-hover:border-[var(--active-color)] transition-colors" />
								</motion.button>
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
				bgVector={path7}
				bgVectors={bgVectors}
			>
				<div className="flex justify-between items-start mb-6">
					<ShieldAlert size={28} style={{ color: primaryColor }} />
					<span
						className="font-mono text-sm border border-white/20 px-1 text-white/40"
						style={{ color: primaryColor }}
					>
						05
					</span>
				</div>
				<h4 className="font-bold text-xl uppercase mb-4 text-white border-b border-white/10 pb-2">
					<ScrambleText text="System Integrity" CHARS={stringList} />
				</h4>
				<div className="space-y-4 text-s text-white/70">
					<p>
						The simulation code will be{" "}
						<span className="text-white font-bold">
							open-source
						</span>{" "}
						and visible to all, but opposing players' strategies
						will remain confidential.
					</p>
					<p className="pt-2 border-t border-white/5">
						No two identical strategies are permitted. A dedicated
						system is in place to detect and reject duplicate
						submissions.
					</p>
				</div>
			</BrutalistCard>
		</div>
	);
}
