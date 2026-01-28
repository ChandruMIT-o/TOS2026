import { motion } from "framer-motion";
import { cn } from "../lib/utils";

interface Tab {
	id: string;
	label: string;
}

interface TabsProps {
	tabs: Tab[];
	activeTab: string;
	onTabChange: (id: string) => void;
	primaryColor: string;
}

export function Tabs({
	tabs,
	activeTab,
	primaryColor,
	onTabChange,
}: TabsProps) {
	return (
		<div className="relative flex p-1 bg-black/60 border border-white/10 w-fit mx-auto mb-12 backdrop-blur-sm rounded-sm">
			{/* Optional: Decorative Grid Background behind tabs */}

			{tabs.map((tab) => {
				const isActive = activeTab === tab.id;

				return (
					<button
						key={tab.id}
						onClick={() => onTabChange(tab.id)}
						className={cn(
							"relative px-8 py-3 text-sm font-bold uppercase tracking-[0.2em] font-mono transition-colors duration-300 z-10 outline-none",
							isActive
								? "text-emerald-400"
								: "text-white/40 hover:text-white/70",
						)}
						style={{ color: isActive ? primaryColor : "#9a9a9a" }}
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
								<span className="w-1.5 h-1.5 rounded-full animate-pulse" />
							)}
							{tab.label}
						</span>
					</button>
				);
			})}
		</div>
	);
}
