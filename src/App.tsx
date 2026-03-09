/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import { User, onAuthStateChanged } from "firebase/auth";
import { ref, get, set } from "firebase/database";
import { auth, db } from "./lib/firebase";
import LoadingScreen from "./components/LoadingScreen";
import LoginScreen from "./components/LoginScreen";
import UsernameScreen from "./components/UsernameScreen";
import LobbyScreen from "./components/LobbyScreen";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [checkingProfile, setCheckingProfile] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };
    
    // Check initially
    checkOrientation();

    // Listen for resize/orientation changes
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  useEffect(() => {
    if (!auth) return;
    // Check for existing auth session
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setDbError(null);
      if (currentUser && db) {
        setCheckingProfile(true);
        try {
          const userRef = ref(db, 'users/' + currentUser.uid);
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            setUsername(snapshot.val().username);
          } else {
            setUsername(null);
          }
        } catch (error: any) {
          console.error("Error fetching user profile:", error);
          if (error.message.includes("Permission denied")) {
            setDbError("PERMISSION_DENIED");
          }
        } finally {
          setCheckingProfile(false);
        }
      } else {
        setUsername(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLoadingComplete = () => {
    setLoading(false);
  };

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    // The useEffect will handle fetching the profile
  };

  const handleUsernameSubmit = async (name: string) => {
    if (user && db) {
      try {
        await set(ref(db, 'users/' + user.uid), {
          username: name,
          email: user.email,
          createdAt: new Date().toISOString()
        });
        setUsername(name);
      } catch (error) {
        console.error("Error saving username:", error);
        alert("Failed to save username. Please try again.");
      }
    }
  };

  return (
    <div className="bg-black min-h-screen text-white font-sans overflow-hidden select-none touch-none">
      {isPortrait ? (
        <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-24 h-24 mb-8 relative animate-bounce">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-emerald-400">
              <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
              <path d="M12 18h.01"></path>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-white animate-spin-slow">
                 <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                 <path d="M3 3v5h5"></path>
               </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Please Rotate Your Device</h2>
          <p className="text-slate-400">This game is designed for landscape mode.</p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
        {loading && (
          <LoadingScreen key="loading" onComplete={handleLoadingComplete} />
        )}

        {!loading && !user && (
          <LoginScreen key="login" onLogin={handleLogin} />
        )}

        {!loading && user && checkingProfile && (
           <div key="checking" className="fixed inset-0 flex items-center justify-center bg-slate-900 text-emerald-400">
             Loading Profile...
           </div>
        )}

        {!loading && user && dbError === "PERMISSION_DENIED" && (
          <div className="fixed inset-0 flex items-center justify-center bg-slate-900 p-4 z-50">
            <div className="bg-slate-800 p-6 rounded-xl border border-red-500 max-w-lg w-full shadow-2xl">
              <h2 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
                <span>🚫</span> Database Permission Denied
              </h2>
              <p className="text-slate-300 mb-4">
                Your Firebase Realtime Database rules are blocking access. You need to update them to allow authenticated users to read and write.
              </p>
              
              <div className="bg-black/50 p-4 rounded-lg border border-slate-700 mb-4 font-mono text-xs text-emerald-400 overflow-x-auto">
                <p className="text-slate-500 mb-2">// Option 1: Secure Rules (Recommended)</p>
                <pre className="mb-4">{`{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}`}</pre>
                <p className="text-slate-500 mb-2">// Option 2: Test Mode (Easiest for now)</p>
                <pre>{`{
  "rules": {
    ".read": true,
    ".write": true
  }
}`}</pre>
              </div>

              <ol className="list-decimal pl-5 space-y-2 text-sm text-slate-400 mb-6">
                <li>Go to <a href="https://console.firebase.google.com/" target="_blank" className="text-emerald-400 hover:underline">Firebase Console</a></li>
                <li>Select project <strong>fyginujn</strong></li>
                <li>Go to <strong>Realtime Database</strong> &rarr; <strong>Rules</strong></li>
                <li>Delete everything there, paste one of the options above, and click <strong>Publish</strong></li>
              </ol>

              <div className="flex gap-3">
                <button 
                  onClick={() => window.location.reload()}
                  className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg transition-colors"
                >
                  I Updated Rules, Retry
                </button>
                <button 
                  onClick={() => auth?.signOut()}
                  className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}

        {!loading && user && !checkingProfile && !username && !dbError && (
          <UsernameScreen key="username" onSubmit={handleUsernameSubmit} />
        )}

        {!loading && user && !checkingProfile && username && !dbError && (
          <LobbyScreen key="lobby" user={user} username={username} />
        )}
      </AnimatePresence>
      )}
    </div>
  );
}

