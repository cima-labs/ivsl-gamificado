"use client";

import { useState, useEffect } from "react";
import { motion, type Variants } from "framer-motion";

const TOTAL_SECONDS = 5 * 60; // 5 minutos

export default function Selection() {
  const [seconds, setSeconds] = useState(TOTAL_SECONDS);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.2 } },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <motion.div
      className="absolute inset-0 velvet flex flex-col items-center justify-between py-12 px-5"
      style={{ background: "radial-gradient(ellipse at center, #0a0800 0%, #050505 65%)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      {/* Línea superior */}
      <motion.div
        className="w-full flex flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div
          className="h-px w-full"
          style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)" }}
        />
        <p
          className="text-[8px] tracking-[0.5em] uppercase"
          style={{ fontFamily: "var(--font-montserrat)", color: "rgba(212,175,55,0.4)" }}
        >
          La Selección
        </p>
      </motion.div>

      {/* Contenido central */}
      <motion.div
        className="flex flex-col items-center gap-8 w-full"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Titular */}
        <motion.h2
          variants={item}
          className="gold-text text-center leading-snug px-4"
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(1.3rem, 6.5vw, 1.7rem)",
            fontWeight: 600,
          }}
        >
          Tu acceso expira en
        </motion.h2>

        {/* Contador dorado */}
        <motion.div variants={item} className="flex flex-col items-center gap-1">
          <p
            className="gold-text tabular-nums leading-none"
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "clamp(3.5rem, 18vw, 5rem)",
              fontWeight: 700,
              letterSpacing: "0.05em",
            }}
          >
            {mm}:{ss}
          </p>
          <p
            className="text-[8px] tracking-[0.4em] uppercase"
            style={{ fontFamily: "var(--font-montserrat)", color: "rgba(212,175,55,0.35)" }}
          >
            minutos restantes
          </p>
        </motion.div>

        {/* Separador */}
        <motion.div
          variants={item}
          className="h-px w-3/4"
          style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent)" }}
        />

        {/* Panel de botones */}
        <motion.div variants={item} className="flex flex-col items-center gap-4 w-full">
          {/* Botón primario — La Élite */}
          <motion.button
            className="w-full py-4 text-[10px] tracking-[0.4em] uppercase font-semibold"
            style={{
              fontFamily: "var(--font-montserrat)",
              background: "linear-gradient(135deg, #BF953F, #D4AF37, #FCF6BA, #D4AF37, #AA771C)",
              color: "#050505",
              border: "none",
            }}
            whileHover={{
              boxShadow: "0 0 30px rgba(212,175,55,0.4), 0 0 60px rgba(212,175,55,0.15)",
              scale: 1.01,
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.3 }}
          >
            Ingresar al Círculo &nbsp;[Aceptar]
          </motion.button>

          {/* Botón secundario — Las Gradas */}
          <motion.button
            className="w-full py-3 text-[9px] tracking-[0.3em] uppercase"
            style={{
              fontFamily: "var(--font-montserrat)",
              background: "transparent",
              color: "rgba(255,255,255,0.2)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
            whileHover={{ color: "rgba(255,255,255,0.35)" }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.3 }}
          >
            Permanecer como espectador &nbsp;[Rechazar]
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Línea inferior */}
      <motion.div
        className="w-full flex flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <div
          className="h-px w-full"
          style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)" }}
        />
        <p
          className="text-[7px] tracking-[0.4em] uppercase"
          style={{ fontFamily: "var(--font-montserrat)", color: "rgba(212,175,55,0.2)" }}
        >
          Cima Labs · Acceso Exclusivo
        </p>
      </motion.div>
    </motion.div>
  );
}
