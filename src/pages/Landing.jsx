import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Fingerprint, Pencil } from "lucide-react";
import NameEntry from "../components/NameEntry";
import { BRAND } from "../config";

export default function Landing({ playerName, onSetName, combinedScore, onEnter }) {
  const [editingName, setEditingName] = useState(false);
  const showForm = !playerName || editingName;

  return (
    <div className="mx-auto flex min-h-[calc(100vh-84px)] w-full max-w-6xl flex-col justify-center px-5 py-10 md:px-8">
      <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
        {/* left: identity + entry */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col gap-6"
        >
          <div className="rule-label">
            <span>DOSSIER NO. 0X4A2</span>
          </div>

          <h1 className="font-display text-5xl font-bold leading-[0.98] text-bone sm:text-6xl md:text-7xl">
            THINK.
            <br />
            <span className="text-cyan text-glow-cyan">CLICK.</span>
            <br />
            DON&rsquo;T GET
            <br />
            HACKED.
          </h1>

          <p className="max-w-md text-sm leading-relaxed text-mute md:text-base">
            Three interrogations. Three minutes each. Every choice is logged, timed,
            and scored — find out how many of them you'd survive for real.
          </p>

          {showForm ? (
            <div className="mt-2 w-full max-w-md">
              <NameEntry
                initialValue={editingName ? playerName : ""}
                onSubmit={(name) => {
                  onSetName(name);
                  setEditingName(false);
                }}
              />
            </div>
          ) : (
            <div className="mt-2 flex flex-wrap items-center gap-3 font-mono text-xs tracking-widest text-mute">
              <span>
                AGENT <span className="text-bone">{playerName}</span>
              </span>
              {combinedScore > 0 && (
                <span className="border-l border-line pl-3">
                  SCORE <span className="text-acid">{combinedScore}</span>
                </span>
              )}
              <button
                onClick={() => setEditingName(true)}
                className="flex items-center gap-1 border-l border-line pl-3 text-mute/80 transition hover:text-cyan"
              >
                <Pencil size={11} /> EDIT
              </button>
            </div>
          )}

          <div className="mt-2">
            <button
              onClick={onEnter}
              className="hud-frame group flex items-center gap-2 border border-cyan/50 bg-cyan/10 px-7 py-3.5 font-display text-sm font-semibold tracking-widest text-cyan transition hover:bg-cyan/20"
            >
              ENTER THE ARCADE
              <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </motion.div>

        {/* right: docket / stamp panel */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="hud-frame case-corner relative hidden border border-line bg-panel/95 p-7 lg:block"
        >
          <div className="stamp animate-stampIn border-cyan/70 text-cyan">
            <Fingerprint size={14} />
            CLEARANCE PENDING
          </div>

          <dl className="mt-8 flex flex-col gap-5">
            <Row label="ORGANIZED BY" value={BRAND.org} />
            <Row label="LINKED EVENT" value={BRAND.event} />
            <Row label="FORMAT" value={BRAND.ctfLength} />
            <Row label="ACTIVE CHALLENGES" value="03" accent />
          </dl>

          <div className="mt-8 border-t border-line pt-5 font-mono text-[11px] leading-relaxed text-mute">
            Every round leaves a trace. Scores are logged to the local leaderboard —
            no personal data leaves this device.
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Row({ label, value, accent }) {
  return (
    <div className="flex items-center justify-between border-b border-line/60 pb-2 font-mono text-xs tracking-widest">
      <dt className="text-mute">{label}</dt>
      <dd className={accent ? "text-acid" : "text-bone"}>{value}</dd>
    </div>
  );
}
