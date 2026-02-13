import { motion } from "framer-motion";
import { User as UserIcon, Phone, Ticket } from "lucide-react";
import type { User } from "./types";

type RegistrationSoloProps = {
	user: User;
	onConfirm: () => void;
	onBack: () => void;
	primaryColor: string;
};

export function RegistrationSolo({
	user,
	onConfirm,
	onBack,
	primaryColor = "#10b981", // Default Emerald
}: RegistrationSoloProps) {
	return (
		<motion.div
			initial={{ opacity: 0, x: 20 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -20 }}
			className="space-y-6 mt-6"
		>
			<div
				style={{ color: primaryColor }}
				className="flex items-center gap-4 text-emerald-400 border-b border-white/10 pb-4"
			>
				<UserIcon size={24} />
				<h3 className="text-xl font-bold uppercase tracking-widest">
					Operative Profile // CONFIRMED
				</h3>
			</div>

			<div className="space-y-4 p-6 bg-white/5 border border-white/10 rounded-sm">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="space-y-2">
						<label className="text-xs text-white/40 uppercase tracking-widest">
							Callsign
						</label>
						<div className="text-lg font-mono text-white border-b border-white/20 pb-2">
							{user.name}
						</div>
					</div>

					<div className="space-y-2">
						<label className="text-xs text-white/40 uppercase tracking-widest flex items-center gap-2">
							<Phone size={12} /> Priority Com-Link
						</label>
						<div className="text-lg font-mono text-white border-b border-white/20 pb-2">
							{user.phone}
						</div>
					</div>

					<div className="space-y-2 col-span-full">
						<label className="text-xs text-white/40 uppercase tracking-widest flex items-center gap-2">
							Access ID (Email)
						</label>
						<div className="text-base font-mono text-white/70 border-b border-white/20 pb-2">
							{user.email}
						</div>
					</div>

					<div className="space-y-2 col-span-full">
						<label
							style={{ color: primaryColor }}
							className="text-xs text-emerald-500/80 uppercase tracking-widest flex items-center gap-2"
						>
							<Ticket size={12} /> Ticket Verification
						</label>
						<div
							style={{ color: primaryColor }}
							className="text-base font-mono text-emerald-400 border-b border-emerald-500/20 pb-2 flex justify-between"
						>
							<span>VALIDATED</span>
							<span className="opacity-50">{user.ticketId}</span>
						</div>
					</div>
				</div>
			</div>

			<div className="flex gap-4 pt-4">
				<button
					onClick={onBack}
					style={{ borderColor: primaryColor }}
					className="cursor-target flex-1 py-4 border border-white/10 text-white/40 hover:text-white uppercase tracking-widest text-sm hover:bg-white/5 transition-colors"
				>
					Back
				</button>
				<button
					onClick={onConfirm}
					style={{ backgroundColor: primaryColor }}
					className="cursor-target flex-[2] bg-emerald-500 text-black font-bold uppercase tracking-widest py-4 hover:bg-emerald-400 transition-colors"
				>
					Confirm & Proceed
				</button>
			</div>
		</motion.div>
	);
}
