import { useState, useEffect } from "react";
import type { ChallengeState } from "../types/challenge";
import {
	challengeApi,
	type DraftSubmission,
	type LockSelectionRequest,
} from "../services/challengeApi";
import type { TimelineStep } from "../components/ValidationTimeline";

const INITIAL_STATE: ChallengeState = {
	remainingTrials: 2,
	isSubmissionLocked: false,
	attempts: {
		1: {
			id: 1,
			status: "ACTIVE",
			strategyName: "",
			strategyDesc: "",
			code: "",
		},
		2: {
			id: 2,
			status: "LOCKED",
			strategyName: "",
			strategyDesc: "",
			code: "",
		},
	},
};

export function useAttemptLogic(teamName: string | null) {
	const [state, setState] = useState<ChallengeState>(INITIAL_STATE);
	const [isRunning, setIsRunning] = useState(false);
	const [isLocking, setIsLocking] = useState(false);

	// Timeline State
	const [timelineSteps, setTimelineSteps] = useState<TimelineStep[]>([]);
	const [showTimeline, setShowTimeline] = useState(false);

	// Load local storage backup on mount
	useEffect(() => {
		const savedStrat = localStorage.getItem("STRATEGY_DEFINITION");
		if (savedStrat) {
			try {
				const parsed = JSON.parse(savedStrat);
				if (parsed.code || parsed.name || parsed.desc) {
					setState((prev) => ({
						...prev,
						attempts: {
							...prev.attempts,
							1: {
								...prev.attempts[1],
								code:
									prev.attempts[1].code || parsed.code || "",
								strategyDesc:
									prev.attempts[1].strategyDesc ||
									parsed.desc ||
									"",
								strategyName:
									prev.attempts[1].strategyName ||
									parsed.name ||
									"",
							},
						},
					}));
				}
			} catch (e) {
				console.error("Failed to parse local strategy", e);
			}
		}
	}, []);

	// Save to local storage on change
	useEffect(() => {
		const current = state.attempts[1]; // Primarily saving attempt 1 for now
		if (current.code || current.strategyName || current.strategyDesc) {
			localStorage.setItem(
				"STRATEGY_DEFINITION",
				JSON.stringify({
					name: current.strategyName,
					desc: current.strategyDesc,
					code: current.code,
				}),
			);
		}
	}, [
		state.attempts[1].code,
		state.attempts[1].strategyName,
		state.attempts[1].strategyDesc,
	]);

	// Update text/name for a specific attempt
	const updateAttempt = (
		id: 1 | 2,
		field: "strategyName" | "code" | "strategyDesc",
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

	const setAttempts = (newAttempts: ChallengeState["attempts"]) => {
		setState((prev) => ({ ...prev, attempts: newAttempts }));
	};

	const setSubmissionLocked = (locked: boolean) => {
		setState((prev) => ({ ...prev, isSubmissionLocked: locked }));
	};

	// Update specific timeline step status
	const updateStepStatus = (id: string, status: TimelineStep["status"]) => {
		setTimelineSteps((prev) =>
			prev.map((s) => (s.id === id ? { ...s, status } : s)),
		);
	};

	// Run the code
	const runTest = async (attemptId: 1 | 2) => {
		if (state.remainingTrials <= 0 || !teamName) return;

		setIsRunning(true);
		setShowTimeline(true);

		// Reset Timeline
		const initialSteps: TimelineStep[] = [
			{
				id: "init",
				label: "Initializing Environment",
				status: "loading",
			},
			{ id: "server", label: "Processing Strategy", status: "pending" },
			{ id: "finalize", label: "Finalizing Results", status: "pending" },
		];
		setTimelineSteps(initialSteps);

		try {
			const currentAttempt = state.attempts[attemptId];
			const hasCode = !!currentAttempt.code?.trim();

			const payload: DraftSubmission = {
				team_name: teamName,
				draft_id: attemptId === 1 ? "draft_1" : "draft_2",
				strategy_name: currentAttempt.strategyName,
				strategy_code: hasCode ? currentAttempt.code : undefined,
				strategy_desc: hasCode
					? undefined
					: currentAttempt.strategyDesc,
			};

			const result = await challengeApi.runSimulation(
				payload,
				(stage) => {
					if (stage.includes("Processing")) {
						updateStepStatus("init", "success");
						updateStepStatus("server", "loading");
					} else if (stage.includes("Finalizing")) {
						updateStepStatus("server", "success");
						updateStepStatus("finalize", "loading");
					}
				},
			);

			// Success
			updateStepStatus("finalize", "success");

			// Auto-close dialog after short delay on success
			setTimeout(() => {
				setShowTimeline(false);
			}, 1500);

			setState((prev) => {
				const nextState = { ...prev };

				// Save result
				nextState.attempts[attemptId].executionResult = result;
				nextState.attempts[attemptId].status = "COMPLETED";
				if (prev.remainingTrials > 0) nextState.remainingTrials -= 1;

				// Unlock Attempt 2 if Attempt 1 is done
				if (
					attemptId === 1 &&
					nextState.attempts[2].status === "LOCKED"
				) {
					nextState.attempts[2].status = "ACTIVE";
				}

				return nextState;
			});
		} catch (e: any) {
			console.error(e);
			// Mark current step as error
			setTimelineSteps((prev) =>
				prev.map((s) =>
					s.status === "loading" ? { ...s, status: "error" } : s,
				),
			);

			// Add error step
			setTimelineSteps((prev) => [
				...prev,
				{ id: "error", label: `Error: ${e.message}`, status: "error" },
			]);
		} finally {
			setIsRunning(false);
		}
	};

	const lockSelection = async (attemptId: 1 | 2) => {
		if (!teamName) return;
		setIsLocking(true);
		setShowTimeline(true);

		// Initialize Timeline for Locking
		setTimelineSteps([
			{
				id: "lock_init",
				label: "Verifying Integrity",
				status: "loading",
			},
			{
				id: "lock_server",
				label: "Finalizing Submission",
				status: "pending",
			},
		]);

		try {
			const payload: LockSelectionRequest = {
				team_name: teamName,
				draft_id: attemptId === 1 ? "draft_1" : "draft_2",
			};

			// Artificial delay for UX (so specific steps are visible)
			await new Promise((resolve) => setTimeout(resolve, 800));
			updateStepStatus("lock_init", "success");
			updateStepStatus("lock_server", "loading");

			await challengeApi.lockSelection(payload);

			updateStepStatus("lock_server", "success");
			setState((prev) => ({ ...prev, isSubmissionLocked: true }));

			// Auto-close
			setTimeout(() => {
				setShowTimeline(false);
			}, 1500);
		} catch (e: any) {
			console.error("Locking failed", e);
			setTimelineSteps((prev) =>
				prev.map((s) => ({
					...s,
					status: s.status === "loading" ? "error" : s.status,
				})),
			);
			setTimelineSteps((prev) => [
				...prev,
				{
					id: "error",
					label: `Lock Failed: ${e.message}`,
					status: "error",
				},
			]);
		} finally {
			setIsLocking(false);
		}
	};

	return {
		attempts: state.attempts,
		remainingTrials: state.remainingTrials,
		isSubmissionLocked: state.isSubmissionLocked,
		isRunning,
		isLocking,
		timelineSteps,
		showTimeline,
		setShowTimeline,
		updateAttempt,
		runTest,
		lockSelection,
		setAttempts,
		setSubmissionLocked,
	};
}
