import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Fingerprint, Search, ShieldAlert, Stamp, RotateCcw, Home } from "lucide-react";
import { getRandomCase } from "../../data/hackerCases";
import { playSfx } from "../../utils/sound";

export default function WhosTheHacker({ soundOn, onExit, onComplete }) {
  const [caseFile] = useState(getRandomCase());
  const [inspected, setInspected] = useState(new Set());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [accusation, setAccusation] = useState(null);

  const currentSuspect = caseFile.suspects[currentIndex];

  // Automatically mark a suspect as inspected when you view their file
  useEffect(() => {
    if (currentSuspect) {
      setInspected((prev) => new Set(prev).add(currentSuspect.name));
    }
  }, [currentIndex, currentSuspect]);

  const getAvatar = (name) => `https://ui-avatars.com/api/?name=${name}&background=120505&color=d90429&size=256&font-size=0.33`;

  function nextSuspect() {
    playSfx("click", soundOn);
    setCurrentIndex((prev) => (prev + 1) % caseFile.suspects.length);
  }

  function prevSuspect() {
    playSfx("click", soundOn);
    setCurrentIndex((prev) => (prev - 1 + caseFile.suspects.length) % caseFile.suspects.length);
  }

  function submitAccusation(suspectName) {
    setAccusation(suspectName);
    const correct = suspectName === caseFile.culprit;
    playSfx(correct ? "correct" : "wrong", soundOn);
    
    if (correct) {
      const base = 500;
      const efficiencyBonus = (caseFile.suspects.length - inspected.size) * 150; 
      const score = Math.min(1000, base + Math.max(0, efficiencyBonus));
      onComplete && onComplete(score);
    } else {
      // Game Over: They get 0 points for a false accusation
      onComplete && onComplete(0);
    }
  }

  // --- CUSTOM CASE REPORT END SCREEN ---
  if (accusation) {
    const isCorrect = accusation === caseFile.culprit;
    const finalScore = isCorrect ? Math.min(1000, 500 + Math.max(0, (caseFile.suspects.length - inspected.size) * 150)) : 0;
    
    const actualCulprit = caseFile.suspects.find(s => s.name === caseFile.culprit);
    const accusedSuspect = caseFile.suspects.find(s => s.name === accusation);

    return (
      <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center gap-6 pt-2 z-10">
        {/* Noir Detective Background Overlay */}
        <div className="fixed inset-0 -z-10 bg-[#0a0a0a]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)] opacity-90" />
          <div className="absolute inset-0 opacity-[0.04] bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')]" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full relative bg-[#1c1c1c] border border-[#333] shadow-2xl p-6 md:p-10 mt-8"
        >
          {/* Top Secret Stamp */}
          <div className="absolute top-6 right-6 rotate-[12deg] border-4 border-crimson text-crimson font-mono font-bold text-xl px-2 py-1 opacity-70 pointer-events-none">
            {isCorrect ? "CASE CLOSED" : "BOTCHED"}
          </div>

          <div className="text-center mb-10 border-b border-[#333] pb-8">
            <h2 className="font-display text-4xl font-bold text-bone tracking-wide uppercase mb-4">
              {isCorrect ? "CULPRIT IDENTIFIED" : "FALSE ACCUSATION"}
            </h2>
            <p className="font-mono text-sm text-mute/90 leading-relaxed max-w-2xl mx-auto bg-black/40 p-4 border-l-2 border-crimson/50">
              {isCorrect 
                ? caseFile.explanation || `${caseFile.culprit} left too much evidence behind. The warrant was successfully executed.`
                : `You issued a warrant for ${accusation}. Their alibi checked out perfectly. Because you tipped your hand, the real hacker—${caseFile.culprit}—wiped their tracks and vanished. You only get one shot.`
              }
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-12 mb-10">
            {/* If Wrong: Show the innocent person they accused */}
            {!isCorrect && (
              <div className="flex flex-col items-center">
                <div className="bg-[#f0f0f0] p-3 pb-10 shadow-xl rotate-[-4deg] border border-gray-300 relative w-48 opacity-70">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-white/40 backdrop-blur-sm rotate-[4deg] border border-white/20 shadow-sm" />
                  <img src={accusedSuspect.image || getAvatar(accusedSuspect.name)} alt={accusedSuspect.name} className="w-full aspect-square object-cover grayscale" />
                  <p className="absolute bottom-3 left-0 w-full text-center font-mono text-black text-lg font-bold tracking-widest uppercase handwritten-style">{accusedSuspect.name}</p>
                  
                  {/* Innocent Stamp */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-[15deg] border-4 border-blue-600 text-blue-600 font-mono font-bold text-3xl px-2 py-1 opacity-80">
                    INNOCENT
                  </div>
                </div>
                <p className="mt-4 font-mono text-xs text-mute tracking-widest">WRONGFULLY ACCUSED</p>
              </div>
            )}

            {/* Always show the actual culprit */}
            <div className="flex flex-col items-center">
              <div className="bg-[#f0f0f0] p-3 pb-10 shadow-xl rotate-[3deg] border border-gray-300 relative w-56">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-white/40 backdrop-blur-sm -rotate-[2deg] border border-white/20 shadow-sm" />
                <img src={actualCulprit.image || getAvatar(actualCulprit.name)} alt={actualCulprit.name} className={`w-full aspect-square object-cover contrast-125 ${isCorrect ? "" : "grayscale"}`} />
                <p className="absolute bottom-3 left-0 w-full text-center font-mono text-black text-lg font-bold tracking-widest uppercase handwritten-style">{actualCulprit.name}</p>
                
                {/* Status Stamp */}
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[10deg] border-4 font-mono font-bold text-3xl px-2 py-1 opacity-90 ${isCorrect ? 'border-crimson text-crimson' : 'border-warn text-warn'}`}>
                  {isCorrect ? "GUILTY" : "ESCAPED"}
                </div>
              </div>
              <p className="mt-4 font-mono text-xs text-mute tracking-widest">{isCorrect ? "THREAT NEUTRALIZED" : "ACTUAL CULPRIT"}</p>
            </div>
          </div>

          <div className="flex flex-col items-center border-t border-[#333] pt-8">
            <p className="font-mono text-xs tracking-widest text-mute mb-2">FINAL INVESTIGATION SCORE</p>
            <p className="font-display text-5xl font-bold text-bone mb-8">{finalScore}</p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <button onClick={() => window.location.reload()} className="flex items-center gap-2 border-2 border-crimson/50 bg-crimson/10 px-6 py-3 font-mono font-bold tracking-widest text-crimson transition-all hover:bg-crimson hover:text-white">
                <RotateCcw size={16} /> REOPEN CASE
              </button>
              <button onClick={onExit} className="flex items-center gap-2 border-2 border-[#555] bg-black/40 px-6 py-3 font-mono font-bold tracking-widest text-mute transition-all hover:border-bone hover:text-bone">
                <Home size={16} /> BACK TO DESK
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // --- MAIN GAME UI ---
  return (
    <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center gap-6 pt-2 z-10">
      {/* Noir Detective Background Overlay */}
      <div className="fixed inset-0 -z-10 bg-[#0a0a0a]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)] opacity-90" />
        <div className="absolute inset-0 opacity-[0.04] bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')]" />
      </div>

      {/* Case Briefing Header */}
      <div className="w-full max-w-3xl text-center mb-2">
        <p className="font-mono text-xs tracking-[0.4em] text-crimson mb-2 font-bold uppercase">
          DEPARTMENT OF CYBER INVESTIGATIONS
        </p>
        <h2 className="font-display text-4xl font-bold text-bone tracking-wide uppercase border-b border-line pb-4 mb-4">
          {caseFile.title || "THE BREACH"}
        </h2>
        <p className="font-mono text-sm text-mute/80 leading-relaxed bg-black/40 p-4 border border-line/50 rounded-sm">
          {caseFile.briefing || "Review the suspect dossiers below. When you have connected the clues, issue the warrant."}
        </p>
      </div>

      {/* Interactive Case File Viewer */}
      <div className="relative w-full max-w-3xl flex items-center justify-center">
        {/* Left Nav Arrow */}
        <button onClick={prevSuspect} className="absolute -left-4 md:-left-12 z-20 p-3 text-mute hover:text-crimson transition-colors">
          <ChevronLeft size={32} />
        </button>

        {/* The Physical Dossier Folder */}
        <div className="w-full relative bg-[#1c1c1c] border border-[#333] shadow-2xl p-6 md:p-10 min-h-[400px]">
          <div className="absolute top-6 right-6 rotate-[12deg] border-4 border-crimson text-crimson font-mono font-bold text-xl px-2 py-1 opacity-70 pointer-events-none">
            CONFIDENTIAL
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentSuspect.name}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col md:flex-row gap-8 mt-6"
            >
              {/* Left Side: Polaroid Mugshot */}
              <div className="flex-shrink-0 flex flex-col items-center">
                <div className="bg-[#f0f0f0] p-3 pb-10 shadow-xl rotate-[-3deg] border border-gray-300 relative w-48">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-white/40 backdrop-blur-sm rotate-[4deg] border border-white/20 shadow-sm" />
                  <img src={currentSuspect.image || getAvatar(currentSuspect.name)} alt={currentSuspect.name} className="w-full aspect-square object-cover grayscale contrast-125 brightness-90 border border-gray-400" />
                  <p className="absolute bottom-3 left-0 w-full text-center font-mono text-black text-lg font-bold tracking-widest uppercase handwritten-style">{currentSuspect.name}</p>
                </div>
                <div className="mt-6 flex items-center gap-2 font-mono text-xs text-mute/70">
                  <Fingerprint size={14} /> ID: {Math.floor(Math.random() * 90000) + 10000}
                </div>
              </div>

              {/* Right Side: Typewriter Clues */}
              <div className="flex-grow font-mono">
                <div className="mb-6">
                  <p className="text-xs text-mute tracking-widest border-b border-[#333] pb-1 mb-2">KNOWN ALIAS / ROLE</p>
                  <p className="text-xl text-bone uppercase">{currentSuspect.role}</p>
                </div>

                <div className="mb-6">
                  <p className="text-xs text-mute tracking-widest border-b border-[#333] pb-1 mb-2">STATEMENT / ALIBI</p>
                  <p className="text-sm text-bone/80 leading-relaxed bg-black/20 p-3 border-l-2 border-crimson/50">
                    "{currentSuspect.alibi || "Claimed to be offline during the incident. Records are unverified."}"
                  </p>
                </div>

                <div className="mb-8">
                  <p className="text-xs text-mute tracking-widest border-b border-[#333] pb-1 mb-2">EVIDENCE / CLUES</p>
                  <p className="text-sm text-warn/90 leading-relaxed flex gap-2">
                    <Search size={16} className="flex-shrink-0 mt-0.5" />
                    {currentSuspect.clues || "Network logs place their device near the proxy server."}
                  </p>
                </div>

                {/* Accuse Action */}
                <button
                  onClick={() => submitAccusation(currentSuspect.name)}
                  className="group flex items-center gap-3 w-full sm:w-auto border-2 border-crimson/50 bg-crimson/10 px-6 py-3 font-mono font-bold tracking-widest text-crimson transition-all hover:bg-crimson hover:text-white"
                >
                  <Stamp size={18} className="transition-transform group-hover:scale-110" />
                  ISSUE WARRANT
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Nav Arrow */}
        <button onClick={nextSuspect} className="absolute -right-4 md:-right-12 z-20 p-3 text-mute hover:text-crimson transition-colors">
          <ChevronRight size={32} />
        </button>
      </div>

      {/* Progress Dots */}
      <div className="flex gap-3 mt-2">
        {caseFile.suspects.map((s, i) => (
          <button
            key={s.name}
            onClick={() => { playSfx("click", soundOn); setCurrentIndex(i); }}
            className={`w-3 h-3 rounded-full transition-all ${currentIndex === i ? "bg-crimson scale-125" : inspected.has(s.name) ? "bg-bone/40" : "bg-line"}`}
            aria-label={`View ${s.name}`}
          />
        ))}
      </div>
    </div>
  );
}