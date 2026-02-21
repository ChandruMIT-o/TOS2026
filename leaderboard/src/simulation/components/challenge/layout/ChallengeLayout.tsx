import * as React from "react";
import { Button } from "../../ui/Button";
import { TestRunButton } from "../controls/TestRunButton";

// Import Panels
import { RuleBook } from "../panels/RuleBook";
import { StrategyEditor } from "../panels/StrategyEditor";
import { Leaderboard } from "../panels/Leaderboard";
import { CodePreview } from "../panels/CodePreview";
import {
	Dialog,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "../../ui/Dialog";

import type {
	LeaderboardEntry,
	ValidationStatus,
} from "../../../types/challenge";

interface ChallengeLayoutProps {
	strategyName: string;
	setStrategyName: (val: string) => void;
	strategyCode: string; // The code
	setStrategyCode: (val: string) => void;
	strategyDesc: string; // The markdown/prompt
	setStrategyDesc: (val: string) => void;
	isLocked: boolean;
	logs?: string;
	validationStatus?: ValidationStatus;
	onRunTest: () => void;
	isRunning: boolean;
	leaderboard: LeaderboardEntry[];
}

export function ChallengeLayout({
	strategyName,
	setStrategyName,
	strategyCode,
	setStrategyCode,
	strategyDesc,
	setStrategyDesc,
	isLocked,
	logs, // Unused in this file but passed? No, need to pass to CodePreview?
	validationStatus, // Need to pass to CodePreview?
	onRunTest,
	isRunning,
	leaderboard,
}: ChallengeLayoutProps) {
	// --- State for Panels (Collapsed/Expanded logic) ---
	// "rulebook" | "strategy" - Only one expanded at a time
	const [activeLeftPanel, setActiveLeftPanel] = React.useState<
		"rulebook" | "strategy"
	>("strategy");

	// "leaderboard" | "code" - Only one expanded at a time
	const [activeRightPanel, setActiveRightPanel] = React.useState<
		"leaderboard" | "code"
	>("code");

	// --- State for Test Run Modal ---
	const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
	const [validationAlertOpen, setValidationAlertOpen] = React.useState(false);

	// --- Handlers ---
	const toggleLeftRuleBook = () =>
		setActiveLeftPanel((prev) =>
			prev === "rulebook" ? "strategy" : "rulebook",
		);
	const toggleLeftStrategy = () =>
		setActiveLeftPanel((prev) =>
			prev === "strategy" ? "rulebook" : "strategy",
		);

	const toggleRightLeaderboard = () =>
		setActiveRightPanel((prev) =>
			prev === "leaderboard" ? "code" : "leaderboard",
		);
	const toggleRightCode = () =>
		setActiveRightPanel((prev) =>
			prev === "code" ? "leaderboard" : "code",
		);

	const handleTestRun = () => {
		if (
			!strategyName?.trim() ||
			(!strategyCode?.trim() && !strategyDesc?.trim())
		) {
			setValidationAlertOpen(true);
			return;
		}
		setIsConfirmOpen(true);
	};

	const confirmRun = () => {
		setIsConfirmOpen(false);
		onRunTest();
	};

	return (
		<div className="flex flex-col md:flex-row h-full w-full overflow-y-auto overflow-x-hidden md:overflow-hidden">
			{/* --- LEFT COLUMN --- */}
			<div className="flex-none md:flex-1 flex flex-col min-w-0 min-h-0 h-max md:h-full pb-4 md:pb-0">
				<RuleBook
					isCollapsed={activeLeftPanel !== "rulebook"}
					onToggle={toggleLeftRuleBook}
				/>
				<StrategyEditor
					isCollapsed={activeLeftPanel !== "strategy"}
					onToggle={toggleLeftStrategy}
					strategyName={strategyName}
					setStrategyName={setStrategyName}
					strategyCode={strategyCode}
					setStrategyCode={setStrategyCode}
					strategyDesc={strategyDesc}
					setStrategyDesc={setStrategyDesc}
					isLocked={isLocked}
				/>
			</div>

			{/* --- CENTER CONTROL --- */}
			<div className="flex flex-col items-center justify-center relative shrink-0 gap-4 py-4 md:py-0">
				<div className="relative z-10">
					<TestRunButton
						onRun={handleTestRun}
						disabled={
							// 1. System/Lock State
							isLocked ||
							isRunning ||
							// 2. Execution State
							validationStatus === "PENDING" ||
							validationStatus === "AI_VALIDATED" ||
							validationStatus === "HUMAN_VERIFIED" ||
							validationStatus === "FLAGGED"
						}
						// Actually, disabled if isRunning.
						// Also if locked?
						// The requirements say "make the whole attempt 1 page only viewable if draft_1 is present".
						// So if status is COMPLETED, maybe they can re-run? "If something fails, players can rerun that attempt."
						// So only disable if running.
					/>
				</div>
			</div>

			{/* --- RIGHT COLUMN --- */}
			<div className="flex-none md:flex-1 flex flex-col min-w-0 min-h-0 h-max md:h-full pb-8 md:pb-0">
				<Leaderboard
					isCollapsed={activeRightPanel !== "leaderboard"}
					onToggle={toggleRightLeaderboard}
					entries={leaderboard}
				/>
				<CodePreview
					isCollapsed={activeRightPanel !== "code"}
					onToggle={toggleRightCode}
					isValidatedByAI={validationStatus === "AI_VALIDATED"}
					logs={logs}
				/>
			</div>

			{/* --- CONFIRMATION DIALOG --- */}
			<Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
				<DialogHeader>
					<DialogTitle>Initiate Simulation?</DialogTitle>
					<DialogDescription>
						You have <strong>1 attempt left</strong>. Running this
						simulation will consume a trial token.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<div className="flex w-full gap-2 justify-end mt-4">
						<Button
							variant="outline"
							className="rounded-none border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white font-mono uppercase text-xs"
							onClick={() => setIsConfirmOpen(false)}
						>
							Cancel
						</Button>
						<Button
							onClick={confirmRun}
							variant="glow"
							className="rounded-none"
						>
							Confirm & Run
						</Button>
					</div>
				</DialogFooter>
			</Dialog>

			{/* --- VALIDATION ERROR DIALOG --- */}
			<Dialog
				open={validationAlertOpen}
				onOpenChange={setValidationAlertOpen}
			>
				<DialogHeader>
					<DialogTitle className="text-red-500">
						Missing Information
					</DialogTitle>
					<DialogDescription>
						Please fill in all the required fields. You must provide
						a valid <strong>Strategy Name</strong> and either write{" "}
						<strong>Code</strong> or provide a{" "}
						<strong>Prompt</strong> before running the simulation.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<div className="flex w-full gap-2 justify-end mt-4">
						<Button
							onClick={() => setValidationAlertOpen(false)}
							variant="outline"
							className="rounded-none text-zinc-300 font-mono uppercase text-xs"
						>
							Understood
						</Button>
					</div>
				</DialogFooter>
			</Dialog>
		</div>
	);
}
