"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface ScanningProps {
  onComplete: () => void;
}

export default function Scanning({ onComplete }: ScanningProps) {
  const loadingRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    loadingRef.current?.play().catch(() => {});
    const t = setTimeout(() => onComplete(), 3000);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <>
    <audio ref={loadingRef} src="/sounds/loading.mp3" />
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center gap-5"
      style={{ background: "#050505" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Spinner dorado */}
      <motion.div
        style={{
          width: 38,
          height: 38,
          borderRadius: "50%",
          border: "2px solid rgba(212,175,55,0.12)",
          borderTopColor: "#D4AF37",
        }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />

      <div className="flex flex-col items-center gap-2">
        <p
          className="text-[9px] tracking-[0.5em] uppercase"
          style={{ fontFamily: "var(--font-montserrat)", color: "rgba(212,175,55,0.55)" }}
        >
          Iniciando escaneo profundo
        </p>
        {/* Puntos animados */}
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(212,175,55,0.4)" }}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.3, ease: "easeInOut" }}
            />
          ))}
        </div>
      </div>
    </motion.div>
    </>
  );
}
