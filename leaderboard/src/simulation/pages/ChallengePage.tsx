import * as React from "react";
import { useLoading } from "../../context/LoadingContext";
import { Users, Lock, Birdhouse } from "lucide-react";
import { AttemptTabs } from "../components/challenge/controls/AttemptTabs";
import { ChallengeLayout } from "../components/challenge/layout/ChallengeLayout";
import { SubmissionDashboard } from "../components/challenge/submission/SubmissionDashboard";
import { useAttemptLogic } from "../hooks/useAttemptLogic";
import { useChallengeData } from "../hooks/useChallengeData";
import Dither from "./Dither";
import type { LeaderboardEntry } from "../types/challenge";
import { ValidationTimeline } from "../components/ValidationTimeline";
import { Dialog, DialogHeader, DialogTitle } from "../components/ui/Dialog";
import { useNavigate } from "react-router-dom";

// Auth & Database
import { auth } from "../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getTeamByMemberUid } from "../../database/api/Invitation";
import { challengeApi } from "../services/challengeApi";
import { simulationTheme, setSimulationTheme, onThemeChange } from "../theme";
import ThemeSwitch from "../components/ui/themeToggle";

export default function ChallengePage() {
	const { setPageLoaded } = useLoading();

	// --- 1. Auth & Team State ---
	const [teamName, setTeamName] = React.useState<string | null>(null);
	const [isAuthLoading, setIsAuthLoading] = React.useState(true);
	const navigate = useNavigate();

	// --- 2. Logic Hooks ---
	// We pass teamName to the hook so it can use it for API calls
	const {
		attempts,
		isRunning,
		timelineSteps,
		showTimeline,
		setShowTimeline,
		updateAttempt,
		runTest,
		setAttempts,
		setSubmissionLocked,
		isSubmissionLocked,
		lockSelection,
		isLocking,
	} = useAttemptLogic(teamName);

	const { leaderboard } = useChallengeData();

	// --- 3. Local UI State ---
	const [activeTab, setActiveTab] = React.useState("attempt-1");
	const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

	// --- 4. Initialization Effects ---
	React.useEffect(() => {
		setPageLoaded(true);
	}, [setPageLoaded]);

	// Fetch Auth & Team
	React.useEffect(() => {
		const unsubTheme = onThemeChange(() => {
			// Trigger a re-render
			forceUpdate();
		});
		return () => unsubTheme();
	}, []);

	React.useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (user) {
				try {
					const team = await getTeamByMemberUid(user.uid);
					if (team) {
						setTeamName(team.team_name);
					} else {
						console.warn("User is not in a team!");
					}
				} catch (e) {
					console.error("Failed to fetch team", e);
				}
			}
			setIsAuthLoading(false);
		});
		return () => unsubscribe();
	}, []);

	// Sync with Backend (Real-time or One-off)
	React.useEffect(() => {
		if (!teamName) return;

		// Subscribe to team data updates
		const unsubscribe = challengeApi.subscribeToTeamData(
			teamName,
			(data) => {
				if (data) {
					// Update Locked State
					if (data.finalized_strategy) {
						setSubmissionLocked(true);
					}

					// Update Attempts from DB (if they exist)
					// This ensures if I refresh, I get my code back (if saved in DB)
					// Note: runTest saves draft to DB.
					const newAttempts = { ...attempts };
					let changed = false;

					if (data.drafts?.draft_1) {
						// Merge draft 1
						const d1 = data.drafts.draft_1;
						const result1 =
							d1.tournament_result?.[d1.strategy_name];
						// Reuse the logic from challengeApi to parse leaderboard if needed,
						// but here we might need to rely on what was saved or re-fetch.
						// Since we don't save the full leaderboard in the 'draft' object in Firestore (usually),
						// we might only have the user's result.
						// HOWEVER, if the user wants to see the full leaderboard from a past run, we need to ensure
						// the backend saves it or we fetch it.
						// Current backend `submit_draft` saves `tournament_result` which is the dict of all results.
						// So we CAN parse it here.

						const fullLeaderboard1: LeaderboardEntry[] = result1
							? Object.entries(d1.tournament_result)
									.map(
										([stratName, stats]: [
											string,
											any,
										]) => ({
											rank: stats.rank,
											strategy: stratName,
											points: stats.points,
											wins: stats.wins,
											draws: stats.draws,
											losses: stats.losses,
											total_nodes: stats.total_nodes,
											matches: 50,
											isPlayer:
												stratName === d1.strategy_name,
										}),
									)
									.sort((a, b) => a.rank - b.rank)
							: [];

						newAttempts[1] = {
							...newAttempts[1],
							code: d1.code || newAttempts[1].code,
							strategyDesc:
								d1.strategy_desc || newAttempts[1].strategyDesc,
							strategyName:
								d1.strategy_name || newAttempts[1].strategyName,
							status: d1.tournament_result
								? "COMPLETED"
								: "ACTIVE",
							// Restore results if needed, though simpler to just show "COMPLETED"
							executionResult: d1.tournament_result
								? {
										score: result1?.points || 0,
										wins: result1?.wins || 0,
										draws: result1?.draws || 0,
										losses: result1?.losses || 0,
										total_nodes: result1?.total_nodes || 0,
										rank: result1?.rank || 0,
										logs: `[RESTORED] Previous Run Statistics Loaded.`,
										validationStatus: "AI_VALIDATED", // Assume valid if saved
										executionTime: "N/A",
										fullLeaderboard: fullLeaderboard1,
									}
								: undefined,
						};
						changed = true;
					}

					if (data.drafts?.draft_2) {
						const d2 = data.drafts.draft_2;
						const result2 =
							d2.tournament_result?.[d2.strategy_name];

						const fullLeaderboard2: LeaderboardEntry[] = result2
							? Object.entries(d2.tournament_result)
									.map(
										([stratName, stats]: [
											string,
											any,
										]) => ({
											rank: stats.rank,
											strategy: stratName,
											points: stats.points,
											wins: stats.wins,
											draws: stats.draws,
											losses: stats.losses,
											total_nodes: stats.total_nodes,
											matches: 50,
											isPlayer:
												stratName === d2.strategy_name,
										}),
									)
									.sort((a, b) => a.rank - b.rank)
							: [];

						newAttempts[2] = {
							...newAttempts[2],
							code: d2.code || newAttempts[2].code,
							strategyDesc:
								d2.strategy_desc || newAttempts[2].strategyDesc,
							strategyName:
								d2.strategy_name || newAttempts[2].strategyName,
							status: d2.tournament_result
								? "COMPLETED"
								: "ACTIVE",
							executionResult: d2.tournament_result
								? {
										score: result2?.points || 0,
										wins: result2?.wins || 0,
										draws: result2?.draws || 0,
										losses: result2?.losses || 0,
										total_nodes: result2?.total_nodes || 0,
										rank: result2?.rank || 0,
										logs: `[RESTORED] Previous Run Statistics Loaded.`,
										validationStatus: "AI_VALIDATED",
										executionTime: "N/A",
										fullLeaderboard: fullLeaderboard2,
									}
								: undefined,
						};
						changed = true;
					}

					// Logic: Unlock Attempt 2 if Attempt 1 has a draft (or result)
					if (
						data.drafts?.draft_1 &&
						newAttempts[2].status === "LOCKED"
					) {
						newAttempts[2].status = "ACTIVE";
						changed = true;
					}

					if (changed) {
						setAttempts(newAttempts);
					}
				}
			},
		);

		return () => unsubscribe();
	}, [teamName]); // Depends on teamName

	// --- 5. Handlers ---
	const handleGoHome = () => {
		window.location.href = "/";
	};

	const currentAttemptId = activeTab === "attempt-2" ? 2 : 1;
	// Cast safely because we know ID is 1 or 2
	const currentAttemptData = attempts[currentAttemptId as 1 | 2];

	// --- 6. Render ---
	if (isAuthLoading) {
		return (
			<div
				className={`flex h-screen items-center justify-center ${simulationTheme.colors.bg.loading} ${simulationTheme.colors.text.accent} font-mono animate-pulse`}
			>
				INITIALIZING UPLINK...
			</div>
		);
	}

	const renderContent = () => {
		if (activeTab === "submission") {
			return (
				<div className="flex-1 overflow-hidden pt-8">
					<SubmissionDashboard
						attempts={attempts}
						onLock={lockSelection}
						isLocking={isLocking}
					/>
					{/* 
						Note: SubmissionDashboard is currently strictly visual/mock driven in the codebase provided.
						Future work would pass `attempts` and `isSubmissionLocked` to it to make it functional.
						For now, we adhere to the strict scope of integrating "functions" and "ChallengePage".
					*/}
					{isSubmissionLocked && (
						<div
							className={`absolute inset-0 ${simulationTheme.colors.bg.overlay} flex items-center justify-center z-50 backdrop-blur-sm`}
						>
							<div
								className={`${simulationTheme.colors.bg.modal} border ${simulationTheme.colors.border.accent} p-8 max-w-md text-center`}
							>
								<Lock
									className={`w-12 h-12 ${simulationTheme.colors.text.accent} mx-auto mb-4`}
								/>
								<h3
									className={`text-2xl font-bold ${simulationTheme.colors.text.title} mb-2 uppercase tracking-widest`}
								>
									System Locked
								</h3>
								<p
									className={`${simulationTheme.colors.text.secondary} font-mono text-sm`}
								>
									Strategy has been finalized. No further
									changes allowed. (Roughly takes 1 minute to
									update Leaderboard)
								</p>
								<button
									onClick={() => navigate("/#leaderboard")}
									className={`
										mt-4
										px-6 py-1
										text-lg font-extrabold uppercase tracking-wider
										${simulationTheme.colors.bg.buttonPrimary} ${simulationTheme.colors.text.primary}
										border-4 ${simulationTheme.colors.border.button}
										${simulationTheme.colors.shadow.button}
										active:${simulationTheme.colors.shadow.buttonActive}
										active:translate-x-[4px]
										active:translate-y-[4px]
										hover:${simulationTheme.colors.shadow.buttonHover}
										hover:translate-x-[4px]
										hover:translate-y-[4px]
										transition-all
										${simulationTheme.colors.bg.buttonHover}
										select-none
									`}
								>
									Leaderboard
								</button>
							</div>
						</div>
					)}
				</div>
			);
		}

		return (
			<ChallengeLayout
				// Data Passing
				strategyName={currentAttemptData.strategyName}
				setStrategyName={(val) =>
					updateAttempt(
						currentAttemptId as 1 | 2,
						"strategyName",
						val,
					)
				}
				strategyCode={currentAttemptData.code}
				setStrategyCode={(val) =>
					updateAttempt(currentAttemptId as 1 | 2, "code", val)
				}
				strategyDesc={currentAttemptData.strategyDesc}
				setStrategyDesc={(val) =>
					updateAttempt(
						currentAttemptId as 1 | 2,
						"strategyDesc",
						val,
					)
				}
				isLocked={
					currentAttemptData.status === "LOCKED" ||
					currentAttemptData.status === "COMPLETED" ||
					isSubmissionLocked
				}
				// Execution Data
				logs={currentAttemptData.executionResult?.logs}
				validationStatus={
					currentAttemptData.executionResult?.validationStatus
				}
				// Actions
				onRunTest={() => runTest(currentAttemptId as 1 | 2)}
				isRunning={isRunning}
				// Context
				leaderboard={
					currentAttemptData.executionResult?.fullLeaderboard ||
					leaderboard
				}
			/>
		);
	};

	return (
		<div
			className={`flex flex-col h-screen ${simulationTheme.colors.bg.main} ${simulationTheme.colors.text.main} overflow-hidden font-sans ${simulationTheme.colors.selection}`}
		>
			{/* Timeline Dialog */}
			<Dialog open={showTimeline} onOpenChange={setShowTimeline}>
				<DialogHeader>
					<DialogTitle className="text-xl font-bold uppercase tracking-widest flex items-center gap-2">
						Running Simulation ~ 1-2 Mins
					</DialogTitle>
				</DialogHeader>
				<div className="py-4">
					<ValidationTimeline steps={timelineSteps} />
				</div>
			</Dialog>

			<div className="absolute inset-0 w-full h-full z-0">
				{/* Dither only for submission tab */}
				{activeTab === "submission" && (
					<Dither
						waveColor={simulationTheme.colors.dither.waveColor}
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
			<div
				className={`w-full ${simulationTheme.colors.bg.nav} ${simulationTheme.colors.text.primary} border-b ${simulationTheme.colors.border.main} z-50 h-[64px] shadow-lg relative`}
			>
				<div className="grid grid-cols-[280px_1fr_280px] divide-x divide-black h-full">
					{/* 1. LEFT: EXIT + IDENTITY */}
					<div
						className={`flex items-center h-full px-4 gap-4 ${simulationTheme.colors.bg.nav}`}
					>
						<button
							onClick={handleGoHome}
							className={`flex items-center justify-center h-10 w-10 border ${simulationTheme.colors.border.main} ${simulationTheme.colors.bg.navBtnHover} ${simulationTheme.colors.text.navBtnHover} transition-colors flex-shrink-0`}
							title="Return to Root"
						>
							<Birdhouse className="w-6 h-6" />
						</button>

						<div className="flex flex-col justify-center">
							<span className="font-black uppercase tracking-tighter text-xl leading-none">
								ToS
							</span>
							<span className="font-bold font-mono text-sm uppercase tracking-tight opacity-100">
								Edition_4
							</span>
						</div>

						{/* Theme Toggle */}
						<div className="self-center w-full flex justify-end">
							<ThemeSwitch
								checked={
									simulationTheme.colors.bg.main ===
									"bg-zinc-950"
								} // simple dark mode check
								onChange={(checked) =>
									setSimulationTheme(checked)
								}
							/>
						</div>
					</div>

					{/* 2. CENTER: TABS */}
					<div
						className={`relative flex items-center justify-center ${simulationTheme.colors.bg.nav} px-4 h-full`}
					>
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
					<div
						className={`flex items-center justify-between h-full px-4 ${simulationTheme.colors.bg.nav}`}
					>
						{/* Team Name Display */}
						<div className="flex flex-col">
							<span className="font-mono text-[10px] uppercase opacity-60 leading-tight flex items-center gap-1">
								<Users size={10} /> Team Name
							</span>
							<span className="font-bold text-lg tracking-tight leading-none truncate max-w-[120px]">
								{teamName || "NO TEAM"}
							</span>
						</div>

						{/* System Status */}
						<div className="flex flex-col items-end leading-none">
							<span className="font-mono text-[10px] uppercase opacity-60 mb-1">
								v2.4.RC
							</span>
							<div
								className={`flex items-center gap-1.5 border ${simulationTheme.colors.border.main} px-2 py-1 ${simulationTheme.colors.bg.statusBadge}`}
							>
								<span
									className={`w-1.5 h-1.5 ${simulationTheme.colors.status.online} rounded-full animate-pulse`}
								/>
								<span className="text-[10px] font-bold uppercase tracking-wider">
									Online
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<main className="flex-1 flex overflow-hidden relative h-full">
				{renderContent()}
			</main>
		</div>
	);
}
