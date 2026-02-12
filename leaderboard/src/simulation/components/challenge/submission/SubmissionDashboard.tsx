import * as React from "react";
import { AttemptCard } from "./AttemptCard";
import { LockInButton } from "./LockInButton";
import {
	Dialog,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "../../ui/Dialog";
import { Button } from "../../ui/Button";

// Mock Data (In reality, this comes from props/context)
const MOCK_ATTEMPTS = [
	{
		id: 1,
		strategyName: "ALPHA_PROTOCOL_V1",
		score: 88.4,
		rank: 12,
		executionTime: "142ms",
		date: "2023-10-24 14:20:00",
	},
	{
		id: 2,
		strategyName: "OMEGA_V2_OPTIMIZED",
		score: 94.1,
		rank: 4,
		executionTime: "115ms",
		date: "2023-10-24 15:45:00",
	},
];

export function SubmissionDashboard() {
	const [selectedAttemptId, setSelectedAttemptId] = React.useState<
		number | null
	>(null);
	const [isDialogOpen, setIsDialogOpen] = React.useState(false);

	const handleLockInClick = () => {
		if (selectedAttemptId) {
			setIsDialogOpen(true);
		}
	};

	const handleFinalSubmit = () => {
		setIsDialogOpen(false);
		console.log(
			`Submitting Attempt #${selectedAttemptId} to leaderboard...`,
		);
		// API Call would go here
	};

	const selectedStrategyName = MOCK_ATTEMPTS.find(
		(a) => a.id === selectedAttemptId,
	)?.strategyName;

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
				{MOCK_ATTEMPTS.map((attempt) => (
					<AttemptCard
						key={attempt.id}
						attempt={attempt}
						isSelected={selectedAttemptId === attempt.id}
						onSelect={() => setSelectedAttemptId(attempt.id)}
					/>
				))}
			</div>

			{/* Action Bar */}
			<div className="max-w-md mx-auto w-full">
				<LockInButton onLockIn={handleLockInClick} isLoading={false} />
				{!selectedAttemptId && (
					<p className="text-center text-xs text-destructive mt-3 opacity-80">
						* Please select an attempt to proceed
					</p>
				)}
			</div>

			{/* Confirmation Modal */}
			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
							onClick={() => setIsDialogOpen(false)}
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
