export type ValidationStatus =
	| "AI_VALIDATED"
	| "HUMAN_VERIFIED"
	| "PENDING"
	| "FAILED"
	| "FLAGGED";

export interface LeaderboardEntry {
	rank: number;
	strategy: string;
	points: number;
	wins: number;
	draws: number;
	losses: number;
	total_nodes: number;
	matches: number;
	isPlayer: boolean;
	avatar?: string;
}

export interface AttemptData {
	id: number; // 1 or 2
	status: "LOCKED" | "ACTIVE" | "COMPLETED";
	strategyName: string;
	strategyDesc: string; // The markdown/strategy text
	code: string; // The executable code
	executionResult?: {
		score: number;
		wins: number;
		draws: number;
		losses: number;
		total_nodes: number;
		rank: number;
		logs: string;
		validationStatus: ValidationStatus;
		executionTime: string;
		fullLeaderboard?: LeaderboardEntry[];
	};
	lastSavedAt?: string;
}

export interface ChallengeState {
	attempts: {
		1: AttemptData;
		2: AttemptData;
	};
	remainingTrials: number; // Max 2
	isSubmissionLocked: boolean; // True if final submission happened
}
