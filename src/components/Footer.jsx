import { ShieldHalf } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative border-t border-line-soft px-6 py-10 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2 text-ink-faint">
          <ShieldHalf size={14} />
          <span className="font-mono text-[11px] tracking-[0.1em]">CYSCOM // VIT CHENNAI</span>
        </div>
        <p className="font-mono text-[10px] tracking-[0.15em] text-ink-faint">
          BUILT BY THE CYBERSECURITY CLUB · ALL SYSTEMS NOMINAL
        </p>
      </div>
    </footer>
  );
}
