import { useState } from "react";
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
	const [isCheatSheetActive, setIsCheatSheetActive] = useState(false);
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

			{/* CARD: THE CHEAT SHEET (Danger Zone) - INFO STRIP STYLE */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.5, delay: 0.5, ease: "circOut" }}
				className="cursor-target lg:col-span-2 lg:row-span-1 group relative p-6 md:p-8 bg-slate-200 text-black border border-black hover:bg-black hover:text-white transition-colors duration-300 overflow-hidden flex flex-col justify-between"
				onMouseEnter={() => setIsCheatSheetActive(true)}
				onMouseLeave={() => setIsCheatSheetActive(false)}
			>
				{/* Top Header Section */}
				<div className="flex justify-between items-start mb-6">
					<div>
						<div className="flex items-center gap-2 mb-1">
							<Unlock
								size={16}
								className="text-red-600 group-hover:text-red-500 transition-colors"
							/>
							<span className="font-mono text-xs uppercase opacity-60 group-hover:opacity-100 transition-opacity text-red-600 group-hover:text-red-500">
								Warning: Rules Disabled
							</span>
						</div>
						<h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-[0.9]">
							Protocol
							<br />
							<ScrambleText
								text="Unrestricted"
								CHARS={stringList}
								active={isCheatSheetActive}
							/>
						</h3>
					</div>
					{/* Decorative Number/ID similar to other cards */}
					<span
						className="font-mono text-sm border border-black/20 group-hover:border-white/20 px-1 opacity-40 group-hover:opacity-100 transition-all"
						style={{ color: primaryColor }}
					>
						ERR-00
					</span>
				</div>

				{/* Content Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
					{/* Left: Description */}
					<div className="flex flex-col justify-end">
						<p className="text-lg font-bold leading-tight mb-4">
							Tactics conventionally considered "cheating" are{" "}
							<span className="bg-red-600 text-white px-1">
								<ScrambleText
									text="encouraged"
									CHARS={stringList}
									active={isCheatSheetActive}
								/>
							</span>
							.
						</p>
						<p className="text-xs font-mono opacity-60 group-hover:opacity-80 italic border-l-2 border-red-600 pl-3">
							"You are even free to collude with the event
							coordinators."
						</p>
					</div>

					{/* Right: List of Allowed Actions (Styled like Info Strip Contacts) */}
					<div className="flex flex-col justify-end gap-2">
						{[
							{ label: "AI Assistance", id: "SYS-01" },
							{ label: "Google Search", id: "NET-02" },
							{ label: "External Consult", id: "LNK-03" },
							{ label: "Collusion", id: "ERR-04" },
						].map((item) => (
							<div
								key={item.id}
								className="flex items-center justify-between border-b border-black/10 group-hover:border-white/20 pb-1"
							>
								<div className="flex items-baseline gap-2">
									<span className="font-mono text-[10px] opacity-40 group-hover:opacity-60 transition-opacity">
										{item.id}
									</span>
									<span className="font-bold uppercase text-sm tracking-wide">
										{item.label}
									</span>
								</div>
								{/* Status Indicator */}
								<div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
							</div>
						))}
					</div>
				</div>
			</motion.div>

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
