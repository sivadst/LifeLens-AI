"use client";
import { motion } from "framer-motion";
import { Loader2, Brain } from "lucide-react";

interface LoadingSpinnerProps {
  text?: string;
  size?: "sm" | "md" | "lg";
}

export default function LoadingSpinner({
  text = "AI is analyzing...",
  size = "md",
}: LoadingSpinnerProps) {
  const sizes = {
    sm: { container: "p-4", icon: "w-6 h-6", text: "text-sm" },
    md: { container: "p-8", icon: "w-10 h-10", text: "text-base" },
    lg: { container: "p-12", icon: "w-16 h-16", text: "text-lg" },
  };

  const s = sizes[size];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex flex-col items-center justify-center gap-4 ${s.container}`}
    >
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className={`${s.icon} text-[var(--color-accent-cyan)]`}
        >
          <Loader2 className="w-full h-full" />
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Brain className="w-5 h-5 text-[var(--color-accent-purple)]" />
        </motion.div>
      </div>
      <div className="flex flex-col items-center gap-1">
        <p className={`${s.text} font-medium text-[var(--color-text-primary)]`}>
          {text}
        </p>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-cyan)]"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
