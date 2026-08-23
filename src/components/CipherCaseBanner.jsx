import { ArrowRight } from "lucide-react";

export default function CipherCaseBanner({ variant = "default" }) {
  return (
    <a
      href="https://chennaievents.vit.ac.in/technovit/eventPreview"
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative flex items-center justify-between overflow-hidden border border-white/10 bg-white/5 p-6 transition-all hover:bg-white/10 hover:border-white/20 active:scale-[0.99] cursor-pointer ${
        variant === "landing" ? "w-full" : ""
      }`}
    >
      {/* Matrix-style aesthetic accent */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-600 opacity-80 group-hover:bg-red-500 transition-colors" />

      <div className="flex flex-col gap-1 pl-2">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse"></span>
          <p className="text-[10px] font-mono tracking-[0.2em] text-white/50">TECHNOVIT EVENT</p>
        </div>
        <h3 className="text-xl font-display font-bold tracking-widest text-white group-hover:text-red-400 transition-colors">
          CIPHER CASE
        </h3>
        <p className="text-sm font-mono text-white/60">
          Register now for the ultimate cyber showdown.
        </p>
      </div>

      <div className="flex items-center justify-center rounded-full bg-white/5 p-3 group-hover:bg-red-600/20 group-hover:text-red-400 transition-all text-white/40">
        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
      </div>
    </a>
  );
}
