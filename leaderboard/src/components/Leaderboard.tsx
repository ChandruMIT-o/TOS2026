import { motion } from "framer-motion";
import { Trophy, Medal, Users, Cpu, Target } from "lucide-react";

interface LeaderboardItem {
	rank: number;
	strategy_name: string;
	team_name: string;
	players: string[];
	points: number;
	wins: number;
	draws: number;
	loss: number;
	nodes: number;
	matches: number;
}

export function Leaderboard({ primaryColor }: { primaryColor: string }) {
	const data: LeaderboardItem[] = [
		{
			rank: 1,
			strategy_name: "strat_sniper",
			team_name: "Null_Pointers",
			players: ["Alex_K", "Sarah_J"],
			points: 23,
			wins: 7,
			draws: 2,
			loss: 1,
			nodes: 129,
			matches: 10,
		},
		{
			rank: 2,
			strategy_name: "strat_plague",
			team_name: "Void_Walkers",
			players: ["Mike_R"],
			points: 21,
			wins: 6,
			draws: 3,
			loss: 1,
			nodes: 163,
			matches: 10,
		},
		{
			rank: 3,
			strategy_name: "strat_random",
			team_name: "Entropy_Crew",
			players: ["David_L", "Emma_W"],
			points: 15,
			wins: 5,
			draws: 0,
			loss: 5,
			nodes: 131,
			matches: 10,
		},
		{
			rank: 4,
			strategy_name: "strat_power_rush",
			team_name: "Blitz_Krieg",
			players: ["James_T"],
			points: 15,
			wins: 5,
			draws: 0,
			loss: 5,
			nodes: 111,
			matches: 10,
		},
		{
			rank: 5,
			strategy_name: "strat_hoarder",
			team_name: "Resource_Hogs",
			players: ["Lisa_M", "Tom_B"],
			points: 9,
			wins: 3,
			draws: 0,
			loss: 7,
			nodes: 120,
			matches: 10,
		},
		{
			rank: 6,
			strategy_name: "strat_neighbor",
			team_name: "Local_Host",
			players: ["Kevin_P"],
			points: 3,
			wins: 0,
			draws: 3,
			loss: 7,
			nodes: 30,
			matches: 10,
		},
	];

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="w-full bg-black text-white border-2 border-black"
		>
			{/* HEADER SECTION */}
			<div className="p-4 md:p-6 border-b border-white/20 flex flex-col md:flex-row justify-between items-start md:items-end gap-3">
				<div>
					<div className="flex items-center gap-2 text-[10px] md:text-xs font-mono uppercase opacity-60 mb-1">
						<span
							style={{ color: primaryColor }}
							className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"
						/>
						System_Status: Live
					</div>
					<h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-[0.9]">
						Current Standings
					</h1>
				</div>
				<div className="text-right font-mono text-[10px] md:text-xs opacity-60">
					Win = 3pts // Draw = 1pt // Loss = 0pts
				</div>
			</div>

			{/* COLUMN HEADERS (Desktop only) */}
			<div className="hidden md:grid grid-cols-12 gap-4 px-6 py-2 border-b border-white/20 font-mono text-[10px] uppercase opacity-50">
				<div className="col-span-1">#</div>
				<div className="col-span-3">Team & Players</div>
				<div className="col-span-3">Strategy</div>
				<div className="col-span-2 text-right">Points</div>
				<div className="col-span-2 text-center">W / D / L</div>
				<div className="col-span-1 text-right">Nodes</div>
			</div>

			{/* DATA ROWS */}
			<div className="divide-y divide-white/20">
				{data.map((item, index) => (
					<motion.div
						key={item.team_name}
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: index * 0.1 }}
						className="cursor-target group relative grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-4 p-4 md:px-6 md:py-3 
                         bg-black hover:bg-white hover:text-black 
                         transition-colors duration-300 cursor-pointer overflow-hidden items-center"
					>
						{/* RANK / POSITION */}
						<div className="col-span-1 md:col-span-1 flex items-center gap-2">
							<span className="font-black text-xl md:text-lg font-mono w-6">
								{item.rank < 10 ? `0${item.rank}` : item.rank}
							</span>

							{/* Always Visible Rank Badges */}
							{item.rank === 1 && (
								<div className="flex items-center justify-center w-6 h-6 bg-yellow-400 text-black rounded-sm shadow-sm group-hover:shadow-md transition-all">
									<Trophy className="w-3.5 h-3.5" />
								</div>
							)}
							{item.rank === 2 && (
								<div className="flex items-center justify-center w-6 h-6 bg-slate-300 text-black rounded-sm shadow-sm group-hover:shadow-md transition-all">
									<Medal className="w-3.5 h-3.5" />
								</div>
							)}
						</div>

						{/* TEAM INFO */}
						<div className="col-span-1 md:col-span-3 flex flex-col justify-center">
							<span className="font-bold uppercase tracking-wider text-base md:text-base truncate leading-tight hover:">
								{item.team_name}
							</span>
							<div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-80 transition-opacity mt-0.5">
								<Users className="w-3 h-3" />
								<span className="font-mono text-[10px] md:text-[11px] truncate">
									{item.players.join(", ")}
								</span>
							</div>
						</div>

						{/* STRATEGY NAME (Separate Column) */}
						<div className="col-span-1 md:col-span-3 flex items-center md:items-center">
							<div className="flex items-center gap-2 px-2 py-1 rounded bg-white/5 group-hover:bg-black/5 transition-colors border border-white/10 group-hover:border-black/10">
								<Cpu className="w-3 h-3 opacity-70" />
								<span className="font-mono text-[11px] uppercase tracking-tight">
									{item.strategy_name}
								</span>
							</div>
						</div>

						{/* POINTS */}
						<div className="hidden md:flex col-span-2 flex-col justify-center text-right">
							<span className="font-black text-2xl leading-none">
								{item.points}
							</span>
						</div>

						{/* STATS (W/D/L) */}
						<div className="hidden md:flex col-span-2 items-center justify-center font-mono text-xs">
							<span className="opacity-60 group-hover:opacity-100 transition-opacity whitespace-nowrap">
								<span className="text-green-500 font-bold">
									{item.wins}
								</span>
								<span className="mx-1 text-white/30 group-hover:text-black/30">
									/
								</span>
								<span className="text-neutral-500 font-bold">
									{item.draws}
								</span>
								<span className="mx-1 text-white/30 group-hover:text-black/30">
									/
								</span>
								<span className="text-red-500 font-bold">
									{item.loss}
								</span>
							</span>
						</div>

						{/* NODES */}
						<div className="hidden md:flex col-span-1 items-center justify-end font-mono text-xs opacity-80">
							<Target className="w-3 h-3 mr-1 opacity-50" />
							{item.nodes}
						</div>

						{/* Mobile Stats shown on small screens */}
						<div className="md:hidden flex justify-between items-center w-full mt-2 pt-2 border-t border-current/10 font-mono text-[10px] opacity-70">
							<div className="flex gap-3">
								<span>
									PTS: <strong>{item.points}</strong>
								</span>
								<span>
									W/D/L: {item.wins}/{item.draws}/{item.loss}
								</span>
							</div>
							<span className="flex items-center gap-1">
								<Cpu className="w-3 h-3" /> {item.strategy_name}
							</span>
						</div>
					</motion.div>
				))}
			</div>

			{/* FOOTER DECORATION */}
			<div className="p-3 border-t border-white/20 bg-neutral-900 text-neutral-500 font-mono text-[10px] flex justify-between">
				<span>SESSION_ID: 0X29A</span>
				<span>END_OF_FILE</span>
			</div>
		</motion.div>
	);
}
