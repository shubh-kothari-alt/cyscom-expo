/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Deep, luxurious dark red/black bases
        void: "#070202",
        ink: "#0a0303",
        panel: "#120505",
        panel2: "#1a0707",
        wine: "#240a0a",
        line: "#331212",
        
        // High-end maroon and crimson accents
        maroon: "#721c24",
        maroonDim: "#4a1217",
        crimson: "#d90429",
        crimsonDim: "#8b001a",
        
        // Utility colors slightly warmed up
        danger: "#ff3333",
        dangerDim: "#8a1c1c",
        warn: "#ffb703",
        bone: "#fdf5f5",
        mute: "#8a7c7d",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      boxShadow: {
        glowMaroon: "0 0 0 1px rgba(114,28,36,0.3), 0 0 24px rgba(114,28,36,0.15)",
        glowCrimson: "0 0 0 1px rgba(217,4,41,0.3), 0 0 32px rgba(217,4,41,0.2)",
        glowDanger: "0 0 0 1px rgba(255,51,51,0.25), 0 0 24px rgba(255,51,51,0.12)",
      },
      keyframes: {
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        countUp: {
          "0%": { opacity: 0, transform: "translateY(4px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-6px)" },
          "40%": { transform: "translateX(6px)" },
          "60%": { transform: "translateX(-4px)" },
          "80%": { transform: "translateX(4px)" },
        },
      },
      animation: {
        scanline: "scanline 6s linear infinite",
        countUp: "countUp 0.4s ease-out",
        shake: "shake 0.4s ease-in-out",
      },
    },
  },
  plugins: [],
}