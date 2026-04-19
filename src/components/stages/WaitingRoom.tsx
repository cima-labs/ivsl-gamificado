"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Volume2 } from "lucide-react";

interface WaitingRoomProps {
  onEnter: () => void;
}

export default function WaitingRoom({ onEnter }: WaitingRoomProps) {
  const [loading, setLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const tapRef = useRef<HTMLAudioElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    function startAudio() {
      if (startedRef.current) return;
      startedRef.current = true;
      audioRef.current?.play().catch(() => {});
    }
    window.addEventListener("click", startAudio, { once: true });
    window.addEventListener("touchstart", startAudio, { once: true });
    return () => {
      window.removeEventListener("click", startAudio);
      window.removeEventListener("touchstart", startAudio);
    };
  }, []);

  function handleClick() {
    tapRef.current?.play().catch(() => {});
    audioRef.current?.pause();
    setLoading(true);
  }

  return (
    <motion.div
      className="absolute inset-0 velvet flex flex-col items-center justify-center gap-10"
      style={{ background: "radial-gradient(ellipse at center, #0d0900 0%, #050505 70%)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
    >
      {/* Pista de tensión */}
      <audio ref={audioRef} src="/sounds/pista tension.mp3" autoPlay loop />
      <audio ref={tapRef} src="/sounds/tap boton.mp3" />

      {/* Resplandor dorado central */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: "60%",
            height: "40%",
            background: "radial-gradient(ellipse, rgba(212,175,55,0.07) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 1, ease: "easeInOut" }}
        className="flex flex-col items-center gap-3"
      >
        <Image
          src="/logo.png"
          alt="Cima Labs"
          width={64}
          height={64}
          priority
          style={{
            filter: "sepia(1) saturate(3) hue-rotate(5deg) brightness(0.75)",
            opacity: 0.9,
          }}
        />
        <div
          className="h-px w-16"
          style={{ background: "linear-gradient(90deg, transparent, #D4AF37, transparent)" }}
        />
        <p
          className="text-[9px] tracking-[0.5em] uppercase"
          style={{
            fontFamily: "var(--font-montserrat)",
            color: "#D4AF37",
            opacity: 0.6,
          }}
        >
          Cima Labs
        </p>
      </motion.div>

      {/* Texto invitación */}
      <motion.div
        className="flex flex-col items-center gap-4 px-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1, ease: "easeInOut" }}
      >
        <motion.h1
          className="leading-snug"
          animate={{ backgroundPosition: ["-200% center", "200% center"] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 1.5, ease: "linear" }}
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(1.4rem, 7vw, 1.8rem)",
            fontWeight: 600,
            background: "linear-gradient(90deg, #AA771C 0%, #BF953F 15%, #AA771C 30%, #D4AF37 40%, #FCF6BA 48%, #FFFEF0 50%, #FCF6BA 52%, #D4AF37 60%, #AA771C 70%, #BF953F 85%, #AA771C 100%)",
            backgroundSize: "300% 100%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Has sido seleccionado.
        </motion.h1>
        <p
          className="text-[11px] leading-relaxed tracking-widest uppercase"
          style={{
            fontFamily: "var(--font-montserrat)",
            color: "rgba(255,255,255,0.35)",
          }}
        >
          Esta invitación no es para todos.<br />
          Solo para quienes están listos.
        </p>
      </motion.div>

      {/* Indicador de volumen */}
      <motion.div
        className="flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <motion.div
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
        >
          <Volume2 size={14} color="#D4AF37" />
        </motion.div>
        <p
          className="text-[9px] tracking-[0.35em] uppercase"
          style={{ fontFamily: "var(--font-montserrat)", color: "rgba(212,175,55,0.6)" }}
        >
          Sube el volumen
        </p>
      </motion.div>

      {/* Botón / Barra de carga */}
      <motion.div
        className="flex flex-col items-center gap-3"
        style={{ width: "72%", maxWidth: 280 }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.8, ease: "easeInOut" }}
      >
        {!loading ? (
          <motion.button
            onClick={handleClick}
            className="relative text-[10px] tracking-[0.4em] uppercase w-full"
            style={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 700,
              color: "#0a0800",
              background: "linear-gradient(135deg, #BF953F 0%, #D4AF37 35%, #FCF6BA 60%, #D4AF37 80%, #AA771C 100%)",
              border: "none",
              borderRadius: "50px",
              padding: "19px 0",
              letterSpacing: "0.4em",
            }}
            animate={{
              boxShadow: [
                "0 4px 20px rgba(212,175,55,0.25), 0 0 0px rgba(212,175,55,0)",
                "0 4px 40px rgba(212,175,55,0.55), 0 0 60px rgba(212,175,55,0.18)",
                "0 4px 20px rgba(212,175,55,0.25), 0 0 0px rgba(212,175,55,0)",
              ],
            }}
            transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
            whileHover={{ scale: 1.025, boxShadow: "0 6px 50px rgba(212,175,55,0.65)" }}
            whileTap={{ scale: 0.97 }}
          >
            Aceptar Invitación
          </motion.button>
        ) : (
          <motion.div
            className="flex flex-col items-center gap-3 w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <p
              className="text-[8px] tracking-[0.45em] uppercase"
              style={{ fontFamily: "var(--font-montserrat)", color: "rgba(212,175,55,0.5)" }}
            >
              Cargando experiencia...
            </p>
            {/* Track */}
            <div
              className="w-full h-px relative overflow-hidden"
              style={{ background: "rgba(212,175,55,0.15)" }}
            >
              {/* Barra animada */}
              <motion.div
                className="absolute inset-y-0 left-0"
                style={{ background: "linear-gradient(90deg, #BF953F, #D4AF37, #FCF6BA)" }}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.2, ease: "easeInOut" }}
                onAnimationComplete={onEnter}
              />
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Línea decorativa inferior */}
      <motion.div
        className="absolute flex flex-col items-center gap-2"
        style={{ bottom: "calc(env(safe-area-inset-bottom) + 40px)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
      >
        <div
          className="h-px w-24"
          style={{ background: "linear-gradient(90deg, transparent, #D4AF37, transparent)" }}
        />
        <p
          className="text-[7px] tracking-[0.4em] uppercase"
          style={{ fontFamily: "var(--font-montserrat)", color: "rgba(212,175,55,0.25)" }}
        >
          Confidencial
        </p>
      </motion.div>
    </motion.div>
  );
}
