import { useState, useEffect } from "react";
import { challengeApi } from "../services/challengeApi";
import type { LeaderboardEntry } from "../types/challenge";

export function useChallengeData() {
	const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		let mounted = true;

		const init = async () => {
			try {
				const data = await challengeApi.fetchLeaderboard();
				if (mounted) setLeaderboard(data);
			} catch (err) {
				console.error("Failed to fetch challenge data", err);
			} finally {
				if (mounted) setIsLoading(false);
			}
		};

		init();

		return () => {
			mounted = false;
		};
	}, []);

	return { leaderboard, isLoading };
}
