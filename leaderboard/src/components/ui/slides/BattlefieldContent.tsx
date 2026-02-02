import { useState } from "react";
import { MousePointer2, Zap, Home, Hexagon } from "lucide-react";

export function BattlefieldContent() {
    const [hoveredNode, setHoveredNode] = useState<any>(null);

    // Node generation logic adhering to the 26-node circular network
    const nodes = Array.from({ length: 26 }, (_, i) => {
        const id = i + 1;
        let type = 'NORMAL';
        if (id === 1) type = 'HOME_P1';
        if (id === 14) type = 'HOME_P2';
        if ([4, 7, 11, 17, 20, 24].includes(id)) type = 'POWER';
        
        // Calculate position
        const angleDeg = (i * (360 / 26)) - 90; // Start at top
        const angleRad = angleDeg * (Math.PI / 180);
        return { id, type, angleRad, angleDeg };
    });

    return (
        <div className="space-y-8 h-full flex flex-col">
            <div className="flex justify-between items-end">
                <div>
                     <h1 className="text-3xl font-bold text-white uppercase tracking-tight flex items-center gap-3">
                        <Hexagon className="text-emerald-500" size={32} />
                        The Arena
                    </h1>
                     <p className="text-white/50 mt-2 text-sm max-w-md">
                        The game is played on a closed loop of 26 nodes. Hover over the nodes to analyze their strategic value.
                    </p>
                </div>
                
                {/* Dynamic Info Panel */}
                <div className={`w-64 p-4 rounded-xl border backdrop-blur-md transition-all duration-300 ${
                    hoveredNode 
                        ? hoveredNode.type === 'POWER' ? 'bg-purple-500/10 border-purple-500/50'
                        : hoveredNode.type === 'HOME_P1' ? 'bg-emerald-500/10 border-emerald-500/50'
                        : hoveredNode.type === 'HOME_P2' ? 'bg-red-500/10 border-red-500/50'
                        : 'bg-white/5 border-white/20'
                        : 'bg-white/5 border-white/10'
                }`}>
                    <div className="flex justify-between items-center mb-3">
                        <div>
                            <h3 className="text-lg font-bold text-white">
                                {hoveredNode ? `Node ${hoveredNode.id}` : "Hover Map"}
                            </h3>
                            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
                                {hoveredNode 
                                    ? hoveredNode.type.replace('_', ' ') 
                                    : "AWAITING INPUT"}
                            </span>
                        </div>
                        <div className="w-8 h-8 rounded bg-black/40 flex items-center justify-center text-white/60">
                            {hoveredNode?.type === 'POWER' ? <Zap size={14} className="text-purple-400"/> :
                             hoveredNode?.type === 'HOME_P1' ? <Home size={14} className="text-emerald-400"/> :
                             hoveredNode?.type === 'HOME_P2' ? <Home size={14} className="text-red-400"/> :
                             <MousePointer2 size={14}/>
                            }
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-black/30 p-2 rounded">
                            <div className="text-white/40 mb-0.5">Yield</div>
                            <div className="font-mono font-bold text-white">
                                {hoveredNode ? (hoveredNode.type.includes('HOME') || hoveredNode.type === 'POWER' ? '+5' : '+1') : '--'}
                            </div>
                        </div>
                        <div className="bg-black/30 p-2 rounded">
                            <div className="text-white/40 mb-0.5">Cost</div>
                            <div className="font-mono font-bold text-white">
                                {hoveredNode ? (hoveredNode.type.includes('HOME') ? 'N/A' : hoveredNode.type === 'POWER' ? '15E' : '5E') : '--'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Interactive Ring Visualization */}
            <div className="flex-1 relative flex items-center justify-center min-h-[400px]">
                {/* Ring Track */}
                <div className="absolute w-[350px] h-[350px] rounded-full border-2 border-dashed border-white/5 animate-[spin_60s_linear_infinite]" />
                
                {/* Center Decoration */}
                 <div className="absolute w-24 h-24 rounded-full bg-black/80 border border-white/10 flex flex-col items-center justify-center z-0 shadow-2xl">
                    <div className="text-white/30 text-[10px] font-mono">NODES</div>
                    <div className="text-2xl font-bold text-white">26</div>
                </div>

                {/* Nodes */}
                <div className="absolute w-[350px] h-[350px]">
                    {nodes.map((node) => {
                         const x = Math.cos(node.angleRad) * 175 + 175 - 16; // 175 is radius, 16 is half size
                         const y = Math.sin(node.angleRad) * 175 + 175 - 16;

                         let baseClasses = "absolute w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-bold cursor-pointer transition-all duration-300 hover:scale-125 z-10 shadow-lg";
                         let colorClasses = "bg-black/80 border-white/20 text-white/40 hover:border-white hover:text-white hover:z-20";
                         
                         if (node.type === 'POWER') colorClasses = "bg-purple-500/20 border-purple-500/50 text-purple-200 hover:bg-purple-500 hover:border-white hover:text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]";
                         if (node.type === 'HOME_P1') colorClasses = "bg-emerald-500/20 border-emerald-500/50 text-emerald-200 hover:bg-emerald-500 hover:border-white hover:text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]";
                         if (node.type === 'HOME_P2') colorClasses = "bg-red-500/20 border-red-500/50 text-red-200 hover:bg-red-500 hover:border-white hover:text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]";

                         return (
                             <div
                                key={node.id}
                                style={{ transform: `translate(${x}px, ${y}px)` }}
                                className={`${baseClasses} ${colorClasses}`}
                                onMouseEnter={() => setHoveredNode(node)}
                                onMouseLeave={() => setHoveredNode(null)}
                             >
                                {node.id}
                             </div>
                         );
                    })}
                </div>
            </div>
        </div>
    );
}
