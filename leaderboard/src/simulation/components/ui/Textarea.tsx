import * as React from "react";
import { cn } from "../../../lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
	({ className, ...props }, ref) => {
		return (
			<textarea
				className={cn(
					// Layout
					"flex min-h-[80px] w-full px-3 py-2 text-sm",
					"resize-y", // Allow vertical resizing

					// Transitions
					"transition-all duration-200 ease-in-out",

					// Typography
					"font-mono font-medium leading-relaxed",
					// Text Color: Almost White (Mint Cream)
					"text-[#ecfdf5]",
					// Placeholder: Muted Zinc
					"placeholder:text-[#52525b]",

					// Base Styles (Idle)
					// Background: Very Dark Zinc (almost black)
					"bg-[#09090b]",
					// Border: Dark Grey (Zinc 800)
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

					className,
				)}
				ref={ref}
				{...props}
			/>
		);
	},
);
Textarea.displayName = "Textarea";

export { Textarea };
