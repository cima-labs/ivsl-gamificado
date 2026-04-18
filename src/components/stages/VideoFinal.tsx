"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useAnimate } from "framer-motion";
import { Volume2 } from "lucide-react";

interface VideoFinalProps {
  onComplete?: () => void;
}

export default function VideoFinal({ onComplete }: VideoFinalProps) {
  const [unmuted, setUnmuted] = useState(false);
  const [dramatic, setDramatic] = useState(false);
  const [noSignal, setNoSignal] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const tapRef = useRef<HTMLAudioElement>(null);
  const noSignalAudioRef = useRef<HTMLAudioElement>(null);
  const dramaticFiredRef = useRef(false);
  const noSignalFiredRef = useRef(false);
  const [scope, animate] = useAnimate();

  function handleUnmute() {
    tapRef.current?.play().catch(() => {});
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.muted = false;
      videoRef.current.volume = 1;
      videoRef.current.play().catch(() => {});
    }
    setUnmuted(true);
  }

  function handleTimeUpdate() {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    const remaining = video.duration - video.currentTime;

    // Shake + flash rojo en los últimos 5s
    if (remaining <= 5 && remaining > 0 && !dramaticFiredRef.current) {
      dramaticFiredRef.current = true;
      setDramatic(true);
      animate(scope.current, {
        x: [0, -6, 8, -5, 6, -3, 4, 0],
        y: [0, 4, -6, 5, -3, 6, -2, 0],
        scale: [1, 1.015, 1.025, 1.02, 1.03, 1.015, 1.025, 1],
      }, {
        duration: 1.4,
        ease: "easeInOut",
        times: [0, 0.1, 0.25, 0.4, 0.55, 0.7, 0.85, 1],
        repeat: 2,
        repeatType: "mirror",
      });
    }

    // No signal en el segundo 56 (golpe del televisor)
    if (video.currentTime >= 56 && !noSignalFiredRef.current) {
      noSignalFiredRef.current = true;
      setNoSignal(true);
      noSignalAudioRef.current?.play().catch(() => {});
    }
  }

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      style={{ background: "#000000" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <audio ref={tapRef} src="/sounds/tap boton.mp3" />
      <audio ref={noSignalAudioRef} src="/sounds/no signal.mp3" />

      {/* Wrapper con shake aplicado */}
      <div ref={scope} style={{ position: "absolute", inset: 0 }}>
        {/* Video fullscreen con filtro B&N en los últimos 2s */}
        <video
          ref={videoRef}
          src="/video payaso v final.mp4"
          autoPlay
          muted
          playsInline
          onTimeUpdate={handleTimeUpdate}
          onEnded={onComplete}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "none",
          }}
        />
      </div>

      {/* Flash rojo dramático en los últimos 5s */}
      <AnimatePresence>
        {dramatic && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "rgba(180,0,0,0.18)", zIndex: 2 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.6, 0, 0.4, 0, 0.3, 0] }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
          />
        )}
      </AnimatePresence>

      {/* NO SIGNAL — barras de colores TV clásicas */}
      <AnimatePresence>
        {noSignal && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 3 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.08 }}
          >
            {/* Barras de colores SMPTE */}
            <div style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "row",
            }}>
              {[
                "#FFFFFF", "#FFFF00", "#00FFFF", "#00FF00",
                "#FF00FF", "#FF0000", "#0000FF", "#000000",
              ].map((color, i) => (
                <div key={i} style={{ flex: 1, background: color }} />
              ))}
            </div>

            {/* Scanlines encima de las barras */}
            <div style={{
              position: "absolute",
              inset: 0,
              background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.22) 0px, rgba(0,0,0,0.22) 1px, transparent 1px, transparent 3px)",
            }} />

            {/* Barra glitch horizontal */}
            <motion.div
              style={{
                position: "absolute",
                left: 0, right: 0,
                height: 8,
                background: "rgba(255,255,255,0.35)",
                top: "40%",
              }}
              animate={{ top: ["40%", "65%", "20%", "80%", "35%", "55%"] }}
              transition={{ repeat: Infinity, duration: 0.15, ease: "linear" }}
            />

            {/* Texto NO SIGNAL parpadeante */}
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center"
              animate={{ opacity: [1, 0.2, 1, 0.5, 1] }}
              transition={{ repeat: Infinity, duration: 0.3, ease: "linear" }}
            >
              <p style={{
                fontFamily: "monospace",
                fontSize: "13px",
                fontWeight: 700,
                letterSpacing: "0.5em",
                color: "#000",
                textTransform: "uppercase",
                background: "rgba(255,255,255,0.75)",
                padding: "4px 14px",
              }}>
                NO SIGNAL
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay oscuro para generar intriga */}
      <AnimatePresence>
        {!unmuted && (
          <motion.div
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.55)", zIndex: 5 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>

      {/* Recuadro central tap-to-unmute */}
      <AnimatePresence>
        {!unmuted && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center px-6"
            style={{ zIndex: 6 }}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: 0.7, duration: 0.6, ease: "easeOut" }}
          >
            <motion.button
              onClick={handleUnmute}
              className="flex flex-col items-center gap-5 px-10 py-8 w-full max-w-xs"
              style={{
                background: "rgba(0,0,0,0.82)",
                border: "1px solid rgba(212,175,55,0.55)",
                borderRadius: "20px",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                boxShadow: "0 0 40px rgba(212,175,55,0.12), inset 0 0 20px rgba(212,175,55,0.04)",
              }}
              whileHover={{
                boxShadow: "0 0 60px rgba(212,175,55,0.22), inset 0 0 30px rgba(212,175,55,0.07)",
              }}
              whileTap={{ scale: 0.97 }}
            >
              <motion.div
                animate={{ opacity: [1, 0.15, 1] }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
              >
                <Volume2 size={34} color="#D4AF37" />
              </motion.div>
              <div className="flex flex-col items-center gap-2">
                <p
                  className="text-center uppercase font-semibold"
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "13px",
                    letterSpacing: "0.22em",
                    color: "#D4AF37",
                  }}
                >
                  Tu video ha iniciado
                </p>
                <div
                  className="h-px w-12"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.4), transparent)" }}
                />
                <p
                  className="text-center uppercase"
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "10px",
                    letterSpacing: "0.3em",
                    color: "rgba(255,255,255,0.45)",
                  }}
                >
                  Toca para escuchar
                </p>
              </div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
