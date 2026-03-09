import { motion } from "motion/react";
import { signInWithGoogle } from "../lib/firebase";
import { useState } from "react";

export default function LoginScreen({ onLogin }: { onLogin: (user: any) => void }) {
  const [error, setError] = useState<string | null>(null);
  const [domainError, setDomainError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);
    setDomainError(null);
    try {
      const user = await signInWithGoogle();
      onLogin(user);
    } catch (err: any) {
      console.error(err);
      if (err.message === "Firebase not configured") {
        setError("Firebase configuration is missing. Please check .env file.");
      } else if (err.code === "auth/unauthorized-domain") {
        setDomainError(window.location.hostname);
      } else {
        setError(err.message || "Failed to login");
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-0 flex flex-col items-center justify-center bg-slate-900 text-white p-4 overflow-hidden"
    >
      {/* Background Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 select-none">
        <h1 className="text-[20vw] font-black text-white whitespace-nowrap transform -rotate-12">
          KKG CHEATS
        </h1>
      </div>

      <div className="w-full max-w-md bg-slate-800/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-slate-700 relative z-10">
        <h2 className="text-3xl font-bold mb-6 text-center text-emerald-400">Welcome to KKG Cheats</h2>
        <p className="text-slate-400 text-center mb-8">Sign in to continue to the game lobby.</p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-200 text-sm">
            {error}
          </div>
        )}

        {domainError && (
          <div className="mb-6 p-4 bg-amber-500/20 border border-amber-500 rounded-lg text-amber-200 text-sm text-left">
            <p className="font-bold mb-2 flex items-center gap-2">
              <span className="text-xl">⚠️</span> Domain Not Authorized
            </p>
            <p className="mb-3">To fix this, you must add this domain to your Firebase settings:</p>
            
            <div className="bg-black/50 p-3 rounded flex items-center justify-between gap-2 font-mono text-xs mb-4 border border-amber-500/30">
              <span className="truncate select-all">{domainError}</span>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(domainError);
                  alert("Domain copied to clipboard!");
                }}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 rounded text-slate-900 text-xs font-bold transition-colors whitespace-nowrap"
              >
                COPY DOMAIN
              </button>
            </div>

            <ol className="list-decimal pl-4 space-y-1 text-xs opacity-90">
              <li>Go to <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="underline font-bold hover:text-white">Firebase Console</a></li>
              <li>Select your project (<strong>fyginujn</strong>)</li>
              <li>Go to <strong>Authentication</strong> &rarr; <strong>Settings</strong> &rarr; <strong>Authorized Domains</strong></li>
              <li>Click <strong>Add domain</strong> and paste the domain above</li>
            </ol>
          </div>
        )}

        <button
          onClick={handleLogin}
          className="w-full py-3 px-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Sign in with Google
        </button>
      </div>
    </motion.div>
  );
}
