"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface EnteringProps {
  onComplete: () => void;
}

export default function Entering({ onComplete }: EnteringProps) {
  const loadingRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    loadingRef.current?.play().catch(() => {});
    const t = setTimeout(onComplete, 3000);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center gap-6"
      style={{ background: "#000000" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <audio ref={loadingRef} src="/sounds/loading.mp3" />

      {/* Spinner + texto */}
      <motion.div className="flex flex-col items-center gap-5">
        {/* Spinner dorado */}
        <motion.div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "2px solid rgba(212,175,55,0.15)",
            borderTop: "2px solid #D4AF37",
          }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />

        <p
          className="text-[11px] tracking-[0.5em] uppercase"
          style={{
            fontFamily: "var(--font-montserrat)",
            color: "rgba(212,175,55,0.7)",
          }}
        >
          Ingresando
        </p>

        {/* Puntos pulsantes */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              style={{
                display: "block",
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: "#D4AF37",
                opacity: 0.4,
              }}
              animate={{ opacity: [0.2, 0.8, 0.2] }}
              transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.3, ease: "easeInOut" }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
