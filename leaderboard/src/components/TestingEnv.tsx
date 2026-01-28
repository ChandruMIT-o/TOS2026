import { motion } from "framer-motion";
import { Terminal, Play, Save } from "lucide-react";

export function TestingEnv() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl p-0 shadow-sm max-w-4xl mx-auto overflow-hidden flex flex-col h-[500px]"
    >
      <div className="bg-background/50 border-b border-border p-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-secondary">
          <Terminal size={14} />
          <span className="font-mono">strategy_v1.py</span>
        </div>
        <div className="flex items-center gap-2">
           <button className="p-1.5 rounded hover:bg-background text-secondary hover:text-foreground transition-colors">
              <Save size={14} />
           </button>
           <button className="bg-foreground text-background text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1 hover:opacity-90">
              <Play size={10} fill="currentColor" /> Run Test
           </button>
        </div>
      </div>

      <div className="flex-1 bg-[#1e1e1e] p-4 text-sm font-mono text-[#d4d4d4] overflow-auto">
        <div className="flex">
          <div className="text-[#6e6e6e] text-right pr-4 select-none">
            1<br/>2<br/>3<br/>4<br/>5<br/>6
          </div>
          <div>
            <span className="text-[#c586c0]">def</span> <span className="text-[#dcdcaa]">main</span>():<br/>
            &nbsp;&nbsp;<span className="text-[#6a9955]"># Initialize generic strategy</span><br/>
            &nbsp;&nbsp;<span className="text-[#9cdcfe]">target</span> = <span className="text-[#ce9178]">"EnemyBase"</span><br/>
            &nbsp;&nbsp;<span className="text-[#c586c0]">if</span> <span className="text-[#9cdcfe]">target</span>.<span className="text-[#dcdcaa]">is_visible</span>():<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#9cdcfe]">weapon</span>.<span className="text-[#dcdcaa]">fire</span>()<br/>
            &nbsp;&nbsp;<span className="text-[#c586c0]">else</span>:<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#9cdcfe]">radar</span>.<span className="text-[#dcdcaa]">scan</span>()
          </div>
        </div>
      </div>

      <div className="bg-black/20 border-t border-border p-3 h-32 font-mono text-xs text-secondary overflow-y-auto">
        <div className="text-emerald-500 mb-1">➜ System initialized.</div>
        <div className="mb-1">Loading assets... [OK]</div>
        <div className="mb-1">Connecting to simulation server... [OK]</div>
        <div className="animate-pulse">_</div>
      </div>
    </motion.div>
  );
}
