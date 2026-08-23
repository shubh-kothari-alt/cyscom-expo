import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy } from "lucide-react";

const GAME_LABEL = { phish: "PHISH OR FISH", password: "PASSWORD PANIC", hacker: "WHO'S THE HACKER" };

export default function Leaderboard({ open, onClose, entries, currentPlayer }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center bg-void/90 backdrop-blur-md p-4 pt-16 md:pt-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="hud-frame relative w-full max-w-lg overflow-hidden border border-maroonDim/80 bg-panel2/80 text-bone shadow-glowMaroon backdrop-blur-lg"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Leaderboard"
          >
            {/* Ambient top edge glow */}
            <div className="absolute left-0 right-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-crimson to-transparent opacity-50" />

            <div className="flex items-center justify-between border-b border-maroonDim/50 bg-wine/40 px-5 py-4">
              <div className="flex items-center gap-2 text-bone">
                <Trophy size={16} className="text-warn drop-shadow-[0_0_8px_rgba(255,183,3,0.5)]" />
                <h2 className="font-display text-sm font-semibold tracking-[0.2em] text-crimson drop-shadow-sm">CYSCOM CYBER ARCADE</h2>
              </div>
              <button onClick={onClose} aria-label="Close leaderboard" className="p-1 text-mute transition-colors hover:text-crimson">
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto px-2 py-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-maroonDim">
              {entries.length === 0 ? (
                <div className="px-4 py-10 text-center font-mono text-sm text-mute">
                  NO SCORES LOGGED YET.
                  <br />
                  Be the first agent on the board.
                </div>
              ) : (
                <ol className="flex flex-col gap-1">
                  {entries.map((e, i) => {
                    const isYou = currentPlayer && e.nickname === currentPlayer.toUpperCase();
                    return (
                      <li
                        key={`${e.nickname}-${e.timestamp}-${i}`}
                        className={`group flex items-center justify-between gap-3 rounded-sm px-3 py-2.5 font-mono text-sm transition-all ${
                          isYou
                            ? "border border-crimson/30 bg-crimson/15 text-crimson shadow-inner"
                            : "border border-transparent text-bone hover:bg-white/5"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <span className={`w-6 ${isYou ? "text-crimson" : "text-mute/70"}`}>
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="tracking-wider">{e.nickname}</span>
                          <span className="hidden text-[10px] uppercase tracking-widest text-mute group-hover:text-mute/80 sm:inline">
                            {GAME_LABEL[e.game] || e.game}
                          </span>
                        </span>
                        <span className={`font-semibold ${isYou ? "text-warn drop-shadow-[0_0_5px_rgba(255,183,3,0.8)]" : "text-bone"}`}>
                          {e.score}
                        </span>
                      </li>
                    );
                  })}
                </ol>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}