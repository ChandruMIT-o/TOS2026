import * as React from "react";
import { useLoading } from "../../context/LoadingContext";
import { Home, Users } from "lucide-react"; // Added Home and Users icons
import { AttemptTabs } from "../components/challenge/controls/AttemptTabs";
import { ChallengeLayout } from "../components/challenge/layout/ChallengeLayout";
import { SubmissionDashboard } from "../components/challenge/submission/SubmissionDashboard";
import { useAttemptLogic } from "../hooks/useAttemptLogic";
import { useChallengeData } from "../hooks/useChallengeData";
import Dither from "./Dither";

export default function ChallengePage() {
	const { setPageLoaded } = useLoading();

	React.useEffect(() => {
		setPageLoaded(true);
	}, [setPageLoaded]);

	// 1. Logic Hooks
	const { attempts, isRunning, runTest, updateAttempt } = useAttemptLogic();
	const { leaderboard } = useChallengeData();

	// 2. Local UI State
	const [activeTab, setActiveTab] = React.useState("attempt-1");

	// 3. Helper to get current active attempt data
	const currentAttemptId = activeTab === "attempt-2" ? 2 : 1;
	const currentAttemptData = attempts[currentAttemptId as 1 | 2];

	// Navigation Handler
	const handleGoHome = () => {
		window.location.href = "/";
	};

	// 4. Render Logic
	const renderContent = () => {
		if (activeTab === "submission") {
			return (
				<div className="flex-1 overflow-hidden pt-8">
					<SubmissionDashboard />
				</div>
			);
		}

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
				{/* Dither only for submission tab */}
				{activeTab === "submission" && (
					<Dither
						waveColor={[0.6, 0.4, 0.1]}
						disableAnimation={false}
						enableMouseInteraction={true}
						mouseRadius={0.3}
						colorNum={27.4}
						waveAmplitude={0.1}
						waveFrequency={3}
						waveSpeed={0.05}
					/>
				)}
			</div>

			{/* Top Navigation Bar - Updated */}
			{/* Fixed height, no hover expansion, persistent details */}
			<div className="w-full bg-slate-200 text-black border-b border-black z-50 h-[64px] shadow-lg relative">
				<div className="grid grid-cols-[280px_1fr_280px] divide-x divide-black h-full">
					{/* 1. LEFT: EXIT + IDENTITY */}
					<div className="flex items-center h-full px-4 gap-4 bg-slate-200">
						{/* Root Page Button */}
						<button
							onClick={handleGoHome}
							className="flex items-center justify-center h-10 w-10 border border-black hover:bg-black hover:text-white transition-colors flex-shrink-0"
							title="Return to Root"
						>
							<Home size={18} />
						</button>

						{/* Branding Info */}
						<div className="flex flex-col justify-center">
							<span className="font-mono text-[10px] uppercase opacity-60 leading-tight">
								Simulation_ID
							</span>
							<div className="flex items-baseline gap-2">
								<span className="font-black uppercase tracking-tighter text-xl leading-none">
									ToS
								</span>
								<span className="font-bold font-mono text-sm uppercase tracking-tight opacity-100">
									Edition 4
								</span>
							</div>
						</div>
					</div>

					{/* 2. CENTER: TABS */}
					<div className="relative flex items-center justify-center bg-slate-200 px-4 h-full">
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

					{/* 3. RIGHT: TEAM + SYSTEM INFO */}
					<div className="flex items-center justify-between h-full px-4 bg-slate-200">
						{/* Team Name Display */}
						<div className="flex flex-col">
							<span className="font-mono text-[10px] uppercase opacity-60 leading-tight flex items-center gap-1">
								<Users size={10} /> Team Name
							</span>
							<span className="font-bold text-lg tracking-tight leading-none truncate max-w-[120px]">
								Null_Ptr
							</span>
						</div>

						{/* System Status */}
						<div className="flex flex-col items-end leading-none">
							<span className="font-mono text-[10px] uppercase opacity-60 mb-1">
								v2.4.RC
							</span>
							<div className="flex items-center gap-1.5 border border-black px-2 py-1 bg-white/50">
								<span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
								<span className="text-[10px] font-bold uppercase tracking-wider">
									Online
								</span>
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
