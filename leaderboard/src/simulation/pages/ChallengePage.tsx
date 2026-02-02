import * as React from "react";
import { AttemptTabs } from "../components/challenge/controls/AttemptTabs";
import { ChallengeLayout } from "../components/challenge/layout/ChallengeLayout";
import { SubmissionDashboard } from "../components/challenge/submission/SubmissionDashboard";
import { useAttemptLogic } from "../hooks/useAttemptLogic";
import { useChallengeData } from "../hooks/useChallengeData";

export default function ChallengePage() {
	// 1. Logic Hooks
	const { attempts, isRunning, runTest, updateAttempt } = useAttemptLogic();
	const { leaderboard } = useChallengeData();

	// 2. Local UI State
	const [activeTab, setActiveTab] = React.useState("attempt-1");

	// 3. Helper to get current active attempt data
	const currentAttemptId = activeTab === "attempt-2" ? 2 : 1;
	const currentAttemptData = attempts[currentAttemptId as 1 | 2];

	// 4. Render Logic
	const renderContent = () => {
		if (activeTab === "submission") {
			return (
				<div className="flex-1 overflow-hidden pt-8">
					<SubmissionDashboard />
				</div>
			);
		}

		// We pass the specific data for the current active attempt to the Layout
		// Note: You will need to slightly update ChallengeLayout to accept props instead of using local state
		// See note below code block.
		return (
			<ChallengeLayout
				// Data Passing
				strategyName={currentAttemptData.strategyName}
				setStrategyName={(val) =>
					updateAttempt(currentAttemptId, "strategyName", val)
				}
				strategyCode={currentAttemptData.code}
				setStrategyCode={(val) =>
					updateAttempt(currentAttemptId, "code", val)
				}
				// Execution Data
				logs={currentAttemptData.executionResult?.logs}
				validationStatus={
					currentAttemptData.executionResult?.validationStatus
				}
				// Actions
				onRunTest={() => runTest(currentAttemptId)}
				isRunning={isRunning}
				// Context
				leaderboard={leaderboard}
			/>
		);
	};

	return (
		<div className="flex flex-col h-screen bg-background text-foreground overflow-hidden font-sans selection:bg-emerald-500/30">
			{/* Top Navigation Bar */}
			<div className="h-14 border-b border-border flex items-center justify-between px-6 bg-card/50 backdrop-blur-md z-50">
				<div className="flex items-center gap-4">
					<div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]" />
					<h1 className="font-bold tracking-widest uppercase text-sm">
						AlgoArena{" "}
						<span className="text-muted-foreground">
							// Protocol 7
						</span>
					</h1>
				</div>

				{/* Central Tabs */}
				<div className="w-[400px]">
					<AttemptTabs
						activeTab={activeTab}
						onTabChange={setActiveTab}
						isAttempt2Locked={attempts[2].status === "LOCKED"}
					/>
				</div>

				<div className="text-xs font-mono text-muted-foreground">
					v2.4.0-RC
				</div>
			</div>

			{/* Main Workspace */}
			<main className="flex-1 flex overflow-hidden relative">
				{/* Background Grid Pattern */}
				<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] -z-10" />

				{renderContent()}
			</main>
		</div>
	);
}
