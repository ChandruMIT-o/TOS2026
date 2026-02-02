import * as React from "react";
import { cn } from "../../../lib/utils";

interface TabsProps {
	value: string;
	onValueChange: (value: string) => void;
	children: React.ReactNode;
	className?: string;
}

export function Tabs({ value, onValueChange, children, className }: TabsProps) {
	// We use Context to pass the active state down to TabTriggers
	return (
		<div className={cn("w-full", className)}>
			{React.Children.map(children, (child) => {
				if (React.isValidElement(child)) {
					return React.cloneElement(
						child as React.ReactElement<any>,
						{ value, onValueChange },
					);
				}
				return child;
			})}
		</div>
	);
}

interface TabsListProps {
	children: React.ReactNode;
	className?: string;
	value?: string;
	onValueChange?: (val: string) => void;
}

export function TabsList({
	children,
	className,
	value,
	onValueChange,
}: TabsListProps) {
	return (
		<div
			className={cn(
				"inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
				className,
			)}
		>
			{React.Children.map(children, (child) => {
				if (React.isValidElement(child)) {
					return React.cloneElement(
						child as React.ReactElement<any>,
						{
							selectedValue: value,
							onClick: () =>
								onValueChange?.((child.props as any).value),
						},
					);
				}
				return child;
			})}
		</div>
	);
}

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	value: string;
	selectedValue?: string;
}

export function TabsTrigger({
	value,
	selectedValue,
	className,
	disabled,
	...props
}: TabsTriggerProps) {
	const isSelected = value === selectedValue;

	return (
		<button
			type="button"
			disabled={disabled}
			className={cn(
				"inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
				isSelected && "bg-background text-foreground shadow-sm",
				className,
			)}
			{...props}
		/>
	);
}

interface TabsContentProps {
	value: string;
	currentValue?: string; // Passed from parent
	children: React.ReactNode;
	className?: string;
}

// Note: For this simple implementation, the parent page handles the conditional rendering of content.
// But if you want a pure component approach:
export function TabsContent({
	value,
	currentValue,
	children,
	className,
}: TabsContentProps) {
	if (value !== currentValue) return null;
	return (
		<div
			className={cn(
				"mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
				className,
			)}
		>
			{children}
		</div>
	);
}
