import { useEffect, useRef } from "react";

export default function Background() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Characters for the Matrix rain
    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%\"'#&_(),.;:?!\\|{}<>[]^~";
    const fontSize = 16;
    const columns = canvas.width / fontSize; 
    
    // Array to track the y-coordinate of the drop in each column
    const drops = [];
    for (let x = 0; x < columns; x++) {
      drops[x] = 1;
    }

    function draw() {
      // Black background with slight opacity to create the fading trail effect
      ctx.fillStyle = "rgba(7, 2, 2, 0.08)"; // matches our tailwind 'void' color
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = fontSize + "px 'IBM Plex Mono', monospace";

      for (let i = 0; i < drops.length; i++) {
        const text = matrix[Math.floor(Math.random() * matrix.length)];
        
        // Randomly make the leading character bright red, the rest deep crimson
        const isHead = Math.random() > 0.85;
        ctx.fillStyle = isHead ? "#ff3333" : "#8b001a"; 

        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Reset drop to the top randomly to stagger them
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    let interval;
    if (!reduceMotion) {
      interval = setInterval(draw, 45); // Adjust this number to change rain speed
    } else {
      draw(); // Draw just one static frame if user prefers reduced motion
    }
    
    function handleResize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (interval) clearInterval(interval);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-20 overflow-hidden bg-void">
      <canvas ref={canvasRef} className="absolute inset-0 opacity-60" />
    </div>
  );
}