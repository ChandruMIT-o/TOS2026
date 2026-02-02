import * as React from "react";
import { Play } from "lucide-react";
import { Button } from "../../ui/Button";

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
import { cn } from "../../../../lib/utils";

interface ChallengeLayoutProps {
	strategyName: string;
	setStrategyName: (val: string) => void;
	strategyCode: string;
	setStrategyCode: (val: string) => void;
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
	logs, // Unused in this file but passed? No, need to pass to CodePreview?
	validationStatus, // Need to pass to CodePreview?
	onRunTest,
	isRunning,
	leaderboard,
}: ChallengeLayoutProps) {
	// --- State for Panels (Collapsed/Expanded logic) ---
	// null = both share space (default)
	// 'top' = top is collapsed, bottom is expanded
	// 'bottom' = bottom is collapsed, top is expanded
	const [leftCollapsed, setLeftCollapsed] = React.useState<
		"top" | "bottom" | null
	>(null);
	const [rightCollapsed, setRightCollapsed] = React.useState<
		"top" | "bottom" | null
	>(null);

	// --- State for Test Run Modal ---
	const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);

	// --- Handlers ---
	const toggleLeftTop = () =>
		setLeftCollapsed((prev) => (prev === "top" ? null : "top"));
	const toggleLeftBottom = () =>
		setLeftCollapsed((prev) => (prev === "bottom" ? null : "bottom"));

	const toggleRightTop = () =>
		setRightCollapsed((prev) => (prev === "top" ? null : "top"));
	const toggleRightBottom = () =>
		setRightCollapsed((prev) => (prev === "bottom" ? null : "bottom"));

	const handleTestRun = () => {
		setIsConfirmOpen(true);
	};

	const confirmRun = () => {
		setIsConfirmOpen(false);
		onRunTest();
	};

	return (
		<div className="flex h-[calc(100vh-100px)] w-full gap-4 p-4">
			{/* --- LEFT COLUMN --- */}
			<div className="flex-1 flex flex-col gap-4 min-w-0">
				<RuleBook
					isCollapsed={leftCollapsed === "top"}
					onToggle={toggleLeftTop}
				/>
				<StrategyEditor
					isCollapsed={leftCollapsed === "bottom"}
					onToggle={toggleLeftBottom}
					strategyName={strategyName}
					setStrategyName={setStrategyName}
					strategyCode={strategyCode}
					setStrategyCode={setStrategyCode}
				/>
			</div>

			{/* --- CENTER CONTROL --- */}
			<div className="flex flex-col items-center justify-center">
				<div className="h-full w-[1px] bg-border/50 absolute z-0 pointer-events-none" />
				<div className="relative z-10">
					<Button
						onClick={handleTestRun}
						size="icon"
						disabled={isRunning}
						className={cn(
							"h-14 w-14 rounded-full shadow-[0_0_20px_rgba(var(--primary),0.3)] border-4 border-background",
							isRunning && "animate-pulse",
						)}
					>
						<Play fill="currentColor" className="ml-1" />
					</Button>
					<div className="mt-2 text-[10px] text-center font-mono text-muted-foreground uppercase tracking-wider bg-background px-1">
						{isRunning ? "Running..." : "Test Run"}
					</div>
				</div>
			</div>

			{/* --- RIGHT COLUMN --- */}
			<div className="flex-1 flex flex-col gap-4 min-w-0">
				<Leaderboard
					isCollapsed={rightCollapsed === "top"}
					onToggle={toggleRightTop}
					entries={leaderboard}
				/>
				<CodePreview
					isCollapsed={rightCollapsed === "bottom"}
					onToggle={toggleRightBottom}
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
							variant="ghost"
							onClick={() => setIsConfirmOpen(false)}
						>
							Cancel
						</Button>
						<Button onClick={confirmRun}>Confirm & Run</Button>
					</div>
				</DialogFooter>
			</Dialog>
		</div>
	);
}
