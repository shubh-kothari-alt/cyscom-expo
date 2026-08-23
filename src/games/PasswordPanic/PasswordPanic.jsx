import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, X, Timer, Lock, Unlock, Shield, 
  Key, Terminal, Cpu, RotateCcw, Home, ShieldCheck, Fingerprint, SearchAlert
} from "lucide-react";
import { getRandomWordBank } from "../../data/passwordChallenges";
import { evaluatePassword, checkRequiredWords, meetsBaseRules } from "../../utils/passwordStrength";
import { playSfx } from "../../utils/sound";

// Changed to 2 minutes (120 seconds)
const DURATION = 120; 

// Clean, aesthetic color palette
const STRENGTH_THEME = {
  "VERY WEAK": { text: "text-rose-500", bg: "bg-rose-500", border: "border-rose-500/30", subtle: "bg-rose-500/5" },
  WEAK: { text: "text-orange-500", bg: "bg-orange-500", border: "border-orange-500/30", subtle: "bg-orange-500/5" },
  FAIR: { text: "text-amber-400", bg: "bg-amber-400", border: "border-amber-400/30", subtle: "bg-amber-400/5" },
  STRONG: { text: "text-emerald-400", bg: "bg-emerald-400", border: "border-emerald-400/30", subtle: "bg-emerald-400/5" },
  FORTRESS: { text: "text-cyan-400", bg: "bg-cyan-400", border: "border-cyan-400/30", subtle: "bg-cyan-400/5" },
};

// Cyber Threat Analysis Data
const CRACK_STATS = {
  "VERY WEAK": { 
    time: "Instantly (< 1 sec)", 
    attacks: ["Dictionary Attack", "Credential Stuffing", "Simple Brute Force"] 
  },
  "WEAK": { 
    time: "Seconds to Minutes", 
    attacks: ["Targeted Brute Force", "Rule-based Dictionary"] 
  },
  "FAIR": { 
    time: "Hours to Days", 
    attacks: ["Advanced Brute Force (GPU)", "Rainbow Tables"] 
  },
  "STRONG": { 
    time: "Centuries", 
    attacks: ["Phishing", "Keyloggers", "Malware"] // Passwords this strong are usually stolen, not cracked
  },
  "FORTRESS": { 
    time: "Trillions of Years", 
    attacks: ["Social Engineering", "Rubber-hose Cryptanalysis"] // Basically, they have to trick or force you to tell them
  },
};

export default function PasswordPanic({ soundOn, onExit, onComplete }) {
  // Sliced to strictly guarantee only 2 whitelist words are required!
  const words = useMemo(() => getRandomWordBank().slice(0, 2), []);
  const [password, setPassword] = useState("");
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [done, setDone] = useState(false);
  const [finalResult, setFinalResult] = useState(null);
  const warnedRef = useRef(false);

  useEffect(() => {
    if (done) return;
    if (timeLeft <= 0) {
      finish();
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    if (timeLeft === 10 && !warnedRef.current) {
      warnedRef.current = true;
      playSfx("warning", soundOn);
    }
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, done]);

  const rules = meetsBaseRules(password, words);
  const wordChecks = checkRequiredWords(password, words);
  const live = evaluatePassword(password, words, timeLeft / DURATION);

  function finish() {
    if (done) return;
    const timeRemainingRatio = timeLeft / DURATION;
    const result = evaluatePassword(password, words, timeRemainingRatio);
    setFinalResult({ ...result, timeLeft });
    setDone(true);
    playSfx("complete", soundOn);
    onComplete && onComplete(result.score);
  }

  const theme = STRENGTH_THEME[live.label];

  // --- POST-GAME: MINIMALIST RESULT SCREEN WITH THREAT ANALYSIS ---
  if (done && finalResult) {
    const isSecure = finalResult.label === "STRONG" || finalResult.label === "FORTRESS";
    const finalTheme = STRENGTH_THEME[finalResult.label];
    const threatData = CRACK_STATS[finalResult.label];

    return (
      <div className="relative mx-auto flex w-full max-w-2xl flex-col items-center justify-center min-h-[70vh] z-10 font-sans">
        {/* Aesthetic Background */}
        <AestheticBackground />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative w-full bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 shadow-2xl overflow-hidden mt-6 mb-6"
        >
          {/* Subtle background glow based on result */}
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 blur-[80px] opacity-20 pointer-events-none ${finalTheme.bg}`} />

          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className={`p-4 rounded-2xl border flex-shrink-0 ${finalTheme.border} ${finalTheme.subtle} ${finalTheme.text}`}>
              {isSecure ? <ShieldCheck size={36} strokeWidth={1.5} /> : <Unlock size={36} strokeWidth={1.5} />}
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-zinc-100 tracking-wide">
                {isSecure ? "Security Verified" : "Vulnerability Detected"}
              </h2>
              <p className="text-zinc-400 text-sm">
                {isSecure 
                  ? "Your password meets advanced security standards." 
                  : "This combination is too weak to deploy."}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-zinc-950/50 rounded-2xl p-5 border border-zinc-800/50 text-center">
              <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest mb-1">Final Strength</p>
              <p className={`text-xl font-bold ${finalTheme.text}`}>{finalResult.label}</p>
            </div>
            <div className="bg-zinc-950/50 rounded-2xl p-5 border border-zinc-800/50 text-center">
              <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest mb-1">Defense Score</p>
              <p className="text-xl font-bold text-zinc-100">{finalResult.score}</p>
            </div>
          </div>

          {/* New Threat Analysis Section */}
          <div className="bg-zinc-950/80 rounded-2xl p-6 border border-zinc-800 mb-8 relative z-10">
            <div className="flex items-center gap-2 border-b border-zinc-800 pb-3 mb-4">
              <SearchAlert size={16} className="text-zinc-400" />
              <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest">Threat Analysis</p>
            </div>
            
            <div className="flex flex-col gap-5">
              <div>
                <p className="text-[10px] text-zinc-500 tracking-widest uppercase mb-1">Time to Crack (Brute Force)</p>
                <p className={`font-mono text-lg font-bold ${finalTheme.text}`}>{threatData.time}</p>
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 tracking-widest uppercase mb-2">Most Likely Vectors of Compromise</p>
                <div className="flex flex-wrap gap-2">
                  {threatData.attacks.map(attack => (
                    <span key={attack} className="px-2.5 py-1.5 bg-zinc-900 border border-zinc-700/50 rounded-lg text-xs font-medium text-zinc-300">
                      {attack}
                    </span>
                  ))}
                </div>
                <p className="text-[10px] text-zinc-500 mt-3 italic leading-relaxed">
                  {isSecure 
                    ? "*Brute force is mathematically unfeasible. Hackers will attempt to steal this password through deception instead." 
                    : "*Hardware acceleration allows automated software to guess thousands of variations of this password per second."}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
            <button onClick={() => window.location.reload()} className="flex justify-center items-center gap-2 rounded-xl bg-zinc-100 hover:bg-white text-zinc-900 px-8 py-3.5 font-medium transition-all shadow-lg">
              <RotateCcw size={18} /> Retry Challenge
            </button>
            <button onClick={onExit} className="flex justify-center items-center gap-2 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 text-zinc-300 px-8 py-3.5 font-medium transition-all border border-zinc-700/50">
              <Home size={18} /> Arcade Menu
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // --- MAIN UI ---
  return (
    <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center min-h-[75vh] pt-8 z-10 font-sans">
      
      {/* Aesthetic Background */}
      <AestheticBackground />

      {/* Main Container */}
      <div className="w-full bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/60 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
        
        {/* Dynamic Top Glow */}
        <div className={`absolute top-0 left-0 w-full h-1 transition-colors duration-500 ${theme.bg}`} />
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-24 blur-[60px] opacity-10 transition-colors duration-500 pointer-events-none ${theme.bg}`} />

        {/* Header Area */}
        <div className="flex items-center justify-between mb-10 relative z-10">
          <div>
            <h2 className="text-2xl font-display font-bold text-zinc-100 tracking-wide">Password Panic</h2>
            <p className="text-sm text-zinc-400 mt-1">Construct a secure phrase.</p>
          </div>
          
          <div className={`flex items-center gap-2 bg-zinc-950/80 px-4 py-2 rounded-xl border transition-colors duration-300 ${timeLeft <= 10 ? "border-rose-500/50 text-rose-500" : "border-zinc-800 text-zinc-300"}`}>
            <Timer size={18} className={timeLeft <= 10 ? "animate-pulse" : ""} />
            <span className="font-mono font-medium text-lg">
              {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:{String(timeLeft % 60).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Required Words Tags (Now strictly 2) */}
        <div className="mb-8 relative z-10">
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Key size={14} /> Required Elements
          </p>
          <div className="flex flex-wrap gap-2.5">
            {wordChecks.map((w) => (
              <span
                key={w.word}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 border ${
                  w.found 
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" 
                    : "border-zinc-700/50 bg-zinc-800/30 text-zinc-400"
                }`}
              >
                {w.found && <Check size={14} />}
                {w.word}
              </span>
            ))}
          </div>
        </div>

        {/* The Input Field */}
        <div className="relative mb-8 z-10">
          <input
            id="pw-input"
            value={password}
            onChange={(e) => setPassword(e.target.value.slice(0, 32))}
            placeholder="Type your password here..."
            autoFocus
            disabled={done}
            className={`w-full bg-zinc-950 border-2 rounded-2xl px-6 py-5 text-xl font-mono text-zinc-100 placeholder:text-zinc-600 transition-all duration-300 focus:outline-none focus:shadow-[0_0_20px_rgba(0,0,0,0.5)] ${theme.border}`}
          />
          {/* Minimal visual strength indicator */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-zinc-800 rounded-b-2xl overflow-hidden">
             <motion.div 
               className={`h-full ${theme.bg}`}
               animate={{ width: `${live.meterPct}%` }}
               transition={{ duration: 0.3 }}
             />
          </div>
        </div>

        {/* Rule Checkers & Live Score */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          
          {/* Rules Grid */}
          <div className="bg-zinc-950/50 rounded-2xl p-5 border border-zinc-800/50">
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest mb-4">Security Rules</p>
            <div className="grid grid-cols-2 gap-3">
              <RuleItem ok={rules.length} label="8+ Chars" />
              <RuleItem ok={rules.upper} label="Uppercase" />
              <RuleItem ok={rules.lower} label="Lowercase" />
              <RuleItem ok={rules.digit} label="Number" />
              <RuleItem ok={rules.symbol} label="Symbol" />
            </div>
          </div>

          {/* Score & Submit */}
          <div className="flex flex-col justify-between bg-zinc-950/50 rounded-2xl p-5 border border-zinc-800/50">
            <div>
              <div className="flex justify-between items-center mb-1">
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest">Strength</p>
                <p className={`text-sm font-bold tracking-wide uppercase ${theme.text}`}>{live.label}</p>
              </div>
              <div className="flex justify-between items-end mt-4">
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest mb-1">Live Score</p>
                <p className="text-3xl font-bold text-zinc-100">{live.score}</p>
              </div>
            </div>

            <button
              onClick={finish}
              className={`w-full mt-6 py-3.5 rounded-xl font-medium transition-all duration-300 ${
                live.label === "FORTRESS" || live.label === "STRONG"
                  ? "bg-zinc-100 text-zinc-900 hover:bg-white shadow-lg"
                  : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              }`}
            >
              Lock In Password
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

// Clean rule item component
function RuleItem({ ok, label }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
        ok ? "bg-emerald-500/20 text-emerald-400" : "bg-zinc-800 text-zinc-500"
      }`}>
        {ok ? <Check size={12} strokeWidth={3} /> : <X size={12} strokeWidth={3} />}
      </div>
      <span className={`text-sm ${ok ? "text-zinc-200" : "text-zinc-500"}`}>
        {label}
      </span>
    </div>
  );
}

// Dedicated background component for the scattered floating icons
function AestheticBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-[#09090b] overflow-hidden">
      {/* Subtle radial gradient for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/40 via-[#09090b] to-[#09090b]" />
      
      {/* Scattered, slowly floating icons */}
      <FloatingIcon Icon={Lock} top="15%" left="10%" size={48} delay={0} duration={8} />
      <FloatingIcon Icon={Shield} top="25%" left="80%" size={64} delay={2} duration={10} />
      <FloatingIcon Icon={Key} top="65%" left="15%" size={36} delay={1} duration={7} />
      <FloatingIcon Icon={Unlock} top="70%" left="75%" size={40} delay={3} duration={9} />
      <FloatingIcon Icon={Terminal} top="45%" left="5%" size={32} delay={4} duration={8} />
      <FloatingIcon Icon={Cpu} top="10%" left="60%" size={42} delay={1.5} duration={11} />
      <FloatingIcon Icon={Fingerprint} top="85%" left="45%" size={56} delay={2.5} duration={12} />
    </div>
  );
}

function FloatingIcon({ Icon, top, left, size, delay, duration }) {
  return (
    <motion.div
      className="absolute text-zinc-800/40"
      style={{ top, left }}
      animate={{ y: [0, -15, 0] }}
      transition={{ 
        duration, 
        repeat: Infinity, 
        ease: "easeInOut",
        delay 
      }}
    >
      <Icon size={size} strokeWidth={1} />
    </motion.div>
  );
}