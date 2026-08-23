import { motion } from "framer-motion";
import { Lock, ArrowUpRight } from "lucide-react";
import { CIPHER_CASE_URL } from "../config/site";
import { useExpoMode } from "../context/ExpoModeContext";

export default function CipherCaseCTA() {
  const { expoMode } = useExpoMode();

  return (
    <section className="relative px-6 pb-28 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="bracket-frame relative overflow-hidden rounded-3xl border border-red/25 bg-gradient-to-b from-navy to-void px-6 py-16 text-center sm:px-14"
        >
          {/* danger-tinted ambient glow */}
          <div
            className="pointer-events-none absolute -top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full opacity-[0.16] blur-[160px]"
            style={{ background: "radial-gradient(circle, #ff4457, transparent 70%)" }}
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #ff4457 1px, transparent 1px), linear-gradient(to bottom, #ff4457 1px, transparent 1px)",
              backgroundSize: "36px 36px",
            }}
          />

          <div className="relative z-10 flex flex-col items-center">
            <p className="text-eyebrow text-xs text-ink-faint mb-3">THE ARCADE IS ONLY THE BEGINNING.</p>
            <p className="text-eyebrow text-xs text-red mb-8">THE REAL CASE STARTS HERE.</p>

            <div className="mb-6 flex items-center gap-3 text-red">
              <Lock size={expoMode ? 28 : 22} strokeWidth={1.75} />
            </div>

            <h2
              className={`font-display font-bold tracking-tight text-ink ${
                expoMode ? "text-5xl" : "text-4xl sm:text-5xl"
              }`}
            >
              CIPHER CASE
            </h2>
            <p className="mt-2 text-eyebrow text-sm text-ink-dim">24-HOUR CTF</p>

            <p
              className={`mt-6 max-w-md font-mono tracking-wide text-red/90 ${
                expoMode ? "text-lg" : "text-sm"
              }`}
            >
              24 HOURS. ONE CASE. ZERO ESCAPE.
            </p>

            <a
              href={CIPHER_CASE_URL}
              target="_blank"
              rel="noreferrer"
              className={`group mt-10 inline-flex items-center gap-2.5 rounded-xl border border-red/40 bg-red/10 font-mono font-medium tracking-[0.08em] text-red transition-colors hover:bg-red hover:text-void ${
                expoMode ? "px-9 py-[18px] text-base" : "px-7 py-3.5 text-sm"
              }`}
            >
              DISCOVER CIPHER CASE
              <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
