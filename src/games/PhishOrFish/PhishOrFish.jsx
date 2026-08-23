import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, Fish, ShieldAlert, CheckCircle2, XCircle, ArrowRight, 
  Timer, Clock, RotateCcw, Home, Link, Eye, Activity
} from "lucide-react";
import { getRandomRounds } from "../../data/phishingMessages";
import { scoreRound, pickPhishTitle, cyberInstinctLabel } from "../../utils/scoring";
import { playSfx } from "../../utils/sound";

const ROUND_COUNT = 5;
const ROUND_TIME = 30; // 30 seconds per question

export default function PhishOrFish({ soundOn, onExit, onComplete }) {
  const rounds = useMemo(() => getRandomRounds(ROUND_COUNT), []);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [answer, setAnswer] = useState(null); // { correct, chosePhish, msElapsed, breakdown }
  const [streak, setStreak] = useState(0);
  const [reactionTimes, setReactionTimes] = useState([]);
  const [done, setDone] = useState(false);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  
  const startRef = useRef(Date.now());
  const autoAdvanceRef = useRef(null);

  // Initialize each new round
  useEffect(() => {
    startRef.current = Date.now();
    setTimeLeft(ROUND_TIME);
  }, [index]);

  // 30-second countdown timer
  useEffect(() => {
    if (answer || done) return;
    
    if (timeLeft <= 0) {
      handleTimeout();
      return;
    }
    
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, answer, done]);

  // Submit score safely ONLY when 'done' state changes to true
  useEffect(() => {
    if (done && onComplete) {
      const finalScore = Math.max(0, score);
      onComplete(finalScore);
    }
  }, [done, score, onComplete]);

  function handleTimeout() {
    setStreak(0); // Break streak
    setReactionTimes((r) => [...r, ROUND_TIME * 1000]);
    setAnswer({ correct: false, chosePhish: "TIMEOUT", msElapsed: ROUND_TIME * 1000, breakdown: null });
    playSfx("wrong", soundOn);
    
    // Automatically shift to the next question after 3 seconds
    autoAdvanceRef.current = setTimeout(() => {
      next();
    }, 3000);
  }

  function handleChoice(chosePhish) {
    if (answer) return;
    const msElapsed = Date.now() - startRef.current;
    const correct = chosePhish === current.isPhish;
    const nextStreak = correct ? streak + 1 : 0;
    const { points, breakdown } = scoreRound({ correct, msElapsed, streak });
    
    setScore((s) => Math.max(0, s + points));
    setStreak(nextStreak);
    setReactionTimes((r) => [...r, msElapsed]);
    if (correct) setCorrectCount((c) => c + 1);
    
    setAnswer({ correct, chosePhish, msElapsed, breakdown });
    playSfx(correct ? "correct" : "wrong", soundOn);
  }

  function next() {
    if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    if (index + 1 >= rounds.length) {
      setDone(true);
      playSfx("complete", soundOn);
      return;
    }
    setAnswer(null);
    setIndex((i) => i + 1);
  }

  const current = rounds[index];

  // --- POST-GAME: CUSTOM AESTHETIC RESULT SCREEN ---
  if (done) {
    const accuracyRatio = correctCount / rounds.length;
    const avgReaction = reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length;
    const isGood = accuracyRatio >= 0.8;
    
    return (
      <div className="relative mx-auto flex w-full max-w-2xl flex-col items-center justify-center min-h-[70vh] z-10 font-sans">
        <AestheticBackground />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative w-full bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-10 shadow-2xl overflow-hidden"
        >
          {/* Subtle background glow */}
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 blur-[80px] opacity-20 pointer-events-none ${isGood ? 'bg-blue-500' : 'bg-rose-500'}`} />

          <div className="text-center border-b border-slate-800 pb-8 mb-8 relative z-10">
            <div className="flex justify-center mb-4">
              <div className={`p-4 rounded-2xl border ${isGood ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'}`}>
                {isGood ? <ShieldAlert size={40} /> : <Fish size={40} />}
              </div>
            </div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mb-2">Threat Intelligence Report</p>
            <h2 className="font-display text-3xl font-bold text-slate-100 tracking-wide mb-3">
              {pickPhishTitle(accuracyRatio)}
            </h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              {isGood 
                ? "Excellent instinct. You successfully identified the majority of malicious communications." 
                : "Every red flag you missed is one a real scammer is counting on. Stay vigilant."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
            <div className="bg-slate-950/50 rounded-2xl p-5 border border-slate-800/50 flex flex-col items-center text-center">
              <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest mb-2">Accuracy</p>
              <p className="text-3xl font-bold text-slate-100">{correctCount} <span className="text-lg text-slate-500">/ {rounds.length}</span></p>
            </div>
            <div className="bg-slate-950/50 rounded-2xl p-5 border border-slate-800/50 flex flex-col items-center text-center">
              <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest mb-2">Final Score</p>
              <p className="text-3xl font-bold text-blue-400">{score}</p>
            </div>
          </div>

          <div className="bg-slate-950/80 rounded-2xl p-5 border border-slate-800 mb-10 relative z-10 flex justify-between items-center">
            <div>
              <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest mb-1">Cyber Instinct</p>
              <p className="text-slate-200 font-medium">{cyberInstinctLabel(accuracyRatio)}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest mb-1">Avg Reaction</p>
              <p className="text-slate-200 font-medium">{avgReaction < 4000 ? "FAST" : "STEADY"}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
            <button onClick={() => window.location.reload()} className="flex justify-center items-center gap-2 rounded-xl bg-slate-100 hover:bg-white text-slate-900 px-8 py-3.5 font-medium transition-all shadow-lg">
              <RotateCcw size={18} /> Retry Scanner
            </button>
            <button onClick={onExit} className="flex justify-center items-center gap-2 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-slate-300 px-8 py-3.5 font-medium transition-all border border-slate-700/50">
              <Home size={18} /> Arcade Menu
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // --- MAIN UI ---
  return (
    <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center min-h-[75vh] pt-4 z-10 font-sans">
      <AestheticBackground />

      {/* Top HUD */}
      <div className="w-full flex items-center justify-between mb-6 bg-slate-900/60 backdrop-blur-xl border border-slate-800/60 rounded-2xl p-4 shadow-lg">
        <div>
          <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest mb-1">Analysis Progress</p>
          <p className="text-sm font-bold text-slate-200 tracking-wider">
            ROUND {String(index + 1).padStart(2, "0")} <span className="text-slate-600">/ {String(rounds.length).padStart(2, "0")}</span>
          </p>
        </div>
        
        {/* 30-Second Timer */}
        <div className="flex flex-col items-center">
          <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest mb-1">Time Limit</p>
          <div className={`flex items-center gap-1.5 font-mono text-lg font-bold transition-colors duration-300 ${timeLeft <= 10 && !answer ? "text-rose-500 animate-pulse" : "text-blue-400"}`}>
            <Timer size={16} />
            00:{String(timeLeft).padStart(2, "0")}
          </div>
        </div>

        <div className="text-right">
          <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest mb-1">Live Score</p>
          <p className="text-sm font-bold text-slate-200 tracking-wider">{score}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1 w-full bg-slate-800/50 rounded-full overflow-hidden mb-8">
        <motion.div
          className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"
          initial={{ width: `${(index / rounds.length) * 100}%` }}
          animate={{ width: `${((index + (answer ? 1 : 0)) / rounds.length) * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Message Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.3 }}
          className={`w-full bg-slate-900/70 backdrop-blur-xl border rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden ${
            answer && !answer.correct ? "border-rose-500/50 animate-shake" : "border-slate-800"
          }`}
        >
          {/* Card Glass Highlight */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* Sender Info Bar */}
          <div className="flex items-center gap-3 mb-6 bg-slate-950/50 rounded-xl p-3 border border-slate-800/50">
            <div className="bg-slate-800 rounded-lg p-2 text-slate-400">
              <Mail size={16} />
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">Incoming {current.channel}</p>
              <p className="text-sm font-medium text-slate-300 truncate">{current.from}</p>
            </div>
          </div>

          {/* Email Body */}
          <div className="mb-8">
            {current.subject && (
              <h3 className="font-display text-xl font-bold text-slate-100 mb-4">{current.subject}</h3>
            )}
            <div className="bg-slate-950/30 rounded-xl p-5 border border-slate-800/30">
              <p className="whitespace-pre-line text-sm leading-relaxed text-slate-300 font-medium">
                {current.body}
              </p>
            </div>
          </div>

          {/* Interactive Controls / Feedback */}
          {!answer ? (
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleChoice(true)}
                className="group flex flex-col items-center justify-center gap-3 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/20 hover:border-rose-500/50 rounded-2xl py-6 transition-all duration-300"
              >
                <ShieldAlert size={28} className="text-rose-500 transition-transform group-hover:scale-110 group-active:scale-95" />
                <span className="font-display font-bold tracking-widest text-rose-500">PHISH</span>
              </button>
              
              <button
                onClick={() => handleChoice(false)}
                className="group flex flex-col items-center justify-center gap-3 bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/20 hover:border-blue-500/50 rounded-2xl py-6 transition-all duration-300"
              >
                <Fish size={28} className="text-blue-500 transition-transform group-hover:scale-110 group-active:scale-95" />
                <span className="font-display font-bold tracking-widest text-blue-500">SAFE</span>
              </button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl border p-6 backdrop-blur-md ${
                answer.chosePhish === "TIMEOUT"
                  ? "border-rose-500/30 bg-rose-500/10"
                  : answer.correct 
                    ? "border-emerald-500/30 bg-emerald-500/10" 
                    : "border-rose-500/30 bg-rose-500/10"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-full ${answer.chosePhish === "TIMEOUT" || !answer.correct ? "bg-rose-500/20 text-rose-400" : "bg-emerald-500/20 text-emerald-400"}`}>
                  {answer.chosePhish === "TIMEOUT" ? <Clock size={20} /> : answer.correct ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                </div>
                <div>
                  <h4 className={`font-display text-lg font-bold tracking-wide ${answer.chosePhish === "TIMEOUT" || !answer.correct ? "text-rose-400" : "text-emerald-400"}`}>
                    {answer.chosePhish === "TIMEOUT" ? "TIME'S UP" : answer.correct ? "THREAT CAUGHT" : "MISSED IT"}
                  </h4>
                  <p className="text-[10px] uppercase tracking-widest text-slate-400">
                    {current.isPhish ? "Phishing Attempt Detected" : "Legitimate Message Verified"}
                  </p>
                </div>
              </div>
              
              <div className="mt-5 space-y-3 bg-slate-950/50 rounded-xl p-4 border border-slate-800/50">
                {current.reasons.map((r, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <ArrowRight size={14} className="text-slate-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm leading-relaxed text-slate-300 font-medium">{r}</span>
                  </div>
                ))}
              </div>
              
              <button
                onClick={next}
                className="w-full mt-6 flex items-center justify-center gap-2 rounded-xl bg-slate-100 hover:bg-white text-slate-900 px-6 py-4 font-medium transition-all shadow-lg"
              >
                Scan Next Message <ArrowRight size={16} />
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// Dedicated aesthetic background for Phish or Fish
function AestheticBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-[#020617] overflow-hidden">
      {/* Deep oceanic radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-blue-900/10 via-[#020617] to-[#020617]" />
      
      {/* Scattered floating icons fitting the Phish/Comms theme */}
      <FloatingIcon Icon={Mail} top="15%" left="12%" size={42} delay={0} duration={9} />
      <FloatingIcon Icon={Fish} top="75%" left="85%" size={56} delay={2} duration={12} />
      <FloatingIcon Icon={ShieldAlert} top="25%" left="75%" size={36} delay={1} duration={8} />
      <FloatingIcon Icon={Link} top="65%" left="15%" size={48} delay={3} duration={10} />
      <FloatingIcon Icon={Eye} top="40%" left="8%" size={32} delay={4} duration={7} />
      <FloatingIcon Icon={Activity} top="10%" left="50%" size={64} delay={1.5} duration={14} />
    </div>
  );
}

function FloatingIcon({ Icon, top, left, size, delay, duration }) {
  return (
    <motion.div
      className="absolute text-slate-800/40"
      style={{ top, left }}
      animate={{ y: [0, -20, 0] }}
      transition={{ 
        duration, 
        repeat: Infinity, 
        ease: "easeInOut",
        delay 
      }}
    >
      <Icon size={size} strokeWidth={1.2} />
    </motion.div>
  );
}