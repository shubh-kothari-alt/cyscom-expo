import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldHalf, Trophy, FileTerminal } from "lucide-react";
import { useExpoMode } from "../context/ExpoModeContext";
import { CIPHER_CASE_URL } from "../config/site";
import SettingsMenu from "./SettingsMenu";

export default function Navbar() {
  const { pathname } = useLocation();
  const { expoMode } = useExpoMode();

  const isActive = (path) => pathname === path;

  return (
    <header className="fixed top-0 inset-x-0 z-40">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div
          className={`mt-4 flex items-center justify-between rounded-2xl border border-line/80 bg-panel/60 backdrop-blur-xl px-5 shadow-[0_0_40px_rgba(0,0,0,0.35)] transition-all ${
            expoMode ? "py-4" : "py-3"
          }`}
        >
          <Link to="/" className="flex items-center gap-3 group">
            <span className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-green/30 bg-green/[0.06]">
              <ShieldHalf size={18} className="text-green" strokeWidth={2} />
            </span>
            <span className="leading-tight">
              <span className="block font-display font-semibold tracking-tight text-ink text-[15px]">
                CYSCOM
              </span>
              <span className="block text-eyebrow text-[9px] text-ink-faint">Cyber Arcade</span>
            </span>
          </Link>

          {!expoMode && (
            <nav className="flex items-center gap-2 font-mono text-[11px] tracking-[0.12em]">
              <NavLink to="/leaderboard" active={isActive("/leaderboard")} icon={Trophy}>
                LEADERBOARD
              </NavLink>
              <a
                href={CIPHER_CASE_URL}
                target="_blank"
                rel="noreferrer"
                className="relative flex items-center gap-1.5 rounded-lg border border-red/25 px-3 py-2 uppercase text-red transition-colors hover:bg-red hover:text-void"
              >
                <FileTerminal size={13} />
                CIPHER CASE
              </a>
              <SettingsMenu />
            </nav>
          )}

          {expoMode && (
            <div className="flex items-center gap-3">
              <StatusPill />
              <SettingsMenu />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function NavLink({ to, active, icon: Icon, accent, children }) {
  return (
    <Link
      to={to}
      className={`relative flex items-center gap-1.5 rounded-lg px-3 py-2 uppercase transition-colors ${
        active
          ? accent
            ? "text-void bg-green"
            : "text-ink bg-panel-2"
          : accent
          ? "text-green hover:bg-green/10 border border-green/25"
          : "text-ink-dim hover:text-ink hover:bg-panel-2"
      }`}
    >
      <Icon size={13} />
      {children}
    </Link>
  );
}

function StatusPill() {
  return (
    <span className="flex items-center gap-2 rounded-full border border-line px-3 py-1.5 font-mono text-[10px] text-ink-dim">
      <motion.span
        className="h-1.5 w-1.5 rounded-full bg-green"
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      SYSTEM ONLINE
    </span>
  );
}
