import { motion } from "framer-motion";
import { GAMES } from "../config/site";
import GameCard from "./GameCard";
import { useExpoMode } from "../context/ExpoModeContext";

export default function GameGrid() {
  const { expoMode } = useExpoMode();

  return (
    <section className="relative px-6 pt-10 pb-24 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <p className="text-eyebrow text-xs text-green mb-3">03 MODULES // AWAITING INPUT</p>
          <h2
            className={`font-display font-semibold tracking-tight text-ink ${
              expoMode ? "text-5xl" : "text-3xl sm:text-4xl"
            }`}
          >
            CHOOSE YOUR CHALLENGE
          </h2>
        </motion.div>

        <div className={`grid gap-6 ${expoMode ? "grid-cols-1 lg:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
          {GAMES.map((game, i) => (
            <GameCard key={game.id} game={game} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
