"use client";

import { motion } from "framer-motion";

interface ComponentLoadingProps {
  message?: string;
  className?: string;
}

const ComponentLoading: React.FC<ComponentLoadingProps> = ({
  message = "Loading...",
  className = "",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm ${className}`}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center gap-2"
      >
        <motion.div
          className="w-8 h-8 border-4 border-primary-400 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        {message && (
          <motion.p className="text-sm text-primary-400">{message}</motion.p>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ComponentLoading;
