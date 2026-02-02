import { TrendingUp, Lock } from "lucide-react";

export function StrategyContent() {
    return (
        <div className="space-y-8 h-full flex flex-col justify-center">
            <div className="grid grid-cols-2 gap-12">
                <div className="space-y-8">
                     <div>
                        <h2 className="text-2xl font-bold text-white uppercase tracking-tight mb-4 flex items-center gap-3">
                            <TrendingUp className="text-emerald-500" />
                            Macro Strategy
                        </h2>
                        <p className="text-white/50 text-sm leading-relaxed">
                            The gap between Normal and Power nodes represents the central strategic tension. A "Power Rush" strategy aims to secure the purple nodes early, while a "Hoarder" strategy saves energy to conquer them later.
                        </p>
                     </div>

                    <div className="space-y-6">
                        {/* Stat Bar 1 */}
                        <div>
                            <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-wide">
                                <span className="text-purple-400">Power Rush (Base + 2 Power)</span>
                                <span className="text-white">15 Income</span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-500 w-3/4 shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
                            </div>
                        </div>

                        {/* Stat Bar 2 */}
                        <div>
                            <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-wide">
                                <span className="text-blue-400">Wide Expansion (Base + 5 Normal)</span>
                                <span className="text-white">10 Income</span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 w-1/2"></div>
                            </div>
                        </div>

                        {/* Stat Bar 3 */}
                        <div>
                            <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-wide">
                                <span className="text-red-500">Turtle (Base Only)</span>
                                <span className="text-white">5 Income</span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-red-500 w-1/4"></div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 p-4 rounded-lg border border-white/10 flex gap-4 items-start">
                        <Lock className="text-white/40 shrink-0 mt-1" size={16} />
                        <div>
                            <h4 className="text-white font-bold text-sm mb-1">Tactical Tip</h4>
                            <p className="text-xs text-white/50 leading-relaxed">
                                Because collision resolution favors the player with higher energy, the "Sniper" strategy involves hoarding 25+ energy to guarantee wins on disputed Power Nodes.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-black/40 rounded-2xl p-6 border border-white/5 flex flex-col justify-center items-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px]"></div>
                    
                    <h3 className="text-center text-white/40 mb-6 text-xs tracking-[0.2em] font-mono uppercase relative z-10">Node Value Heatmap</h3>
                    
                    <div className="grid grid-cols-6 gap-2 relative z-10 w-full max-w-[300px]">
                        {Array.from({ length: 24 }).map((_, i) => {
                            const isPower = [3, 6, 10, 16, 19, 23].includes(i);
                            return (
                                <div 
                                    key={i} 
                                    className={`h-10 rounded transition-all duration-500 cursor-crosshair hover:scale-110 ${
                                        isPower 
                                        ? 'bg-purple-500/80 animate-pulse shadow-[0_0_10px_rgba(168,85,247,0.3)]' 
                                        : 'bg-emerald-900/40 hover:bg-emerald-500/40'
                                    }`} 
                                />
                            );
                        })}
                    </div>
                    
                    <div className="flex justify-between w-full max-w-[300px] mt-4 text-[10px] font-mono text-white/30 relative z-10">
                        <span>NODE 1</span>
                        <span>NODE 26</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
