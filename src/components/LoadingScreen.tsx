import { motion } from "motion/react";

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black flex items-center justify-center z-50"
      onAnimationComplete={() => {
        setTimeout(onComplete, 3000); // Simulate loading time
      }}
    >
      <motion.h1
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, type: "spring" }}
        className="text-6xl md:text-9xl font-black text-white tracking-tighter"
        style={{ fontFamily: "'Impact', sans-serif" }} // Or a custom font if available
      >
        KKG CHEATS
      </motion.h1>
    </motion.div>
  );
}
