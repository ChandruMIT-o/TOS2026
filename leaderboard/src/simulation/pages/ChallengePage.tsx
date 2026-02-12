import * as React from "react";
import { ArrowUpRight } from "lucide-react";
import { AttemptTabs } from "../components/challenge/controls/AttemptTabs";
import { ChallengeLayout } from "../components/challenge/layout/ChallengeLayout";
import { SubmissionDashboard } from "../components/challenge/submission/SubmissionDashboard";
import { useAttemptLogic } from "../hooks/useAttemptLogic";
import { useChallengeData } from "../hooks/useChallengeData";
import Dither from "./Dither";

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
			<div className="absolute inset-0 w-full h-full z-0">
				<Dither
					waveColor={
						activeTab === "attempt-2"
							? [0.1, 0.4, 0.5] // Deep teal for attempt-2
							: activeTab === "submission"
								? [0.6, 0.4, 0.1] // Gold/amber for submission
								: [0.5, 0.5, 0.5] // Silver/grey for attempt-1
					}
					disableAnimation={false}
					enableMouseInteraction={false}
					mouseRadius={0.3}
					colorNum={27.4}
					waveAmplitude={0.1}
					waveFrequency={3}
					waveSpeed={0.03}
				/>
			</div>
			{/* Top Navigation Bar - Brutalist Style */}
			<div className="group/nav w-full bg-slate-200 text-black border-b border-black z-50 transition-[height] duration-500 ease-in-out h-[60px] hover:h-[100px] overflow-hidden relative shadow-lg">
				<div className="grid grid-cols-1 md:grid-cols-[200px_1fr_200px] divide-y md:divide-y-0 md:divide-x divide-black h-full">
					{/* 1. IDENTITY */}
					<div className="group/item relative p-4 flex flex-col justify-center group-hover/nav:justify-between hover:bg-black hover:text-white transition-colors duration-300 cursor-default h-full">
						<div className="absolute top-3 right-3 opacity-0 group-hover/item:opacity-100 transition-opacity">
							<ArrowUpRight size={16} />
						</div>
						<span className="font-mono text-[10px] uppercase opacity-0 group-hover/nav:opacity-60 group-hover/item:opacity-100 transition-opacity delay-100 hidden group-hover/nav:block">
							Simulation_ID
						</span>
						<div className="flex flex-col">
							<span className="font-black uppercase tracking-tighter text-xl leading-none">
								ToS
							</span>
							<span className="font-black uppercase tracking-tighter text-xl leading-none opacity-0 h-0 group-hover/nav:opacity-100 group-hover/nav:h-auto transition-all duration-300 transform translate-y-2 group-hover/nav:translate-y-0">
								Edition 4
							</span>
						</div>
					</div>

					{/* 2. CENTRAL TABS */}
					<div className="relative flex items-center justify-center p-2 bg-slate-200 hover:bg-white/50 transition-colors h-full">
						<div className="w-full max-w-[500px]">
							<AttemptTabs
								activeTab={activeTab}
								onTabChange={setActiveTab}
								isAttempt2Locked={
									attempts[2].status === "LOCKED"
								}
							/>
						</div>
					</div>

					{/* 3. SYSTEM INFO */}
					<div className="group/item relative p-4 flex flex-col justify-center group-hover/nav:justify-between hover:bg-black hover:text-white transition-colors duration-300 cursor-default h-full">
						<span className="font-mono text-[10px] uppercase opacity-0 group-hover/nav:opacity-60 group-hover/item:opacity-100 transition-opacity delay-100 hidden group-hover/nav:block">
							System_Ver
						</span>
						<div className="flex items-center justify-between mt-auto w-full">
							<span className="font-bold font-mono text-xl tracking-tight opacity-0 group-hover/nav:opacity-100 transition-opacity hidden group-hover/nav:block">
								v2.4.RC
							</span>
							<div className="flex flex-col items-end leading-none ml-auto">
								<span className="text-[10px] opacity-50 uppercase hidden group-hover/nav:block">
									Status
								</span>
								<div className="flex items-center gap-1">
									<span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
									<span className="text-xs font-bold uppercase">
										Online
									</span>
								</div>
							</div>
						</div>
					</div>
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
