import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Mail, Loader2, CheckCircle2 } from "lucide-react";
import type { User as UserType } from "./types";
import { Input } from "../ui/Input";
import { sendInvite } from "./mockApi";

type RegistrationDuoProps = {
	currentUser: UserType;
	primaryColor: string;
	onConfirm: (partner: UserType) => void;
	onBack: () => void;
	partner?: UserType | null;
};

export function RegistrationDuo({
	currentUser,
	onConfirm,
	onBack,
	partner: initialPartner,
	primaryColor,
}: RegistrationDuoProps) {
	const [partnerEmail, setPartnerEmail] = useState(
		initialPartner?.email || "",
	);
	const [inviteStatus, setInviteStatus] = useState<
		"IDLE" | "SENDING" | "SENT" | "ACCEPTED"
	>(initialPartner ? "ACCEPTED" : "IDLE");
	const [partner, setPartner] = useState<UserType | null>(
		initialPartner || null,
	);

	const handleSendInvite = async () => {
		if (!partnerEmail.includes("@")) return;
		setInviteStatus("SENDING");

		try {
			await sendInvite(currentUser, partnerEmail);
			setInviteStatus("SENT");

			// Simulate polling for acceptance
			// In a real app, this would be a socket or periodic fetch
			// For demo, we'll auto-accept after 3 seconds if the email matches a mock user
			if (
				partnerEmail === "operative2@tos.com" ||
				partnerEmail === "operative1@tos.com"
			) {
				setTimeout(() => {
					setInviteStatus("ACCEPTED");
					// Mock partner data
					setPartner({
						id: "mock-partner",
						name: "Ghost",
						email: partnerEmail,
						phone: "999-002-2002",
						ticketId: "TOS-002",
						hasTicket: true,
					});
				}, 3000);
			}
		} catch (e) {
			console.error(e);
			setInviteStatus("IDLE");
		}
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
							onClick={onBack}
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

			{inviteStatus !== "ACCEPTED" && (
				<button
					onClick={onBack}
					style={{ borderColor: primaryColor }}
					className="cursor-target w-full py-4 border border-white/10 text-white/40 hover:text-white uppercase tracking-widest text-xs mt-4 hover:bg-white/5 rounded-sm transition-colors"
				>
					Cancel Protocol
				</button>
			)}
		</motion.div>
	);
}
