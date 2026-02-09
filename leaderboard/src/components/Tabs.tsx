import { motion } from "framer-motion";
import { cn } from "../lib/utils";
import { Lock } from "lucide-react";

interface Tab {
	id: string;
	label: string;
	disabled?: boolean;
}

interface TabsProps {
	tabs: Tab[];
	activeTab: string;
	onTabChange: (id: string) => void;
	onDisabledTabClick?: (id: string) => void;
	primaryColor: string;
}

export function Tabs({
	tabs,
	activeTab,
	primaryColor,
	onTabChange,
	onDisabledTabClick,
}: TabsProps) {
	return (
		<div className="cursor-hidden relative flex p-1 bg-black/60 border border-white/10 w-fit max-w-full overflow-x-auto mx-auto mb-12 backdrop-blur-sm rounded-sm">
			{/* Optional: Decorative Grid Background behind tabs */}

			{tabs.map((tab) => {
				const isActive = activeTab === tab.id;

				return (
					<button
						key={tab.id}
						onClick={() => {
							if (tab.disabled) {
								onDisabledTabClick?.(tab.id);
							} else {
								onTabChange(tab.id);
							}
						}}
						className={cn(
							"cursor-target relative px-4 py-2 md:px-8 md:py-3 text-xs md:text-sm font-bold uppercase tracking-widest md:tracking-[0.2em] font-mono transition-colors duration-300 z-10 outline-none whitespace-nowrap flex items-center gap-2",
							isActive
								? "text-emerald-400"
								: "text-white/40 hover:text-white/70",
							tab.disabled &&
								"opacity-50 cursor-not-allowed hover:text-white/40",
						)}
						style={{
							color: isActive
								? primaryColor
								: tab.disabled
									? "#555"
									: "#9a9a9a",
						}}
					>
						{/* The Active State "Highlight" moving behind the text */}
						{isActive && (
							<motion.div
								layoutId="active-tab"
								className="absolute inset-0 border border-white/10"
								transition={{
									type: "spring",
									bounce: 0.15,
									duration: 0.6,
								}}
								style={{ zIndex: -1 }}
							>
								{/* Tactical Accents on the Active Tab */}
								<div
									style={{ backgroundColor: primaryColor }}
									className="absolute bottom-0 left-0 right-0 h-[2px] shadow-[0_0_10px_#10b981]"
								/>
								<div className="absolute top-0 left-0 w-1 h-1 bg-white/30" />
								<div className="absolute top-0 right-0 w-1 h-1 bg-white/30" />

								{/* Subtle Scanline Animation inside the active tab */}
								<div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.03)_50%,transparent_100%)] animate-[shimmer_2s_infinite]" />
							</motion.div>
						)}

						<span className="relative z-10 flex items-center gap-2">
							{/* Optional: Add a tiny indicator dot for the active tab */}
							{isActive && (
								<span className="w-1.5 h-1.5 rounded-full animate-pulse bg-current" />
							)}
							{tab.disabled && (
								<Lock size={12} className="opacity-70" />
							)}
							{tab.label}
						</span>
					</button>
				);
			})}
		</div>
	);
}
