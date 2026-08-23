import { useState } from "react";
import { Lock, Unlock, Terminal, FileSearch } from "lucide-react";

export default function CipherCaseGame({ onComplete }) {
  const [passcode, setPasscode] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState(false);

  // The secret answer based on the poster's Carbon (6) and Calcium (20)
  const SECRET_CODE = "620"; 

  const handleUnlock = (e) => {
    e.preventDefault();
    if (passcode === SECRET_CODE) {
      setIsUnlocked(true);
      setError(false);
      // Give them a massive CTF bonus score
      if (onComplete) onComplete(5000); 
    } else {
      setError(true);
      setPasscode("");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-black border-2 border-red-900/50 p-8 font-mono text-white">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-red-900/50 pb-4 mb-6">
        <div className="flex items-center gap-3 text-red-600">
          <Terminal size={24} />
          <h2 className="text-2xl font-bold tracking-widest">CTF_TERMINAL</h2>
        </div>
        <span className="text-xs text-red-500/50 animate-pulse">STATUS: ENCRYPTED</span>
      </div>

      {!isUnlocked ? (
        <div className="space-y-6">
          <div className="bg-red-950/20 p-4 border border-red-900/30">
            <h3 className="text-red-500 font-bold mb-2 flex items-center gap-2">
              <FileSearch size={18} /> ACTIVE CASE FILE
            </h3>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              A lethal synthetic compound was deployed in the mainframe. 
              The perpetrator left a signature in the logs. You must find the hidden connections and put your technical skills to test to identify the cipher.
            </p>
            <div className="bg-black p-3 text-red-400/80 text-xs tracking-widest border border-red-900/50">
              LOG_FRAG: [Carbon-Isotope-Detected] ... [Calcium-Residue-Found]
            </div>
          </div>

          <form onSubmit={handleUnlock} className="flex flex-col gap-4">
            <label className="text-sm text-gray-500">ENTER OVERRIDE CIPHER:</label>
            <div className="flex gap-4">
              <input
                type="text"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className={`flex-1 bg-transparent border-b-2 ${error ? 'border-red-600 text-red-600' : 'border-gray-700 text-white'} focus:outline-none focus:border-red-500 text-xl px-2 py-1`}
                placeholder="***"
                maxLength={3}
              />
              <button 
                type="submit"
                className="bg-red-900/40 hover:bg-red-600 border border-red-900 px-6 py-2 transition-colors flex items-center gap-2"
              >
                <Lock size={16} /> DECRYPT
              </button>
            </div>
            {error && <p className="text-xs text-red-600">ACCESS DENIED. CIPHER INCORRECT.</p>}
          </form>
        </div>
      ) : (
        <div className="text-center py-8 space-y-6">
          <div className="flex justify-center text-red-500 mb-4">
            <Unlock size={48} />
          </div>
          <h3 className="text-3xl font-bold text-white tracking-widest">CIPHER BROKEN</h3>
          <p className="text-gray-400 max-w-md mx-auto">
            You have successfully bypassed the security grid and secured 5,000 CTF points. 
          </p>
          <div className="pt-4">
            <a 
              href="https://chennaievents.vit.ac.in/technovit/eventPreview" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-red-600 text-black font-bold px-8 py-3 hover:bg-red-500 transition-colors"
            >
              REGISTER FOR THE REAL MISSION
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
