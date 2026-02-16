import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "../ui/Input"; // Assuming this is your shadcn or custom input
import { Terminal, ShieldAlert, ExternalLink, Cpu, Wifi } from "lucide-react";
import type { User } from "./types";
import { login } from "../../auth/session";
import { cn } from "../../lib/utils";
import { Eye, EyeOff } from "lucide-react";

type RegistrationLoginProps = {
	onLoginSuccess: (user: User) => void;
	primaryColor: string;
};

export function RegistrationLogin({
	onLoginSuccess,
	primaryColor,
}: RegistrationLoginProps) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [showPassword, setShowPassword] = useState(false);

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			// Real login call
			const userCredential = await login(email, password);
			const user: User = {
				id: userCredential.uid,
				email: userCredential.email || email,
				name: userCredential.displayName || email.split("@")[0], // Fallback if no display name
				phone: "", // TODO: Fetch from profile if exists
				ticketId: "",
				hasTicket: false,
			};

			// Artificial delay to show off the "Authenticating" state
			await new Promise((resolve) => setTimeout(resolve, 800));

			onLoginSuccess(user);
		} catch (err: any) {
			// Sanitize Firebase Format: "Firebase: Error (auth/invalid-credential)." -> "Error (auth/invalid-credential)"
			const errorMessage = err.message || "CONNECTION SEVERED";
			const sanitizedError = errorMessage
				.replace("Firebase: ", "")
				.replace(/\.$/, "");
			setError(sanitizedError);
		} finally {
			setLoading(false);
		}
	};

	function onForgotPassword() {
		window.open("https://tekhora26.live/signin", "_blank");
		return;
	}

	return (
		<div className="w-full max-w-xl mx-auto pt-10 pb-10 font-mono">
			{/* --- Warning / Context Module --- */}
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.1 }}
				className="mb-10 relative overflow-hidden rounded-sm border border-red-500/30 bg-red-950/20 p-6"
			>
				{/* Background Scanline Effect */}
				<div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(220,38,38,0.05)_3px)]" />

				<div className="flex gap-4 relative z-10">
					<ShieldAlert className="text-red-500 shrink-0 w-6 h-6 mt-1" />
					<div className="space-y-4 flex-1">
						<div>
							<h3 className="text-red-400 font-bold uppercase tracking-widest text-sm mb-2">
								// Restricted Access Protocol
							</h3>
							<p className="text-xs text-red-200/70 font-mono leading-relaxed uppercase">
								Only personnel with valid event tickets for
								TOS2026 may proceed. Credentials must match your
								event registration data.
							</p>
						</div>
					</div>
				</div>
				<a
					href="https://tekhora26.live"
					target="_blank"
					rel="noopener noreferrer"
					className="cursor-target relative w-full mt-4 overflow-hidden flex items-center justify-center gap-3 px-6 py-3 border border-red-500/30 bg-red-400/20 font-bold uppercase tracking-widest text-xs hover:text-white hover:border-red-400 transition-all duration-300 group"
				>
					<span className="relative z-10 flex items-center gap-2">
						TEKHORA26.LIVE <ExternalLink size={14} />
					</span>
				</a>
			</motion.div>

			{/* --- Login Form --- */}
			<form onSubmit={handleLogin} className="space-y-8">
				{/* Field 01: Email */}
				<div className="space-y-4 group">
					<label
						style={{ color: primaryColor }}
						className="text-sm uppercase tracking-widest font-bold pl-1 flex items-center gap-3"
					>
						<Terminal size={16} /> 01. Operator Identity
					</label>

					<div className="relative">
						<Input
							type="email"
							placeholder="TEKHORA REGISTERED EMAIL"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							disabled={loading}
							className="cursor-target bg-black/40 border border-white/10 placeholder:text-white/20 focus:outline-none focus:border-black focus:ring-0 transition-all duration-300 tracking-widest h-16 text-lg px-4"
							style={{ caretColor: primaryColor }}
						/>
						{/* Corner Accents */}
						<div
							className="absolute -bottom-1 -right-1 w-3 h-3 border-r-2 border-b-2 opacity-50"
							style={{ borderColor: primaryColor }}
						/>
						<div
							className="absolute -top-1 -left-1 w-3 h-3 border-l-2 border-t-2 opacity-50"
							style={{ borderColor: primaryColor }}
						/>
					</div>
				</div>

				{/* Field 02: Password with Eye icon */}
				<div className="space-y-4 group">
					<label
						style={{ color: primaryColor }}
						className="text-sm uppercase tracking-widest font-bold pl-1 flex items-center gap-3"
					>
						<Cpu size={16} /> 02. Security Clearance
					</label>

					<div className="relative">
						<Input
							type={showPassword ? "text" : "password"}
							placeholder="TEKHORA PASSWORD"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							disabled={loading}
							className="cursor-target bg-black/40 border border-white/10 placeholder:text-white/20 focus:outline-none focus:border-black focus:ring-0 transition-all duration-300 tracking-widest h-16 text-lg px-4 pr-14"
							style={{ caretColor: primaryColor }}
						/>

						{/* Eye Toggle */}
						<button
							type="button"
							onClick={() => setShowPassword((prev) => !prev)}
							className="cursor-target absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition"
							tabIndex={-1}
						>
							{showPassword ? (
								<EyeOff size={24} />
							) : (
								<Eye size={24} />
							)}
						</button>

						{/* Corner Accents */}
						<div
							className="absolute -bottom-1 -right-1 w-3 h-3 border-r-2 border-b-2 opacity-50"
							style={{ borderColor: primaryColor }}
						/>
						<div
							className="absolute -top-1 -left-1 w-3 h-3 border-l-2 border-t-2 opacity-50"
							style={{ borderColor: primaryColor }}
						/>
					</div>
				</div>

				{/* Error Console */}
				<AnimatePresence>
					{error && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							className="overflow-hidden"
						>
							<div className="bg-red-500/10 border-l-2 border-red-500 p-4 mb-4 flex items-center gap-3">
								<ShieldAlert
									size={18}
									className="text-red-500 animate-pulse"
								/>
								<span className="text-red-400 font-mono text-xs uppercase tracking-wider">
									Error: {error}
								</span>
							</div>
						</motion.div>
					)}
				</AnimatePresence>

				{/* Submit Action */}
				<button
					type="submit"
					disabled={loading}
					style={{
						color: primaryColor,
						borderColor: primaryColor,
						backgroundColor: loading ? "#262626" : "#0f0f0f", // Very dark background to contrast with primaryColor
					}}
					className={cn(
						"w-full border border-b-4 font-black uppercase tracking-[0.2em] overflow-hidden relative py-6 hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group cursor-target",
						loading && "opacity-50 cursor-not-allowed",
					)}
				>
					{!loading && (
						<span
							style={{
								backgroundColor: primaryColor,
								boxShadow: `0 0 10px 10px ${primaryColor}4d`, // 30% opacity equivalent
							}}
							className="absolute -top-[150%] left-0 inline-flex w-full h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500"
						/>
					)}

					<span className="relative z-10 flex items-center justify-center gap-4 text-sm md:text-base">
						{loading ? (
							<>
								<Wifi className="animate-ping" size={16} />
								ESTABLISHING UPLINK...
							</>
						) : (
							<>AUTHENTICATE</>
						)}
					</span>
				</button>

				{/* forgot password button */}
				<button
					type="button"
					onClick={() => {
						onForgotPassword();
					}}
					className="cursor-target text-lg uppercase w-full h-16 tracking-widest text-blue-200 hover:text-blue-400 border border-blue-200 hover:border-blue-500/50 px-3 py-1 bg-blue-950/20 transition-all"
				>
					FORGOT PASSWORD : TO MAIN WEBSITE
				</button>
			</form>
		</div>
	);
}
