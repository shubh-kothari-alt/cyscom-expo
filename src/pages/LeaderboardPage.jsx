import { motion } from "framer-motion";
import Leaderboard from "../components/Leaderboard";
import { useExpoMode } from "../context/ExpoModeContext";

export default function LeaderboardPage() {
  const { expoMode } = useExpoMode();

  return (
    <div className="min-h-screen px-6 pt-36 pb-24 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <p className="text-eyebrow text-xs text-green mb-3">RANKED // LIVE</p>
          <h1
            className={`font-display font-semibold tracking-tight text-ink ${
              expoMode ? "text-5xl" : "text-3xl sm:text-4xl"
            }`}
          >
            CYSCOM // GLOBAL LEADERBOARD
          </h1>
        </motion.div>

        <Leaderboard />
      </div>
    </div>
  );
}
