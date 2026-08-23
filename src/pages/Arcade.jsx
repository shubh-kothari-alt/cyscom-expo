import { motion } from "framer-motion";
import GameGrid from "../components/GameGrid";
import CipherCaseCTA from "../components/CipherCaseCTA";

export default function Arcade() {
  return (
    <div className="pt-32">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="px-6 text-center sm:px-8"
      >
        <p className="text-eyebrow text-xs text-cyan mb-3">SESSION ACTIVE</p>
      </motion.div>
      <GameGrid />
      <CipherCaseCTA />
    </div>
  );
}
