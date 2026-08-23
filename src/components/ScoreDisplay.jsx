import { motion } from "framer-motion";
import { RotateCcw, Home } from "lucide-react";

// stats: array of { label, value, accent? }
export default function ScoreDisplay({ heading, title, score, stats, verdict, onReplay, onHome }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto flex w-full max-w-2xl flex-col gap-6 pt-4"
    >
      <div className="hud-frame relative overflow-hidden border border-maroonDim/60 bg-panel2/80 backdrop-blur-lg p-6 text-center md:p-10 shadow-2xl">
        {/* Ambient background glow behind the score */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-crimson/10 blur-[80px]" />

        <div className="relative z-10">
          <p className="font-mono text-xs tracking-[0.3em] text-crimson/80">{heading}</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-bone md:text-4xl drop-shadow-sm">{title}</h2>

          <div className="mt-8 animate-countUp">
            <p className="font-mono text-xs tracking-widest text-mute">FINAL SCORE</p>
            <p className="font-display text-6xl font-bold text-crimson drop-shadow-[0_0_25px_rgba(217,4,41,0.6)] md:text-7xl">
              {score}
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {stats.map((s) => (
              <div key={s.label} className="rounded-sm border border-maroonDim/50 bg-black/30 p-4 backdrop-blur-sm shadow-inner">
                <p className="font-mono text-[10px] tracking-[0.2em] text-mute/80">{s.label}</p>
                <p className={`mt-1.5 font-display text-lg font-semibold ${s.accent ? `text-${s.accent} drop-shadow-sm` : "text-bone"}`}>
                  {s.value}
                </p>
              </div>
            ))}
          </div>

          {verdict && (
            <div className="mt-8 border-l-2 border-crimson/50 bg-crimson/5 py-4 px-5 text-left backdrop-blur-sm">
              <p className="font-mono text-sm italic tracking-wide text-bone/90 leading-relaxed">
                &ldquo;{verdict}&rdquo;
              </p>
            </div>
          )}

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <button
              onClick={onReplay}
              className="group relative overflow-hidden flex items-center gap-2 rounded-sm border border-crimson/50 bg-crimson/10 px-6 py-3.5 font-display text-sm font-semibold tracking-widest text-crimson transition-all duration-300 hover:bg-crimson/20 hover:border-crimson hover:shadow-glowCrimson"
            >
              <span className="relative z-10 flex items-center gap-2">
                <RotateCcw size={16} className="transition-transform duration-500 group-hover:-rotate-90" /> 
                PLAY AGAIN
              </span>
              <div className="absolute inset-0 -z-0 bg-gradient-to-r from-transparent via-crimson/20 to-transparent translate-x-[-100%] transition-transform duration-500 group-hover:translate-x-[100%]" />
            </button>
            
            <button
              onClick={onHome}
              className="group relative overflow-hidden flex items-center gap-2 rounded-sm border border-maroonDim/60 bg-panel2/60 px-6 py-3.5 font-display text-sm font-semibold tracking-widest text-mute transition-all duration-300 hover:border-warn hover:text-warn hover:bg-warn/10 hover:shadow-glowMaroon"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Home size={16} className="transition-transform group-hover:scale-110" /> 
                BACK TO ARCADE
              </span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}