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
			// Forces the dark brutalist container style
			className="bg-zinc-950 border-4 border-zinc-100 text-zinc-100 font-sans"
		>
			<div className="flex flex-col gap-8 text-base leading-relaxed bg-zinc-950 p-6">
				{/* Intro Section */}
				<div className="bg-yellow-400 p-5 border-2 border-zinc-100 shadow-[4px_4px_0px_0px_#f4f4f5]">
					<p className="font-medium text-black text-lg">
						This is a{" "}
						<strong className="font-black uppercase tracking-wide">
							turn-based, iterated tactical simulation
						</strong>
						. Two strategies battle for dominance over a circular
						network. Victory requires balancing your energy economy
						against aggressive expansion.
					</p>
				</div>

				{/* Section 1: Battlefield */}
				<section className="space-y-5">
					<h3 className="text-xl font-black text-white flex items-center gap-3 uppercase tracking-wide">
						<span className="flex items-center justify-center w-8 h-8 bg-zinc-100 text-black border-2 border-zinc-100 shadow-[2px_2px_0px_0px_#f4f4f5]">
							1
						</span>
						The Battlefield: The Ring
					</h3>
					<p className="font-medium">
						The game takes place on a ring of{" "}
						<strong className="font-black bg-zinc-100 text-black px-2 py-1 border-2 border-zinc-100">
							26 nodes
						</strong>{" "}
						(n1 to n26).
					</p>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-zinc-100">
						<div className="border-2 border-cyan-400 p-4 bg-zinc-900 shadow-[4px_4px_0px_0px_#22d3ee]">
							<strong className="block text-cyan-400 text-lg mb-2 font-black uppercase">
								Home Bases
							</strong>
							<div className="space-y-2 font-medium">
								<div>
									Player A:{" "}
									<code className="bg-zinc-950 border-2 border-cyan-400 text-cyan-400 px-2 py-1 font-mono font-bold">
										n1
									</code>
								</div>
								<div>
									Player B:{" "}
									<code className="bg-zinc-950 border-2 border-cyan-400 text-cyan-400 px-2 py-1 font-mono font-bold">
										n14
									</code>
								</div>
								<span className="inline-block bg-rose-500 text-white px-2 py-1 border-2 border-zinc-100 font-bold text-sm mt-2 shadow-[2px_2px_0px_0px_#f4f4f5]">
									Cannot be captured.
								</span>
							</div>
						</div>

						<div className="border-2 border-fuchsia-400 p-4 bg-zinc-900 shadow-[4px_4px_0px_0px_#e879f9]">
							<strong className="block text-fuchsia-400 text-lg mb-2 font-black uppercase">
								Power Nodes
							</strong>
							<div className="space-y-2 font-medium">
								<div>
									Locations:{" "}
									<code className="bg-zinc-950 border-2 border-fuchsia-400 text-fuchsia-400 px-2 py-1 font-mono font-bold block mt-1 w-fit">
										[4, 7, 11, 17, 20, 24]
									</code>
								</div>
								<span className="inline-block bg-lime-400 text-black px-2 py-1 border-2 border-zinc-100 font-bold text-sm mt-2 shadow-[2px_2px_0px_0px_#f4f4f5]">
									High Economic Value
								</span>
							</div>
						</div>
					</div>
				</section>

				<div className="border-b-4 border-zinc-100 border-dashed" />

				{/* Section 2: Actions */}
				<section className="space-y-6">
					<h3 className="text-xl font-black text-white flex items-center gap-3 uppercase tracking-wide">
						<span className="flex items-center justify-center w-8 h-8 bg-zinc-100 text-black border-2 border-zinc-100 shadow-[2px_2px_0px_0px_#f4f4f5]">
							2
						</span>
						Player Actions
					</h3>
					<p className="font-bold text-lg bg-zinc-100 text-black inline-block px-3 py-1 border-2 border-zinc-100 shadow-[2px_2px_0px_0px_#f4f4f5]">
						Each round, simultaneously choose one action:
					</p>

					{/* Action A */}
					<div className="border-2 border-lime-400 bg-zinc-950 shadow-[4px_4px_0px_0px_#a3e635]">
						<div className="bg-lime-400 px-4 py-3 border-b-2 border-lime-400 font-black text-black text-lg uppercase tracking-wider">
							A. HARVEST
						</div>
						<div className="p-5 space-y-4">
							<p className="font-medium text-zinc-100">
								Gain energy based on territory.{" "}
								<strong className="bg-zinc-100 text-black px-1">
									(No passive income otherwise)
								</strong>
							</p>
							<ul className="grid grid-cols-3 gap-4 text-center font-bold">
								<li className="bg-zinc-900 text-lime-400 p-3 border-2 border-lime-400 shadow-[2px_2px_0px_0px_#a3e635]">
									<span className="block text-2xl mb-1 text-white">
										+5E
									</span>{" "}
									Home
								</li>
								<li className="bg-zinc-900 text-lime-400 p-3 border-2 border-lime-400 shadow-[2px_2px_0px_0px_#a3e635]">
									<span className="block text-2xl mb-1 text-white">
										+5E
									</span>{" "}
									Power
								</li>
								<li className="bg-zinc-900 text-lime-400 p-3 border-2 border-lime-400 shadow-[2px_2px_0px_0px_#a3e635]">
									<span className="block text-2xl mb-1 text-white">
										+1E
									</span>{" "}
									Normal
								</li>
							</ul>
						</div>
					</div>

					{/* Action B */}
					<div className="border-2 border-cyan-400 bg-zinc-950 shadow-[4px_4px_0px_0px_#22d3ee]">
						<div className="bg-cyan-400 px-4 py-3 border-b-2 border-cyan-400 font-black text-black text-lg uppercase tracking-wider flex items-center justify-between">
							B. EXPAND
							<span className="font-mono font-bold bg-zinc-950 text-cyan-400 border-2 border-cyan-400 px-2 py-0.5 text-sm shadow-[2px_2px_0px_0px_#22d3ee]">
								[target_node]
							</span>
						</div>
						<div className="p-5 space-y-4 text-zinc-100">
							<p className="font-medium">
								Claim any unoccupied node. Cost:{" "}
								<strong className="font-black text-lg bg-cyan-400 text-black px-2 py-0.5">
									5E
								</strong>{" "}
								(Normal) or{" "}
								<strong className="font-black text-lg bg-cyan-400 text-black px-2 py-0.5">
									15E
								</strong>{" "}
								(Power).
							</p>

							<div className="bg-rose-500 text-white border-2 border-zinc-100 p-4 shadow-[4px_4px_0px_0px_#f4f4f5]">
								<strong className="block font-black uppercase text-lg mb-2">
									⚠️ Collision Rule
								</strong>
								<p className="font-bold mb-2">
									If both players target the same node:
								</p>
								<ul className="list-disc pl-5 font-medium space-y-1">
									<li>
										Higher energy reserves wins (pays cost).
									</li>
									<li>
										Loser gets nothing, loses{" "}
										<strong className="font-black bg-white text-rose-500 px-1">
											5E
										</strong>{" "}
										penalty.
									</li>
									<li>
										If tied energy: neither wins, both lose{" "}
										<strong className="font-black bg-white text-rose-500 px-1">
											5E
										</strong>
										.
									</li>
								</ul>
							</div>
						</div>
					</div>

					{/* Action C */}
					<div className="border-2 border-fuchsia-400 bg-zinc-950 shadow-[4px_4px_0px_0px_#e879f9]">
						<div className="bg-fuchsia-400 px-4 py-3 border-b-2 border-fuchsia-400 font-black text-black text-lg uppercase tracking-wider flex items-center justify-between">
							C. CONQUER
							<span className="font-mono font-bold bg-zinc-950 text-fuchsia-400 border-2 border-fuchsia-400 px-2 py-0.5 text-sm shadow-[2px_2px_0px_0px_#e879f9]">
								[target_node]
							</span>
						</div>
						<div className="p-5 space-y-4 text-zinc-100">
							<p className="font-medium">
								Steal an opponent's node. Base Cost:{" "}
								<strong className="font-black text-lg bg-fuchsia-400 text-black px-2 py-0.5">
									8E
								</strong>{" "}
								(Normal) or{" "}
								<strong className="font-black text-lg bg-fuchsia-400 text-black px-2 py-0.5">
									20E
								</strong>{" "}
								(Power).
							</p>
							<div className="bg-zinc-900 p-4 border-2 border-zinc-100 shadow-[4px_4px_0px_0px_#f4f4f5]">
								<strong className="block text-fuchsia-400 font-black uppercase mb-2">
									🛡️ Defense Bonus
								</strong>
								<p className="font-medium">
									Nodes gain{" "}
									<strong className="font-black text-lg text-white">
										+1 Cost
									</strong>{" "}
									for every neighbor also owned by the
									defender.
									<br />
									<span className="block mt-2 bg-zinc-950 text-zinc-300 border-2 border-zinc-100 p-2 font-bold text-sm">
										Example: Owning n1, n2, n3 means n2
										costs +2 to steal.
									</span>
								</p>
							</div>
						</div>
					</div>
				</section>

				<div className="border-b-4 border-zinc-100 border-dashed" />

				{/* Section 3: Interface */}
				<section className="space-y-6">
					<h3 className="text-xl font-black text-white flex items-center gap-3 uppercase tracking-wide">
						<span className="flex items-center justify-center w-8 h-8 bg-zinc-100 text-black border-2 border-zinc-100 shadow-[2px_2px_0px_0px_#f4f4f5]">
							3
						</span>
						Strategy Interface
					</h3>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						<div>
							<h4 className="font-black text-white mb-3 text-lg uppercase tracking-widest border-b-4 border-zinc-100 inline-block pb-1">
								Inputs
							</h4>
							<ul className="space-y-3 font-mono font-bold text-sm">
								<li className="flex justify-between items-center border-b-2 border-zinc-800 pb-2">
									<span className="bg-cyan-400 text-black border-2 border-cyan-400 px-2 py-1 shadow-[2px_2px_0px_0px_#ffffff]">
										free
									</span>
									<span className="text-zinc-300">
										List[int] (Unoccupied)
									</span>
								</li>
								<li className="flex justify-between items-center border-b-2 border-zinc-800 pb-2">
									<span className="bg-rose-500 text-white border-2 border-rose-500 px-2 py-1 shadow-[2px_2px_0px_0px_#ffffff]">
										opp
									</span>
									<span className="text-zinc-300">
										List[int] (Enemy nodes)
									</span>
								</li>
								<li className="flex justify-between items-center border-b-2 border-zinc-800 pb-2">
									<span className="bg-lime-400 text-black border-2 border-lime-400 px-2 py-1 shadow-[2px_2px_0px_0px_#ffffff]">
										mine
									</span>
									<span className="text-zinc-300">
										List[int] (Your nodes)
									</span>
								</li>
								<li className="flex justify-between items-center border-b-2 border-zinc-800 pb-2">
									<span className="bg-yellow-400 text-black border-2 border-yellow-400 px-2 py-1 shadow-[2px_2px_0px_0px_#ffffff]">
										energy
									</span>
									<span className="text-zinc-300">
										int (Your balance)
									</span>
								</li>
							</ul>
						</div>

						<div>
							<h4 className="font-black text-white mb-3 text-lg uppercase tracking-widest border-b-4 border-zinc-100 inline-block pb-1">
								Return Format
							</h4>
							<div className="space-y-3 text-sm font-bold">
								<code className="block bg-zinc-900 text-cyan-400 p-3 border-2 border-zinc-100 shadow-[4px_4px_0px_0px_#f4f4f5]">
									["EXPAND", 3]
								</code>
								<code className="block bg-zinc-900 text-fuchsia-400 p-3 border-2 border-zinc-100 shadow-[4px_4px_0px_0px_#f4f4f5]">
									["CONQUER", 7]
								</code>
								<code className="block bg-zinc-900 text-lime-400 p-3 border-2 border-zinc-100 shadow-[4px_4px_0px_0px_#f4f4f5]">
									["HARVEST"]
								</code>
							</div>
						</div>
					</div>
				</section>

				{/* Summary Table */}
				<section className="border-4 border-zinc-100 bg-zinc-950 overflow-x-auto">
					<table className="w-full text-left border-collapse min-w-[500px]">
						<thead className="bg-zinc-100 text-black font-black uppercase tracking-wider text-sm">
							<tr>
								<th className="py-4 px-5 border-r-2 border-zinc-100">
									Feature
								</th>
								<th className="py-4 px-5 border-r-2 border-zinc-100">
									Home
								</th>
								<th className="py-4 px-5 border-r-2 border-zinc-100">
									Power
								</th>
								<th className="py-4 px-5">Normal</th>
							</tr>
						</thead>
						<tbody className="font-bold text-sm divide-y-2 divide-zinc-100 text-zinc-100">
							<tr className="bg-zinc-900 hover:bg-zinc-800 transition-colors">
								<td className="py-4 px-5 border-r-2 border-zinc-100 text-lime-400">
									Harvest
								</td>
								<td className="py-4 px-5 border-r-2 border-zinc-100 font-black text-lg">
									+5E
								</td>
								<td className="py-4 px-5 border-r-2 border-zinc-100 font-black text-lg">
									+5E
								</td>
								<td className="py-4 px-5 font-black text-lg">
									+1E
								</td>
							</tr>
							<tr className="bg-zinc-950 hover:bg-zinc-900 transition-colors">
								<td className="py-4 px-5 border-r-2 border-zinc-100 text-cyan-400">
									Expand Cost
								</td>
								<td className="py-4 px-5 border-r-2 border-zinc-100 text-zinc-500">
									—
								</td>
								<td className="py-4 px-5 border-r-2 border-zinc-100 font-black text-lg">
									15E
								</td>
								<td className="py-4 px-5 font-black text-lg">
									5E
								</td>
							</tr>
							<tr className="bg-zinc-900 hover:bg-zinc-800 transition-colors">
								<td className="py-4 px-5 border-r-2 border-zinc-100 text-fuchsia-400">
									Conquer Base
								</td>
								<td className="py-4 px-5 border-r-2 border-zinc-100 bg-rose-500 text-white uppercase tracking-wider">
									Lock
								</td>
								<td className="py-4 px-5 border-r-2 border-zinc-100 font-black text-lg">
									20E
								</td>
								<td className="py-4 px-5 font-black text-lg">
									8E
								</td>
							</tr>
							<tr className="bg-zinc-950">
								<td className="py-4 px-5 border-r-2 border-zinc-100 text-yellow-400">
									Support Bonus
								</td>
								<td
									className="py-4 px-5 font-black uppercase text-zinc-300"
									colSpan={3}
								>
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
