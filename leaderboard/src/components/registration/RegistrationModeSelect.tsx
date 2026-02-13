import { motion } from "framer-motion";
import { Users, Target } from "lucide-react";

type RegistrationModeSelectProps = {
	onSelectMode: (mode: "SOLO" | "DUO") => void;
	primaryColor: string;
	onBack: () => void;
};

export function RegistrationModeSelect({
	onSelectMode,
	primaryColor = "#10b981", // Default Emerald
	onBack,
}: RegistrationModeSelectProps) {
	// Reusable Card Component to keep code clean
	const ModeCard = ({
		mode,
		title,
		desc,
		icon: Icon,
	}: {
		mode: "SOLO" | "DUO";
		title: string;
		desc: string;
		icon: any;
		delay: number;
	}) => (
		<motion.button
			onClick={() => onSelectMode(mode)}
			className="cursor-target group relative w-full border border-white/10 bg-black/40 hover:bg-white/5 transition-all duration-300 rounded-sm p-8 flex flex-col items-center gap-6 overflow-hidden cursor-pointer"
			style={{
				borderColor: "rgba(255,255,255,0.1)",
			}}
		>
			{/* --- THE SCANNER EFFECT (From Login) --- */}
			<span
				style={{
					backgroundColor: primaryColor,
					boxShadow: `0 0 20px 10px ${primaryColor}4d`, // Glow width
				}}
				className="absolute -top-[150%] left-0 inline-flex w-full h-[2px] opacity-0 group-hover:opacity-50 group-hover:top-[150%] duration-1000 ease-in-out z-20"
			/>

			{/* Hover Border Highlight (Inset) */}
			<div
				className="absolute inset-0 border-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
				style={{ borderColor: primaryColor }}
			/>

			{/* Corner Brackets (Animated) */}
			<div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-white/20 group-hover:w-full group-hover:h-full transition-all duration-500 ease-out opacity-50" />
			<div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-white/20 group-hover:w-full group-hover:h-full transition-all duration-500 ease-out opacity-50" />

			{/* Background Grid Pattern */}
			<div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

			{/* Icon Wrapper with Glow */}
			<div className="relative group-hover:-translate-y-2 transition-transform duration-300">
				<div
					className="absolute inset-0 blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500"
					style={{ backgroundColor: primaryColor }}
				/>
				<Icon
					size={56}
					className="relative z-10 text-white/40 group-hover:text-white transition-colors duration-300"
					strokeWidth={1.5}
				/>
			</div>

			{/* Text Content */}
			<div className="relative z-10 space-y-2 text-center">
				<h4
					className="text-2xl font-black uppercase tracking-[0.2em] text-white group-hover:text-emerald-400 transition-colors"
					style={{ color: "white" }} // Initial color
				>
					<span
						className="group-hover:text-[var(--primary)]"
						style={{ "--primary": primaryColor } as any}
					>
						{title}
					</span>
				</h4>
				<div
					className="h-px w-8 bg-white/20 mx-auto group-hover:w-24 transition-all duration-500"
					style={{ backgroundColor: `white` }}
				/>
				<p className="text-xs font-mono text-white/40 max-w-[220px] mx-auto uppercase tracking-wide leading-relaxed">
					{desc}
				</p>
			</div>

			{/* Bottom "Select" Label */}
			<div className="mt-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
				<span
					className="text-[10px] font-bold uppercase tracking-widest py-1 px-3 border"
					style={{
						color: primaryColor,
						borderColor: primaryColor,
						backgroundColor: `${primaryColor}10`,
					}}
				>
					[ Initiate ]
				</span>
			</div>
		</motion.button>
	);

	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -10 }}
			className="w-full max-w-2xl mx-auto pt-10 pb-10 font-mono"
		>
			{/* Header */}
			<div className="mb-10 text-center space-y-4">
				<motion.div
					initial={{ scale: 0.9, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					className="inline-flex items-center gap-2 px-3 py-1 border border-white/10 rounded-full bg-white/5 text-[10px] text-emerald-400 uppercase tracking-widest mb-2"
				>
					<div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
					System Ready
				</motion.div>

				<h3 className="text-2xl md:text-3xl font-black uppercase tracking-widest text-white">
					Operational Parameters
				</h3>
				<p className="text-xs text-white/40 font-mono uppercase tracking-wider">
					Select deployment protocol to proceed
				</p>
			</div>

			{/* Grid Selection */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
				<ModeCard
					mode="SOLO"
					title="Solo Op"
					desc="Single operative deployment. Standard loadout configuration."
					icon={Target}
					delay={0.1}
				/>

				<ModeCard
					mode="DUO"
					title="Duo Squad"
					desc="Joint Task Force. Synchronized link required."
					icon={Users}
					delay={0.2}
				/>
			</div>

			{/* Back Action */}
			<button
				onClick={onBack}
				style={{ borderColor: primaryColor }}
				className="cursor-target w-full py-4 border border-white/10 text-white/40 hover:text-white uppercase tracking-widest text-xs mt-4 hover:bg-white/5 rounded-sm transition-colors"
			>
				Return to Authentication
			</button>
		</motion.div>
	);
}
