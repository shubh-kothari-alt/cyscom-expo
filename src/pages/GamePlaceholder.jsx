import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import { GAMES } from "../config/site";
import { useExpoMode } from "../context/ExpoModeContext";

/**
 * Drop-in placeholder for a game module.
 *
 * To wire in the real game later: build the component (e.g. PhishOrFish.jsx),
 * then in App.jsx swap
 *   <GamePlaceholder gameId="phish-or-fish" />
 * for
 *   <PhishOrFish />
 * on that route. Nothing else needs to change.
 */
export default function GamePlaceholder({ gameId }) {
  const game = GAMES.find((g) => g.id === gameId);
  const { expoMode } = useExpoMode();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-24 text-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bracket-frame relative flex flex-col items-center rounded-3xl border border-line bg-panel/60 px-10 py-16 backdrop-blur-sm sm:px-20"
      >
        <p className="text-eyebrow text-xs text-ink-faint mb-4">{game ? game.title : "GAME MODULE"}</p>

        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
          className="mb-7 text-cyan"
        >
          <Loader2 size={expoMode ? 44 : 34} strokeWidth={1.5} />
        </motion.div>

        <h1
          className={`font-display font-semibold tracking-tight text-ink ${
            expoMode ? "text-4xl" : "text-2xl sm:text-3xl"
          }`}
        >
          GAME MODULE INITIALIZING...
        </h1>

        <p className={`mt-4 max-w-sm text-ink-dim ${expoMode ? "text-lg" : "text-sm"}`}>
          This challenge is being wired up. Check back once the Cyscom crew finishes deployment.
        </p>

        <div className="mt-4 flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-cyan"
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>

        <Link
          to="/arcade"
          className="mt-10 flex items-center gap-2 rounded-xl border border-line px-5 py-3 font-mono text-xs tracking-[0.08em] text-ink-dim transition-colors hover:border-ink-faint hover:text-ink"
        >
          <ArrowLeft size={14} />
          BACK TO ARCADE
        </Link>
      </motion.div>
    </div>
  );
}
