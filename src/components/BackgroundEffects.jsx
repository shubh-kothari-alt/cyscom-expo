import { motion } from "framer-motion";

export default function BackgroundEffects() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden" aria-hidden="true">
      
      {/* High-end cinematic glow gradients in rich maroons and reds */}
      <div
        className="absolute -top-40 left-1/4 h-[560px] w-[560px] rounded-full opacity-[0.12] blur-[140px]"
        style={{ background: "radial-gradient(circle, #721c24, transparent 70%)" }}
      />
      <div
        className="absolute top-1/3 -right-32 h-[480px] w-[480px] rounded-full opacity-[0.10] blur-[140px]"
        style={{ background: "radial-gradient(circle, #d90429, transparent 70%)" }}
      />
      <div
        className="absolute bottom-0 left-1/3 h-[420px] w-[420px] rounded-full opacity-[0.15] blur-[140px]"
        style={{ background: "radial-gradient(circle, #1a0707, transparent 70%)" }}
      />

      {/* Occasional scanline sweep - tinted red */}
      <motion.div
        className="absolute inset-x-0 h-px"
        style={{
          background: "linear-gradient(to right, transparent, rgba(217,4,41,0.35), transparent)",
        }}
        initial={{ top: "-5%" }}
        animate={{ top: ["-5%", "105%"] }}
        transition={{ duration: 7, repeat: Infinity, repeatDelay: 9, ease: "linear" }}
      />

      {/* Film grain for texture */}
      <div className="noise-overlay absolute inset-0 opacity-50 mix-blend-overlay" />

      {/* Heavy dark vignette to keep edges quiet and blend with the void base */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse 95% 85% at 50% 40%, transparent 50%, #070202 100%)" }}
      />
    </div>
  );
}