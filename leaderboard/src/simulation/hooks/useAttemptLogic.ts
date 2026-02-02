import { useState } from "react";
import type { ChallengeState } from "../types/challenge";
import { challengeApi } from "../services/challengeApi";

const INITIAL_STATE: ChallengeState = {
	remainingTrials: 2,
	isSubmissionLocked: false,
	attempts: {
		1: { id: 1, status: "ACTIVE", strategyName: "", code: "" },
		2: { id: 2, status: "LOCKED", strategyName: "", code: "" },
	},
};

export function useAttemptLogic() {
	const [state, setState] = useState<ChallengeState>(INITIAL_STATE);
	const [isRunning, setIsRunning] = useState(false);

	// Update text/name for a specific attempt
	const updateAttempt = (
		id: 1 | 2,
		field: "strategyName" | "code",
		value: string,
	) => {
		setState((prev) => ({
			...prev,
			attempts: {
				...prev.attempts,
				[id]: { ...prev.attempts[id], [field]: value },
			},
		}));
	};

	// Run the code
	const runTest = async (attemptId: 1 | 2) => {
		if (state.remainingTrials <= 0) return;

		setIsRunning(true);

		try {
			const result = await challengeApi.runSimulation(
				attemptId,
				state.attempts[attemptId].code,
			);

			setState((prev) => {
				const nextState = { ...prev };

				// Save result
				nextState.attempts[attemptId].executionResult = result;
				nextState.attempts[attemptId].status = "COMPLETED";
				nextState.remainingTrials -= 1;

				// Unlock Attempt 2 if Attempt 1 is done
				if (
					attemptId === 1 &&
					nextState.attempts[2].status === "LOCKED"
				) {
					nextState.attempts[2].status = "ACTIVE";
				}

				return nextState;
			});
		} catch (e) {
			console.error(e);
		} finally {
			setIsRunning(false);
		}
	};

	return {
		attempts: state.attempts,
		remainingTrials: state.remainingTrials,
		isRunning,
		updateAttempt,
		runTest,
	};
}
