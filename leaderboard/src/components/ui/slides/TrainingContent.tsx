import { Swords } from "lucide-react";

export function TrainingContent() {
	return (
		<div className="space-y-8 h-full flex flex-col justify-center items-center text-center">
			<div className="relative group cursor-pointer">
				<div className="absolute inset-0 bg-emerald-500 blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-full" />
				<div className="relative w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-800 rounded-2xl flex items-center justify-center shadow-2xl border border-white/20 group-hover:scale-110 transition-transform duration-300">
					<Swords size={40} className="text-white" />
				</div>
			</div>

			<div className="space-y-4 max-w-lg">
				<h2 className="text-2xl font-bold text-white uppercase tracking-widest">
					Ready to Deploy?
				</h2>
				<p className="text-white/50">
					Initialize the local training environment to test your
					strategy against dummy bots before submitting to the main
					leaderboard.
				</p>

				<button
					onClick={() => window.open("/sim", "_blank")}
					className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded text-sm font-bold uppercase tracking-widest transition-all shadow-lg hover:shadow-emerald-500/25 active:scale-95"
				>
					Launch Simulator
				</button>
			</div>

			<div className="grid grid-cols-3 gap-4 w-full max-w-2xl mt-8">
				<div className="bg-white/5 p-4 rounded border border-white/10 flex flex-col items-center gap-2">
					<div className="text-emerald-500 font-mono text-xl">0</div>
					<div className="text-[10px] text-white/40 uppercase tracking-widest">
						Wins
					</div>
				</div>
				<div className="bg-white/5 p-4 rounded border border-white/10 flex flex-col items-center gap-2">
					<div className="text-white font-mono text-xl">8</div>
					<div className="text-[10px] text-white/40 uppercase tracking-widest">
						Games Played
					</div>
				</div>
				<div className="bg-white/5 p-4 rounded border border-white/10 flex flex-col items-center gap-2">
					<div className="text-red-500 font-mono text-xl">12%</div>
					<div className="text-[10px] text-white/40 uppercase tracking-widest">
						Win Rate
					</div>
				</div>
			</div>
		</div>
	);
}
