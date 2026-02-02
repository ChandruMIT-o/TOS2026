export type ValidationStatus =
	| "AI_VALIDATED"
	| "HUMAN_VERIFIED"
	| "PENDING"
	| "FAILED";

export interface LeaderboardEntry {
	rank: number;
	name: string;
	score: number;
	isPlayer: boolean;
	avatar?: string;
}

export interface AttemptData {
	id: number; // 1 or 2
	status: "LOCKED" | "ACTIVE" | "COMPLETED";
	strategyName: string;
	code: string; // The markdown/strategy text
	executionResult?: {
		score: number;
		logs: string;
		validationStatus: ValidationStatus;
		executionTime: string;
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
