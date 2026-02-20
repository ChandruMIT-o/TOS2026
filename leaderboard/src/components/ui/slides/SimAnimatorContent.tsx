// File: leaderboard/src/components/ui/slides/SimAnimatorContent.tsx

import { useState, useMemo } from "react";
import {
	ChevronLeft,
	ChevronRight,
	Activity,
	Zap,
	Hexagon,
} from "lucide-react";
import { matchData } from "../simdata"; // Assuming your data is exported here

export function SimAnimatorContent() {
	const [roundIdx, setRoundIdx] = useState(0);
	const currentRound = matchData[roundIdx];

	// Derive map state based on actions up to current round
	const nodeOwners = useMemo(() => {
		let owners: Record<number, string> = { 1: "A", 14: "B" };
		for (let i = 0; i <= roundIdx; i++) {
			const { choices } = matchData[i];
			if (
				!choices.A.invalid &&
				(choices.A.type === "EXPAND" || choices.A.type === "CONQUER") &&
				choices.A.targetNode
			) {
				owners[choices.A.targetNode] = "A";
			}
			if (
				!choices.B.invalid &&
				(choices.B.type === "EXPAND" || choices.B.type === "CONQUER") &&
				choices.B.targetNode
			) {
				owners[choices.B.targetNode] = "B";
			}
		}
		return owners;
	}, [roundIdx]);

	const handlePrev = () => setRoundIdx((prev) => Math.max(0, prev - 1));
	const handleNext = () =>
		setRoundIdx((prev) => Math.min(matchData.length - 1, prev + 1));

	return (
		<div className="space-y-6 h-full flex flex-col animate-in fade-in duration-500">
			<div className="flex justify-between items-center">
				<div className="flex flex-col">
					<h2 className="text-3xl font-black text-white uppercase tracking-tight flex items-center gap-3">
						<Activity className="text-emerald-500" />
						Live Telemetry
					</h2>
					<p className="text-white/50 text-sm mt-1">
						Step through the simulation to audit strategy execution
						turn-by-turn.
					</p>
				</div>

				{/* Playback Controls */}
				<div className="flex items-center gap-4 bg-white/5 p-2 rounded-lg border border-white/10">
					<button
						onClick={handlePrev}
						disabled={roundIdx === 0}
						className="p-2 bg-white/5 hover:bg-white/10 rounded disabled:opacity-30 transition-colors"
					>
						<ChevronLeft className="text-white" size={20} />
					</button>
					<div className="font-mono text-white text-lg font-bold text-center">
						TURN {currentRound.round}{" "}
						<span className="text-white/30">
							/ {matchData.length}
						</span>
					</div>
					<button
						onClick={handleNext}
						disabled={roundIdx === matchData.length - 1}
						className="p-2 bg-white/5 hover:bg-white/10 rounded disabled:opacity-30 transition-colors"
					>
						<ChevronRight className="text-white" size={20} />
					</button>
				</div>
			</div>

			<div className="flex-1 grid grid-cols-5 gap-4">
				{/* The Map */}
				<div className="col-span-2 bg-black/40 rounded-2xl border border-white/10 relative flex items-center justify-center overflow-hidden">
					<div className="absolute w-[280px] h-[280px] rounded-full border border-dashed border-white/10" />
					{Array.from({ length: 26 }, (_, i) => {
						const id = i + 1;
						const angleDeg = i * (360 / 26) - 90;
						const angleRad = angleDeg * (Math.PI / 180);
						const radius = 140;
						const x = Math.cos(angleRad) * radius;
						const y = Math.sin(angleRad) * radius;

						const isPower = [4, 7, 11, 17, 20, 24].includes(id);
						const owner = nodeOwners[id];

						let bgClass =
							"bg-white/5 border-white/20 text-white/30";
						if (owner === "A")
							bgClass =
								"bg-emerald-500 border-emerald-400 text-black shadow-[0_0_15px_rgba(16,185,129,0.5)] z-10 scale-110";
						if (owner === "B")
							bgClass =
								"bg-[#FA003F] border-[#FA003F] text-white shadow-[0_0_15px_rgba(247,0,1,0.5)] z-10 scale-110";
						else if (isPower)
							bgClass =
								"bg-purple-500/20 border-purple-500/50 text-purple-300";

						return (
							<div
								key={id}
								style={{
									transform: `translate(${x}px, ${y}px)`,
								}}
								className={`absolute w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${bgClass}`}
							>
								{id}
							</div>
						);
					})}
				</div>

				{/* Turn Data Inspector */}
				<div className="col-span-3 space-y-4 flex-1">
					<div className="grid grid-rows-2 gap-4 flex-1">
						{/* Player A Panel */}
						<div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-5 flex flex-col">
							<h3 className="text-emerald-500 font-bold uppercase tracking-widest border-b border-emerald-500/20 pb-3 mb-4">
								Player A
							</h3>

							<div className="space-y-4 flex-1">
								<div>
									<div className="text-[10px] text-white/40 mb-1 font-mono">
										INPUT STATE
									</div>
									<div className="flex gap-4">
										<div className="flex items-center gap-1 text-white font-mono">
											<Zap
												size={14}
												className="text-yellow-400"
											/>{" "}
											{currentRound.inputs.A.energy}
										</div>
										<div className="flex items-center gap-1 text-white font-mono">
											<Hexagon
												size={14}
												className="text-emerald-400"
											/>{" "}
											{currentRound.inputs.A.nodes}
										</div>
									</div>
								</div>

								<div>
									<div className="text-[10px] text-white/40 mb-1 font-mono">
										ACTION EMITTED
									</div>
									<div className="bg-black/50 p-2 rounded border border-white/5 font-mono text-sm text-emerald-300">
										[{currentRound.choices.A.type}
										{currentRound.choices.A.targetNode
											? `, ${currentRound.choices.A.targetNode}`
											: ""}
										]
										{currentRound.choices.A.invalid && (
											<span className="ml-2 text-red-500 text-xs">
												(INVALID)
											</span>
										)}
									</div>
								</div>

								<div className="mt-auto pt-4">
									<div className="text-[10px] text-white/40 mb-1 font-mono">
										RESULT
									</div>
									<p className="text-sm text-white/80 leading-snug">
										{currentRound.results.A.text}
									</p>
								</div>
							</div>
						</div>

						{/* Player B Panel */}
						<div className="bg-[#FA003F]/5 border border-[#FA003F]/50 rounded-xl p-5 flex flex-col">
							<h3 className="text-[#FA003F] font-bold uppercase tracking-widest border-b border-[#FA003F]/20 pb-3 mb-4">
								Player B
							</h3>

							<div className="space-y-4 flex-1">
								<div>
									<div className="text-[10px] text-white/40 mb-1 font-mono">
										INPUT STATE
									</div>
									<div className="flex gap-4">
										<div className="flex items-center gap-1 text-white font-mono">
											<Zap
												size={14}
												className="text-yellow-400"
											/>{" "}
											{currentRound.inputs.B.energy}
										</div>
										<div className="flex items-center gap-1 text-white font-mono">
											<Hexagon
												size={14}
												className="text-[#FA003F]"
											/>{" "}
											{currentRound.inputs.B.nodes}
										</div>
									</div>
								</div>

								<div>
									<div className="text-[10px] text-white/40 mb-1 font-mono">
										ACTION EMITTED
									</div>
									<div className="bg-black/50 p-2 rounded border border-white/5 font-mono text-sm text-[#FA003F]">
										[{currentRound.choices.B.type}
										{currentRound.choices.B.targetNode
											? `, ${currentRound.choices.B.targetNode}`
											: ""}
										]
										{currentRound.choices.B.invalid && (
											<span className="ml-2 text-red-500 text-xs">
												(INVALID)
											</span>
										)}
									</div>
								</div>

								<div className="mt-auto pt-4">
									<div className="text-[10px] text-white/40 mb-1 font-mono">
										RESULT
									</div>
									<p className="text-sm text-white/80 leading-snug">
										{currentRound.results.B.text}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
