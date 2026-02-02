
export const TacticalGrid = () => {
	return (
		<div className="fixed inset-0 z-0 bg-[#020406]">
			{/* Base Grid - Dark Grey */}
			<div
				className="absolute inset-0 opacity-[0.2]"
				style={{
					backgroundImage: `
                        linear-gradient(to right, #8ea2bdff 1px, transparent 1px),
                        linear-gradient(to bottom, #334155 1px, transparent 1px)
                    `,
					backgroundSize: "60px 60px",
					// Fade out edges so it doesn't look like a hard wall
					maskImage:
						"radial-gradient(circle at 50% 50%, black 30%, transparent 100%)",
					WebkitMaskImage:
						"radial-gradient(circle at 50% 50%, black 30%, transparent 100%)",
				}}
			/>

			{/* Secondary Finer Grid - Emerald Hint */}
			<div
				className="absolute inset-0 opacity-[0.08]"
				style={{
					backgroundImage: `
                        linear-gradient(to right, #3fdfa9ff 1px, transparent 1px),
                        linear-gradient(to bottom, #10b981 1px, transparent 1px)
                    `,
					backgroundSize: "14px 14px",
					maskImage:
						"radial-gradient(circle at 50% 50%, black 20%, transparent 90%)",
					WebkitMaskImage:
						"radial-gradient(circle at 50% 50%, black 20%, transparent 90%)",
				}}
			/>

			{/* Radar Sweep Effect */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div
					className="w-[200%] h-[40vh] -left-1/2 absolute bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent animate-scan"
				/>
			</div>

			{/* Floating Orbs for "Simulation" feel */}
			<div
				className="absolute top-[20%] left-[15%] w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] animate-pulse"
				style={{ animationDuration: "4s" }}
			/>
			<div
				className="absolute bottom-[20%] right-[15%] w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] animate-pulse"
				style={{ animationDuration: "7s" }}
			/>
            
            <style>{`
                @keyframes scan {
                    0% { transform: translateY(-100%) rotate(5deg); }
                    100% { transform: translateY(300%) rotate(5deg); }
                }
                .animate-scan {
                    animation: scan 8s linear infinite;
                }
            `}</style>
		</div>
	);
};
