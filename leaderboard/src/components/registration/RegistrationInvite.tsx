import { motion } from "framer-motion";
import { User, CheckCircle2, XCircle } from "lucide-react";
import type { User as UserType } from "./types";

type RegistrationInviteProps = {
	inviteFrom: UserType;
	onAccept: () => void;
	onReject: () => void;
	primaryColor: string;
};

export function RegistrationInvite({
	inviteFrom,
	onAccept,
	onReject,
}: RegistrationInviteProps) {
	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			className="space-y-8 text-center p-8 border border-emerald-500/30 bg-emerald-500/5 rounded-sm relative overflow-hidden"
		>
			<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-shimmer" />

			<div className="space-y-4">
				<h3 className="text-xl font-bold uppercase tracking-widest text-emerald-400 flex items-center justify-center gap-3">
					<User size={24} /> Incoming Transmission
				</h3>

				<p className="text-white/80 font-mono text-sm leading-relaxed max-w-sm mx-auto">
					Operative{" "}
					<span className="text-emerald-400 font-bold">
						{inviteFrom.name}
					</span>{" "}
					({inviteFrom.email}) has requested a Duo Uplink.
				</p>

				<div className="p-4 bg-black/40 border border-emerald-500/20 rounded-sm">
					<p className="text-xs text-white/40 uppercase tracking-widest mb-1">
						Squad Request From
					</p>
					<p className="text-lg font-bold text-white uppercase">
						{inviteFrom.name}
					</p>
					<p className="text-xs text-emerald-500/60 font-mono">
						{inviteFrom.phone}
					</p>
				</div>
			</div>

			<div className="flex gap-4 justify-center pt-4">
				<button
					onClick={onReject}
					className="flex items-center gap-2 px-6 py-3 border border-red-500/30 text-red-400 hover:bg-red-500/10 uppercase tracking-widest text-xs font-bold rounded-sm transition-colors"
				>
					<XCircle size={14} /> Reject
				</button>
				<button
					onClick={onAccept}
					className="flex items-center gap-2 px-8 py-3 bg-emerald-500 text-black hover:bg-emerald-400 uppercase tracking-widest text-xs font-bold rounded-sm transition-colors shadow-[0_0_15px_rgba(16,185,129,0.2)]"
				>
					<CheckCircle2 size={14} /> Accept Uplink
				</button>
			</div>
		</motion.div>
	);
}
