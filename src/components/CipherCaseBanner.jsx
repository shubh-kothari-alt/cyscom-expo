import { ArrowRight, Clock, MapPin, Trophy, Calendar } from "lucide-react";

export default function CipherCaseBanner({ variant = "default" }) {
  return (
    <a
      href="https://chennaievents.vit.ac.in/technovit/eventPreview"
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative flex flex-col md:flex-row items-start md:items-center justify-between overflow-hidden border-2 border-red-600/80 bg-black p-6 transition-all hover:bg-red-950/30 hover:border-red-500 hover:shadow-[0_0_20px_rgba(220,38,38,0.3)] active:scale-[0.99] cursor-pointer ${
        variant === "landing" ? "w-full" : ""
      }`}
    >
      {/* Gritty background accent */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.05)_0,transparent_100%)] pointer-events-none"></div>

      <div className="relative z-10 flex flex-col gap-4">
        
        {/* Breaking Bad Style Title */}
        <div className="flex items-center gap-1 text-4xl md:text-5xl font-black text-red-600 tracking-wider font-display">
          
          {/* Carbon (C) Element */}
          <div className="relative flex h-14 w-12 md:h-16 md:w-14 flex-col items-center justify-center border-2 border-red-600 bg-black/50 leading-none">
            <span className="absolute top-1 left-1 text-[10px] font-mono text-red-600">6</span>
            <span>C</span>
          </div>
          
          <span>IPHER</span>
          
          {/* Calcium (Ca) Element */}
          <div className="relative ml-2 flex h-14 w-14 md:h-16 md:w-16 flex-col items-center justify-center border-2 border-red-600 bg-black/50 leading-none">
            <span className="absolute top-1 left-1 text-[10px] font-mono text-red-600">20</span>
            <span>Ca</span>
          </div>
          
          <span>SE</span>
        </div>

        {/* Subtitle */}
        <p className="text-sm md:text-base font-mono font-bold text-red-500 tracking-widest uppercase">
          Murder Mystery CTF
        </p>
        
        {/* Event Details Grid */}
        <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm font-mono text-red-200/80 mt-2">
          <span className="flex items-center gap-1.5">
            <Clock size={16} className="text-red-600"/> 24 HOURS
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin size={16} className="text-red-600"/> MG AUDITORIUM
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar size={16} className="text-red-600"/> 31 AUGUST
          </span>
          <span className="flex items-center gap-1.5 rounded bg-red-900/40 px-2 py-1 text-red-400 font-bold border border-red-900/50">
            <Trophy size={16} className="text-red-500"/> PRIZES: 1 LAKH
          </span>
        </div>
      </div>

      {/* Action Button */}
      <div className="relative z-10 mt-6 md:mt-0 flex items-center gap-3 md:justify-center rounded bg-red-600 px-6 py-4 text-black font-bold group-hover:bg-red-500 group-hover:shadow-[0_0_15px_rgba(239,68,68,0.6)] transition-all">
        <span className="font-mono tracking-wider">SOLVE IT</span>
        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform stroke-[3]" />
      </div>
    </a>
  );
}
