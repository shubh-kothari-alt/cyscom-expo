import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useExpoMode } from "../context/ExpoModeContext";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

export default function Hero() {
  const { expoMode } = useExpoMode();

  return (
    <section className="relative flex min-h-[92vh] flex-col items-center justify-center px-6 pt-24 text-center">
      <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col items-center">
        <motion.div
          variants={item}
          className="mb-8 flex items-center gap-2 rounded-full border border-line bg-panel/50 px-4 py-1.5 font-mono text-[10px] tracking-[0.2em] text-ink-dim"
        >
          <motion.span
            className="h-1.5 w-1.5 rounded-full bg-green"
            animate={{ opacity: [1, 0.25, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          SYSTEM ONLINE
          <span className="mx-1 text-ink-faint">/</span>
          VIT CHENNAI // CYSCOM
        </motion.div>

        <motion.p variants={item} className="text-eyebrow text-xs text-cyan mb-5">
          CYSCOM // CYBER ARCADE
        </motion.p>

        <motion.h1
          variants={item}
          className={`font-display font-semibold leading-[0.98] tracking-tight text-ink ${
            expoMode ? "text-6xl sm:text-8xl" : "text-5xl sm:text-7xl md:text-8xl"
          }`}
        >
          THINK.
          <br />
          CLICK.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green via-cyan to-green">
            DON&rsquo;T GET HACKED.
          </span>
        </motion.h1>

        <motion.p
          variants={item}
          className={`mt-7 max-w-xl text-ink-dim ${expoMode ? "text-xl" : "text-base sm:text-lg"}`}
        >
          Three games. Three minutes.
          <br className="hidden sm:block" /> How cyber-aware are you?
        </motion.p>

        <motion.div variants={item} className="mt-11">
          <Link
            to="/arcade"
            className={`group relative inline-flex items-center gap-3 overflow-hidden rounded-xl bg-green font-mono font-medium tracking-[0.08em] text-void transition-transform hover:scale-[1.03] active:scale-[0.98] ${
              expoMode ? "px-10 py-5 text-base" : "px-7 py-4 text-sm"
            }`}
          >
            <span className="relative z-10">ENTER THE ARCADE</span>
            <ArrowRight size={16} className="relative z-10 transition-transform group-hover:translate-x-1" />
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-cyan to-green transition-transform duration-500 group-hover:translate-x-0" />
          </Link>
        </motion.div>
      </motion.div>

      {/* scroll hint */}
      <motion.div
        className="absolute bottom-8 flex flex-col items-center gap-2 text-ink-faint"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2.4, repeat: Infinity }}
      >
        <span className="font-mono text-[9px] tracking-[0.2em]">SCROLL</span>
        <span className="h-8 w-px bg-gradient-to-b from-ink-faint to-transparent" />
      </motion.div>
    </section>
  );
}
