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
			<TabsList className="grid w-full grid-cols-3 bg-transparent p-1 border border-black rounded-none">
				<TabsTrigger
					value="attempt-1"
					className="data-[state=active]:bg-black data-[state=active]:text-white rounded-none transition-colors"
				>
					ATTEMPT 01
				</TabsTrigger>

				<TabsTrigger
					value="attempt-2"
					disabled={isAttempt2Locked}
					className={cn(
						"data-[state=active]:bg-black data-[state=active]:text-white rounded-none transition-colors",
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
					className="data-[state=active]:bg-black data-[state=active]:text-white rounded-none transition-colors"
				>
					SUBMISSION
				</TabsTrigger>
			</TabsList>
		</Tabs>
	);
}
