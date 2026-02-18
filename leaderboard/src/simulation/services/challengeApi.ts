import type { AttemptData, LeaderboardEntry } from "../types/challenge";

// Mock Data Store
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
