import { motion } from "motion/react";
import { User } from "firebase/auth";
import { useState, useEffect } from "react";

export default function LobbyScreen({ user, username }: { user: User; username: string }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showUid, setShowUid] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((e) => {
        console.error(`Error attempting to enable fullscreen mode: ${e.message} (${e.name})`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-sky-300 text-white overflow-hidden font-sans"
    >
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 p-4 lg:p-6 flex justify-between items-center z-10">
        <div 
          className="flex items-center gap-4 bg-black/30 backdrop-blur-md p-2 pr-6 rounded-full border border-white/10 cursor-pointer hover:bg-black/40 transition-colors"
          onClick={() => setShowUid(!showUid)}
        >
          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-red-500 flex items-center justify-center text-xl font-bold border-2 border-white shadow-lg">
            {username.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg lg:text-xl font-bold text-white drop-shadow-md">{username}</h2>
            {showUid ? (
              <p className="text-xs text-emerald-300 font-mono tracking-wider">UID: {user.uid.slice(0, 8)}...</p>
            ) : (
              <p className="text-xs text-yellow-300 font-bold uppercase tracking-wider">Level 1 • Runner</p>
            )}
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={toggleFullscreen}
            className="w-10 h-10 lg:w-12 lg:h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center backdrop-blur-md transition-colors border border-white/20"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
            )}
          </button>
          <button className="px-6 py-2 bg-yellow-400 hover:bg-yellow-300 text-red-600 rounded-full text-sm lg:text-base font-black shadow-[0_4px_0_rgb(180,83,9)] active:shadow-none active:translate-y-[4px] transition-all uppercase tracking-wider border-2 border-yellow-500">
            Play Now
          </button>
        </div>
      </header>

      {/* Main Content - Character Display */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Background Elements - Sky and Ground */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-300 to-sky-100" />
        <div className="absolute bottom-0 w-full h-[35%] bg-[#f0e68c] border-t-8 border-[#e6d86c]" /> {/* Sand/Ground */}
        
        {/* Decorative clouds */}
        <div className="absolute top-20 left-20 w-32 h-12 bg-white/80 rounded-full blur-xl opacity-60 animate-pulse" />
        <div className="absolute top-40 right-40 w-48 h-16 bg-white/80 rounded-full blur-xl opacity-40" />

        {/* Character Container */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.4 }}
          className="relative z-10 flex flex-col items-center mt-20"
        >
          {/* The Red Character - Standing Pose */}
          <div className="relative w-40 h-64 lg:w-56 lg:h-80">
             {/* Head */}
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 lg:w-32 lg:h-32 bg-red-600 rounded-full shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.2)] z-20" />
             
             {/* Body */}
             <div className="absolute top-20 lg:top-28 left-1/2 -translate-x-1/2 w-16 h-24 lg:w-20 lg:h-32 bg-red-600 rounded-3xl shadow-[inset_-5px_-5px_15px_rgba(0,0,0,0.2)] z-10" />
             
             {/* Left Arm - Straight Down */}
             <div className="absolute top-24 lg:top-32 left-2 lg:left-4 w-8 h-24 lg:w-10 lg:h-32 bg-red-600 rounded-full origin-top shadow-[inset_-2px_-2px_10px_rgba(0,0,0,0.2)]" />
             
             {/* Right Arm - Straight Down */}
             <div className="absolute top-24 lg:top-32 right-2 lg:right-4 w-8 h-24 lg:w-10 lg:h-32 bg-red-600 rounded-full origin-top shadow-[inset_-2px_-2px_10px_rgba(0,0,0,0.2)]" />
             
             {/* Left Leg - Straight */}
             <div className="absolute top-40 lg:top-56 left-6 lg:left-8 w-9 h-24 lg:w-11 lg:h-32 bg-red-600 rounded-full shadow-[inset_-2px_-2px_10px_rgba(0,0,0,0.2)]" />
             
             {/* Right Leg - Straight */}
             <div className="absolute top-40 lg:top-56 right-6 lg:right-8 w-9 h-24 lg:w-11 lg:h-32 bg-red-600 rounded-full shadow-[inset_-2px_-2px_10px_rgba(0,0,0,0.2)]" />
          </div>
          
          {/* Shadow */}
          <div className="w-48 h-8 bg-black/20 rounded-[100%] blur-md mt-[-10px]" />
        </motion.div>
      </div>
    </motion.div>
  );
}

