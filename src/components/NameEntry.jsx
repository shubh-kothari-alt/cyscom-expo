import { useState } from "react";
import { ArrowRight } from "lucide-react";

export default function NameEntry({ onSubmit }) {
  const [name, setName] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length > 0) {
      onSubmit(trimmed.slice(0, 15));
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-full">
      <div className="relative">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          maxLength={15}
          autoFocus
          className="w-full bg-transparent border-b border-white/20 py-3 text-2xl font-display text-white placeholder:text-white/30 focus:border-white focus:outline-none transition-colors"
        />
      </div>
      
      <button
        type="submit"
        disabled={!name.trim()}
        className="flex items-center justify-between w-full rounded-full bg-white px-8 py-4 text-sm font-bold text-black transition-all hover:bg-white/90 active:scale-[0.98] disabled:opacity-30 disabled:pointer-events-none"
      >
        <span>Continue</span>
        <ArrowRight size={18} />
      </button>
    </form>
  );
}