import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Terminal, Loader2 } from "lucide-react";
import { Input } from "../ui/Input";
import {
	completeInvite,
	listenToInvite,
	checkTeamNameExists,
} from "../../database/api/Invitation";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { auth } from "../../lib/firebase"; // To get current user UID for SOLO case

type RegistrationTeamDesignationProps = {
	onSetTeamName: (name: string) => void;
	primaryColor: string;
	onBack: () => void;
	role?: "inviter" | "invitee";
	inviteId?: string;
	inviterName?: string;
	inviteeUid?: string;
};

export function RegistrationTeamDesignation({
	onSetTeamName,
	onBack,
	primaryColor,
	role, // "inviter" (or undefined/SOLO) | "invitee"
	inviteId,
	inviterName,
	inviteeUid,
}: RegistrationTeamDesignationProps) {
	const [teamName, setTeamName] = useState("");
	const [loading, setLoading] = useState(false);
	const [waitingForInviter] = useState(role === "invitee" && !!inviteId);
	const [checkingName, setCheckingName] = useState(false);
	const [nameError, setNameError] = useState<string | null>(null);

	useEffect(() => {
		if (role === "invitee" && inviteId) {
			const unsubscribe = listenToInvite(inviteId, (data) => {
				if (data && data.status === "COMPLETED" && data.team_name) {
					onSetTeamName(data.team_name);
				}
			});
			return () => unsubscribe();
		}
	}, [role, inviteId, onSetTeamName]);

	useEffect(() => {
		const checkName = async () => {
			if (teamName.length < 3) {
				setNameError(null);
				return;
			}
			setCheckingName(true);
			setNameError(null);
			try {
				const exists = await checkTeamNameExists(teamName);
				if (exists) {
					setNameError("TEAM NAME ALREADY TAKEN");
				}
			} catch (error) {
				console.error("Error checking name", error);
			} finally {
				setCheckingName(false);
			}
		};

		const timer = setTimeout(checkName, 500);
		return () => clearTimeout(timer);
	}, [teamName]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (teamName.length < 3 || nameError) return;
		setLoading(true);

		try {
			// Double check uniqueness
			const exists = await checkTeamNameExists(teamName);
			if (exists) {
				setNameError("TEAM NAME ALREADY TAKEN");
				setLoading(false);
				return;
			}
			// 1. Create the tos_teams document
			const currentUser = auth.currentUser;
			if (!currentUser) throw new Error("No user logged in");

			const members = [currentUser.uid];
			if (inviteeUid) {
				members.push(inviteeUid);
			}

			const teamRef = doc(db, "tos_teams", teamName);
			// Note: In a real app we should check if team name exists first.
			// setDoc will overwrite or merge. Assuming unique names required, we should check existence
			// but for now let's proceed as per instruction to just create it.
			// Actually, if we want to ensure uniqueness we'd use a transaction or check first.
			// Let's assume unique check is done or we accept overwrite for this task scope
			// (or maybe setDoc fails if we use a creation condition, but standard setDoc overwrites).

			await setDoc(teamRef, {
				team_name: teamName,
				mode: members.length > 1 ? "DUO" : "SOLO",
				members: members,
				created_at: Timestamp.now(),
				drafts: null, // As requested
			});

			// 2. If this is part of an invite, complete the invite
			if (inviteId && role === "inviter") {
				await completeInvite(inviteId, teamName);
			} else if (members.length === 1) {
				// Solo Mode: Create self-invite to block others
				// We need a User object. We can construct one from auth for this purpose
				// or assume Name is needed. createSelfInvite uses name.
				// Let's use currentUser (already checked above)

				// Importing createSelfInvite
				const { createSelfInvite } =
					await import("../../database/api/Invitation");

				// We need to match User type
				const soloUser = {
					id: currentUser.uid,
					name:
						currentUser.displayName ||
						currentUser.email?.split("@")[0] ||
						"Unknown",
					email: currentUser.email || "",
					phone: "", // Not needed for blockage
					ticketId: "",
					hasTicket: true,
				};
				await createSelfInvite(soloUser, teamName);
			}

			// 3. Proceed
			onSetTeamName(teamName);
		} catch (error) {
			console.error("Error creating team:", error);
			// Handle error (e.g., team name taken if we had rules for that)
		} finally {
			setLoading(false);
		}
	};

	if (waitingForInviter) {
		return (
			<motion.div
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				className="space-y-6 text-center py-10"
			>
				<div className="flex flex-col items-center gap-4">
					<div className="relative">
						<div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse" />
						<Loader2
							className="relative z-10 animate-spin w-12 h-12"
							style={{ color: primaryColor }}
						/>
					</div>
					<h3 className="text-xl font-bold uppercase tracking-widest text-white mt-4">
						Waiting for {inviterName || "Partner"}
					</h3>
					<p className="text-white/60 font-mono text-sm max-w-sm mx-auto">
						Your Squad Leader is currently designating the unit
						callsign. Stand by for synchronization.
					</p>
				</div>
			</motion.div>
		);
	}

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			className="space-y-6"
		>
			<div
				style={{ color: primaryColor }}
				className="flex items-center gap-4 border-b border-white/10 pb-4 pt-4"
			>
				<Terminal size={24} />
				<h3 className="text-xl font-bold uppercase tracking-widest">
					Unit Designation
				</h3>
			</div>

			<div className="space-y-4">
				<p className="text-white/60 font-mono text-sm leading-relaxed">
					Assign a tactical designation for this unit. This identifier
					will be used for all mission parameters and leaderboard
					tracking.
				</p>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="space-y-2">
						<label
							style={{ color: primaryColor }}
							className="text-xs uppercase tracking-widest font-bold flex items-center gap-2"
						>
							// TEAM CODE
						</label>
						<div className="relative">
							{/* Restrict input chars if needed */}
							<Input
								placeholder="ENTER TEAM NAME (e.g. ALPHA)"
								value={teamName}
								onChange={(e) =>
									setTeamName(
										e.target.value
											.toUpperCase()
											.replace(/[^A-Z0-9_-]/g, ""),
									)
								}
								className={`cursor-target bg-black/40 border ${nameError ? "border-red-500/50 focus:border-red-500" : "border-white/10 focus:border-emerald-500/50"} placeholder:text-white/20 h-16 text-xl tracking-[0.2em] font-black text-white px-6`}
							/>
							<div className="absolute top-0 right-0 h-full flex items-center pr-4 pointer-events-none">
								{checkingName ? (
									<Loader2 className="w-5 h-5 animate-spin text-white/20" />
								) : teamName.length >= 3 && !nameError ? (
									<div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]" />
								) : null}
							</div>
						</div>
						{nameError && (
							<p className="text-xs text-red-400 font-mono tracking-widest">
								{nameError}
							</p>
						)}
						<p className="text-xs text-white/30 text-right *:*mt-1">
							MINIMUM 3 CHARACTERS
						</p>
					</div>

					<div className="flex gap-4">
						<button
							type="button"
							onClick={onBack}
							style={{ borderColor: primaryColor }}
							className="cursor-target flex-1 py-6 border border-white/10 text-white/40 hover:text-white uppercase tracking-widest text-sm hover:bg-white/5 transition-colors"
						>
							Back
						</button>
						<button
							type="submit"
							disabled={
								teamName.length < 3 ||
								loading ||
								!!nameError ||
								checkingName
							}
							style={{ backgroundColor: primaryColor }}
							className="cursor-target flex-[2] hover:bg-emerald-400 text-black font-black uppercase tracking-widest py-6 text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
						>
							<span className="relative z-10 flex items-center justify-center gap-4">
								{loading
									? "INITIALIZING..."
									: "CONFIRM & DEPLOY"}
							</span>
							<div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 mix-blend-overlay" />
						</button>
					</div>
				</form>
			</div>
		</motion.div>
	);
}
