import { Volume2, VolumeX, Maximize2, Trophy, Terminal } from "lucide-react";

export default function Header({
  playerName,
  soundOn,
  onToggleSound,
  expoMode,
  onToggleExpo,
  onOpenLeaderboard,
  showBackNav,
  onBack,
  gameTitle,
  progressLabel,
}) {
  return (
    <header className="relative z-30 flex items-center justify-between gap-4 px-5 py-4 md:px-8 border-b border-maroonDim/30 bg-void/40 backdrop-blur-md">
      <div className="flex items-center gap-3">
        {showBackNav ? (
          <button
            onClick={onBack}
            className="hud-frame flex items-center gap-2 rounded-sm border border-maroonDim/60 bg-panel2/60 backdrop-blur-sm px-3 py-2 text-xs font-mono text-mute transition-all hover:border-crimson hover:text-crimson hover:bg-crimson/10"
          >
            ← BACK
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <Terminal size={20} className="text-crimson" strokeWidth={2} />
            <span className="font-display text-sm font-semibold tracking-[0.2em] text-bone">
              CYSCOM <span className="text-crimson"></span>
            </span>
          </div>
        )}
        {gameTitle && (
          <div className="hidden items-center gap-2 border-l border-maroonDim/50 pl-3 md:flex">
            <span className="font-mono text-xs tracking-widest text-mute">{gameTitle}</span>
            {progressLabel && (
              <span className="font-mono text-xs tracking-widest text-crimson">{progressLabel}</span>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {playerName && (
          <span className="hidden font-mono text-xs tracking-widest text-mute sm:inline">
            AGENT <span className="text-bone">{playerName}</span>
          </span>
        )}
        <button
          onClick={onOpenLeaderboard}
          aria-label="Open leaderboard"
          className="hud-frame flex items-center gap-1.5 rounded-sm border border-maroonDim/60 bg-panel2/60 backdrop-blur-sm px-3 py-2 text-xs font-mono text-mute transition-all hover:border-warn hover:text-warn hover:bg-warn/10"
        >
          <Trophy size={14} />
          <span className="hidden sm:inline">RANKS</span>
        </button>
        <button
          onClick={onToggleSound}
          aria-label={soundOn ? "Mute sound" : "Unmute sound"}
          className="rounded-sm border border-maroonDim/60 bg-panel2/60 backdrop-blur-sm p-2 text-mute transition-all hover:border-crimson hover:text-crimson hover:bg-crimson/10"
        >
          {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>
        <button
          onClick={onToggleExpo}
          aria-label="Toggle expo mode"
          title="Expo mode"
          className={`rounded-sm border backdrop-blur-sm p-2 transition-all ${
            expoMode 
              ? "border-warn bg-warn/10 text-warn shadow-glowMaroon" 
              : "border-maroonDim/60 bg-panel2/60 text-mute hover:border-warn hover:text-warn hover:bg-warn/10"
          }`}
        >
          <Maximize2 size={16} />
        </button>
      </div>
    </header>
  );
}