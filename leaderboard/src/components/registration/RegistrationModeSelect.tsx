import { motion } from "framer-motion";
import { User, Users } from "lucide-react";

type RegistrationModeSelectProps = {
	onSelectMode: (mode: "SOLO" | "DUO") => void;
	primaryColor: string;
	onBack: () => void;
};

export function RegistrationModeSelect({
	onSelectMode,
	onBack,
}: RegistrationModeSelectProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="space-y-8 text-center"
		>
			<h3 className="text-xl uppercase tracking-widest text-emerald-500 font-bold border-b border-white/10 pb-4">
				Select Operation Protocol
			</h3>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<button
					onClick={() => onSelectMode("SOLO")}
					className="group relative p-8 border border-white/10 hover:border-emerald-500/50 bg-white/5 hover:bg-emerald-500/10 transition-all rounded-sm flex flex-col items-center gap-4 py-16"
				>
					<User
						size={48}
						className="text-white/40 group-hover:text-emerald-400 transition-colors"
					/>
					<span className="text-2xl font-black uppercase tracking-widest text-white group-hover:text-emerald-400">
						SOLO OP
					</span>
					<span className="text-xs text-white/40 font-mono max-w-[200px]">
						Single operative deployment. Standard protocol.
					</span>

					<div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
				</button>

				<button
					onClick={() => onSelectMode("DUO")}
					className="group relative p-8 border border-white/10 hover:border-emerald-500/50 bg-white/5 hover:bg-emerald-500/10 transition-all rounded-sm flex flex-col items-center gap-4 py-16"
				>
					<Users
						size={48}
						className="text-white/40 group-hover:text-emerald-400 transition-colors"
					/>
					<span className="text-2xl font-black uppercase tracking-widest text-white group-hover:text-emerald-400">
						DUO SQUAD
					</span>
					<span className="text-xs text-white/40 font-mono max-w-[200px]">
						Joint task force. Two operatives required.
					</span>

					<div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
				</button>
			</div>
			<button
				onClick={onBack}
				className="w-full py-4 border border-white/10 text-white/40 hover:text-white uppercase tracking-widest text-xs mt-8 transition-colors hover:bg-white/5 rounded-sm"
			>
				Back to Login
			</button>
		</motion.div>
	);
}
