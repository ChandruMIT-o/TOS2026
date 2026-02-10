import { motion, type Variants } from "framer-motion";
import { ArrowUpRight, Terminal } from "lucide-react";
import { InfiniteTicker, ScrambleText } from "./HomeTabDesign";
import { HomeBento } from "./HomeBento";

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

						<div className="overflow-hidden pb-2">
							<motion.h1
								variants={textReveal}
								className="text-[2.5rem] sm:text-[2.7rem] md:text-[5rem] font-black uppercase tracking-tighter leading-none md:leading-[0.9] text-white mix-blend-difference"
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

				{/* --- INFO STRIP --- */}
				<div className="w-full bg-slate-200 text-black border-y border-black">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-black">
						{/* 1. EVENT IDENTITY */}
						<a
							href="https://tekhora26.live"
							target="_blank"
							rel="noopener noreferrer"
							className="cursor-target group relative p-6 md:p-8 flex flex-col justify-between min-h-[160px] hover:bg-black hover:text-white transition-colors duration-300 cursor-pointer"
						>
							<div className="absolute top-6 right-6 md:top-8 md:right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
								<ArrowUpRight size={24} />
							</div>
							<div>
								<span className="font-mono text-xs uppercase opacity-60 group-hover:opacity-100 transition-opacity">
									Event_ID
								</span>
								<h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-[0.9] mt-1">
									Tekhora
									<br />
									2026
								</h3>
							</div>
							<div className="flex items-center gap-2 mt-4 font-mono text-xs font-bold uppercase tracking-widest">
								<span className="w-2 h-2 bg-black rounded-full group-hover:bg-white" />
								Team Size: 1-2
							</div>
						</a>

						{/* 2. DATE & TIME (Big Data) */}
						<div className="cursor-target group relative p-6 md:p-8 flex flex-col justify-between min-h-[160px] hover:bg-black hover:text-white transition-colors duration-300">
							<span className="font-mono text-xs uppercase opacity-60 group-hover:opacity-100 transition-opacity">
								T - Minus
							</span>
							<div className="flex items-baseline gap-1 mt-auto">
								<span className="text-6xl md:text-7xl font-black tracking-tighter leading-none">
									21
								</span>
								<div className="flex flex-col font-bold leading-none">
									<span className="text-xl uppercase">
										FEB
									</span>
									<span className="text-lg opacity-50">
										09:30
									</span>
								</div>
							</div>
						</div>

						{/* 3. PRIZE POOL (High Impact) */}
						<div className="cursor-target group relative p-6 md:p-8 flex flex-col justify-between min-h-[160px] hover:bg-black hover:text-white transition-colors duration-300">
							<div className="flex justify-between items-start">
								<span className="font-mono text-xs uppercase opacity-60 group-hover:opacity-100 transition-opacity">
									Total_Bounty
								</span>
								<span className="font-mono text-xs font-bold border border-black px-1 group-hover:border-white group-hover:bg-white group-hover:text-black transition-all">
									FEE: ₹60
								</span>
							</div>
							<div className="mt-auto">
								<div className="flex items-baseline gap-5">
									<span className="text-5xl font-black tracking-tighter">
										₹3.5k
									</span>
									<span className="text-sm font-bold uppercase rotate-[-90deg] origin-left translate-y-2 opacity-50">
										Win
									</span>
								</div>
								<div className="w-full h-px bg-black/20 group-hover:bg-white/20 my-2" />
								<div className="flex justify-between items-center text-sm font-bold uppercase">
									<span>Runner Up</span>
									<span>₹2000</span>
								</div>
							</div>
						</div>

						{/* 4. CONTACTS (Actionable) */}
						<div className="cursor-target group relative p-6 md:p-8 flex flex-col justify-between min-h-[160px] hover:bg-black hover:text-white transition-colors duration-300">
							<span className="font-mono text-xs uppercase opacity-60 group-hover:opacity-100 transition-opacity">
								Link_Start
							</span>

							<div className="space-y-3 mt-auto">
								{[
									{ name: "Chandru", phone: "7667634519" },
									{ name: "Mirsha", phone: "9940358967" },
								].map((contact, i) => (
									<a
										key={i}
										href={`tel:${contact.phone}`}
										className="flex items-center justify-between border-b border-black/20 group-hover:border-white/30 pb-1 cursor-pointer hover:pl-2 transition-all"
									>
										<div className="flex flex-col leading-none">
											<span className="font-bold uppercase text-lg">
												{contact.name}
											</span>
											<span className="font-mono text-xs opacity-60">
												{contact.phone}
											</span>
										</div>
										<ArrowUpRight
											size={20}
											className="opacity-0 group-hover:opacity-100 transition-opacity"
										/>
									</a>
								))}
							</div>
						</div>
					</div>
				</div>

				{/* --- 3. MAIN GRID --- */}
				<HomeBento
					primaryColor={primaryColor}
					stringList={stringList}
				/>

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
