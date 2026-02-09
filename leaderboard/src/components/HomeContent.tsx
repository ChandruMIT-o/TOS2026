import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HomeTab } from "./HomeTab";
import { Registration } from "./Registration";
import { TestingEnv } from "./TestingEnv";
import { Leaderboard } from "./Leaderboard";

interface HomeContentProps {
	activeTab: string;
	isPerformanceMode: boolean;
	contentRef: React.RefObject<HTMLDivElement | null>;
	primaryColor: string;
	glitchChars: string;
}

export const HomeContent: React.FC<HomeContentProps> = ({
	activeTab,
	isPerformanceMode,
	contentRef,
	primaryColor,
	glitchChars,
}) => {
	return (
		<main
			className={`flex-1 w-full relative group transition-all duration-100 ease-[cubic-bezier(0.25,1,0.5,1)] ${
				activeTab === "testing" && isPerformanceMode
					? "w-full max-w-none px-0"
					: activeTab === "home" || activeTab === "testing"
						? "max-w-[98vw] px-0"
						: activeTab === "leaderboard"
							? "max-w-4xl"
							: "max-w-3xl"
			}`}
		>
			<AnimatePresence mode="popLayout">
				<motion.div
					key={activeTab}
					initial={{
						opacity: 0,
						scale: 0.98,
						filter: "blur(10px)",
					}}
					animate={{
						opacity: 1,
						scale: 1,
						filter: "blur(0px)",
					}}
					exit={{
						opacity: 0,
						scale: 0.98,
						filter: "blur(10px)",
					}}
					transition={{ duration: 0.4, ease: "circOut" }}
					className="relative w-full overflow-hidden"
				>
					<div
						ref={contentRef}
						className={`relative ${
							activeTab === "testing" ||
							(activeTab === "home" && isPerformanceMode)
								? ""
								: "bg-[#0a0a0a]/98 backdrop-blur-xl border border-white/10 p-6 md:p-10 shadow-2xl rounded-sm"
						}`}
					>
						{/* Decorative Brackets & Glow - Hide in testing */}
						{activeTab !== "testing" && (
							<>
								<div
									className="absolute top-0 left-0 w-5 h-5 border-l-3 border-t-3 transition-colors duration-500"
									style={{
										borderColor: primaryColor,
									}}
								/>
								<div
									className="absolute top-0 right-0 w-5 h-5 border-r-3 border-t-3 transition-colors duration-500"
									style={{
										borderColor: primaryColor,
									}}
								/>
								<div
									className="absolute bottom-0 left-0 w-5 h-5 border-l-3 border-b-3 transition-colors duration-500"
									style={{
										borderColor: primaryColor,
									}}
								/>
								<div
									className="absolute bottom-0 right-0 w-5 h-5 border-r-3 border-b-3 transition-colors duration-500"
									style={{
										borderColor: primaryColor,
									}}
								/>
								{/* Glowing border accent */}
								<div
									className="absolute top-0 left-0 w-full h-[1px] opacity-50"
									style={{
										background: `linear-gradient(90deg, transparent, ${primaryColor}, transparent)`,
									}}
								/>
								{/* Background Grid Pattern inside container */}
								<div
									className="absolute inset-0 z-0 opacity-[0.03]"
									style={{
										backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`,
										backgroundSize: "40px 40px",
									}}
								/>
							</>
						)}

						{/* Content Render */}
						<div className="relative z-10">
							{activeTab === "home" && (
								<HomeTab
									primaryColor={primaryColor}
									stringList={glitchChars}
								/>
							)}
							{activeTab === "registration" && (
								<Registration primaryColor={primaryColor} />
							)}
							{activeTab === "testing" && <TestingEnv />}
							{activeTab === "leaderboard" && <Leaderboard />}
						</div>
					</div>
				</motion.div>
			</AnimatePresence>
		</main>
	);
};
