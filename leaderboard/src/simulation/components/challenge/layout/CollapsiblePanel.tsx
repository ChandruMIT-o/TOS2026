import * as React from "react";
import { ChevronDown, ChevronRight, type LucideIcon } from "lucide-react";
import { Card } from "../../ui/Card";
import { cn } from "../../../../lib/utils";

interface CollapsiblePanelProps {
	title: string;
	icon: LucideIcon;
	children: React.ReactNode;
	isCollapsed: boolean;
	onToggle: () => void;
	className?: string;
	actionElement?: React.ReactNode; // Optional header button (e.g., refresh)
}

export function CollapsiblePanel({
	title,
	icon: Icon,
	children,
	isCollapsed,
	onToggle,
	className,
	actionElement,
}: CollapsiblePanelProps) {
	return (
		<Card
			className={cn(
				"flex flex-col overflow-hidden transition-all duration-300 ease-in-out rounded-none border-black border",
				isCollapsed ? "flex-none h-[50px]" : "flex-1 h-full", // Flex magic here
				className,
			)}
		>
			{/* Header */}
			<div
				className="group flex items-center justify-between px-4 py-3 border-b border-black bg-[#ececec] text-black text-black cursor-pointer hover:bg-white hover:text-black transition-colors"
				onClick={onToggle}
			>
				<div className="flex items-center gap-2 font-bold font-mono text-sm uppercase tracking-wide">
					{isCollapsed ? (
						<ChevronRight size={16} />
					) : (
						<ChevronDown size={16} />
					)}
					<Icon size={16} />
					<span>{title}</span>
				</div>
				{/* Prevent click propagation if clicking an action button in header */}
				{actionElement && (
					<div onClick={(e) => e.stopPropagation()}>
						{actionElement}
					</div>
				)}
			</div>

			{/* Content */}
			<div
				className={cn(
					"flex-1 overflow-auto transition-opacity duration-300 p-4",
					isCollapsed
						? "opacity-0 pointer-events-none"
						: "opacity-100",
				)}
			>
				{children}
			</div>
		</Card>
	);
}
