import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Terminal, CheckCircle2 } from "lucide-react";
import { RegistrationLogin } from "./RegistrationLogin";
import { RegistrationModeSelect } from "./RegistrationModeSelect";
import { RegistrationSolo } from "./RegistrationSolo";
import { RegistrationDuo } from "./RegistrationDuo";
import { RegistrationTeamDesignation } from "./RegistrationTeamDesignation";
import { RegistrationInvite } from "./RegistrationInvite";
import type { User, RegistrationStep } from "./types";
import { checkInvites } from "./mockApi";

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

	// --- Handlers ---

	const handleLoginSuccess = async (loggedInUser: User) => {
		setUser(loggedInUser);
		// Check for invites immediately after login
		try {
			const invite = await checkInvites(loggedInUser.email);
			if (invite) {
				setInviteFrom(invite.from);
				setStep("INVITE_RECEIVED");
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

	const handleDuoConfirm = (confirmedPartner: User) => {
		setPartner(confirmedPartner);
		setStep("TEAM_NAME");
	};

	const handleInviteAccept = () => {
		if (inviteFrom) {
			setPartner(inviteFrom);
			setMode("DUO");
			setStep("DUO_CONFIRMED"); // Skip to confirmation/team name?
			// The prompt implies: "Once, accepted, both of their accounts will show duo only with both their details".
			// So we show the Duo Confirmation screen (User + Partner details).
			// But RegistrationDuo handles the "Invite Sending" part.
			// I should probably reuse a component or creating a specific "DuoConfirmed" view.
			// For simplicity, I'll redirect to a state effectively same as "Team Name" but maybe show the partner details there?
			// Actually, let's just go to TEAM_NAME, and show the team members there or add an intermediate step.
			// Let's add a "DUO_CONFIRMED" state to show the success message before Team Name.
			setStep("TEAM_NAME");
		}
	};

	const handleInviteReject = () => {
		setInviteFrom(null);
		setStep("MODE_SELECTION");
	};

	const handleSetTeamName = (name: string) => {
		setTeamName(name);
		setStep("COMPLETED");
	};

	const resetRegistration = () => {
		setStep("LOGIN");
		setUser(null);
		setPartner(null);
		setTeamName("");
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
						onBack={() => {
							if (mode === "SOLO") {
								setStep("SOLO_CONFIRMATION");
							} else {
								// For DUO, we should probably go back to the state where the partner was accepted.
								// Currently RegistrationDuo handles the flow up to "Proceed to Designation".
								// So going back to DUO_INVITE should render RegistrationDuo which should presumably show the accepted state if partner is set?
								// In RegistrationDuo, it has local state for `inviteStatus`. If we unmount it, we lose that state.
								// We might need to lift that state up or just accept that "Back" might reset the invite flow (which is annoying).
								// BUT, we have `partner` state in `Registration.tsx`.
								// Let's check `RegistrationDuo`. It takes `currentUser` and `onConfirm`. It doesn't take `partner` as prop to initialize state.
								// Ideally we should fix RegistrationDuo to accept `partner` prop to restore state.
								// For now, let's just go back to DUO_INVITE.
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

						<button
							onClick={resetRegistration}
							className="text-xs text-white/20 hover:text-white uppercase tracking-widest mt-8 transition-colors"
						>
							Return to Login
						</button>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
