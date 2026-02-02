import type { AttemptData, LeaderboardEntry } from "../types/challenge";

// Mock Data Store
const MOCK_LEADERBOARD: LeaderboardEntry[] = [
	{ rank: 1, name: "NEXUS_PRIME", score: 98.4, isPlayer: false },
	{ rank: 2, name: "VORTEX_AI", score: 95.1, isPlayer: false },
	{ rank: 3, name: "CYBER_GHOST", score: 92.8, isPlayer: false },
	{ rank: 4, name: "IRON_CLAD", score: 88.2, isPlayer: false },
	{ rank: 5, name: "ECHO_UNIT", score: 85.9, isPlayer: false },
];

// Helper for delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const challengeApi = {
	fetchLeaderboard: async (): Promise<LeaderboardEntry[]> => {
		await delay(800);
		return [...MOCK_LEADERBOARD];
	},

	runSimulation: async (
		_attemptId: number,
		_code: string,
	): Promise<AttemptData["executionResult"]> => {
		await delay(2000); // Simulate processing time

		// Randomize result for demo purposes
		const score = parseFloat((Math.random() * (99 - 70) + 70).toFixed(1));
		const isHumanVerified = Math.random() > 0.7;

		return {
			score,
			logs: `[SYSTEM] Initializing Container...\n[KERNEL] Loading Modules...\n[EXEC] Strategy parsed successfully.\n[OUTPUT] Net Profit: +${score}%\n[SYSTEM] Process finished with exit code 0.`,
			validationStatus: isHumanVerified
				? "HUMAN_VERIFIED"
				: "AI_VALIDATED",
			executionTime: `${Math.floor(Math.random() * 100) + 50}ms`,
		};
	},

	submitFinalAttempt: async (_attemptId: number): Promise<boolean> => {
		await delay(1500);
		return true;
	},
};
