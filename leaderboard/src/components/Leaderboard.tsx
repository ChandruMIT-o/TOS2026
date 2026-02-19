import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getLeaderboardData } from "../database/api/LeaderboardData";

import {
	Trophy,
	Medal,
	Users,
	Cpu,
	Target,
	RefreshCw,
	AlertTriangle,
} from "lucide-react";

// 1. Interface matching your Backend Response (EnrichedLeaderboardEntry)
interface LeaderboardItem {
	rank: number;
	strategy: string; // Changed from strategy_name to match DB
	team_name: string;
	players: string[];
	points: number;
	wins: number;
	draws: number;
	losses: number; // Changed from loss to match DB
	total_nodes: number; // Changed from nodes to match DB
	matches: number;
}

const CACHE_KEY = "leaderboard_cache";
const CACHE_DURATION = 60 * 1000; // 60 seconds

export function useLeaderboardData() {
	const [data, setData] = useState<LeaderboardItem[] | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

	const fetchData = useCallback(async (forceUpdate = false) => {
		setLoading(true);
		setError(null);

		try {
			// 1. Check Cache (Skip if forcing update)
			if (!forceUpdate) {
				const cached = sessionStorage.getItem(CACHE_KEY);
				if (cached) {
					const { timestamp, payload } = JSON.parse(cached);
					const age = Date.now() - timestamp;

					if (age < CACHE_DURATION) {
						setData(payload);
						setLastUpdated(new Date(timestamp));
						setLoading(false);
						return;
					}
				}
			}

			// 2. Fetch Data from Firestore
			const rawResult = await getLeaderboardData(100);

			// 3. Sanitize Data (Fix type mismatch: undefined -> string)
			const sanitizedResult: LeaderboardItem[] = rawResult.map(
				(item) => ({
					...item,
					team_name: item.team_name ?? "Unknown Team",
					strategy: item.strategy ?? "Unknown Strategy",
					// Ensure array is never undefined
					players: item.players ?? [],
				}),
			);

			// 4. Update State & Cache
			const now = new Date();
			setData(sanitizedResult);
			setLastUpdated(now);

			sessionStorage.setItem(
				CACHE_KEY,
				JSON.stringify({
					timestamp: now.getTime(),
					payload: sanitizedResult,
				}),
			);
		} catch (err: any) {
			console.error("Fetch error:", err);
			// If we have data (even old/stale), don't wipe it out on error
			if (!data) {
				setError(
					err.message || "Failed to connect to Leaderboard Service",
				);
			}
		} finally {
			setLoading(false);
		}
	}, []); // Depend on 'data' to know if we should show error or keep stale data

	// Initial fetch on mount
	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return {
		data,
		loading,
		error,
		lastUpdated,
		refresh: () => fetchData(true),
	};
}

// 3. Main Component
export function Leaderboard({
	primaryColor = "#10b981",
}: {
	primaryColor?: string;
}) {
	const { data, loading, error, lastUpdated, refresh } = useLeaderboardData();

	// Formatter for time
	const formatTime = (date: Date | null) => {
		if (!date) return "--:--:--";
		return date.toLocaleTimeString("en-US", {
			hour12: false,
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		});
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="w-full bg-black text-white border-2 border-black min-h-[600px] flex flex-col"
		>
			{/* HEADER SECTION */}
			<div className="p-4 md:p-6 border-b border-white/20 flex flex-col md:flex-row justify-between items-start md:items-end gap-3 bg-neutral-900/50">
				<div>
					<img
						src="/vite.svg"
						alt="Logo"
						className="w-15 h-15 items-center justify-center"
					/>
					<div className="flex items-center gap-3 text-[10px] md:text-xs font-mono uppercase opacity-60 mb-1">
						<div className="flex items-center gap-2">
							<span
								style={{
									backgroundColor: error
										? "red"
										: primaryColor,
								}}
								className={`w-1.5 h-1.5 rounded-full ${loading ? "animate-ping" : ""}`}
							/>
							Status:{" "}
							{loading
								? "SYNCING..."
								: error
									? "OFFLINE"
									: "LIVE"}
						</div>
						<span>|</span>
						<div className="flex items-center gap-1">
							UPDATED: {formatTime(lastUpdated)}
						</div>
					</div>
					<h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-[0.9]">
						Current Standings
					</h1>
				</div>

				<div className="flex flex-col items-end gap-2">
					<button
						onClick={refresh}
						disabled={loading}
						className="cursor-target flex items-center gap-2 px-3 py-1 text-md font-mono font-bold border border-white/20 hover:bg-white hover:text-black transition-colors disabled:opacity-50"
					>
						<RefreshCw
							className={`w-3 h-3 ${loading ? "animate-spin" : ""}`}
						/>
						{loading ? "REFRESHING" : "FORCE_REFRESH"}
					</button>
					<div className="text-right font-mono text-[10px] md:text-xs opacity-60">
						Win = 3pts // Draw = 1pt // Loss = 0pts
					</div>
				</div>
			</div>

			{/* COLUMN HEADERS (Desktop) */}
			<div className="hidden md:grid grid-cols-12 gap-4 px-6 py-2 border-b border-white/20 font-mono text-[10px] uppercase opacity-50 bg-black">
				<div className="col-span-1">#</div>
				<div className="col-span-3">Team & Players</div>
				<div className="col-span-3">Strategy</div>
				<div className="col-span-2 text-right">Points</div>
				<div className="col-span-2 text-center">W / D / L</div>
				<div className="col-span-1 text-right">Nodes</div>
			</div>

			{/* BODY CONTENT */}
			<div className="flex-1 bg-black relative min-h-[300px]">
				{/* Loading Skeleton */}
				{loading && !data && (
					<div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 text-white/30 animate-pulse z-10">
						<Cpu className="w-12 h-12" />
						<span className="font-mono text-xs">
							ESTABLISHING UPLINK...
						</span>
					</div>
				)}

				{/* Error State */}
				{error && !data && (
					<div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 text-red-500 z-10">
						<AlertTriangle className="w-12 h-12" />
						<span className="font-mono text-xs text-center px-4">
							CONNECTION FAILURE: {error}
						</span>
						<button onClick={refresh} className="underline text-xs">
							RETRY CONNECTION
						</button>
					</div>
				)}

				{/* Data List */}
				<div className="divide-y divide-white/20">
					<AnimatePresence>
						{data?.map((item, index) => (
							<motion.div
								key={item.team_name} // Ideally use item.id if available
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0 }}
								transition={{ delay: index * 0.05 }}
								className="cursor-target group relative grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-4 p-4 md:px-6 md:py-3 
                  bg-black hover:bg-white hover:text-black 
                  transition-colors duration-300 cursor-pointer overflow-hidden items-center"
							>
								{/* RANK / POSITION */}
								<div className="col-span-1 md:col-span-1 flex items-center gap-2">
									<span className="font-black text-xl md:text-lg font-mono w-6">
										{item.rank < 10
											? `0${item.rank}`
											: item.rank}
									</span>
									{item.rank === 1 && (
										<div className="flex items-center justify-center w-6 h-6 bg-yellow-400 text-black rounded-sm">
											<Trophy className="w-3.5 h-3.5" />
										</div>
									)}
									{item.rank === 2 && (
										<div className="flex items-center justify-center w-6 h-6 bg-slate-300 text-black rounded-sm">
											<Medal className="w-3.5 h-3.5" />
										</div>
									)}
								</div>

								{/* TEAM INFO */}
								<div className="col-span-1 md:col-span-3 flex flex-col justify-center">
									<span className="font-bold uppercase tracking-wider text-base leading-tight truncate">
										{item.team_name}
									</span>
									<div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-80 transition-opacity mt-0.5">
										<Users className="w-3 h-3" />
										<span className="font-mono text-[10px] md:text-[11px] truncate">
											{item.players.join(", ")}
										</span>
									</div>
								</div>

								{/* STRATEGY */}
								<div className="col-span-1 md:col-span-3 flex items-center">
									<div className="flex items-center gap-2 px-2 py-1 rounded bg-white/5 group-hover:bg-black/5 border border-white/10 group-hover:border-black/10">
										<Cpu className="w-3 h-3 opacity-70" />
										<span className="font-mono text-sm uppercase tracking-tight">
											{item.strategy}
										</span>
									</div>
								</div>

								{/* POINTS */}
								<div className="hidden md:flex col-span-2 flex-col justify-center text-right">
									<span className="font-black text-2xl leading-none">
										{item.points}
									</span>
								</div>

								{/* W/D/L Stats */}
								<div className="hidden md:flex col-span-2 items-center justify-center font-mono text-xs">
									<span className="opacity-60 group-hover:opacity-100 transition-opacity whitespace-nowrap">
										<span className="text-green-500 group-hover:text-green-600 font-bold">
											{item.wins}
										</span>
										<span className="mx-1 opacity-30">
											/
										</span>
										<span className="text-neutral-500 group-hover:text-neutral-600 font-bold">
											{item.draws}
										</span>
										<span className="mx-1 opacity-30">
											/
										</span>
										<span className="text-red-500 group-hover:text-red-600 font-bold">
											{item.losses}
										</span>
									</span>
								</div>

								{/* NODES */}
								<div className="hidden md:flex col-span-1 items-center justify-end font-mono text-xs opacity-80">
									<Target className="w-3 h-3 mr-1 opacity-50" />
									{item.total_nodes}
								</div>

								{/* Mobile View */}
								<div className="md:hidden flex justify-between items-center w-full mt-2 pt-2 border-t border-current/10 font-mono text-[10px] opacity-70">
									<div className="flex gap-3">
										<span>
											PTS: <strong>{item.points}</strong>
										</span>
										<span>
											W/D/L: {item.wins}/{item.draws}/
											{item.losses}
										</span>
									</div>
									<span className="flex items-center gap-1">
										<Target className="w-3 h-3" />{" "}
										{item.total_nodes}
									</span>
								</div>
							</motion.div>
						))}
					</AnimatePresence>
				</div>
			</div>

			{/* FOOTER DECORATION */}
			<div className="p-3 border-t border-white/20 bg-neutral-900 text-neutral-500 font-mono text-[10px] flex justify-between">
				<span>
					SESSION_ID:{" "}
					{lastUpdated
						? lastUpdated.getTime().toString(16).toUpperCase()
						: "NULL"}
				</span>
				<span>{data ? `${data.length} RECORDS` : "NO DATA"}</span>
			</div>
		</motion.div>
	);
}
