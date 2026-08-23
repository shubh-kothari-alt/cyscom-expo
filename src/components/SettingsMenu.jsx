import { useState, useRef, useEffect } from "react";
import { Settings, Monitor } from "lucide-react";
import { useExpoMode } from "../context/ExpoModeContext";

export default function SettingsMenu() {
  const [open, setOpen] = useState(false);
  const { expoMode, toggleExpoMode } = useExpoMode();
  const ref = useRef(null);

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Settings"
        aria-expanded={open}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-ink-dim transition-colors hover:text-ink hover:border-ink-faint"
      >
        <Settings size={14} />
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-64 rounded-xl border border-line bg-panel/95 backdrop-blur-xl p-3 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
          <p className="text-eyebrow text-[9px] text-ink-faint px-1 pb-2">Display</p>
          <button
            onClick={toggleExpoMode}
            className="flex w-full items-center justify-between rounded-lg px-2 py-2.5 hover:bg-panel-2 transition-colors"
          >
            <span className="flex items-center gap-2.5 text-[13px] text-ink">
              <Monitor size={15} className="text-cyan" />
              Expo Mode
            </span>
            <span
              className={`relative h-5 w-9 rounded-full transition-colors ${
                expoMode ? "bg-green" : "bg-line"
              }`}
            >
              <span
                className={`absolute top-0.5 h-4 w-4 rounded-full bg-void transition-transform ${
                  expoMode ? "translate-x-4" : "translate-x-0.5"
                }`}
              />
            </span>
          </button>
          <p className="px-2 pt-1 text-[11px] leading-relaxed text-ink-faint">
            Larger touch targets, minimal nav, auto-reset to home after inactivity. Built for the expo floor.
          </p>
        </div>
      )}
    </div>
  );
}
