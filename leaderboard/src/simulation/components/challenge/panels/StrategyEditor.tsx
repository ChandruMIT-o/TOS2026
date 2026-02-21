import {
	FileText,
	Code,
	ALargeSmall,
	Settings2,
	ChevronDown,
	Terminal,
	Loader2,
	CheckCircle2,
	XCircle,
} from "lucide-react";
import { CollapsiblePanel } from "../layout/CollapsiblePanel";
import { Input } from "../../ui/Input";
import { useState, useEffect } from "react";
import AceEditor from "react-ace";
import { challengeApi } from "../../../services/challengeApi";
import { simulationTheme } from "../../../theme";

// Modes
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-markdown";

// Theme (Strictly Terminal)
import "ace-builds/src-noconflict/theme-terminal";
import "ace-builds/src-noconflict/ext-language_tools";

interface StrategyEditorProps {
	isCollapsed: boolean;
	onToggle: () => void;
	strategyName: string;
	setStrategyName: (val: string) => void;
	strategyCode: string;
	setStrategyCode: (val: string) => void;
	strategyDesc: string;
	setStrategyDesc: (val: string) => void;
	isLocked: boolean;
}

export function StrategyEditor({
	isCollapsed,
	onToggle,
	strategyName,
	setStrategyName,
	strategyCode,
	setStrategyCode,
	strategyDesc,
	setStrategyDesc,
	isLocked,
}: StrategyEditorProps) {
	const [mode, setMode] = useState<"prompt" | "code">("code");
	const [language, setLanguage] = useState("python");

	// Availability Check State
	const [availability, setAvailability] = useState<
		"idle" | "checking" | "available" | "taken"
	>("idle");

	const languages = [{ value: "python", label: "PYTHON" }];

	// Debounced check for strategy name availability
	useEffect(() => {
		const checkName = async () => {
			if (!strategyName || strategyName.length < 3) {
				setAvailability("idle");
				return;
			}
			setAvailability("checking");
			try {
				const isAvailable =
					await challengeApi.checkStrategyAvailability(strategyName);
				setAvailability(isAvailable ? "available" : "taken");
			} catch (error) {
				console.error("Failed to check availability", error);
				setAvailability("idle");
			}
		};

		const timer = setTimeout(checkName, 800);
		return () => clearTimeout(timer);
	}, [strategyName]);

	return (
		<CollapsiblePanel
			title="STRATEGY_DEFINITION"
			icon={isCollapsed ? Settings2 : FileText}
			isCollapsed={isCollapsed}
			onToggle={onToggle}
			// Match the brutalist container style
			className={`${simulationTheme.colors.panels.bg.base} border-4 ${simulationTheme.colors.panels.border.base} ${simulationTheme.colors.panels.text.base} font-sans`}
		>
			<div
				className={`flex flex-col h-full gap-8 ${simulationTheme.colors.panels.bg.base} p-3 md:p-6`}
			>
				{/* 1. Header & Identity Section */}
				<div className="flex flex-col gap-2">
					<label className="text-xs font-black text-lime-400 uppercase tracking-widest flex flex-wrap gap-y-2 items-center justify-between border-b-4 border-zinc-100 pb-2">
						<div className="flex items-center gap-2">
							<Terminal className="w-4 h-4" strokeWidth={3} />
							Target_Identifier
							{strategyName && (
								<span className="text-zinc-500 hidden sm:inline-block">
									[{strategyName}]
								</span>
							)}
						</div>
						{/* Availability Indicator */}
						<div className="flex items-center gap-2">
							{availability === "checking" && (
								<Loader2 className="w-4 h-4 animate-spin text-yellow-400" />
							)}
							{availability === "available" && (
								<span
									className={`text-xs ${simulationTheme.colors.panels.text.dark} ${simulationTheme.colors.panels.bg.success} px-2 py-0.5 font-black flex items-center gap-1 border-2 ${simulationTheme.colors.panels.border.success} shadow-[2px_2px_0px_0px_#f4f4f5]`}
								>
									<CheckCircle2
										className="w-3 h-3"
										strokeWidth={3}
									/>
									AVAILABLE
								</span>
							)}
							{availability === "taken" && (
								<span
									className={`text-xs ${simulationTheme.colors.panels.text.light} ${simulationTheme.colors.panels.bg.error} px-2 py-0.5 font-black flex items-center gap-1 border-2 ${simulationTheme.colors.panels.border.error} shadow-[2px_2px_0px_0px_#f4f4f5]`}
								>
									<XCircle
										className="w-3 h-3"
										strokeWidth={3}
									/>
									TAKEN
								</span>
							)}
						</div>
					</label>
					<div className="relative mt-2">
						<Input
							placeholder="ENTER_STRATEGY_NAME"
							value={strategyName}
							disabled={isLocked}
							onChange={(e) => {
								const val = e.target.value.toUpperCase();
								if (val === "") {
									setStrategyName(val);
									return;
								}
								if (val.length > 16) return;
								if (/[^A-Z0-9]/.test(val)) return;
								if (/^[0-9]/.test(val)) return;
								setStrategyName(val);
							}}
							// Harsh input styling
							className={`w-full ${simulationTheme.colors.panels.bg.surface} border-4 rounded-none h-14 px-4 
                                     font-black text-lg tracking-widest ${simulationTheme.colors.panels.text.light} placeholder:text-zinc-600
                                     focus:outline-none transition-all duration-75
                                     ${
											availability === "taken"
												? "border-rose-500 focus:shadow-[6px_6px_0px_0px_#f43f5e]"
												: availability === "available"
													? "border-lime-400 focus:shadow-[6px_6px_0px_0px_#a3e635]"
													: "border-zinc-100 focus:border-cyan-400 focus:shadow-[6px_6px_0px_0px_#22d3ee]"
										}
                                     disabled:opacity-50 disabled:cursor-not-allowed`}
						/>
					</div>
				</div>

				{/* 2. Control Grid */}
				<div className="grid grid-cols-12 gap-6 items-end">
					{/* Mode Toggles */}
					<div className="col-span-12 lg:col-span-7">
						<label className="text-xs text-zinc-400 font-black uppercase tracking-widest mb-3 block">
							Input_Mode
						</label>
						<div
							className={`flex border-4 ${simulationTheme.colors.panels.border.base} ${simulationTheme.colors.panels.bg.base}`}
						>
							<button
								onClick={() => setMode("prompt")}
								className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-black uppercase tracking-wider transition-none
                                    ${
										mode === "prompt"
											? `${simulationTheme.colors.panels.bg.accent} ${simulationTheme.colors.panels.text.dark} border-r-4 ${simulationTheme.colors.panels.border.base}`
											: `${simulationTheme.colors.panels.text.muted} hover:text-white ${simulationTheme.colors.panels.bg.surfaceHover} border-r-4 ${simulationTheme.colors.panels.border.base}`
									} disabled:opacity-50 disabled:cursor-not-allowed`}
							>
								<ALargeSmall
									className="w-5 h-5"
									strokeWidth={3}
								/>
								Prompt
							</button>
							<button
								onClick={() => setMode("code")}
								className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-black uppercase tracking-wider transition-none
                                    ${
										mode === "code"
											? `${simulationTheme.colors.panels.bg.info} ${simulationTheme.colors.panels.text.dark}`
											: `${simulationTheme.colors.panels.text.muted} hover:text-white ${simulationTheme.colors.panels.bg.surfaceHover}`
									} disabled:opacity-50 disabled:cursor-not-allowed`}
							>
								<Code className="w-5 h-5" strokeWidth={3} />
								Code
							</button>
						</div>
					</div>

					{/* Language Selector (Conditional) */}
					<div className="col-span-12 lg:col-span-5">
						{mode === "code" ? (
							<>
								<label className="text-xs text-zinc-400 font-black uppercase tracking-widest mb-3 block">
									Runtime_Env
								</label>
								<div className="relative">
									<select
										value={language}
										onChange={(e) =>
											setLanguage(e.target.value)
										}
										disabled={isLocked}
										className={`appearance-none w-full ${simulationTheme.colors.panels.bg.surface} border-4 ${simulationTheme.colors.panels.border.base} rounded-none py-3 pl-4 pr-12 
                                                 text-sm font-black ${simulationTheme.colors.panels.text.light} uppercase tracking-wider cursor-pointer
                                                 focus:outline-none focus:border-yellow-400 focus:shadow-[4px_4px_0px_0px_#facc15]
                                                 transition-none disabled:opacity-50 disabled:cursor-not-allowed`}
									>
										{languages.map((l) => (
											<option
												key={l.value}
												value={l.value}
											>
												{l.label}
											</option>
										))}
									</select>
									<div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-100">
										<ChevronDown
											className="w-5 h-5"
											strokeWidth={3}
										/>
									</div>
								</div>
							</>
						) : (
							<div className="h-full flex items-end pb-3">
								<span
									className={`text-xs ${simulationTheme.colors.panels.text.dark} font-black ${simulationTheme.colors.panels.bg.surfaceAlt} px-3 py-1 border-2 ${simulationTheme.colors.panels.border.base} shadow-[2px_2px_0px_0px_#f4f4f5]`}
								>
									MARKDOWN_ENABLED
								</span>
							</div>
						)}
					</div>
				</div>

				<span className="w-[150px] text-xs text-black font-black bg-zinc-100 px-3 py-1 shadow-[2px_2px_0px_0px_#f4f4f5]">
					{mode === "prompt"
						? `WORDS: ${(strategyDesc || "").trim() === "" ? 0 : (strategyDesc || "").trim().split(/\s+/).length} / 350`
						: `CHARS: ${(strategyCode || "").length} / 7000`}
				</span>

				{/* 3. Editor Area */}
				<div className="flex-1 flex flex-col min-h-[400px] lg:min-h-[600px]">
					<div
						className={`relative flex-1 border-4 transition-colors duration-75 
                        ${mode === "code" ? "border-cyan-400" : "border-fuchsia-400"} 
                        bg-black`}
					>
						{/* Decorative Label Tag */}
						<div
							className={`absolute -top-4 left-4 px-3 py-1 text-xs font-black uppercase tracking-widest z-10 border-2 ${simulationTheme.colors.panels.border.base}
                            ${
								mode === "code"
									? `${simulationTheme.colors.panels.bg.info} ${simulationTheme.colors.panels.text.dark}`
									: `${simulationTheme.colors.panels.bg.accent} ${simulationTheme.colors.panels.text.dark}`
							}`}
						>
							{mode === "prompt"
								? "Markdown_Buffer"
								: "Source_Buffer"}
						</div>

						{/* Overlay when locked */}
						{isLocked && (
							<div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
								<span
									className={`${simulationTheme.colors.panels.bg.error}/80 backdrop-blur-sm ${simulationTheme.colors.panels.text.light} font-black px-6 py-2 border-4 ${simulationTheme.colors.panels.border.base} shadow-[4px_4px_0px_0px_#f4f4f5] rotate-[-5deg] text-2xl tracking-widest`}
								>
									SYSTEM LOCKED
								</span>
							</div>
						)}

						<div className="h-full pt-4">
							{" "}
							{/* Padding to offset the overlapping label */}
							<AceEditor
								mode={mode === "prompt" ? "markdown" : language}
								theme="terminal"
								name="strategy_editor"
								onChange={(val) => {
									if (mode === "prompt") {
										const wordCount =
											val.trim() === ""
												? 0
												: val.trim().split(/\s+/)
														.length;
										if (wordCount <= 350) {
											setStrategyDesc(val);
										} else {
											const parts = val.split(/(\s+)/);
											let truncated = "";
											let count = 0;
											for (const p of parts) {
												if (p.trim().length > 0)
													count++;
												if (count > 350) break;
												truncated += p;
											}
											setStrategyDesc(truncated);
										}
									} else {
										if (val.length <= 7000) {
											setStrategyCode(val);
										} else {
											setStrategyCode(val.slice(0, 7000));
										}
									}
								}}
								value={
									mode === "prompt"
										? strategyDesc
										: strategyCode
								}
								readOnly={isLocked}
								width="100%"
								height="100%"
								fontSize={15}
								showPrintMargin={false}
								showGutter={true}
								highlightActiveLine={!isLocked}
								setOptions={{
									enableBasicAutocompletion: true,
									enableLiveAutocompletion: true,
									enableSnippets: true,
									showLineNumbers: true,
									tabSize: 4,
									fontFamily: '"Fira Code", monospace',
									cursorStyle: "wide", // Block cursor
									useWorker: false,
								}}
								className="bg-black"
							/>
						</div>
					</div>

					{/* Footer Stats */}
					<div className="mt-8 flex justify-between items-center border-t-4 border-zinc-800 pt-4">
						<div className="flex gap-4">
							<span
								className={
									isLocked
										? "text-rose-500 font-black text-sm"
										: "text-lime-400 font-black text-sm"
								}
							>
								STATUS: {isLocked ? "LOCKED" : "READY"}
							</span>
						</div>
					</div>
				</div>
			</div>
		</CollapsiblePanel>
	);
}
