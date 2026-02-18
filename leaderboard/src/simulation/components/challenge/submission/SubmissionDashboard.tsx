import * as React from "react";
import { AttemptCard, type AttemptStats } from "./AttemptCard";
import { LockInButton } from "./LockInButton";
import {
	Dialog,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "../../ui/Dialog";
import { Button } from "../../ui/Button";
import type { ChallengeState } from "../../../types/challenge";

interface SubmissionDashboardProps {
	attempts: ChallengeState["attempts"];
	onLock: (id: 1 | 2) => void;
	isLocking: boolean;
}

export function SubmissionDashboard({
	attempts,
	onLock,
	isLocking,
}: SubmissionDashboardProps) {
	const [selectedAttemptId, setSelectedAttemptId] = React.useState<
		number | null
	>(null);
	const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);

	// Map attempts to card stats
	const getAttemptStats = (id: 1 | 2): AttemptStats | null => {
		const att = attempts[id];
		if (att.status !== "COMPLETED" || !att.executionResult) return null;

		return {
			id: att.id,
			strategyName: att.strategyName,
			rank: att.executionResult.rank || 0,
			points: att.executionResult.score || 0,
			wins: att.executionResult.wins || 0,
			draws: att.executionResult.draws || 0,
			losses: att.executionResult.losses || 0,
			total_nodes: att.executionResult.total_nodes || 0,
			date: new Date().toLocaleDateString(), // We could store date in AttemptData if needed
		};
	};

	const validAttempts = [getAttemptStats(1), getAttemptStats(2)].filter(
		(a): a is AttemptStats => a !== null,
	);

	const handleLockInClick = () => {
		if (selectedAttemptId) {
			setIsConfirmOpen(true);
		}
	};

	const handleFinalSubmit = () => {
		if (selectedAttemptId) {
			setIsConfirmOpen(false);
			onLock(selectedAttemptId as 1 | 2); // Trigger the lock logic in hook
		}
	};

	const selectedStrategyName =
		attempts[selectedAttemptId as 1 | 2]?.strategyName;

	return (
		<div className="flex flex-col h-full overflow-y-auto max-w-5xl mx-auto p-6 animate-in fade-in zoom-in-95 duration-500">
			{/* Header */}
			<div className="text-center mb-10 space-y-4">
				<h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white leading-[0.9]">
					Finalize
					<br />
					<span className="text-emerald-500">Submission</span>
				</h2>
				<p className="font-mono text-white/50 uppercase tracking-widest text-xs max-w-md mx-auto border-t border-b border-white/10 py-2">
					Select your best performing algorithm to lock in your final
					ranking. This action cannot be undone.
				</p>
			</div>

			{/* Cards Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
				{validAttempts.length > 0 ? (
					validAttempts.map((attempt) => (
						<AttemptCard
							key={attempt.id}
							attempt={attempt}
							isSelected={selectedAttemptId === attempt.id}
							onSelect={() => setSelectedAttemptId(attempt.id)}
						/>
					))
				) : (
					<div className="col-span-2 text-center py-12 border border-dashed border-white/20 rounded-xl bg-white/5">
						<p className="text-white/40 font-mono uppercase tracking-widest">
							No completed simulations found
						</p>
						<p className="text-xs text-white/30 mt-2">
							Run simulation attempts to see them here
						</p>
					</div>
				)}
			</div>

			{/* Action Bar */}
			<div className="max-w-md mx-auto w-full">
				<LockInButton
					onLockIn={handleLockInClick}
					isLoading={isLocking} // Hook handles visual state now too, but button can show loading
					disabled={!selectedAttemptId || isLocking}
				/>
				{!selectedAttemptId && validAttempts.length > 0 && (
					<p className="text-center text-xs text-destructive mt-3 opacity-80">
						* Please select an attempt to proceed
					</p>
				)}
			</div>

			{/* Confirmation Modal */}
			<Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
				<DialogHeader>
					<DialogTitle>Confirm Final Submission</DialogTitle>
					<DialogDescription>
						Are you sure you want to submit{" "}
						<strong>{selectedStrategyName}</strong>? Your other
						attempts will be discarded from the final leaderboard.
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
							variant="glow"
							onClick={handleFinalSubmit}
							className="rounded-none"
						>
							Confirm Submission
						</Button>
					</div>
				</DialogFooter>
			</Dialog>
		</div>
	);
}
