"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface DiagnosisProps {
  onComplete: () => void;
}

const LINES = [
  "EVALUANDO NIVEL DE CONCIENCIA...",
  "DIAGNÓSTICO: JUGADOR APTO PARA EL NUEVO SISTEMA.",
  "PREPARANDO INVITACIÓN AL 1%...",
  "ACCESO AUTORIZADO POR: AURELIUS.",
];

export default function Diagnosis({ onComplete }: DiagnosisProps) {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [displayedText, setDisplayedText] = useState("");
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [done, setDone] = useState(false);
  const analisisRef = useRef<HTMLAudioElement>(null);

  // Arranca el audio al montar
  useEffect(() => {
    analisisRef.current?.play().catch(() => {});
  }, []);

  // Typewriter por líneas
  useEffect(() => {
    if (lineIndex >= LINES.length) {
      analisisRef.current?.pause();
      if (analisisRef.current) analisisRef.current.currentTime = 0;
      setTimeout(() => {
        setDone(true);
        setTimeout(onComplete, 1000);
      }, 400);
      return;
    }
    const currentLine = LINES[lineIndex];
    if (charIndex < currentLine.length) {
      const t = setTimeout(() => {
        setDisplayedText(currentLine.slice(0, charIndex + 1));
        setCharIndex((c) => c + 1);
      }, 18);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setVisibleLines((prev) => [...prev, currentLine]);
        setDisplayedText("");
        setCharIndex(0);
        setLineIndex((l) => l + 1);
      }, 280);
      return () => clearTimeout(t);
    }
  }, [lineIndex, charIndex]);

  return (
    <>
    <audio ref={analisisRef} src="/sounds/analisis de datos.mp3" loop />
    <motion.div
      className="absolute inset-0 velvet flex flex-col items-center justify-between px-6"
      style={{ background: "#050505", paddingTop: "14%", paddingBottom: "12%" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <motion.div
        className="flex flex-col items-center gap-2 text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <p
          className="text-[8px] tracking-[0.5em] uppercase"
          style={{ fontFamily: "var(--font-montserrat)", color: "rgba(212,175,55,0.35)" }}
        >
          DIAGNÓSTICO TERMINADO
        </p>
        <div
          className="h-px w-full"
          style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent)" }}
        />
      </motion.div>

      {/* Consola */}
      <motion.div
        className="w-full flex flex-col gap-3"
        style={{
          border: "1px solid rgba(212,175,55,0.18)",
          background: "rgba(0,0,0,0.6)",
          borderRadius: "16px",
          maxWidth: "calc(100% - 16px)",
          alignSelf: "center",
          padding: "20px 24px 20px 20px",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.05, duration: 0.3 }}
      >
        {/* Líneas ya escritas */}
        {visibleLines.map((line, i) => (
          <motion.p
            key={i}
            className="text-[10px] tracking-[0.15em] leading-relaxed"
            style={{ fontFamily: "var(--font-montserrat)", color: "rgba(212,175,55,0.7)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span style={{ color: "rgba(212,175,55,0.4)", marginRight: 8 }}>›</span>
            {line}
          </motion.p>
        ))}

        {/* Línea en curso */}
        {lineIndex < LINES.length && (
          <p
            className="text-[10px] tracking-[0.15em] leading-relaxed"
            style={{ fontFamily: "var(--font-montserrat)", color: "#D4AF37" }}
          >
            <span style={{ color: "rgba(212,175,55,0.4)", marginRight: 8 }}>›</span>
            {displayedText}
            <span className="animate-pulse">▋</span>
          </p>
        )}
      </motion.div>

      {/* Logo Cima Labs */}
      <motion.div
        className="flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: done ? 1 : 0.3 }}
        transition={{ duration: 1 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.png"
          alt="Cima Labs"
          style={{ width: 48, height: 48, objectFit: "contain", opacity: 0.55, filter: "sepia(1) saturate(3) hue-rotate(5deg) brightness(0.75)" }}
        />
        <p
          className="text-[9px] tracking-[0.4em]"
          style={{ fontFamily: "var(--font-montserrat)", color: "#D4AF37", letterSpacing: "0.35em" }}
        >
          @cima.labs
        </p>
      </motion.div>
    </motion.div>
    </>
  );
}
