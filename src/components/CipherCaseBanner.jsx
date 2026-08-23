import { ShieldAlert } from "lucide-react";
import { BRAND, CIPHER_CASE_URL } from "../config";

export default function CipherCaseBanner({ variant = "landing" }) {
  const isEnd = variant === "end";
  
  return (
    <div className="hud-frame relative overflow-hidden border border-crimson/30 bg-gradient-to-br from-wine/80 via-panel2/80 to-void/80 backdrop-blur-md p-6 text-bone shadow-glowMaroon md:p-8">
      {/* Subtle glowing ambient light in the corner */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-crimson/20 blur-3xl" />
      
      <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 font-mono text-xs tracking-[0.3em] text-crimson">
            <ShieldAlert size={14} className="drop-shadow-md" />
            POWERED BY {BRAND.org}
          </div>
          <p className="font-mono text-xs uppercase tracking-widest text-mute">
            {isEnd ? "You've survived the arcade. Ready for the real case?" : "The real case starts here."}
          </p>
          <h3 className="mt-2 font-display text-3xl font-bold tracking-tight text-bone md:text-4xl drop-shadow-sm">
            {BRAND.event}
          </h3>
          <p className="font-mono text-sm tracking-widest text-crimson/80">{BRAND.ctfLength}</p>
        </div>
        
        <a
          href={CIPHER_CASE_URL}
          target="_blank"
          rel="noreferrer"
          className="group relative overflow-hidden hud-frame shrink-0 border border-crimson/50 bg-crimson/10 px-6 py-3 text-center font-display text-sm font-semibold tracking-widest text-crimson transition-all duration-300 hover:border-crimson hover:bg-crimson/20 hover:shadow-glowCrimson"
        >
          <span className="relative z-10">{isEnd ? "SCAN TO REGISTER" : "LEARN MORE"}</span>
          {/* Animated gradient sweep on hover */}
          <div className="absolute inset-0 -z-0 bg-gradient-to-r from-transparent via-crimson/20 to-transparent translate-x-[-100%] transition-transform duration-700 group-hover:translate-x-[100%]" />
        </a>
      </div>
    </div>
  );
}