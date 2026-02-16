import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Terminal, CheckCircle2 } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { RegistrationLogin } from "./RegistrationLogin";
import { RegistrationModeSelect } from "./RegistrationModeSelect";
import { RegistrationSolo } from "./RegistrationSolo";
import { RegistrationDuo } from "./RegistrationDuo";
import { RegistrationTeamDesignation } from "./RegistrationTeamDesignation";
import { RegistrationInvite } from "./RegistrationInvite";
import type { User, RegistrationStep } from "./types";
import { logout } from "../../auth/session";
import { auth } from "../../lib/firebase"; // Import auth for checking current user state
import {
	checkUserInviteStatus,
	acceptInvite,
	rejectInvite,
	getTeamByMemberUid,
	getUserProfile,
	type TeamFormation,
} from "../../database/api/Invitation";

type RegistrationProps = {
	primaryColor: string;
};

export function Registration({ primaryColor }: RegistrationProps) {
	const [step, setStep] = useState<RegistrationStep>("LOGIN");
	const [user, setUser] = useState<User | null>(null);
	const [partner, setPartner] = useState<User | null>(null);
	const [teamName, setTeamName] = useState("");
	const [mode, setMode] = useState<"SOLO" | "DUO">("SOLO");
	const [inviteFrom, setInviteFrom] = useState<User | null>(null);
	const [existingInvite, setExistingInvite] = useState<TeamFormation | null>(
		null,
	);
	const [isInitializing, setIsInitializing] = useState(true);
	const [confirmLogout, setConfirmLogout] = useState(false);
	const [confirmAbort, setConfirmAbort] = useState(false);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
			if (currentUser) {
				const loggedInUser: User = {
					id: currentUser.uid,
					email: currentUser.email || "",
					name:
						currentUser.displayName ||
						currentUser.email?.split("@")[0] ||
						"Unknown",
					phone: "", // Fetch from DB if needed
					ticketId: "",
					hasTicket: false,
				};

				setUser(loggedInUser);

				try {
					// 1. Check if user is already in a team
					const team = await getTeamByMemberUid(loggedInUser.id);
					if (team) {
						setTeamName(team.team_name);
						setMode(team.mode as "SOLO" | "DUO");
						// If DUO, we should ideally fetch partner details.
						if (team.mode === "DUO" && team.members.length > 1) {
							// Find partner UID
							const partnerUid = team.members.find(
								(uid: string) => uid !== loggedInUser.id,
							);
							if (partnerUid) {
								const partnerProfile =
									await getUserProfile(partnerUid);
								if (partnerProfile) {
									setPartner(partnerProfile);
								} else {
									setPartner({
										id: partnerUid,
										name: "Linked Partner", // Fallback
										email: "",
										phone: "",
										ticketId: "",
										hasTicket: false,
									});
								}
							}
						}
						setStep("COMPLETED");
						setIsInitializing(false);
						return;
					}

					// 2. If not in a team, check invites
					const invite = await checkUserInviteStatus(
						loggedInUser.email,
					);
					if (invite) {
						setExistingInvite(invite);
						if (invite.role === "invitee") {
							// I am the invitee, show the invite received screen
							setInviteFrom({
								id: "inviter-placeholder",
								name: invite.inviter_name || "Unknown",
								email: invite.inviter_email,
								phone: "",
								ticketId: "",
								hasTicket: false,
							});
							if (isInitializing) {
								setStep("INVITE_RECEIVED");
							}
						} else if (invite.role === "inviter") {
							// I am the inviter, show the pending invite screen (Duo)
							setMode("DUO");
							if (isInitializing) {
								setStep("DUO_INVITE");
							}
						}
					} else {
						if (isInitializing) {
							setStep("MODE_SELECTION");
						}
					}
				} catch (e) {
					console.error("Error checking invites/teams", e);
					if (isInitializing) {
						setStep("MODE_SELECTION");
					}
				}
			} else {
				// No user is signed in
				if (isInitializing) {
					setStep("LOGIN");
				}
			}
			setIsInitializing(false);
		});

		return () => unsubscribe();
	}, []);

	// Show a loading state while initializing to prevent flash of login screen
	if (isInitializing && step === "LOGIN") {
		return (
			<div className="min-h-[50vh] flex items-center justify-center text-emerald-500/50 font-mono animate-pulse">
				INITIALIZING SYSTEM...
			</div>
		);
	}

	// --- Handlers ---

	const handleLoginSuccess = async (loggedInUser: User) => {
		setUser(loggedInUser);
		// Check for invites immediately after login
		try {
			// 1. Check if user is already in a team
			const team = await getTeamByMemberUid(loggedInUser.id);
			if (team) {
				setTeamName(team.team_name);
				setMode(team.mode as "SOLO" | "DUO");
				if (team.mode === "DUO" && team.members.length > 1) {
					const partnerUid = team.members.find(
						(uid: string) => uid !== loggedInUser.id,
					);
					if (partnerUid) {
						const partnerProfile = await getUserProfile(partnerUid);
						if (partnerProfile) {
							setPartner(partnerProfile);
						} else {
							setPartner({
								id: partnerUid,
								name: "Linked Partner", // Fallback
								email: "",
								phone: "",
								ticketId: "",
								hasTicket: false,
							});
						}
					}
				}
				setStep("COMPLETED");
				return;
			}

			const invite = await checkUserInviteStatus(loggedInUser.email);
			if (invite) {
				setExistingInvite(invite);
				if (invite.role === "invitee") {
					setInviteFrom({
						id: "inviter-placeholder",
						name: invite.inviter_name || "Unknown",
						email: invite.inviter_email,
						phone: "",
						ticketId: "",
						hasTicket: false,
					});
					setStep("INVITE_RECEIVED");
				} else if (invite.role === "inviter") {
					setMode("DUO");
					setStep("DUO_INVITE");
				}
			} else {
				setStep("MODE_SELECTION");
			}
		} catch (e) {
			console.error("Error checking invites", e);
			setStep("MODE_SELECTION");
		}
	};

	const handleModeSelect = (selectedMode: "SOLO" | "DUO") => {
		setMode(selectedMode);
		if (selectedMode === "SOLO") {
			setStep("SOLO_CONFIRMATION");
		} else {
			setStep("DUO_INVITE");
		}
	};

	const handleSoloConfirm = () => {
		setStep("TEAM_NAME");
	};

	const handleDuoConfirm = (
		confirmedPartner: User,
		invite?: TeamFormation,
	) => {
		setPartner(confirmedPartner);
		if (invite) {
			setExistingInvite(invite);
		}
		setStep("TEAM_NAME");
	};

	const handleInviteAccept = async () => {
		if (inviteFrom && existingInvite?.id && user?.id) {
			try {
				await acceptInvite(existingInvite.id, user.id);
				setPartner(inviteFrom);
				setMode("DUO");
				// After acceptance, we can proceed to team name.
				setStep("TEAM_NAME");
			} catch (e) {
				console.error("Failed to accept invite", e);
				// Optionally show error
			}
		}
	};

	const handleInviteReject = async () => {
		if (existingInvite?.id) {
			try {
				await rejectInvite(existingInvite.id);
				setInviteFrom(null);
				setExistingInvite(null);
				setStep("MODE_SELECTION");
			} catch (e) {
				console.error("Failed to reject invite", e);
			}
		}
	};

	const handleSetTeamName = (name: string) => {
		setTeamName(name);
		setStep("COMPLETED");
	};

	const resetRegistration = async () => {
		try {
			await logout();
		} catch (error) {
			console.error("Logout failed", error);
		}
		setStep("LOGIN");
		setUser(null);
		setPartner(null);
		setTeamName("");
		setExistingInvite(null);
		setInviteFrom(null);
	};

	const handleAbortTeam = async () => {
		if (!teamName) return;
		try {
			// Find and delete team
			const { deleteTeam } =
				await import("../../database/api/Invitation");
			await deleteTeam(teamName);

			// Reset state
			setStep("MODE_SELECTION");
			setTeamName("");
			setPartner(null);
			setConfirmLogout(false);
			// Optionally reload page or re-check to ensure clean state
			window.location.reload();
		} catch (e) {
			console.error("Failed to abort team", e);
		}
	};

	return (
		<div className="w-full max-w-2xl mx-auto pt-10 px-4">
			{/* Header */}
			<div className="flex items-center gap-5 border-b border-white/10 pb-8">
				<div className="p-4 bg-white/5 border border-white/10 rounded-md shadow-[0_0_20px_rgba(255,255,255,0.05)]">
					<Terminal
						className="w-8 h-8 text-emerald-400"
						style={{ color: primaryColor }}
					/>
				</div>
				<div>
					<h2 className="text-2xl font-bold uppercase tracking-[0.2em] text-white">
						Unit Registration
					</h2>
					<div className="flex items-center gap-3 mt-2">
						<div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
						<p
							style={{ color: primaryColor }}
							className="text-sm text-emerald-500/80 font-mono uppercase tracking-widest"
						>
							System Online // {step.replace("_", " ")}
						</p>
					</div>
				</div>
				{step !== "LOGIN" && (
					<>
						{!confirmLogout ? (
							<button
								onClick={() => setConfirmLogout(true)}
								className="cursor-target ml-auto text-md uppercase tracking-widest text-red-200 hover:text-red-400 border border-red-200 hover:border-red-500/50 px-3 py-1 bg-red-950/20 transition-all"
							>
								[ LOG OUT ]
							</button>
						) : (
							<div className="ml-auto flex items-center gap-2">
								<span className="text-xs tracking-widest text-red-300">
									CONFIRM?
								</span>

								<button
									onClick={() => {
										resetRegistration();
										setConfirmLogout(false);
									}}
									className="cursor-target text-xs uppercase tracking-widest text-green-200 hover:text-green-400 border border-green-200 hover:border-green-500/50 px-2 py-1 bg-green-950/20 transition-all"
								>
									YES
								</button>

								<button
									onClick={() => setConfirmLogout(false)}
									className="cursor-target text-xs uppercase tracking-widest text-slate-300 hover:text-white border border-slate-400 hover:border-white/50 px-2 py-1 bg-slate-800/40 transition-all"
								>
									NO
								</button>
							</div>
						)}
					</>
				)}
			</div>

			{/* Main Content Area */}
			<AnimatePresence mode="wait">
				{step === "LOGIN" && (
					<RegistrationLogin
						key="login"
						onLoginSuccess={handleLoginSuccess}
						primaryColor={primaryColor}
					/>
				)}

				{step === "MODE_SELECTION" && (
					<RegistrationModeSelect
						key="mode"
						onSelectMode={handleModeSelect}
						primaryColor={primaryColor}
						onBack={() => setStep("LOGIN")}
					/>
				)}

				{step === "SOLO_CONFIRMATION" && user && (
					<RegistrationSolo
						key="solo"
						user={user}
						onConfirm={handleSoloConfirm}
						onBack={() => setStep("MODE_SELECTION")}
						primaryColor={primaryColor}
					/>
				)}

				{step === "DUO_INVITE" && user && (
					<RegistrationDuo
						key="duo"
						currentUser={user}
						primaryColor={primaryColor}
						onConfirm={handleDuoConfirm}
						onBack={() => setStep("MODE_SELECTION")}
						partner={partner}
						existingInvite={existingInvite}
					/>
				)}

				{step === "INVITE_RECEIVED" && inviteFrom && (
					<RegistrationInvite
						key="invite"
						inviteFrom={inviteFrom}
						onAccept={handleInviteAccept}
						onReject={handleInviteReject}
						primaryColor={primaryColor}
					/>
				)}

				{step === "TEAM_NAME" && (
					<RegistrationTeamDesignation
						key="team-name"
						onSetTeamName={handleSetTeamName}
						primaryColor={primaryColor}
						// Pass extra props for team sync
						role={
							existingInvite?.inviter_email === user?.email
								? "inviter"
								: "invitee"
						}
						inviteId={existingInvite?.id}
						inviterName={existingInvite?.inviter_name}
						// If I am inviter, I need invitee's UID. If I am invitee, I don't need it for this step.
						// existingInvite might be null if SOLO, so handle that in component
						// Note: If SOLO, existingInvite is null, so role is "invitee" (default) or we can pass "SOLO"
						// But RegistrationTeamDesignation needs to handle SOLO case appropriately.
						// Actually, for SOLO, existingInvite is null.
						// Let's pass a explicit mode or derive it.
						// The component likely assumes SOLO if inviteId is missing, logic needs to be robust.
						inviteeUid={existingInvite?.invitee_uid}
						onBack={() => {
							if (mode === "SOLO") {
								setStep("SOLO_CONFIRMATION");
							} else {
								setStep("DUO_INVITE");
							}
						}}
					/>
				)}

				{step === "COMPLETED" && (
					<motion.div
						key="completed"
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						className="text-center space-y-8 py-10"
					>
						<div className="inline-flex p-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-4">
							<CheckCircle2
								size={64}
								style={{ color: primaryColor }}
							/>
						</div>

						<div className="space-y-2">
							<h3 className="text-3xl font-black uppercase tracking-widest text-white">
								Registration Complete
							</h3>
							<p
								style={{ color: primaryColor }}
								className="font-mono text-lg"
							>
								UNIT DESIGNATION: {teamName}
							</p>
						</div>

						<div className="p-6 bg-white/5 border border-white/10 rounded-sm max-w-md mx-auto space-y-4">
							<div className="flex justify-between border-b border-white/10 pb-2">
								<span className="text-xs text-white/40 uppercase">
									Mode
								</span>
								<span className="text-sm font-bold text-white">
									{mode}
								</span>
							</div>
							<div className="flex justify-between border-b border-white/10 pb-2">
								<span className="text-xs text-white/40 uppercase">
									Operative 01
								</span>
								<span className="text-sm font-bold text-white">
									{user?.name}
								</span>
							</div>
							{mode === "DUO" && (partner || inviteFrom) && (
								<div className="flex justify-between border-b border-white/10 pb-2">
									<span className="text-xs text-white/40 uppercase">
										Operative 02
									</span>
									<span className="text-sm font-bold text-white">
										{partner?.name || "LINKED"}
									</span>
								</div>
							)}
						</div>

						{!confirmAbort ? (
							<button
								onClick={() => setConfirmAbort(true)}
								style={{
									borderColor: primaryColor,
									color: primaryColor,
								}}
								className="cursor-target w-full py-4 border border-white/10 hover:bg-white/5 uppercase tracking-widest transition-all mt-8"
							>
								[ ABORT TEAM OPERATION ]
							</button>
						) : (
							<div className="space-y-4 p-4 border border-red-500/30 bg-red-950/10 rounded mt-8">
								<div className="text-red-400 text-sm font-bold tracking-widest uppercase">
									WARNING: THIS ACTION CANNOT BE UNDONE
								</div>
								<div className="flex gap-4">
									<button
										onClick={handleAbortTeam}
										className="cursor-target flex-1 py-3 bg-red-500/20 border border-red-500/50 text-red-200 hover:bg-red-500/30 hover:text-white uppercase tracking-widest transition-all"
									>
										CONFIRM ABORT
									</button>
									<button
										onClick={() => setConfirmAbort(false)}
										className="cursor-target flex-1 py-3 border border-white/10 text-white/60 hover:text-white hover:bg-white/5 uppercase tracking-widest transition-all"
									>
										CANCEL
									</button>
								</div>
							</div>
						)}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
