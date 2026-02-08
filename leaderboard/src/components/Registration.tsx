import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Input } from "./ui/Input";
import { cn } from "../lib/utils";
import { Users, User, Phone, Terminal, CheckCircle2, Lock } from "lucide-react";

type RegistrationProps = {
	primaryColor: string;
};

export function Registration({ primaryColor }: RegistrationProps) {
	const [teamName, setTeamName] = useState("");
	const [playerCount, setPlayerCount] = useState<1 | 2>(1);
	const [player1, setPlayer1] = useState("");
	const [player2, setPlayer2] = useState("");
	const [contact1, setContact1] = useState("");
	const [contact2, setContact2] = useState("");

	// --- Logic for Progressive Reveal ---
	// 1. Show Squad & Operatives if Team Name is valid (3+ chars)
	const showSectionSquad = teamName.length >= 3;

	// 2. Show Comms if Player 1 is filled (and Player 2 if duo selected)
	const isPlayer1Valid = player1.length >= 2;
	const isPlayer2Valid = playerCount === 1 || player2.length >= 2;
	const showSectionComms =
		showSectionSquad && isPlayer1Valid && isPlayer2Valid;

	// 3. Show Submit if Contact 1 is filled (arbitrary length check for UX)
	const showSubmit = showSectionComms && contact1.length >= 5;

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		alert("TRANSMISSION RECEIVED // UNIT REGISTERED");
	};

	// Animation configuration for the "Reveal" effect
	const revealVar: Variants = {
		hidden: { opacity: 0, y: 20, height: 0, overflow: "hidden" },
		visible: {
			opacity: 1,
			y: 0,
			height: "auto",
			transition: {
				type: "spring",
				stiffness: 100,
				damping: 20,
				mass: 0.5,
			},
		},
		exit: { opacity: 0, height: 0, transition: { duration: 0.2 } },
	};

	return (
		<div className="w-full max-w-xl mx-auto pt-10 pb-10">
			{/* Tactical Header */}
			<div className="flex items-center gap-5 mb-10 border-b border-white/10 pb-8">
				<div className="p-4 bg-white/5 border border-white/10 rounded-md shadow-[0_0_20px_rgba(255,255,255,0.05)]">
					<Terminal
						className="w-8 h-8 text-emerald-400"
						style={{ color: primaryColor }}
					/>
				</div>
				<div>
					<h2 className="text-2xl font-bold uppercase tracking-[0.2em] text-white">
						Unit Registration
					</h2>
					<div className="flex items-center gap-3 mt-2">
						<div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
						<p
							style={{ color: primaryColor }}
							className="text-sm text-emerald-500/80 font-mono uppercase tracking-widest"
						>
							System Online
						</p>
					</div>
				</div>
			</div>

			<form onSubmit={handleSubmit} className="space-y-10 font-mono">
				{/* --- STEP 1: UNIT ID (Always Visible) --- */}
				<div className="space-y-4 relative group">
					<div className="flex justify-between items-end">
						<label
							style={{ color: primaryColor }}
							className="text-sm uppercase tracking-widest text-emerald-400 font-bold pl-1"
						>
							// 01. Unit Designation
						</label>
						{!showSectionSquad && (
							<span className="text-xs text-white/40 uppercase tracking-widest animate-pulse">
								Awaiting Input...
							</span>
						)}
					</div>

					<div className="relative">
						<Input
							placeholder="ENTER TEAM NAME (e.g. ALPHA)"
							value={teamName}
							onChange={(e) =>
								setTeamName(e.target.value.toUpperCase())
							}
							className="cursor-target bg-black/40 border border-white/10 placeholder:text-white/50 focus:outline-none focus-visible:outline-none focus:border-none focus:ring-0 transition-all duration-300 tracking-widest h-16 text-xl px-4"
						/>
						{/* Corner Accent */}
						<div className="absolute -bottom-1 -right-1 w-3 h-3 border-r-2 border-b-2 border-emerald-500/30" />
					</div>

					<p className="text-xs text-white/40 pl-1">
						* Minimum 3 characters required to proceed
					</p>
				</div>

				{/* --- STEP 2: SQUAD & OPERATIVES (Conditional) --- */}
				<AnimatePresence>
					{showSectionSquad && (
						<motion.div
							variants={revealVar}
							initial="hidden"
							animate="visible"
							exit="exit"
							className="space-y-8"
						>
							{/* Squad Config */}
							<div className="space-y-4">
								<label
									style={{ color: primaryColor }}
									className="text-sm uppercase tracking-widest text-emerald-400 font-bold pl-1 block"
								>
									// 02. Squad Configuration
								</label>
								<div className="flex bg-black/40 p-1.5 rounded-md border border-white/10 relative overflow-hidden">
									<div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.02)_50%,transparent_100%)] animate-[shimmer_2s_infinite]" />

									<button
										type="button"
										onClick={() => setPlayerCount(1)}
										className={cn(
											"cursor-target flex-1 flex items-center justify-center gap-3 py-4 rounded-sm text-sm uppercase tracking-wider font-bold transition-all duration-300 relative z-10",
											playerCount === 1
												? "bg-white/10 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)] border border-emerald-500/20"
												: "text-white/40 hover:text-white/80 hover:bg-white/5",
										)}
										style={{
											color:
												playerCount === 1
													? primaryColor
													: "#9e9e9e",
											borderColor:
												playerCount === 1
													? primaryColor
													: "#9e9e9e",
										}}
									>
										<User size={18} /> Solo
									</button>
									<button
										type="button"
										onClick={() => setPlayerCount(2)}
										className={cn(
											"cursor-target flex-1 flex items-center justify-center gap-3 py-4 rounded-sm text-sm uppercase tracking-wider font-bold transition-all duration-300 relative z-10",
											playerCount === 2
												? "bg-white/10 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)] border border-emerald-500/20"
												: "text-white/40 hover:text-white/80 hover:bg-white/5",
										)}
										style={{
											color:
												playerCount === 2
													? primaryColor
													: "#9e9e9e",
											borderColor:
												playerCount === 2
													? primaryColor
													: "#9e9e9e",
										}}
									>
										<Users size={18} /> Duo
									</button>
								</div>
							</div>

							{/* Operative Names */}
							<div className="grid grid-cols-1 gap-6 p-6 border border-white/10 bg-white/[0.02] rounded-md relative">
								<div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

								<div className="space-y-3">
									<label className="text-sm uppercase tracking-widest text-white/70 font-semibold pl-1">
										Operative 01 Callsign
									</label>
									<Input
										placeholder="ENTER NAME"
										value={player1}
										onChange={(e) =>
											setPlayer1(e.target.value)
										}
										className="cursor-target bg-black/40 border border-white/10 placeholder:text-white/50 focus:outline-none focus-visible:outline-none focus:border-none focus:ring-0 transition-all duration-300 tracking-widest h-16 text-xl px-4"
									/>
								</div>

								{playerCount === 2 && (
									<motion.div
										initial={{ opacity: 0, height: 0 }}
										animate={{ opacity: 1, height: "auto" }}
										className="space-y-3"
									>
										<label className="text-sm uppercase tracking-widest text-white/70 font-semibold pl-1">
											Operative 02 Callsign
										</label>
										<Input
											placeholder="ENTER NAME"
											value={player2}
											onChange={(e) =>
												setPlayer2(e.target.value)
											}
											className="cursor-target bg-black/40 border border-white/10 placeholder:text-white/50 focus:outline-none focus-visible:outline-none focus:border-none focus:ring-0 transition-all duration-300 tracking-widest h-16 text-xl px-4"
										/>
									</motion.div>
								)}
							</div>
						</motion.div>
					)}
				</AnimatePresence>

				{/* --- STEP 3: COMMS (Conditional) --- */}
				<AnimatePresence>
					{showSectionComms && (
						<motion.div
							variants={revealVar}
							initial="hidden"
							animate="visible"
							exit="exit"
							className="space-y-6 pt-6 border-t-2 border-dashed border-white/10"
						>
							<div className="space-y-4">
								<label
									style={{ color: primaryColor }}
									className="text-sm uppercase tracking-widest text-emerald-400 font-bold pl-1 flex items-center gap-3"
								>
									<Phone size={16} /> // 03. Priority Comm
									Link
								</label>
								<Input
									type="tel"
									placeholder="000-000-0000"
									value={contact1}
									onChange={(e) =>
										setContact1(e.target.value)
									}
									className="bg-black/40 border border-white/10 placeholder:text-white/50 focus:outline-none focus-visible:outline-none focus:border-none focus:ring-0 transition-all duration-300 tracking-widest h-16 text-xl px-4"
								/>
							</div>

							<div className="space-y-4 opacity-60 hover:opacity-100 transition-opacity">
								<label className="text-xs uppercase tracking-widest text-white/50 font-semibold pl-1 flex items-center gap-3">
									<Phone size={14} /> Secondary Link
									(Optional)
								</label>
								<Input
									type="tel"
									placeholder="OPTIONAL"
									value={contact2}
									onChange={(e) =>
										setContact2(e.target.value)
									}
									className="bg-black/40 border border-white/10 placeholder:text-white/50 focus:outline-none focus-visible:outline-none focus:border-none focus:ring-0 transition-all duration-300 tracking-widest h-16 text-xl px-4"
								/>
							</div>
						</motion.div>
					)}
				</AnimatePresence>

				{/* --- STEP 4: SUBMIT (Conditional) --- */}
				<AnimatePresence>
					{showSubmit ? (
						<motion.button
							variants={revealVar}
							initial="hidden"
							animate="visible"
							type="submit"
							className="w-full group relative bg-emerald-500 text-black font-black uppercase tracking-[0.2em] py-6 rounded-sm hover:bg-emerald-400 transition-colors duration-300 overflow-hidden"
						>
							<span className="relative z-10 flex items-center justify-center gap-4 text-lg">
								Initialize Registration{" "}
								<CheckCircle2 size={24} />
							</span>
							<div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 mix-blend-overlay" />
						</motion.button>
					) : (
						/* Locked State Visual */
						<div className="py-6 border border-white/5 bg-white/[0.01] rounded-sm flex items-center justify-center gap-3 text-white/20 uppercase tracking-widest">
							<Lock size={16} /> Awaiting Completion
						</div>
					)}
				</AnimatePresence>
			</form>
		</div>
	);
}
