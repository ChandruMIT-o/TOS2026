import { Sprout, Expand, Shield } from "lucide-react";

export function MechanicsContent() {
    return (
        <div className="space-y-8">
            <div className="text-center space-y-2 mb-8">
                <h2 className="text-2xl font-bold text-white uppercase tracking-widest">Core Mechanics</h2>
                <p className="text-white/50 text-sm max-w-2xl mx-auto">
                    Each round, players simultaneously submit one of three actions. Energy is your currency, territory is your engine.
                </p>
            </div>

            <div className="grid grid-cols-3 gap-6">
                {/* Harvest Card */}
                <div className="group relative bg-white/5 p-6 rounded-xl border border-white/10 hover:border-emerald-500/50 transition-all hover:-translate-y-1">
                    <div className="absolute top-2 right-2 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Sprout size={64} className="text-emerald-500" />
                    </div>
                    
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-4 text-emerald-400">
                        <Sprout size={20} />
                    </div>
                    
                    <h3 className="text-lg font-bold text-white mb-2">Harvest</h3>
                    <p className="text-xs text-white/50 mb-4 leading-relaxed h-10">
                        The only way to generate energy. You must spend a turn to collect resources.
                    </p>
                    
                    <div className="bg-black/30 p-3 rounded text-[10px] font-mono space-y-1.5 text-white/70">
                        <div className="flex justify-between"><span>Home Base</span> <span className="text-emerald-400">+5E</span></div>
                        <div className="flex justify-between"><span>Power Node</span> <span className="text-purple-400">+5E</span></div>
                        <div className="flex justify-between"><span>Normal</span> <span className="text-white/40">+1E</span></div>
                    </div>
                </div>

                {/* Expand Card */}
                <div className="group relative bg-white/5 p-6 rounded-xl border border-white/10 hover:border-blue-500/50 transition-all hover:-translate-y-1">
                    <div className="absolute top-2 right-2 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Expand size={64} className="text-blue-500" />
                    </div>
                    
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4 text-blue-400">
                        <Expand size={20} />
                    </div>
                    
                    <h3 className="text-lg font-bold text-white mb-2">Expand</h3>
                    <p className="text-xs text-white/50 mb-4 leading-relaxed h-10">
                        Claim empty territory. If both players target the same node, highest energy wins.
                    </p>
                    
                    <div className="bg-black/30 p-3 rounded text-[10px] font-mono space-y-1.5 text-white/70">
                        <div className="flex justify-between"><span>Power Cost</span> <span className="text-purple-400">15E</span></div>
                        <div className="flex justify-between"><span>Normal Cost</span> <span className="text-white/40">5E</span></div>
                        <div className="flex justify-between pt-1 border-t border-white/5 text-red-400">
                            <span>Collision</span> <span>-5E</span>
                        </div>
                    </div>
                </div>

                {/* Conquer Card */}
                <div className="group relative bg-white/5 p-6 rounded-xl border border-white/10 hover:border-red-500/50 transition-all hover:-translate-y-1">
                    <div className="absolute top-2 right-2 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Shield size={64} className="text-red-500" />
                    </div>
                    
                    <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center mb-4 text-red-400">
                        <Shield size={20} />
                    </div>
                    
                    <h3 className="text-lg font-bold text-white mb-2">Conquer</h3>
                    <p className="text-xs text-white/50 mb-4 leading-relaxed h-10">
                        Steal enemy nodes. Cost significantly increases based on enemy defense.
                    </p>
                    
                    <div className="bg-black/30 p-3 rounded text-[10px] font-mono space-y-1.5 text-white/70">
                        <div className="flex justify-between"><span>Base Cost</span> <span className="text-red-400">8E / 20E</span></div>
                        <div className="flex justify-between"><span>Defense Tax</span> <span className="text-emerald-400">+1E / Neighbor</span></div>
                        <div className="pt-1 text-white/30 italic text-[9px]">Home bases are immune.</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
