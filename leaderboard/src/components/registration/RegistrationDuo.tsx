import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Mail, Loader2, CheckCircle2, XCircle } from "lucide-react";
import type { User as UserType } from "./types";
import { Input } from "../ui/Input";
import {
	createInvite,
	cancelInvite,
	listenToInvite,
	type TeamFormation,
} from "../../database/api/Invitation";

type RegistrationDuoProps = {
	currentUser: UserType;
	primaryColor: string;
	onConfirm: (partner: UserType) => void;
	onBack: () => void;
	partner?: UserType | null;
	existingInvite?: TeamFormation | null;
};

export function RegistrationDuo({
	currentUser,
	onConfirm,
	onBack,
	partner: initialPartner,
	existingInvite,
	primaryColor,
}: RegistrationDuoProps) {
	const [partnerEmail, setPartnerEmail] = useState(
		existingInvite?.invitee_email || initialPartner?.email || "",
	);
	const [inviteStatus, setInviteStatus] = useState<
		"IDLE" | "SENDING" | "SENT" | "ACCEPTED" | "REJECTED"
	>(
		existingInvite
			? existingInvite.status === "PENDING"
				? "SENT"
				: existingInvite.status
			: initialPartner
				? "ACCEPTED"
				: "IDLE",
	);
	const [partner, setPartner] = useState<UserType | null>(
		initialPartner || null,
	);
	const [currentInviteId, setCurrentInviteId] = useState<string | null>(
		existingInvite?.id || null,
	);
	const [error, setError] = useState<string | null>(null);

	// Effect to listen to invite status changes if we have an active invite ID
	useEffect(() => {
		if (!currentInviteId) return;

		const unsubscribe = listenToInvite(currentInviteId, (updatedInvite) => {
			if (!updatedInvite) {
				// Invite was deleted/cancelled
				setInviteStatus("IDLE");
				setCurrentInviteId(null);
				setPartnerEmail("");
				return;
			}

			if (updatedInvite.status === "ACCEPTED") {
				setInviteStatus("ACCEPTED");
				// In a real scenario, we would fetch the partner's full profile here.
				// For now, we construct a partial User based on the invite info.
				setPartner({
					id: "partner-id-placeholder", // We don't have their ID unless we query for it
					name: updatedInvite.invitee_email.split("@")[0], // Placeholder name
					email: updatedInvite.invitee_email,
					phone: "",
					ticketId: "",
					hasTicket: false,
				});
			} else if (updatedInvite.status === "REJECTED") {
				setInviteStatus("REJECTED");
				// Optionally wait and reset
			} else {
				setInviteStatus("SENT");
			}
		});

		return () => unsubscribe();
	}, [currentInviteId]);

	const handleSendInvite = async () => {
		if (!partnerEmail.includes("@")) return;
		setInviteStatus("SENDING");
		setError(null);

		try {
			const newInvite = await createInvite(currentUser, partnerEmail);
			setCurrentInviteId(newInvite.id!);
			setInviteStatus("SENT");
		} catch (e: any) {
			console.error(e);
			setError(e.message || "Failed to send invite");
			setInviteStatus("IDLE");
		}
	};

	const handleCancelInvite = async () => {
		if (currentInviteId) {
			try {
				await cancelInvite(currentInviteId);
				setInviteStatus("IDLE");
				setCurrentInviteId(null);
				setPartnerEmail("");
			} catch (e) {
				console.error("Failed to cancel invite", e);
			}
		} else {
			// If we are just locally in "sending" or "idle" state
			onBack();
		}
	};

	const handleReset = () => {
		if (currentInviteId) {
			cancelInvite(currentInviteId).catch(console.error);
		}
		setInviteStatus("IDLE");
		setCurrentInviteId(null);
		setPartnerEmail("");
		setPartner(null);
	};

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			className="space-y-6 pt-4"
		>
			<div
				style={{ color: primaryColor }}
				className="flex items-center gap-4 border-b border-white/10 pb-4"
			>
				<Users size={24} />
				<h3 className="text-xl font-bold uppercase tracking-widest">
					Duo Protocol // PARTNER LINK
				</h3>
			</div>

			{inviteStatus === "IDLE" && (
				<div className="space-y-6">
					<p className="text-white/60 font-mono text-sm">
						Enter your partner's operative email address. They must
						be logged in to accept the uplink request.
					</p>

					<div className="space-y-2">
						<label
							style={{ color: primaryColor }}
							className="text-xs uppercase tracking-widest font-bold flex items-center gap-2"
						>
							<Mail size={14} /> Partner Email
						</label>
						<div className="flex gap-2">
							<Input
								type="email"
								placeholder="partner@tos.com"
								value={partnerEmail}
								onChange={(e) =>
									setPartnerEmail(e.target.value)
								}
								className="cursor-target bg-black/40 border-white/10 text-white placeholder:text-white/20 h-12 font-mono"
							/>
							<button
								onClick={handleSendInvite}
								disabled={!partnerEmail}
								style={{ backgroundColor: primaryColor }}
								className="cursor-target hover:bg-emerald-500 hover:text-black text-black px-6 font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
							>
								Send
							</button>
						</div>
						{error && (
							<p className="text-red-400 text-xs font-mono mt-2">
								{error}
							</p>
						)}
					</div>
				</div>
			)}

			{inviteStatus === "SENDING" && (
				<div className="py-12 flex flex-col items-center justify-center text-emerald-500/50">
					<Loader2 className="animate-spin w-8 h-8 mb-4" />
					<p className="text-xs uppercase tracking-widest">
						Transmitting Uplink Request...
					</p>
				</div>
			)}

			{inviteStatus === "SENT" && (
				<div className="py-12 flex flex-col items-center justify-center text-emerald-400 space-y-4 bg-emerald-500/5 border border-emerald-500/20 rounded-sm">
					<div className="relative">
						<div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse" />
						<Loader2 className="relative z-10 animate-spin w-12 h-12 text-emerald-400" />
					</div>

					<div className="text-center space-y-1">
						<p className="text-sm font-bold uppercase tracking-widest">
							Waiting for {partnerEmail}...
						</p>
						<p className="text-xs text-white/40 max-w-[250px] mx-auto">
							Request sent. Target must accept connection to
							proceed.
						</p>
					</div>
				</div>
			)}

			{inviteStatus === "REJECTED" && (
				<div className="py-12 flex flex-col items-center justify-center text-red-400 space-y-4 bg-red-500/5 border border-red-500/20 rounded-sm">
					<XCircle className="w-12 h-12 text-red-400" />
					<div className="text-center space-y-1">
						<p className="text-sm font-bold uppercase tracking-widest">
							Uplink Rejected
						</p>
						<p className="text-xs text-white/40 max-w-[250px] mx-auto">
							Target decliend the connection request.
						</p>
					</div>
					<button
						onClick={handleReset}
						className="px-6 py-2 border border-red-500/30 hover:bg-red-500/10 text-red-400 uppercase tracking-widest text-xs transition-colors"
					>
						Try Again
					</button>
				</div>
			)}

			{inviteStatus === "ACCEPTED" && partner && (
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					className="space-y-6"
				>
					<div
						style={{
							color: primaryColor,
							borderColor: primaryColor,
						}}
						className="p-4 bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-4 rounded-sm"
					>
						<CheckCircle2
							style={{ color: primaryColor }}
							className="text-emerald-400 w-8 h-8"
						/>
						<div>
							<p
								style={{ color: primaryColor }}
								className="text-emerald-400 font-bold uppercase tracking-widest"
							>
								Uplink Established
							</p>
							<p className="text-xs text-white/60">
								Squad formation synchronized.
							</p>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{/* User Card */}
						<div className="p-4 border border-white/10 bg-white/5 space-y-2 rounded-sm opacity-50">
							<p className="text-xs text-white/40 uppercase">
								Operative 01 (You)
							</p>
							<p className="text-lg font-mono font-bold text-white">
								{currentUser.name}
							</p>
							<p className="text-xs font-mono text-emerald-500/60">
								{currentUser.phone}
							</p>
						</div>

						{/* Partner Card */}
						<div
							style={{ borderColor: primaryColor }}
							className="p-4 border border-emerald-500/30 bg-emerald-500/5 space-y-2 rounded-sm shadow-[0_0_15px_rgba(16,185,129,0.1)]"
						>
							<p className="text-xs text-emerald-500/60 uppercase">
								Operative 02 (Linked)
							</p>
							<p
								style={{ color: primaryColor }}
								className="text-lg font-mono font-bold"
							>
								{partner.name}
							</p>
							<p className="text-xs font-mono text-emerald-500/60">
								{partner.phone}
							</p>
						</div>
					</div>
					<div className="flex gap-2">
						<button
							onClick={handleCancelInvite}
							style={{ borderColor: primaryColor }}
							className="cursor-target w-full py-4 border border-white/10 text-white/40 hover:text-white uppercase tracking-widest text-xs mt-4 hover:bg-white/5 rounded-sm transition-colors"
						>
							Cancel Protocol
						</button>

						<button
							onClick={() => partner && onConfirm(partner)}
							style={{ backgroundColor: primaryColor }}
							className="cursor-target w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase tracking-widest py-4 rounded-sm transition-all mt-4"
						>
							Proceed to Designation
						</button>
					</div>
				</motion.div>
			)}

			{inviteStatus !== "ACCEPTED" && inviteStatus !== "REJECTED" && (
				<button
					onClick={handleCancelInvite}
					style={{ borderColor: primaryColor }}
					className="cursor-target w-full py-4 border border-white/10 text-white/40 hover:text-white uppercase tracking-widest text-xs mt-4 hover:bg-white/5 rounded-sm transition-colors"
				>
					Cancel Protocol
				</button>
			)}
		</motion.div>
	);
}
