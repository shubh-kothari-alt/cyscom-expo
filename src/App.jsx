import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, ArrowRight, Plus } from "lucide-react";
import Header from "./components/Header";
import GameCard from "./components/GameCard";
import Leaderboard from "./components/Leaderboard";
import CipherCaseBanner from "./components/CipherCaseBanner";
import NameEntry from "./components/NameEntry";
import PhishOrFish from "./games/PhishOrFish/PhishOrFish";
import PasswordPanic from "./games/PasswordPanic/PasswordPanic";
import WhosTheHacker from "./games/WhosTheHacker/WhosTheHacker";
import CipherCaseGame from "./games/CipherCaseGame/CipherCaseGame"; // <-- Imported the new game
import { EXPO_TIMEOUT } from "./config";
import {
  getPlayerName,
  setPlayerName as savePlayerName,
  getLeaderboard,
  addLeaderboardEntry,
  getCombinedScore,
} from "./utils/storage";

// Added cipher to the game metadata
const GAME_META = {
  phish: { title: "PHISH OR FISH?" },
  password: { title: "PASSWORD PANIC" },
  hacker: { title: "WHO'S THE HACKER?" },
  cipher: { title: "CIPHER CASE CTF" }, 
};

export default function App() {
  const [view, setView] = useState("landing");
  const [playerName, setPlayerNameState] = useState(() => getPlayerName());
  const [soundOn, setSoundOn] = useState(false);
  const [expoMode, setExpoMode] = useState(false);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  
  const [entries, setEntries] = useState([]);
  const [combinedScore, setCombinedScore] = useState(0);

  const inactivityRef = useRef(null);
  const viewRef = useRef(view);
  viewRef.current = view;

  useEffect(() => {
    async function loadData() {
      const board = await getLeaderboard();
      setEntries(board);
      if (playerName) {
        const score = await getCombinedScore(playerName);
        setCombinedScore(score);
      }
    }
    loadData();
  }, [playerName]);

  useEffect(() => {
    function onFullscreenChange() {
      setExpoMode(!!document.fullscreenElement);
    }
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const resetInactivityTimer = useCallback(() => {
    if (inactivityRef.current) clearTimeout(inactivityRef.current);
    if (!expoMode) return;
    inactivityRef.current = setTimeout(() => {
      if (viewRef.current !== "landing") setView("landing");
    }, EXPO_TIMEOUT);
  }, [expoMode]);

  useEffect(() => {
    resetInactivityTimer();
    const events = ["pointerdown", "keydown", "touchstart"];
    events.forEach((e) => window.addEventListener(e, resetInactivityTimer));
    return () => {
      events.forEach((e) => window.removeEventListener(e, resetInactivityTimer));
      if (inactivityRef.current) clearTimeout(inactivityRef.current);
    };
  }, [resetInactivityTimer]);

  function handleToggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => console.error(err));
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }

  function handleSetName(name) {
    setPlayerNameState(name);
    savePlayerName(name);
  }

  function handleClearName() {
    setPlayerNameState("");
    savePlayerName("");
    setCombinedScore(0);
  }

  async function handleComplete(game, score) {
    const updated = await addLeaderboardEntry({ nickname: playerName || "PLAYER", score, game });
    setEntries(updated);
    
    const newCombined = await getCombinedScore(playerName);
    setCombinedScore(newCombined);
  }

  // Added cipher to the isGame check so the header and background adapt!
  const isGame = ["phish", "password", "hacker", "cipher"].includes(view);
  function handleBack() {
    if (isGame) setView("arcade");
    else if (view === "arcade") setView("landing");
  }

  return (
    <div className="relative min-h-screen font-body text-bone selection:bg-white/30 selection:text-white bg-[#0a0a0c]">
      
      {(!isGame || view === "arcade" || view === "landing") && <StructuralBackground />}
      
      <Header
        playerName={playerName}
        soundOn={soundOn}
        onToggleSound={() => setSoundOn((s) => !s)}
        expoMode={expoMode}
        onToggleExpo={handleToggleFullscreen}
        onOpenLeaderboard={() => setLeaderboardOpen(true)}
        showBackNav={view !== "landing"}
        onBack={handleBack}
        gameTitle={isGame ? GAME_META[view]?.title : null}
      />

      <main className="relative z-10 mx-auto w-full max-w-5xl px-5 pb-24 pt-4 md:px-8">
        <AnimatePresence mode="wait">
          {view === "landing" && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.4 }}
            >
              <LandingScreen
                playerName={playerName}
                onSetName={handleSetName}
                onClearName={handleClearName}
                combinedScore={combinedScore}
                onEnter={() => setView("arcade")}
              />
            </motion.div>
          )}

          {view === "arcade" && (
            <motion.div
              key="arcade"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
            >
              <ArcadeDashboard onPlay={(game) => setView(game)} />
            </motion.div>
          )}

          {view === "phish" && (
            <motion.div key="phish" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <PhishOrFish soundOn={soundOn} onExit={handleBack} onComplete={(score) => handleComplete("phish", score)} />
            </motion.div>
          )}
          {view === "password" && (
            <motion.div key="password" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <PasswordPanic soundOn={soundOn} onExit={handleBack} onComplete={(score) => handleComplete("password", score)} />
            </motion.div>
          )}
          {view === "hacker" && (
            <motion.div key="hacker" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WhosTheHacker soundOn={soundOn} onExit={handleBack} onComplete={(score) => handleComplete("hacker", score)} />
            </motion.div>
          )}
          
          {/* Render the new Cipher Case game! */}
          {view === "cipher" && (
            <motion.div key="cipher" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <CipherCaseGame 
                onComplete={(score) => {
                  handleComplete("cipher", score);
                  // Automatically send them back to the menu after 4 seconds of seeing the success screen
                  setTimeout(() => setView("arcade"), 4000); 
                }} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Leaderboard
        open={leaderboardOpen}
        onClose={() => setLeaderboardOpen(false)}
        entries={entries}
        currentPlayer={playerName}
      />
    </div>
  );
}

// ==========================================
// AESTHETIC PLAIN BACKGROUND
// ==========================================
function StructuralBackground() {
  return (
    <div className="fixed inset-0 -z-0 bg-[#0a0a0c] overflow-hidden flex items-center justify-center pointer-events-none">
      <div className="absolute left-[15%] top-0 bottom-0 w-[1px] bg-white/[0.03]" />
      <div className="absolute right-[15%] top-0 bottom-0 w-[1px] bg-white/[0.03]" />
      <div className="absolute top-[25%] left-0 right-0 h-[1px] bg-white/[0.03]" />
      <div className="absolute bottom-[25%] left-0 right-0 h-[1px] bg-white/[0.03]" />

      <div className="absolute top-[25%] left-[15%] -translate-x-1/2 -translate-y-1/2 text-white/10"><Plus size={16} strokeWidth={1} /></div>
      <div className="absolute top-[25%] right-[15%] translate-x-1/2 -translate-y-1/2 text-white/10"><Plus size={16} strokeWidth={1} /></div>
      <div className="absolute bottom-[25%] left-[15%] -translate-x-1/2 translate-y-1/2 text-white/10"><Plus size={16} strokeWidth={1} /></div>
      <div className="absolute bottom-[25%] right-[15%] translate-x-1/2 translate-y-1/2 text-white/10"><Plus size={16} strokeWidth={1} /></div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none flex items-center justify-center" style={{ perspective: "1200px" }}>
        
        <div className="absolute z-20 w-[300px] h-[300px] flex items-center justify-center opacity-40">
          <img 
            src="/logo1.png" 
            alt="Cyscom Logo" 
            className="w-full h-full object-contain mix-blend-screen rounded-full" 
          />
        </div>

        <motion.div
          className="absolute w-[500px] h-[500px]"
          style={{ transformStyle: "preserve-3d" }}
          animate={{ rotateY: [0, 360], rotateX: [15, 35, 15] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute inset-0 rounded-full border-2 border-blue-500/40" style={{ transform: "rotateX(90deg)" }} />
          <div className="absolute inset-0 rounded-full border-2 border-blue-400/30" style={{ transform: "rotateX(90deg) rotateY(45deg)" }} />
          <div className="absolute inset-0 rounded-full border-2 border-white/20" style={{ transform: "rotateX(90deg) rotateY(90deg)" }} />
          <div className="absolute inset-0 rounded-full border-2 border-blue-400/30" style={{ transform: "rotateX(90deg) rotateY(135deg)" }} />
        </motion.div>

        <motion.div
          className="absolute w-[650px] h-[650px] rounded-full border-2 border-blue-500/25"
          style={{ transformStyle: "preserve-3d" }}
          animate={{ rotateX: [60, 60], rotateY: [0, 360], rotateZ: [0, -360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        
        <motion.div
          className="absolute w-[750px] h-[750px] rounded-full border-2 border-white/20 border-dashed"
          style={{ transformStyle: "preserve-3d" }}
          animate={{ rotateX: [-70, -70], rotateY: [0, -360], rotateZ: [0, 360] }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </div>
  );
}

// ==========================================
// SCREEN 1: MINIMALIST LANDING
// ==========================================
function LandingScreen({ playerName, onSetName, onClearName, combinedScore, onEnter }) {
  return (
    <div className="relative flex min-h-[85vh] flex-col items-center justify-center p-6 z-10">
      <div className="w-full max-w-md relative z-10 mb-12">
        {!playerName ? (
          <div className="flex flex-col text-left">
            <h1 className="font-display text-5xl font-bold text-white mb-10 tracking-tight">
              Welcome.
            </h1>
            <NameEntry onSubmit={onSetName} />
          </div>
        ) : (
          <div className="flex flex-col text-left">
            <div className="mb-12">
              <p className="text-white/40 font-mono tracking-widest text-[10px] uppercase mb-3">Active Session</p>
              <h1 className="font-display text-4xl font-bold text-white tracking-tight break-all">
                {playerName}
              </h1>
              
              {combinedScore > 0 && (
                <div className="mt-6 inline-flex items-center gap-4 border border-white/10 px-5 py-3 rounded-none">
                  <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Global Rating</span>
                  <span className="font-mono text-lg font-bold text-white">{combinedScore}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4">
              <button
                onClick={onEnter}
                className="flex items-center justify-between w-full bg-white px-8 py-5 text-sm font-bold text-black transition-all hover:bg-white/90 active:scale-[0.98]"
              >
                <span className="tracking-wide">ENTER ARCADE</span>
                <ArrowRight size={18} />
              </button>
              
              <button 
                onClick={onClearName}
                className="flex items-center justify-center gap-2 w-full px-8 py-4 text-xs font-mono tracking-widest text-white/30 hover:text-white transition-all"
              >
                <LogOut size={14} />
                SWITCH PROFILE
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// SCREEN 2: ARCADE DASHBOARD
// ==========================================
function ArcadeDashboard({ onPlay }) {
  return (
    <div className="flex flex-col gap-10 pt-4">
      {/* Added the CTF game to the grid! */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
        <GameCard
          title="PHISH OR FISH?"
          description="Spot the social engineering attempts before time runs out."
          onClick={() => onPlay("phish")}
        />
        <GameCard
          title="PASSWORD PANIC"
          description="Construct a secure phrase under pressure."
          onClick={() => onPlay("password")}
        />
        <GameCard
          title="WHO'S THE HACKER?"
          description="Review dossiers and identify the internal threat."
          onClick={() => onPlay("hacker")}
        />
        <GameCard
          title="CIPHER CASE CTF"
          description="A lethal CTF challenge. Find the atomic connections to decrypt the terminal."
          onClick={() => onPlay("cipher")}
        />
      </div>
      
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="mt-4"
      >
        <CipherCaseBanner variant="landing" />
      </motion.section>
    </div>
  );
}
