import * as React from "react";
import { cn } from "../../../lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, ...props }, ref) => {
		return (
			<div className="relative group">
				<input
					type={type}
					className={cn(
						// Layout
						"flex h-10 w-full px-3 py-2 text-sm",
						"transition-all duration-200 ease-in-out",

						// Typography
						"font-mono font-medium tracking-tight",
						// Text Color: Almost White
						"text-[#ecfdf5]",
						// Placeholder: Muted Zinc
						"placeholder:text-[#52525b]",

						// Base Styles (Idle)
						// Background: Very Dark Zinc (almost black)
						"bg-[#09090b]",
						// Border: Dark Grey
						"border border-[#27272a]",

						// Focus State (The 'Glow')
						"focus-visible:outline-none",
						// Border: Emerald 500
						"focus-visible:border-[#10b981]",
						// Ring: Emerald with opacity
						"focus-visible:ring-1 focus-visible:ring-[#10b981]/20",
						// Shadow: Emerald Glow
						"focus-visible:shadow-[0_0_15px_rgba(16,185,129,0.25)]",

						// Disabled State
						"disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[#18181b]",

						// File Input styles
						"file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[#ecfdf5]",

						className,
					)}
					ref={ref}
					{...props}
				/>
			</div>
		);
	},
);
Input.displayName = "Input";

export { Input };
