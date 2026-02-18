import { db } from "../../lib/firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import type { AttemptData, LeaderboardEntry } from "../types/challenge";

// Cloud Function URLs
const FUNCTIONS_BASE_URL = "https://us-central1-tekhora-26.cloudfunctions.net";

export interface DraftSubmission {
	team_name: string;
	draft_id: "draft_1" | "draft_2";
	strategy_name: string;
	strategy_desc?: string; // Optional if code is provided
	strategy_code?: string; // Optional if desc is provided
}

export interface LockSelectionRequest {
	team_name: string;
	draft_id: "draft_1" | "draft_2";
}

export interface TeamData {
	team_name: string;
	drafts: {
		draft_1?: any;
		draft_2?: any;
	};
	finalized_strategy?: string;
	finalized_at?: any;
}

export const challengeApi = {
	// fetching leaderboard (keep mock or implement real if needed, user focused on simulation integration first)
	fetchLeaderboard: async (): Promise<LeaderboardEntry[]> => {
		// keeping mock for now as per user instruction "We are only using two functions (already deployed.)"
		// and the user request is about simulation integration.
		// However, I should probably check if there is a real leaderboard endpoint or firestore collection.
		// For now, I'll return mock to avoid breaking that part, unless I find a collection.
		// The prompt said: "We need to integrate simulation ... with the functions".
		// I will leave the mock leaderboard for now to focus on the critical path.

		const MOCK_LEADERBOARD: LeaderboardEntry[] = [
			{
				rank: 1,
				strategy: "NEXUS_PRIME",
				points: 984,
				isPlayer: false,
				wins: 45,
				draws: 3,
				losses: 2,
				total_nodes: 15432,
				matches: 50,
			},
			{
				rank: 2,
				strategy: "VORTEX_AI",
				points: 951,
				isPlayer: false,
				wins: 42,
				draws: 5,
				losses: 3,
				total_nodes: 14210,
				matches: 50,
			},
			{
				rank: 3,
				strategy: "CYBER_GHOST",
				points: 928,
				isPlayer: false,
				wins: 40,
				draws: 6,
				losses: 4,
				total_nodes: 13500,
				matches: 50,
			},
			{
				rank: 4,
				strategy: "IRON_CLAD",
				points: 882,
				isPlayer: false,
				wins: 38,
				draws: 4,
				losses: 8,
				total_nodes: 12800,
				matches: 50,
			},
			{
				rank: 5,
				strategy: "ECHO_UNIT",
				points: 859,
				isPlayer: false,
				wins: 35,
				draws: 7,
				losses: 8,
				total_nodes: 11950,
				matches: 50,
			},
		];
		return new Promise((resolve) =>
			setTimeout(() => resolve(MOCK_LEADERBOARD), 800),
		);
	},

	// Run Simulation -> calling submit_draft
	runSimulation: async (
		payload: DraftSubmission,
		onProgress?: (step: string) => void,
	): Promise<AttemptData["executionResult"]> => {
		try {
			if (onProgress) onProgress("Initializing Request...");

			const response = await fetch(`${FUNCTIONS_BASE_URL}/submit_draft`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			if (onProgress) onProgress("Processing on Server...");

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Simulation failed");
			}

			if (onProgress) onProgress("Finalizing Results...");

			const data = await response.json();

			// Transform response to match AttemptData["executionResult"]
			// The backend returns: { status, message, is_unique, leaderboard: { [strat]: { ... } } }

			const myStats = data.leaderboard[payload.strategy_name];
			if (!myStats) {
				throw new Error("Strategy stats missing in response");
			}

			// Parse full leaderboard
			const fullLeaderboard: LeaderboardEntry[] = Object.entries(
				data.leaderboard,
			)
				.map(([stratName, stats]: [string, any]) => ({
					rank: stats.rank,
					strategy: stratName,
					points: stats.points,
					wins: stats.wins,
					draws: stats.draws,
					losses: stats.losses,
					total_nodes: stats.total_nodes,
					matches: 50, // Hardcoded for now as per competition specs (or derive if available)
					isPlayer: stratName === payload.strategy_name,
				}))
				.sort((a, b) => a.rank - b.rank);

			// Format logs/output
			const logs =
				`[SYSTEM] Strategy '${payload.strategy_name}' submitted.\n` +
				`[RESULT] Rank: ${myStats.rank} | Points: ${myStats.points}\n` +
				`[STATS] Wins: ${myStats.wins} | Draws: ${myStats.draws} | Losses: ${myStats.losses}\n` +
				`[UNIQUE] Logic Unique: ${data.is_unique ? "YES" : "NO"}`;

			return {
				score: myStats.points,
				wins: myStats.wins,
				draws: myStats.draws,
				losses: myStats.losses,
				total_nodes: myStats.total_nodes,
				rank: myStats.rank,
				logs: logs,
				validationStatus: data.is_unique ? "AI_VALIDATED" : "FLAGGED",
				executionTime: "N/A", // Backend doesn't return time yet
				fullLeaderboard: fullLeaderboard,
			};
		} catch (error: any) {
			console.error("Run Simulation Error:", error);
			throw error;
		}
	},

	// Lock Selection -> calling lock_selection
	lockSelection: async (
		payload: LockSelectionRequest,
	): Promise<{ success: boolean; message: string; finalName?: string }> => {
		try {
			const response = await fetch(
				`${FUNCTIONS_BASE_URL}/lock_selection`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload),
				},
			);

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Locking failed");
			}

			return {
				success: true,
				message: data.message,
				finalName: data.final_name,
			};
		} catch (error: any) {
			console.error("Lock Selection Error:", error);
			throw error;
		}
	},

	// Fetch Team Data (Real-time or One-off)
	getTeamData: async (teamName: string): Promise<TeamData | null> => {
		try {
			const docRef = doc(db, "tos_teams", teamName);
			const snap = await getDoc(docRef);
			if (snap.exists()) {
				return snap.data() as TeamData;
			}
			return null;
		} catch (error) {
			console.error("Get Team Data Error:", error);
			return null;
		}
	},

	// Subscribe to Team Data
	subscribeToTeamData: (
		teamName: string,
		callback: (data: TeamData | null) => void,
	) => {
		const docRef = doc(db, "tos_teams", teamName);
		return onSnapshot(docRef, (doc) => {
			if (doc.exists()) {
				callback(doc.data() as TeamData);
			} else {
				callback(null);
			}
		});
	},
};
