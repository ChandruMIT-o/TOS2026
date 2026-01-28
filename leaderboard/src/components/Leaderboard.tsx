import { motion } from "framer-motion";

export function Leaderboard() {
  const data = [
    { rank: 1, team: "CipherSquad", score: 2450, status: "Online" },
    { rank: 2, team: "NullPointers", score: 2320, status: "Offline" },
    { rank: 3, team: "BinaryBeasts", score: 2100, status: "In Game" },
    { rank: 4, team: "StackOverflow", score: 1950, status: "Online" },
    { rank: 5, team: "GitMerge", score: 1800, status: "Offline" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Leaderboard</h2>
        <span className="text-xs font-mono text-secondary bg-background/50 px-2 py-1 rounded">
          LIVE
        </span>
      </div>

      <div className="overflow-hidden bg-background/30 rounded-lg border border-border">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-secondary uppercase bg-background/50 border-b border-border">
            <tr>
              <th className="px-4 py-3 font-medium">Rank</th>
              <th className="px-4 py-3 font-medium">Team</th>
              <th className="px-4 py-3 font-medium text-right">Score</th>
              <th className="px-4 py-3 font-medium text-right">Status</th>
            </tr>
          </thead>
          <motion.tbody 
            className="divide-y divide-border/50"
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            {data.map((item) => (
              <motion.tr 
                key={item.team} 
                className="hover:bg-background/50 transition-colors"
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  show: { opacity: 1, x: 0 }
                }}
              >
                <td className="px-4 py-3 font-mono text-secondary">#{item.rank}</td>
                <td className="px-4 py-3 font-medium">{item.team}</td>
                <td className="px-4 py-3 text-right font-mono">{item.score}</td>
                <td className="px-4 py-3 text-right">
                  <span
                    className={`inline-block w-2 h-2 rounded-full mr-2 ${
                      item.status === "Online"
                        ? "bg-emerald-500"
                        : item.status === "In Game"
                        ? "bg-amber-500"
                        : "bg-neutral-500"
                    }`}
                  />
                  <span className="text-xs text-secondary">{item.status}</span>
                </td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </div>
    </motion.div>
  );
}
