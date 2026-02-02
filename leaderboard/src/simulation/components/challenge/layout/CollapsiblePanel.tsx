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
				"flex flex-col overflow-hidden transition-all duration-300 ease-in-out",
				isCollapsed ? "flex-none h-[60px]" : "flex-1 h-full", // Flex magic here
				className,
			)}
		>
			{/* Header */}
			<div
				className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
				onClick={onToggle}
			>
				<div className="flex items-center gap-2 font-semibold text-sm uppercase tracking-wide text-muted-foreground">
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
