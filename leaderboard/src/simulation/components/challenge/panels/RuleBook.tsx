import { BookOpen } from "lucide-react";
import { CollapsiblePanel } from "../layout/CollapsiblePanel";

interface RuleBookProps {
	isCollapsed: boolean;
	onToggle: () => void;
}

export function RuleBook({ isCollapsed, onToggle }: RuleBookProps) {
	return (
		<CollapsiblePanel
			title="Mission Brief / Rules"
			icon={BookOpen}
			isCollapsed={isCollapsed}
			onToggle={onToggle}
			// Assuming your Panel accepts a className, we force the container dark here.
			// If not, ensure the parent container of this component has 'bg-[#09090b]'
			className="bg-[#1A1A1A] border-[#27272a] text-[#ecfdf5]"
		>
			<div className="flex flex-col gap-6 text-md leading-relaxed bg-[#09090b] text-white p-4">
				{/* Intro Section */}
				<div className="bg-[#18181b] p-4  border border-[#27272a]">
					<p>
						This is a{" "}
						<strong className="text-[#ecfdf5]">
							turn-based, iterated tactical simulation
						</strong>
						. Two strategies battle for dominance over a circular
						network. Victory requires balancing your energy economy
						against aggressive expansion.
					</p>
				</div>

				{/* Section 1: Battlefield */}
				<section className="space-y-4">
					<h3 className="text-lg font-bold text-[#ecfdf5] flex items-center gap-2">
						<span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#10b981]/10 text-[#10b981] text-xs">
							1
						</span>
						The Battlefield: The Ring
					</h3>
					<p>
						The game takes place on a ring of{" "}
						<strong className="text-[#ecfdf5]">26 nodes</strong> (n1
						to n26).
					</p>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="border border-[#27272a]  p-3 bg-[#18181b]/50">
							<strong className="block text-[#ecfdf5] mb-1">
								Home Bases
							</strong>
							<span className="text-xs">
								Player A:{" "}
								<code className="bg-[#27272a] px-1 py-0.5 text-[#ecfdf5]">
									n1
								</code>
								<br />
								Player B:{" "}
								<code className="bg-[#27272a] px-1 py-0.5 text-[#ecfdf5]">
									n14
								</code>
								<br />
								<span className="text-red-400 mt-1 block font-medium">
									Cannot be captured.
								</span>
							</span>
						</div>
						<div className="border border-[#27272a] p-3 bg-[#18181b]/50">
							<strong className="block text-[#ecfdf5] mb-1">
								Power Nodes
							</strong>
							<span className="text-xs">
								Locations:{" "}
								<code className="bg-[#27272a] px-1 py-0.5 text-[#ecfdf5]">
									[4, 7, 11, 17, 20, 24]
								</code>
								<br />
								<span className="text-[#10b981] mt-1 block font-medium">
									High Economic Value
								</span>
							</span>
						</div>
					</div>
				</section>

				<div className="h-px bg-[#27272a]" />

				{/* Section 2: Actions */}
				<section className="space-y-6">
					<h3 className="text-lg font-bold text-[#ecfdf5] flex items-center gap-2">
						<span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#10b981]/10 text-[#10b981] text-xs">
							2
						</span>
						Player Actions
					</h3>
					<p className="mb-4">
						Each round, simultaneously choose one action:
					</p>

					{/* Action A */}
					<div className=" border border-[#27272a] bg-[#09090b] overflow-hidden">
						<div className="bg-[#18181b] px-4 py-2 border-b border-[#27272a] font-bold text-[#ecfdf5]">
							A. HARVEST
						</div>
						<div className="p-4 space-y-2">
							<p>
								Gain energy based on territory.{" "}
								<em className="text-xs opacity-70">
									(No passive income otherwise)
								</em>
								.
							</p>
							<ul className="grid grid-cols-3 gap-2 text-center text-xs mt-2">
								<li className="bg-[#27272a]/40 p-2 border border-[#27272a]">
									<span className="block font-bold text-[#10b981]">
										+5E
									</span>{" "}
									Home
								</li>
								<li className="bg-[#27272a]/40 p-2 border border-[#27272a]">
									<span className="block font-bold text-[#10b981]">
										+5E
									</span>{" "}
									Power
								</li>
								<li className="bg-[#27272a]/40 p-2 border border-[#27272a]">
									<span className="block font-bold text-[#10b981]">
										+1E
									</span>{" "}
									Normal
								</li>
							</ul>
						</div>
					</div>

					{/* Action B */}
					<div className=" border border-[#27272a] bg-[#09090b] overflow-hidden">
						<div className="bg-[#18181b] px-4 py-2 border-b border-[#27272a] font-bold text-[#ecfdf5]">
							B. EXPAND{" "}
							<span className="font-mono font-normal opacity-50 text-xs ml-2 text-[#a1a1aa]">
								[target_node]
							</span>
						</div>
						<div className="p-4 space-y-3">
							<p>
								Claim any unoccupied node. Cost:{" "}
								<strong className="text-[#ecfdf5]">5E</strong>{" "}
								(Normal) or{" "}
								<strong className="text-[#ecfdf5]">15E</strong>{" "}
								(Power).
							</p>

							<div className="bg-amber-900/10 border-l-2 border-amber-500 pl-3 py-2 text-xs space-y-1">
								<strong className="text-amber-500 block">
									⚠️ Collision Rule
								</strong>
								<p>If both players target the same node:</p>
								<ul className="list-disc pl-4 opacity-90">
									<li>
										Higher energy reserves wins (pays cost).
									</li>
									<li>
										Loser gets nothing, loses{" "}
										<strong className="text-[#ecfdf5]">
											5E
										</strong>{" "}
										penalty.
									</li>
									<li>
										If tied energy: neither wins, both lose{" "}
										<strong className="text-[#ecfdf5]">
											5E
										</strong>
										.
									</li>
								</ul>
							</div>
						</div>
					</div>

					{/* Action C */}
					<div className=" border border-[#27272a] bg-[#09090b] overflow-hidden">
						<div className="bg-[#18181b] px-4 py-2 border-b border-[#27272a] font-bold text-[#ecfdf5]">
							C. CONQUER{" "}
							<span className="font-mono font-normal opacity-50 text-xs ml-2 text-[#a1a1aa]">
								[target_node]
							</span>
						</div>
						<div className="p-4 space-y-3">
							<p>
								Steal an opponent's node. Base Cost:{" "}
								<strong className="text-[#ecfdf5]">8E</strong>{" "}
								(Normal) or{" "}
								<strong className="text-[#ecfdf5]">20E</strong>{" "}
								(Power).
							</p>
							<div className="bg-[#27272a]/40 p-3 rounded text-xs border border-[#27272a]">
								<strong className="text-[#ecfdf5] block mb-1">
									🛡️ Defense Bonus
								</strong>
								<p>
									Nodes gain{" "}
									<strong className="text-[#ecfdf5]">
										+1 Cost
									</strong>{" "}
									for every neighbor also owned by the
									defender.
									<br />
									<span className="opacity-70 italic">
										Example: Owning n1, n2, n3 means n2
										costs +2 to steal.
									</span>
								</p>
							</div>
						</div>
					</div>
				</section>

				<div className="h-px bg-[#27272a]" />

				{/* Section 3: Interface */}
				<section className="space-y-4">
					<h3 className="text-lg font-bold text-[#ecfdf5] flex items-center gap-2">
						<span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#10b981]/10 text-[#10b981] text-xs">
							3
						</span>
						Strategy Interface
					</h3>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<h4 className="font-semibold text-[#ecfdf5] mb-2 text-xs uppercase tracking-wider">
								Inputs
							</h4>
							<ul className="space-y-2 font-mono text-xs">
								<li className="flex justify-between border-b border-[#27272a] pb-1">
									<span className="text-sky-400">free</span>
									<span>List[int] (Unoccupied)</span>
								</li>
								<li className="flex justify-between border-b border-[#27272a] pb-1">
									<span className="text-red-400">opp</span>
									<span>List[int] (Enemy nodes)</span>
								</li>
								<li className="flex justify-between border-b border-[#27272a] pb-1">
									<span className="text-[#10b981]">mine</span>
									<span>List[int] (Your nodes)</span>
								</li>
								<li className="flex justify-between border-b border-[#27272a] pb-1">
									<span className="text-amber-400">
										energy
									</span>
									<span>int (Your balance)</span>
								</li>
							</ul>
						</div>

						<div>
							<h4 className="font-semibold text-[#ecfdf5] mb-2 text-xs uppercase tracking-wider">
								Return Format
							</h4>
							<div className="space-y-2 text-xs">
								<code className="block bg-[#18181b] p-2 border border-[#27272a] text-[#ecfdf5]">
									["EXPAND", 3]
								</code>
								<code className="block bg-[#18181b] p-2 border border-[#27272a] text-[#ecfdf5]">
									["CONQUER", 7]
								</code>
								<code className="block bg-[#18181b] p-2 border border-[#27272a] text-[#ecfdf5]">
									["HARVEST"]
								</code>
							</div>
						</div>
					</div>
				</section>

				{/* Summary Table */}
				<section className=" border border-[#27272a] overflow-hidden">
					<table className="w-full text-left text-xs">
						<thead className="bg-[#18181b] text-[#ecfdf5]">
							<tr>
								<th className="py-3 px-4 font-semibold">
									Feature
								</th>
								<th className="py-3 px-4 font-semibold">
									Home
								</th>
								<th className="py-3 px-4 font-semibold">
									Power
								</th>
								<th className="py-3 px-4 font-semibold">
									Normal
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-[#27272a]">
							<tr className="hover:bg-[#27272a]/40 transition-colors">
								<td className="py-3 px-4 font-medium text-[#ecfdf5]">
									Harvest
								</td>
								<td className="py-3 px-4 text-[#10b981] font-mono">
									+5E
								</td>
								<td className="py-3 px-4 text-[#10b981] font-mono">
									+5E
								</td>
								<td className="py-3 px-4 text-[#10b981] font-mono">
									+1E
								</td>
							</tr>
							<tr className="hover:bg-[#27272a]/40 transition-colors">
								<td className="py-3 px-4 font-medium text-[#ecfdf5]">
									Expand Cost
								</td>
								<td className="py-3 px-4 opacity-50">-</td>
								<td className="py-3 px-4 font-mono">15E</td>
								<td className="py-3 px-4 font-mono">5E</td>
							</tr>
							<tr className="hover:bg-[#27272a]/40 transition-colors">
								<td className="py-3 px-4 font-medium text-[#ecfdf5]">
									Conquer Base
								</td>
								<td className="py-3 px-4 text-red-400">Lock</td>
								<td className="py-3 px-4 font-mono">20E</td>
								<td className="py-3 px-4 font-mono">8E</td>
							</tr>
							<tr className="hover:bg-[#27272a]/40 transition-colors">
								<td className="py-3 px-4 font-medium text-[#ecfdf5]">
									Support Bonus
								</td>
								<td className="py-3 px-4" colSpan={3}>
									+1 Defense Cost per friendly neighbor
								</td>
							</tr>
						</tbody>
					</table>
				</section>
			</div>
		</CollapsiblePanel>
	);
}
