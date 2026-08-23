import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

// --- LOCALIZED RED MATRIX RAIN ---
function CardMatrixRain() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    // Size the canvas exactly to the GameCard
    const resize = () => {
      if (!canvas.parentElement) return;
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);

    const draw = () => {
      // Semi-transparent black to create the fading trail effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Aesthetic Red text
      ctx.fillStyle = "#ff2a2a";
      ctx.font = fontSize + "px monospace";

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);
    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60 mix-blend-screen" />;
}

// --- THE GAME CARD ---
export default function GameCard({ title, description, onClick }) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      onClick={onClick}
      className="group relative flex flex-col justify-between bg-black/80 backdrop-blur-md border border-white/10 p-8 rounded-3xl cursor-pointer shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden hover:border-red-500/40 transition-all min-h-[280px]"
    >
      {/* MATRIX RAIN: Always visible, locked inside the card */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <CardMatrixRain />
      </div>

      {/* Dark gradient overlay so your text stays readable over the rain */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/50 to-black/90 pointer-events-none z-10" />

      {/* Card Content */}
      <div className="relative z-20">
        <h3 className="font-display text-2xl font-bold text-white tracking-wide mb-3 group-hover:text-red-500 transition-colors">
          {title}
        </h3>
        <p className="text-white/60 text-sm leading-relaxed mb-8">
          {description}
        </p>
      </div>

      <div className="relative z-20 flex items-center gap-2 text-xs font-mono tracking-widest text-white/40 group-hover:text-red-500 transition-colors">
        <span>INITIALIZE SIMULATION</span>
        <ArrowRight size={14} className="transition-transform group-hover:translate-x-2" />
      </div>
    </motion.div>
  );
}