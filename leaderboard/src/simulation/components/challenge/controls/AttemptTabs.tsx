import { Lock } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "../../ui/Tabs";
import { cn } from "../../../../lib/utils";

interface AttemptTabsProps {
	activeTab: string;
	onTabChange: (tab: string) => void;
	isAttempt2Locked: boolean;
}

export function AttemptTabs({
	activeTab,
	onTabChange,
	isAttempt2Locked,
}: AttemptTabsProps) {
	return (
		<Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
			<TabsList className="grid w-full grid-cols-3 bg-muted/40 p-1 border border-white/5">
				<TabsTrigger value="attempt-1">ATTEMPT 01</TabsTrigger>

				<TabsTrigger
					value="attempt-2"
					disabled={isAttempt2Locked}
					className={cn(
						isAttempt2Locked && "opacity-50 cursor-not-allowed",
					)}
				>
					{isAttempt2Locked ? (
						<span className="flex items-center gap-2">
							<Lock size={12} /> LOCKED
						</span>
					) : (
						"ATTEMPT 02"
					)}
				</TabsTrigger>

				<TabsTrigger
					value="submission"
					className="data-[state=active]:text-emerald-400"
				>
					SUBMISSION
				</TabsTrigger>
			</TabsList>
		</Tabs>
	);
}
