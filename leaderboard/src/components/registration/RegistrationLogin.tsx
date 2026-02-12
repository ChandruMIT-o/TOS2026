import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "../ui/Input";
import { Lock, Terminal, ShieldAlert, ExternalLink } from "lucide-react";
import type { User } from "./types";
import { loginUser } from "./mockApi";

type RegistrationLoginProps = {
	onLoginSuccess: (user: User) => void;
	primaryColor: string;
};

export function RegistrationLogin({ onLoginSuccess }: RegistrationLoginProps) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			// Mock login - in real app, verify password too
			if (password.length < 4) throw new Error("INVALID CREDENTIALS");

			const user = await loginUser(email);
			onLoginSuccess(user);
		} catch (err: any) {
			setError(err.message || "LOGIN FALIED");
		} finally {
			setLoading(false);
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			className="space-y-8 w-full max-w-md mx-auto"
		>
			<div className="bg-red-500/10 border border-red-500/20 p-4 rounded-sm flex flex-col gap-4">
				<div className="flex gap-3">
					<ShieldAlert className="text-red-500 shrink-0" />
					<p className="text-xs text-red-200/80 font-mono leading-relaxed">
						WARNING: RESTRICTED ACCESS. ONLY PERSONNEL WITH EVENT
						TICKETS FOR TOS2026 MAY PROCEED. USE THE SAME EMAIL AND
						PASSWORD YOU USED TO LOGIN TO THE EVENT.
					</p>
				</div>
				<a
					href="https://tekhora26.live"
					target="_blank"
					rel="noopener noreferrer"
					className="ml-9 flex items-center justify-center gap-2 bg-red-500 text-black font-bold text-xs uppercase tracking-widest py-3 rounded-sm hover:bg-red-400 transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:shadow-[0_0_20px_rgba(239,68,68,0.5)]"
				>
					Visit TEKHORA26.LIVE <ExternalLink size={14} />
				</a>
			</div>

			<div className="space-y-4">
				<div className="space-y-2">
					<label className="text-xs uppercase tracking-widest text-emerald-500 font-bold flex items-center gap-2">
						<Terminal size={14} /> Operator Email
					</label>
					<Input
						type="email"
						placeholder="ENTER EMAIL"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="bg-black/40 border-white/10 text-white placeholder:text-white/20 h-12 font-mono tracking-wider focus:border-emerald-500/50"
					/>
				</div>

				<div className="space-y-2">
					<label className="text-xs uppercase tracking-widest text-emerald-500 font-bold flex items-center gap-2">
						<Lock size={14} /> Access Code
					</label>
					<Input
						type="password"
						placeholder="••••••••"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="bg-black/40 border-white/10 text-white placeholder:text-white/20 h-12 font-mono tracking-wider focus:border-emerald-500/50"
					/>
				</div>
			</div>

			{error && (
				<div className="text-red-400 text-sm font-mono bg-red-500/5 p-2 border border-red-500/20">
					// ERROR: {error}
				</div>
			)}

			<button
				onClick={handleLogin}
				disabled={loading}
				className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase tracking-widest py-4 rounded-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{loading ? "AUTHENTICATING..." : "ESTABLISH UPLINK"}
			</button>
		</motion.div>
	);
}
