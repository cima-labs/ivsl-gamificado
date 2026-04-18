"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, PhoneOff } from "lucide-react";

// Constantes del anillo de progreso
const CALL_CIRCLE = 160;
const CALL_STROKE = 5;
const CALL_RADIUS = (CALL_CIRCLE - CALL_STROKE) / 2;
const CALL_CIRC = 2 * Math.PI * CALL_RADIUS;

// 3/4 del anillo en el primer 55% del audio, último 1/4 en el 45% restante
// f(0)=0, f(1)=1 garantizado — sincronía exacta con el audio
function easeProgress(p: number) {
  const split = 0.55;   // momento del audio donde el anillo llega al 75%
  const vSplit = 0.75;  // progreso visual en ese punto
  const blendW = 0.12;  // zona de transición suave

  const fast = p * (vSplit / split);
  const slow = vSplit + (p - split) * ((1 - vSplit) / (1 - split));
  const t = Math.min(1, Math.max(0, (p - split + blendW) / (2 * blendW)));
  const smooth = t * t * (3 - 2 * t); // smoothstep

  return Math.min(1, fast * (1 - smooth) + slow * smooth);
}

interface SpectacleProps {
  onComplete: () => void;
  onCallEnded?: () => void;
}

type CallState = "video" | "incoming" | "active" | "ended" | "loading";

export default function Spectacle({ onComplete, onCallEnded }: SpectacleProps) {
  const [callState, setCallState] = useState<CallState>("video");
  const [audioProgress, setAudioProgress] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const ringRef = useRef<HTMLAudioElement>(null);
  const endCallRef = useRef<HTMLAudioElement>(null);
  const loadingSfxRef = useRef<HTMLAudioElement>(null);
  const rafRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Rastrear progreso del audio con RAF cuando la llamada está activa
  useEffect(() => {
    if (callState !== "active") return;
    function tick() {
      const a = audioRef.current;
      if (a && a.duration) {
        setAudioProgress(a.currentTime / a.duration);
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [callState]);

  // Al terminar el audio → animación de llamada finalizada → siguiente etapa
  function handleAudioEnded() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setAudioProgress(1);
    setCallState("ended");
    onCallEnded?.();
    endCallRef.current?.play().catch(() => {});
    setTimeout(() => {
      setCallState("loading");
      loadingSfxRef.current?.play().catch(() => {});
    }, 2200);
    setTimeout(() => onComplete(), 5200);
  }

  function handleIncoming() {
    setCallState("incoming");
    ringRef.current?.play().catch(() => {});
  }

  function handleAnswer() {
    ringRef.current?.pause();
    if (ringRef.current) ringRef.current.currentTime = 0;
    setCallState("active");
    audioRef.current?.play().catch(() => {});
  }

  // Progreso visual con easing
  const visualProgress = easeProgress(audioProgress);
  const strokeOffset = CALL_CIRC * (1 - visualProgress);

  return (
    <motion.div
      className="absolute inset-0 velvet flex flex-col items-center justify-center"
      style={{ background: "#050505" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      {/* Audios */}
      <audio ref={ringRef} src="/sounds/llamada-entrante.mp3" loop onCanPlay={(e) => { (e.target as HTMLAudioElement).volume = 1; }} />
      <audio
        ref={audioRef}
        src="/sounds/audio-llamada-final.mp3"
        onEnded={handleAudioEnded}
      />
      <audio ref={endCallRef} src="/sounds/end call.mp3" />
      <audio ref={loadingSfxRef} src="/sounds/loading.mp3" />

      <AnimatePresence mode="wait">

        {/* FASE A — Video del personaje */}
        {callState === "video" && (
          <motion.div
            key="video"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <video
              src="/video1-ivsl-final.mp4"
              autoPlay
              playsInline
              className="w-full h-full object-cover"
              onEnded={handleIncoming}
            />
            {/* Parpadeo negro */}
            <motion.div
              className="absolute inset-0"
              style={{ background: "#000", pointerEvents: "none" }}
              animate={{ opacity: [0, 0, 0, 0, 0.7, 0.1, 0, 0, 0, 0, 0, 0.5, 0, 0, 0, 0, 0, 0.8, 0.2, 0] }}
              transition={{ repeat: Infinity, duration: 9, ease: "easeInOut" }}
            />
          </motion.div>
        )}

        {/* FASE B — Llamada entrante iOS 26.4 */}
        {callState === "incoming" && (
          <motion.div
            key="incoming"
            className="absolute inset-0 flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, x: [0, -3, 3, -2, 2, -1, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 0.5 },
              x: { repeat: Infinity, duration: 0.45, ease: "easeInOut", repeatDelay: 1.1 },
            }}
          >
            {/* Fondo: foto difuminada */}
            <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/foto-perfil-personaje.jpg"
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(28px) brightness(0.45) saturate(1.2)", transform: "scale(1.1)" }}
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.7) 100%)" }} />
            </div>

            {/* Status bar */}
            <div style={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 22px 0" }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: "white", fontFamily: "var(--font-montserrat)" }}>
                {String(new Date().getHours()).padStart(2,"0")}:{String(new Date().getMinutes()).padStart(2,"0")}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 2 }}>
                  {[3,5,7,9].map((h,i) => <div key={i} style={{ width: 3, height: h, background: "white", borderRadius: 1, opacity: i<3?1:0.4 }} />)}
                </div>
                <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
                  <path d="M7.5 8.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" fill="white" />
                  <path d="M4.5 6.2C5.4 5.3 6.4 4.8 7.5 4.8s2.1.5 3 1.4" stroke="white" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                  <path d="M2 3.8C3.5 2.3 5.4 1.5 7.5 1.5s4 .8 5.5 2.3" stroke="white" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                </svg>
                <div style={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <div style={{ width: 22, height: 11, border: "1.5px solid rgba(255,255,255,0.7)", borderRadius: 3, padding: "1.5px", display: "flex", alignItems: "center" }}>
                    <div style={{ width: "78%", height: "100%", background: "white", borderRadius: 1.5 }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Contenido central */}
            <div style={{ position: "relative", zIndex: 2, flex: 1, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "10%" }}>
              {/* Foto circular grande */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6, ease: [0.23,1,0.32,1] }}
                style={{ position: "relative" }}
              >
                {/* Anillos pulsantes */}
                {[1.35, 1.65].map((scale, i) => (
                  <motion.div key={i} style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.2)" }}
                    animate={{ scale: [1, scale, 1], opacity: [0.4, 0, 0.4] }}
                    transition={{ repeat: Infinity, duration: 2.2, delay: i * 0.6, ease: "easeInOut" }}
                  />
                ))}
                <div style={{ width: 118, height: 118, borderRadius: "50%", overflow: "hidden", border: "3px solid rgba(255,255,255,0.5)", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/foto-perfil-personaje.jpg" alt="Aurelius" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              </motion.div>

              {/* Nombre + subtítulo */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.6 }}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, marginTop: 20 }}
              >
                <h2 style={{ fontSize: 34, fontWeight: 700, color: "white", fontFamily: "var(--font-montserrat)", letterSpacing: "-0.02em", textShadow: "0 2px 12px rgba(0,0,0,0.4)" }}>
                  Aurelius
                </h2>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", fontFamily: "var(--font-montserrat)" }}>
                  Llamada de FaceTime
                </p>
                <motion.p
                  style={{ fontSize: 12, color: "#4CD964", fontFamily: "var(--font-montserrat)", marginTop: 2 }}
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1.4 }}
                >
                  ● @cima.labs
                </motion.p>
              </motion.div>
            </div>

            {/* Botón contestar */}
            <motion.div
              style={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "center", paddingBottom: 52 }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6, ease: [0.23,1,0.32,1] }}
            >
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <motion.button
                  onClick={handleAnswer}
                  style={{
                    width: 70, height: 70, borderRadius: "50%",
                    background: "rgba(52,199,89,0.88)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    border: "1.5px solid rgba(255,255,255,0.15)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", boxShadow: "0 4px 20px rgba(52,199,89,0.4)",
                  }}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                  whileTap={{ scale: 0.92 }}
                >
                  <Phone size={28} color="white" />
                </motion.button>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-montserrat)" }}>Contestar</span>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* FASE C — Llamada activa (estilo analista) */}
        {callState === "active" && (
          <motion.div
            key="active"
            className="absolute inset-0"
            style={{
              background: "linear-gradient(180deg, #0B1D18 0%, #071410 40%, #050E0C 100%)",
              display: "flex", flexDirection: "column", alignItems: "center",
              fontFamily: "var(--font-montserrat)",
              overflow: "hidden",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            transition={{ duration: 0.5 }}
          >
            {/* Glow verde central */}
            <div style={{
              position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)",
              width: 260, height: 260, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(0,168,132,0.18) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />

            {/* Nombre + estado */}
            <div style={{ marginTop: 64, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, zIndex: 1 }}>
              <span style={{ fontSize: 24, fontWeight: 700, color: "#E9EDEF", letterSpacing: 0.3 }}>Aurelius</span>
              <span style={{ fontSize: 13, color: "#8696A0" }}>En llamada</span>
            </div>

            {/* Anillo de progreso + foto + ondas de voz */}
            <div style={{ position: "relative", marginTop: 40, zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>

                {/* Ondas de voz alrededor del círculo */}
                {[0, 0.5, 1.0, 1.5].map((delay, i) => (
                  <motion.div
                    key={i}
                    style={{
                      position: "absolute",
                      inset: -(16 + i * 14),
                      borderRadius: "50%",
                      border: `1.5px solid rgba(0,168,132,${0.5 - i * 0.1})`,
                      pointerEvents: "none",
                    }}
                    animate={{ opacity: [0, 0.7, 0], scale: [0.9, 1.1, 1.35] }}
                    transition={{ repeat: Infinity, duration: 1.6, delay, ease: "easeOut" }}
                  />
                ))}

                {/* SVG anillo de progreso */}
                <svg
                  width={CALL_CIRCLE}
                  height={CALL_CIRCLE}
                  style={{ position: "absolute", transform: "rotate(-90deg)" }}
                >
                  {/* Pista base */}
                  <circle
                    cx={CALL_CIRCLE / 2}
                    cy={CALL_CIRCLE / 2}
                    r={CALL_RADIUS}
                    fill="none"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth={CALL_STROKE}
                  />
                  {/* Progreso */}
                  <circle
                    cx={CALL_CIRCLE / 2}
                    cy={CALL_CIRCLE / 2}
                    r={CALL_RADIUS}
                    fill="none"
                    stroke="rgba(0,168,132,0.9)"
                    strokeWidth={CALL_STROKE}
                    strokeLinecap="round"
                    strokeDasharray={CALL_CIRC}
                    strokeDashoffset={strokeOffset}
                    style={{ transition: "stroke-dashoffset 0.3s linear" }}
                  />
                </svg>

                {/* Foto de Aurelius dentro del círculo */}
                <div style={{
                  width: CALL_CIRCLE - CALL_STROKE * 2 - 8,
                  height: CALL_CIRCLE - CALL_STROKE * 2 - 8,
                  borderRadius: "50%",
                  overflow: "hidden",
                  background: "#1a1a1a",
                }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/foto-perfil-personaje.jpg"
                    alt="Aurelius"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              </div>
            </div>

            {/* Cifrado */}
            <div style={{ marginTop: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, zIndex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="rgba(134,150,160,0.7)">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z"/>
                </svg>
                <span style={{ fontSize: 11, color: "rgba(134,150,160,0.7)" }}>Cifrado de extremo a extremo</span>
              </div>
              <span style={{ fontSize: 10, color: "rgba(134,150,160,0.4)", letterSpacing: 0.5 }}>@cima.labs</span>
            </div>

            {/* Espaciador */}
            <div style={{ flex: 1 }} />

            {/* Botones de acción */}
            <div style={{
              width: "100%", paddingBottom: 52, paddingLeft: 32, paddingRight: 32,
              display: "flex", justifyContent: "space-between", alignItems: "center",
              zIndex: 1,
            }}>
              {/* Silenciar — deshabilitado mientras suena el audio */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <motion.button
                  onClick={() => {
                    if (audioProgress > 0 && audioProgress < 1) return;
                    const next = !muted;
                    setMuted(next);
                    if (audioRef.current) audioRef.current.muted = next;
                  }}
                  whileTap={!(audioProgress > 0 && audioProgress < 1) ? { scale: 0.9 } : {}}
                  style={{
                    width: 62, height: 62, borderRadius: "50%",
                    background: muted ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.12)",
                    border: "none",
                    cursor: (audioProgress > 0 && audioProgress < 1) ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    opacity: (audioProgress > 0 && audioProgress < 1) ? 0.35 : 1,
                    transition: "opacity 0.3s ease",
                  }}
                >
                  <svg width="26" height="26" viewBox="0 0 24 24" fill={muted ? "#000" : "white"}>
                    {muted
                      ? <path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z"/>
                      : <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                    }
                  </svg>
                </motion.button>
                <span style={{ fontSize: 11.5, color: (audioProgress > 0 && audioProgress < 1) ? "rgba(134,150,160,0.4)" : "#8696A0", transition: "color 0.3s" }}>
                  {muted ? "Activar" : "Silenciar"}
                </span>
              </div>

              {/* Colgar — deshabilitado mientras suena el audio */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <motion.button
                  onClick={(audioProgress > 0 && audioProgress < 1) ? undefined : () => {
                    if (rafRef.current) cancelAnimationFrame(rafRef.current);
                    audioRef.current?.pause();
                    setCallState("ended");
                    endCallRef.current?.play().catch(() => {});
                    setTimeout(() => { setCallState("loading"); loadingSfxRef.current?.play().catch(() => {}); }, 2200);
                    setTimeout(() => onComplete(), 5200);
                  }}
                  whileTap={!(audioProgress > 0 && audioProgress < 1) ? { scale: 0.88 } : {}}
                  style={{
                    width: 72, height: 72, borderRadius: "50%",
                    background: "#FF3B30", border: "none",
                    cursor: (audioProgress > 0 && audioProgress < 1) ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: (audioProgress > 0 && audioProgress < 1) ? "none" : "0 4px 20px rgba(255,59,48,0.5)",
                    opacity: (audioProgress > 0 && audioProgress < 1) ? 0.35 : 1,
                    transition: "opacity 0.3s ease, box-shadow 0.3s ease",
                  }}
                >
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="white" style={{ transform: "rotate(135deg)" }}>
                    <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
                  </svg>
                </motion.button>
                <span style={{ fontSize: 11.5, color: (audioProgress > 0 && audioProgress < 1) ? "rgba(134,150,160,0.4)" : "#8696A0", transition: "color 0.3s" }}>Colgar</span>
              </div>

              {/* Altavoz — siempre activo */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <motion.button
                  onClick={() => {
                    const next = !speaker;
                    setSpeaker(next);
                    const a = audioRef.current;
                    if (!a) return;
                    if (next) {
                      if (!audioCtxRef.current) {
                        const ctx = new AudioContext();
                        const src = ctx.createMediaElementSource(a);
                        const gn = ctx.createGain();
                        gn.gain.value = 2.8;
                        src.connect(gn);
                        gn.connect(ctx.destination);
                        audioCtxRef.current = ctx;
                        gainNodeRef.current = gn;
                      } else {
                        gainNodeRef.current!.gain.value = 2.8;
                      }
                    } else {
                      if (gainNodeRef.current) gainNodeRef.current.gain.value = 1.0;
                    }
                  }}
                  whileTap={{ scale: 0.9 }}
                  style={{
                    width: 62, height: 62, borderRadius: "50%",
                    background: speaker ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.12)",
                    border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <svg width="26" height="26" viewBox="0 0 24 24" fill={speaker ? "#000" : "white"}>
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77 0-4.28-2.99-7.86-7-8.77z"/>
                  </svg>
                </motion.button>
                <span style={{ fontSize: 11.5, color: "#8696A0" }}>Altavoz</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* FASE D — Llamada finalizada */}
        {callState === "ended" && (
          <motion.div
            key="ended"
            className="absolute inset-0 flex flex-col items-center justify-center gap-6"
            style={{ background: "#050505" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              style={{
                width: 72, height: 72, borderRadius: "50%",
                background: "rgba(231,76,60,0.15)",
                border: "1px solid rgba(231,76,60,0.4)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <PhoneOff size={28} color="rgba(231,76,60,0.8)" />
            </motion.div>
            <motion.p
              className="text-[9px] tracking-[0.5em] uppercase"
              style={{ fontFamily: "var(--font-montserrat)", color: "rgba(255,255,255,0.3)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Llamada finalizada
            </motion.p>
          </motion.div>
        )}

        {/* FASE E — Loading protocolo */}
        {callState === "loading" && (
          <motion.div
            key="loading"
            className="absolute inset-0 flex flex-col items-center justify-center gap-5"
            style={{ background: "#050505" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              style={{
                width: 36, height: 36, borderRadius: "50%",
                border: "2px solid rgba(212,175,55,0.15)",
                borderTopColor: "#D4AF37",
              }}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            />
            <p
              className="text-[9px] tracking-[0.5em] uppercase"
              style={{ fontFamily: "var(--font-montserrat)", color: "rgba(212,175,55,0.5)" }}
            >
              Iniciando protocolo
            </p>
          </motion.div>
        )}

      </AnimatePresence>
    </motion.div>
  );
}
