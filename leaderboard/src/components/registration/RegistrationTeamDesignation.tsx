import { useState } from "react";
import { motion } from "framer-motion";
import { Terminal } from "lucide-react";
import { Input } from "../ui/Input";

type RegistrationTeamDesignationProps = {
	onSetTeamName: (name: string) => void;
	primaryColor: string;
	onBack: () => void;
};

export function RegistrationTeamDesignation({
	onSetTeamName,
	onBack,
}: RegistrationTeamDesignationProps) {
	const [teamName, setTeamName] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (teamName.length < 3) return;

		setLoading(true);
		// Simulate API call
		setTimeout(() => {
			onSetTeamName(teamName);
			setLoading(false);
		}, 1000);
	};

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			className="space-y-6"
		>
			<div className="flex items-center gap-4 text-emerald-400 border-b border-white/10 pb-4">
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
						<label className="text-xs uppercase tracking-widest text-emerald-500 font-bold flex items-center gap-2">
							// TEAM CODE
						</label>
						<div className="relative">
							<Input
								placeholder="ENTER TEAM NAME (e.g. ALPHA)"
								value={teamName}
								onChange={(e) =>
									setTeamName(e.target.value.toUpperCase())
								}
								className="bg-black/40 border border-white/10 placeholder:text-white/20 h-16 text-xl tracking-[0.2em] font-black text-white px-6 focus:border-emerald-500/50"
							/>
							<div className="absolute top-0 right-0 h-full w-2 bg-emerald-500/20 animate-pulse" />
						</div>
						<p className="text-xs text-white/30 text-right *:*mt-1">
							MINIMUM 3 CHARACTERS
						</p>
					</div>

					<div className="flex gap-4">
						<button
							type="button"
							onClick={onBack}
							className="flex-1 py-6 border border-white/10 text-white/40 hover:text-white uppercase tracking-widest text-sm hover:bg-white/5 transition-colors rounded-sm"
						>
							Back
						</button>
						<button
							type="submit"
							disabled={teamName.length < 3 || loading}
							className="flex-[2] bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest py-6 text-lg rounded-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
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
