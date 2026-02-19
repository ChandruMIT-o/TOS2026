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

// Modes
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-typescript";
import "ace-builds/src-noconflict/mode-csharp";
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

	const languages = [
		{ value: "python", label: "PYTHON" },
		{ value: "java", label: "JAVA" },
		{ value: "javascript", label: "JAVASCRIPT" },
		{ value: "typescript", label: "TYPESCRIPT" },
		{ value: "csharp", label: "C#" },
	];

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
			className="font-mono rounded-none border-2 border-white/20"
		>
			<div className="flex flex-col h-full gap-6 text-white font-mono p-1">
				{/* 1. Header & Identity Section */}
				<div className="flex flex-col gap-1">
					<label className="text-[10px] font-bold text-[#00ff00] uppercase tracking-widest mb-1 flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Terminal className="w-3 h-3" />
							Target_Identifier
							{strategyName && (
								<span className="text-white/50">
									[{strategyName}]
								</span>
							)}
						</div>
						{/* Availability Indicator */}
						<div className="flex items-center gap-2">
							{availability === "checking" && (
								<Loader2 className="w-3 h-3 animate-spin text-yellow-500" />
							)}
							{availability === "available" && (
								<span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
									<CheckCircle2 className="w-3 h-3" />
									AVAILABLE
								</span>
							)}
							{availability === "taken" && (
								<span className="text-[10px] text-red-500 font-bold flex items-center gap-1">
									<XCircle className="w-3 h-3" />
									TAKEN
								</span>
							)}
						</div>
					</label>
					<div className="relative group">
						<Input
							placeholder="ENTER_STRATEGY_NAME"
							value={strategyName}
							disabled={isLocked}
							onChange={(e) =>
								setStrategyName(e.target.value.toUpperCase())
							}
							className={`w-full bg-[#111] border-2 rounded-none h-10 px-3 
                                     font-bold tracking-widest text-white placeholder:text-white/20
                                     focus:ring-0 transition-all duration-150
                                     ${
											availability === "taken"
												? "border-red-500 focus:border-red-500 focus:shadow-[4px_4px_0px_0px_#ef4444]"
												: availability === "available"
													? "border-emerald-500 focus:border-emerald-500 focus:shadow-[4px_4px_0px_0px_#10b981]"
													: "border-white/20 focus:border-[#00ff00] focus:shadow-[4px_4px_0px_0px_#00ff00]"
										}
                                     disabled:opacity-50 disabled:cursor-not-allowed`}
						/>
					</div>
				</div>

				{/* 2. Control Grid */}
				<div className="grid grid-cols-12 gap-4 items-end">
					{/* Mode Toggles (Tabs Style) */}
					<div className="col-span-12 lg:col-span-7">
						<label className="text-[10px] text-white/50 font-bold uppercase tracking-widest mb-2 block">
							Input_Mode
						</label>
						<div className="flex border-2 border-white/20 bg-[#111]">
							<button
								onClick={() => setMode("prompt")}
								disabled={isLocked}
								className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-150
                                    ${
										mode === "prompt"
											? "bg-white text-black shadow-[inset_0_0_20px_rgba(0,0,0,0.1)]"
											: "text-white/40 hover:text-white hover:bg-white/5"
									} disabled:opacity-50 disabled:cursor-not-allowed`}
							>
								<ALargeSmall className="w-4 h-4" />
								Prompt
							</button>
							<div className="w-[2px] bg-white/20"></div>
							<button
								onClick={() => setMode("code")}
								disabled={isLocked}
								className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-150
                                    ${
										mode === "code"
											? "bg-[#00ff00] text-black shadow-[inset_0_0_20px_rgba(0,0,0,0.1)]"
											: "text-white/40 hover:text-white hover:bg-white/5"
									} disabled:opacity-50 disabled:cursor-not-allowed`}
							>
								<Code className="w-4 h-4" />
								Code
							</button>
						</div>
					</div>

					{/* Language Selector (Conditional) */}
					<div className="col-span-12 lg:col-span-5">
						{mode === "code" ? (
							<>
								<label className="text-[10px] text-white/50 font-bold uppercase tracking-widest mb-2 block">
									Runtime_Env
								</label>
								<div className="relative">
									<select
										value={language}
										onChange={(e) =>
											setLanguage(e.target.value)
										}
										disabled={isLocked}
										className="appearance-none w-full bg-[#111] border-2 border-white/20 rounded-none py-2 pl-3 pr-10 
                                                 text-xs font-bold text-white uppercase tracking-wider cursor-pointer
                                                 focus:outline-none focus:border-[#00ff00] focus:shadow-[4px_4px_0px_0px_rgba(0,255,0,0.5)]
                                                 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
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
									<div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#00ff00]">
										<ChevronDown className="w-4 h-4 stroke-[3]" />
									</div>
								</div>
							</>
						) : (
							<div className="h-full flex items-end pb-2">
								<span className="text-[10px] text-white/30 font-mono bg-white/5 px-2 py-1">
									MARKDOWN_ENABLED
								</span>
							</div>
						)}
					</div>
				</div>

				{/* 3. Editor Area */}
				<div className="flex-1 flex flex-col min-h-[400px]">
					<div
						className={`relative flex-1 border-2 transition-colors duration-200 
                        ${mode === "code" ? "border-[#00ff00]/50" : "border-white/50"} 
                        shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] bg-black opacity-${isLocked ? "50" : "100"}`}
					>
						{/* Decorative Label Tag */}
						<div
							className={`absolute -top-5 left-4 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest z-10 border-2
                            ${
								mode === "code"
									? "bg-[#00ff00] text-black border-black"
									: "bg-white text-black border-black"
							}`}
						>
							{mode === "prompt"
								? "Markdown_Buffer"
								: "Source_Buffer"}
						</div>

						{/* Overlay when locked to prevent interaction if Ace's readOnly isn't enough or for visual effect */}
						{isLocked && (
							<div className="absolute inset-0 z-20 bg-black/10 cursor-not-allowed" />
						)}

						<AceEditor
							mode={mode === "prompt" ? "markdown" : language}
							theme="terminal"
							name="strategy_editor"
							onChange={(val) =>
								mode === "prompt"
									? setStrategyDesc(val)
									: setStrategyCode(val)
							}
							value={
								mode === "prompt" ? strategyDesc : strategyCode
							}
							readOnly={isLocked}
							width="100%"
							height="100%"
							fontSize={14}
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
								cursorStyle: "wide", // Block cursor for terminal feel
								useWorker: false,
							}}
							className="bg-black"
						/>
					</div>

					{/* Footer Stats */}
					<div className="mt-2 flex justify-between items-center border-t-2 border-white/5 pt-2">
						<div className="flex gap-4">
							<span className="text-[10px] font-bold text-[#00ff00]">
								STATUS: {isLocked ? "LOCKED" : "READY"}
							</span>
						</div>
						<span className="text-[10px] text-white/40 font-bold bg-white/10 px-2 py-0.5">
							LEN:{" "}
							{mode === "prompt"
								? (strategyDesc || "").length
								: (strategyCode || "").length}
						</span>
					</div>
				</div>
			</div>
		</CollapsiblePanel>
	);
}
