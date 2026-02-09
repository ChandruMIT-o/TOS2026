import React from "react";

interface HomeHeaderProps {
	primaryColor: string;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({ primaryColor }) => {
	return (
		<header className="mb-8 w-full max-w-4xl flex flex-col items-center">
			<div className="w-full flex justify-between text-[10px] md:text-xs font-mono text-white/90 mb-2 tracking-widest uppercase">
				<span className="bg-[#000]">SYS.VER.2.0.4</span>
				<span className="animate-pulse bg-[#000]">
					● SIGNAL ESTABLISHED
				</span>
				<span className="bg-[#000]">SECURE//ENCRYPTED</span>
			</div>

			<div
				className="cursor-target relative px-12 py-6 border-y border-white/90 bg-black/50 backdrop-blur-[2px] w-full text-center group transition-colors duration-500"
				style={{ borderColor: `${primaryColor}33` }} // 33 is approx 20% opacity
			>
				{/* Decorative Brackets */}
				<div
					className="absolute top-0 left-0 w-3 h-3 border-l-3 border-t-3 transition-colors duration-500"
					style={{ borderColor: primaryColor }}
				/>
				<div
					className="absolute top-0 right-0 w-3 h-3 border-r-3 border-t-3 transition-colors duration-500"
					style={{ borderColor: primaryColor }}
				/>
				<div
					className="absolute bottom-0 left-0 w-3 h-3 border-l-3 border-b-3 transition-colors duration-500"
					style={{ borderColor: primaryColor }}
				/>
				<div
					className="absolute bottom-0 right-0 w-3 h-3 border-r-3 border-b-3 transition-colors duration-500"
					style={{ borderColor: primaryColor }}
				/>

				<h1 className="text-3xl md:text-5xl font-black tracking-widest text-white uppercase drop-shadow-2xl">
					Tournament
					<span style={{ color: primaryColor }}>.OS</span>
				</h1>
				<div className="mt-2 flex items-center justify-center gap-3">
					<div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-white/50" />
					<span
						style={{ color: primaryColor }}
						className="text-[15px] tracking-[0.6em] uppercase text-white/60 font-medium"
					>
						Warfare Edition
					</span>
					<div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-white/50" />
				</div>
			</div>
		</header>
	);
};
