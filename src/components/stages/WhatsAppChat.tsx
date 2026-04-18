"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PhoneOff } from "lucide-react";

const CIRCLE_SIZE = 180;
const STROKE = 5;
const RADIUS = (CIRCLE_SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const VIDEOS = [
  "/video 1 analista.mp4",
  "/2 analista.mp4",
  "/3 chat analista.mp4",
  "/4 chat analista.mp4",
];

// ── Video Note ──────────────────────────────────────────────────────────────

interface VideoNoteProps {
  src: string;
  timeStr: string;
  onEnded: () => void;
  seen: boolean;
  onPlayStart: () => void;
  onPlayStop: () => void;
  gain?: number;
}

function VideoNote({ src, timeStr, onEnded, seen, onPlayStart, onPlayStop, gain = 1 }: VideoNoteProps) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [finished, setFinished] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const tapRef = useRef<HTMLAudioElement>(null);
  const msgSfxRef = useRef<HTMLAudioElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  useEffect(() => {
    msgSfxRef.current?.play().catch(() => {});
  }, []);

  function handlePlay() {
    if (playing || finished) return;
    tapRef.current?.play().catch(() => {});
    setPlaying(true);
    onPlayStart();
    setTimeout(() => {
      const v = videoRef.current;
      if (!v) return;
      // Aplicar gain si es mayor que 1
      if (gain > 1 && !audioCtxRef.current) {
        const ctx = new AudioContext();
        audioCtxRef.current = ctx;
        const src = ctx.createMediaElementSource(v);
        sourceRef.current = src;
        const gn = ctx.createGain();
        gn.gain.value = gain;
        gainNodeRef.current = gn;
        src.connect(gn);
        gn.connect(ctx.destination);
      }
      v.muted = false;
      v.currentTime = 0;
      v.play().catch(() => {});
    }, 100);
  }

  function handleTimeUpdate() {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    setProgress(v.currentTime / v.duration);
  }

  function handleEnded() {
    setFinished(true);
    setProgress(1);
    onPlayStop();
    setTimeout(() => onEnded(), 800);
  }

  return (
    <motion.div
      style={{ display: "flex", alignItems: "flex-end", gap: 6, marginBottom: 12 }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <audio ref={tapRef} src="/sounds/tap boton.mp3" />
      <audio ref={msgSfxRef} src="/sounds/tap mensaje.mp3" />
      <div style={{ width: 28, height: 28, borderRadius: "50%", overflow: "hidden", flexShrink: 0, marginBottom: 2 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/la analista perfil.jpg" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 4 }}>
        <motion.div
          animate={{ scale: playing && !finished ? 1.08 : 1 }}
          transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
          style={{ transformOrigin: "center" }}
        >
        <div
          style={{ position: "relative", width: CIRCLE_SIZE, height: CIRCLE_SIZE, cursor: finished ? "default" : "pointer" }}
          onClick={handlePlay}
        >
          <svg width={CIRCLE_SIZE} height={CIRCLE_SIZE} style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}>
            <circle cx={CIRCLE_SIZE/2} cy={CIRCLE_SIZE/2} r={RADIUS} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={STROKE} />
            <circle cx={CIRCLE_SIZE/2} cy={CIRCLE_SIZE/2} r={RADIUS} fill="none" stroke="#25D366" strokeWidth={STROKE}
              strokeLinecap="round" strokeDasharray={CIRCUMFERENCE} strokeDashoffset={dashOffset}
              style={{ transition: "stroke-dashoffset 0.25s linear" }} />
          </svg>
          <div style={{ position: "absolute", inset: STROKE + 2, borderRadius: "50%", overflow: "hidden", background: "#111" }}>
            <video ref={videoRef} src={src} muted={!playing} playsInline
              onTimeUpdate={handleTimeUpdate} onEnded={handleEnded}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
          <AnimatePresence>
            {!playing && !finished && (
              <motion.div
                style={{ position: "absolute", inset: STROKE + 2, borderRadius: "50%", background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center" }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              >
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)", border: "2px solid rgba(255,255,255,0.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z" /></svg>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        </motion.div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, paddingLeft: 4 }}>
          <span style={{ fontSize: 11, color: "#8696A0" }}>{timeStr}</span>
          <AnimatePresence>
            {seen && (
              <motion.svg width="16" height="11" viewBox="0 0 16 11" fill="none"
                initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
                <path d="M1 5.5L4.5 9L10 2" stroke="#53BDEB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 5.5L8.5 9L15 2" stroke="#53BDEB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </motion.svg>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// ── Audio Note ──────────────────────────────────────────────────────────────

interface AudioNoteProps {
  timeStr: string;
  onPlayStart: () => void;
  onAudioEnded: () => void;
  darkRef: React.RefObject<HTMLVideoElement | null>;
}

function AudioNote({ timeStr, onPlayStart, onAudioEnded, darkRef }: AudioNoteProps) {
  const [playing, setPlaying] = useState(false);
  const [finished, setFinished] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const tapRef = useRef<HTMLAudioElement>(null);
  const msgRef = useRef<HTMLAudioElement>(null);
  const fmtTime = (s: number) => `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;

  // Tap mensaje al aparecer
  useEffect(() => {
    msgRef.current?.play().catch(() => {});
  }, []);

  function handlePlay() {
    if (playing || finished) return;
    tapRef.current?.play().catch(() => {});
    setPlaying(true);
    onPlayStart();
    // Arranca dark.mp4 como música de fondo a volumen bajo
    if (darkRef.current) {
      darkRef.current.volume = 0.08;
      darkRef.current.currentTime = 0;
      darkRef.current.play().catch(() => {});
    }
    setTimeout(() => {
      audioRef.current?.play().catch(() => {});
    }, 100);
  }

  function handleTimeUpdate() {
    const a = audioRef.current;
    if (!a || !a.duration) return;
    setProgress(a.currentTime / a.duration);
    setElapsed(Math.floor(a.currentTime));
  }

  function handleEnded() {
    setPlaying(false);
    setFinished(true);
    setProgress(1);
    // Para la música
    if (darkRef.current) {
      darkRef.current.pause();
      darkRef.current.currentTime = 0;
    }
    setTimeout(() => onAudioEnded(), 600);
  }

  return (
    <motion.div
      style={{ display: "flex", alignItems: "flex-end", gap: 6, marginBottom: 12 }}
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <audio ref={msgRef} src="/sounds/tap mensaje.mp3" />
      <audio ref={tapRef} src="/sounds/tap boton.mp3" />
      <audio ref={audioRef} src="/audio final analista.mp3"
        onTimeUpdate={handleTimeUpdate} onEnded={handleEnded}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)} />

      <div style={{ width: 28, height: 28, borderRadius: "50%", overflow: "hidden", flexShrink: 0, marginBottom: 2 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/la analista perfil.jpg" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 4, maxWidth: "75%" }}>
        <div style={{ background: "#202C33", borderRadius: "0px 12px 12px 12px", padding: "10px 12px", display: "flex", alignItems: "center", gap: 10, minWidth: 220 }}>
          <div onClick={handlePlay} style={{ width: 40, height: 40, borderRadius: "50%", background: "#00A884", display: "flex", alignItems: "center", justifyContent: "center", cursor: (playing || finished) ? "default" : "pointer", flexShrink: 0 }}>
            {playing ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
            )}
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 2, height: 20 }}>
              {[3,5,8,6,10,7,4,9,5,7,6,8,4,6,9,5,7,4,8,6].map((h, i) => (
                <motion.div key={`bar-${i}-${finished}`} style={{ width: 2.5, borderRadius: 2, background: progress > i/20 ? "#00A884" : "rgba(255,255,255,0.25)", height: h }}
                  animate={(playing && !finished) ? { scaleY: [1, 1.4, 0.7, 1.2, 1] } : { scaleY: 1 }}
                  transition={(playing && !finished)
                    ? { repeat: Infinity, duration: 0.6 + i * 0.05, ease: "easeInOut" }
                    : { duration: 0.15 }
                  } />
              ))}
            </div>
            <span style={{ fontSize: 10, color: "#8696A0" }}>
              {playing ? fmtTime(elapsed) : fmtTime(Math.floor(duration))}
            </span>
          </div>
          <div style={{ width: 34, height: 34, borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/la analista perfil.jpg" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </div>
        <span style={{ fontSize: 11, color: "#8696A0", paddingLeft: 4 }}>{timeStr}</span>
      </div>
    </motion.div>
  );
}


// ── WhatsApp Call Screen ─────────────────────────────────────────────────────

function CallScreen({ onEnd, onCallEnded }: { onEnd: () => void; onCallEnded: () => void }) {
  const [status, setStatus] = useState<"waiting" | "connected" | "ended">("waiting");
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const waitRef = useRef<HTMLAudioElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const endCallRef = useRef<HTMLAudioElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // 1) Al montar: reproducir "llamada en espera" y conectar tras 2 segundos
  useEffect(() => {
    waitRef.current?.play().catch(() => {});
    const t = setTimeout(() => {
      waitRef.current?.pause();
      setStatus("connected");
      setAudioPlaying(true);
      intervalRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
      if (audioRef.current) {
        audioRef.current.volume = 0.6;
        audioRef.current.play().catch(() => {});
      }
    }, 2000);
    return () => {
      clearTimeout(t);
      if (intervalRef.current) clearInterval(intervalRef.current);
      waitRef.current?.pause();
      if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
    };
  }, []);

  // 2) Cuando termina el audio → pantalla "Llamada finalizada" → TikTok
  function handleAudioEnded() {
    setAudioPlaying(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setStatus("ended");
    endCallRef.current?.play().catch(() => {});
    setTimeout(() => onCallEnded(), 2000);
  }

  function handleSpeaker() {
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
  }

  function handleEnd() {
    waitRef.current?.pause();
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
    if (intervalRef.current) clearInterval(intervalRef.current);
    setStatus("ended");
    endCallRef.current?.play().catch(() => {});
    setTimeout(() => onEnd(), 2200);
  }

  const fmtTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  return (
    <motion.div
      style={{
        position: "absolute", inset: 0, zIndex: 10,
        display: "flex", flexDirection: "column",
        alignItems: "center",
        background: "linear-gradient(180deg, #0B1D18 0%, #071410 40%, #050E0C 100%)",
        fontFamily: "var(--font-montserrat)",
        overflow: "hidden",
      }}
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ duration: 0.38, ease: [0.25, 1, 0.5, 1] }}
    >
      {/* Llamada en espera — suena 2 segundos al abrir */}
      <audio ref={waitRef} src="/sounds/llamada en espera.mp3" loop />
      {/* Audio de la llamada — arranca al conectar */}
      <audio ref={audioRef} src="/audio analista llamada tik.mp4" onEnded={handleAudioEnded} />
      {/* Sonido de colgar */}
      <audio ref={endCallRef} src="/sounds/end call.mp3" />

      {/* Glow verde central */}
      <div style={{
        position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)",
        width: 260, height: 260, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,168,132,0.18) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Top info */}
      <div style={{ marginTop: 64, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, zIndex: 1 }}>
        <span style={{ fontSize: 24, fontWeight: 700, color: "#E9EDEF", letterSpacing: 0.3 }}>La Analista</span>
        <motion.span
          key={status}
          initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
          style={{ fontSize: 14, color: "#8696A0" }}
        >
          {status === "waiting" ? "Llamando..." : fmtTime(seconds)}
        </motion.span>
      </div>

      {/* Foto de perfil con ondas */}
      <div style={{ position: "relative", marginTop: 40, zIndex: 1 }}>
        {/* Ondas de voz — activas mientras suena el audio de la llamada */}
        <AnimatePresence>
          {status === "connected" && audioPlaying && (
            <>
              {[0, 0.5, 1.0, 1.5].map((delay, i) => (
                <motion.div key={i}
                  style={{
                    position: "absolute",
                    inset: -(16 + i * 14),
                    borderRadius: "50%",
                    border: `${1.5 - i * 0.2}px solid rgba(0,168,132,${0.5 - i * 0.1})`,
                    pointerEvents: "none",
                  }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: [0, 0.7, 0], scale: [0.9, 1.1, 1.35] }}
                  transition={{ repeat: Infinity, duration: 1.6, delay, ease: "easeOut" }}
                />
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Foto */}
        <div style={{
          width: 130, height: 130, borderRadius: "50%",
          overflow: "hidden",
          border: "3px solid rgba(0,168,132,0.5)",
          boxShadow: "0 0 30px rgba(0,168,132,0.3), 0 8px 32px rgba(0,0,0,0.6)",
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/la analista perfil.jpg" alt="La Analista"
            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      </div>

      {/* Indicador "cifrado de extremo a extremo" + handle */}
      <div style={{ marginTop: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: 5, zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#8696A0">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
          </svg>
          <span style={{ fontSize: 11, color: "#8696A0" }}>Cifrado de extremo a extremo</span>
        </div>
        <span style={{ fontSize: 11, color: "rgba(134,150,160,0.45)", letterSpacing: 0.5 }}>@cima.labs</span>
      </div>

      {/* Espacio flexible */}
      <div style={{ flex: 1 }} />

      {/* Botones de acción */}
      <div style={{
        width: "100%", paddingBottom: 52, paddingLeft: 32, paddingRight: 32,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        zIndex: 1,
      }}>
        {/* Silenciar — deshabilitado mientras el audio suena */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <motion.button
            onClick={() => {
              if (audioPlaying) return;
              const next = !muted;
              setMuted(next);
              if (audioRef.current) audioRef.current.muted = next;
            }}
            whileTap={!audioPlaying ? { scale: 0.9 } : {}}
            style={{
              width: 62, height: 62, borderRadius: "50%",
              background: muted ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.12)",
              border: "none",
              cursor: audioPlaying ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              opacity: audioPlaying ? 0.35 : 1,
              transition: "opacity 0.3s ease",
            }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill={muted ? "#000" : "white"}>
              {muted ? (
                <path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z"/>
              ) : (
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
              )}
            </svg>
          </motion.button>
          <span style={{ fontSize: 11.5, color: audioPlaying ? "rgba(134,150,160,0.4)" : "#8696A0", transition: "color 0.3s" }}>
            {muted ? "Activar" : "Silenciar"}
          </span>
        </div>

        {/* Colgar — deshabilitado mientras el audio suena */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <motion.button
            onClick={audioPlaying ? undefined : handleEnd}
            whileTap={!audioPlaying ? { scale: 0.88 } : {}}
            whileHover={!audioPlaying ? { scale: 1.06 } : {}}
            style={{
              width: 72, height: 72, borderRadius: "50%",
              background: "#FF3B30",
              border: "none",
              cursor: audioPlaying ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: audioPlaying ? "none" : "0 4px 20px rgba(255,59,48,0.5)",
              opacity: audioPlaying ? 0.35 : 1,
              transition: "opacity 0.3s ease, box-shadow 0.3s ease",
            }}
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="white" style={{ transform: "rotate(135deg)" }}>
              <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
            </svg>
          </motion.button>
          <span style={{ fontSize: 11.5, color: audioPlaying ? "rgba(134,150,160,0.4)" : "#8696A0", transition: "color 0.3s" }}>Colgar</span>
        </div>

        {/* Altavoz — siempre activo, sube volumen al activar */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <motion.button
            onClick={handleSpeaker}
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

      {/* Pantalla "Llamada finalizada" */}
      <AnimatePresence>
        {status === "ended" && (
          <motion.div
            style={{
              position: "absolute", inset: 0, zIndex: 20,
              background: "#050505",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 20,
            }}
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
              style={{
                fontSize: 9, letterSpacing: "0.5em", textTransform: "uppercase",
                fontFamily: "var(--font-montserrat)", color: "rgba(255,255,255,0.3)",
                margin: 0,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Llamada finalizada
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────

export type WhatsAppSubStage = "analista" | "call-screen" | "tiktok-login" | "tiktok-feed" | "aurelius-chat" | "video-call";

export default function WhatsAppChat({ devSubStage, onComplete }: { devSubStage?: WhatsAppSubStage; onComplete?: () => void }) {
  const [visibleCount, setVisibleCount] = useState(1);
  const [showAudio, setShowAudio] = useState(false);
  const [showCallCTA, setShowCallCTA] = useState(false);
  const [recordingIdx, setRecordingIdx] = useState<number | null>(null);
  const [showCall, setShowCall] = useState(() => devSubStage === "call-screen");
  const [showTikTok, setShowTikTok] = useState(() => devSubStage === "tiktok-login" || devSubStage === "tiktok-feed" || devSubStage === "aurelius-chat" || devSubStage === "video-call");
  const [showFeed, setShowFeed] = useState(() => devSubStage === "tiktok-feed" || devSubStage === "aurelius-chat" || devSubStage === "video-call");
  const darkRef = useRef<HTMLVideoElement>(null);

  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2,"0")}:${now.getMinutes().toString().padStart(2,"0")}`;

  function handleVideoEnded(index: number) {
    if (index + 1 < VIDEOS.length) {
      setVisibleCount(index + 2);
    } else {
      setShowAudio(true);
    }
  }

  function handleAudioEnded() {
    setShowCallCTA(true);
  }

  return (
    <motion.div
      className="absolute inset-0 flex flex-col"
      style={{ background: "#000", fontFamily: "var(--font-montserrat)" }}
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.32, ease: [0.25, 1, 0.5, 1] }}
    >
      {/* Música de fondo (dark.mp4) — oculta */}
      <video ref={darkRef} src="/dark.mp4" muted={false} loop style={{ display: "none" }} />

      {/* ── HEADER ── */}
      <div style={{
        background: "#1F2C34",
        paddingTop: 14, paddingBottom: 10,
        paddingLeft: 14, paddingRight: 14,
        display: "flex", alignItems: "center", gap: 10,
        flexShrink: 0, zIndex: 2,
      }}>
        <div style={{ width: 42, height: 42, borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: "2px solid rgba(255,255,255,0.08)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/la analista perfil.jpg" alt="La Analista" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 1 }}>
          <span style={{ fontSize: 16, fontWeight: 600, color: "#E9EDEF" }}>La Analista</span>
          <motion.span
            key={recordingIdx !== null ? `rec-${recordingIdx}` : "online"}
            style={{ fontSize: 12, color: "#25D366" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
          >
            {recordingIdx === null ? "en línea" : recordingIdx === 3 ? "grabando nota de audio..." : "grabando nota de video..."}
          </motion.span>
        </div>

        {/* Ícono llamada — siempre visible, animación activa al terminar el audio */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.23,1,0.32,1] }}
          style={{ position: "relative", flexShrink: 0, cursor: showCallCTA ? "pointer" : "default" }}
          onClick={() => {
            if (!showCallCTA) return;
            new Audio("/sounds/tap boton.mp3").play().catch(() => {});
            setShowCall(true);
          }}
        >
          {/* Ondas expansivas — solo cuando showCallCTA */}
          <AnimatePresence>
            {showCallCTA && [0, 0.5, 1.0].map((delay, i) => (
              <motion.div key={i} style={{
                position: "absolute",
                inset: -4,
                borderRadius: "50%",
                background: "rgba(0,168,132,0.35)",
                pointerEvents: "none",
              }}
                initial={{ scale: 1, opacity: 0 }}
                animate={{ scale: [1, 2.4], opacity: [0.6, 0] }}
                transition={{ repeat: Infinity, duration: 1.8, delay, ease: "easeOut" }}
              />
            ))}
          </AnimatePresence>

          {/* Botón teléfono */}
          <motion.div
            animate={showCallCTA
              ? { x: [0, -1.5, 1.5, -1, 1, 0], y: [0, 1, -1, 0.5, -0.5, 0] }
              : { x: 0, y: 0 }
            }
            transition={showCallCTA
              ? { repeat: Infinity, duration: 2.4, ease: "easeInOut" }
              : { duration: 0 }
            }
            style={{
              width: 42, height: 42, borderRadius: "50%",
              background: showCallCTA ? "#00A884" : "rgba(255,255,255,0.12)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: showCallCTA ? "0 0 20px rgba(0,168,132,0.7)" : "none",
              position: "relative", zIndex: 1,
              transition: "background 0.4s ease, box-shadow 0.4s ease",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
            </svg>
          </motion.div>
        </motion.div>
      </div>

      {/* ── CHAT ── */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        {/* Fondo fijo dentro del contenedor — no se corta al hacer scroll */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url('/fondo 2 chat.jpg')",
          backgroundSize: "cover", backgroundPosition: "center",
          opacity: 0.35, pointerEvents: "none", zIndex: 0,
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "rgba(11,20,26,0.72)",
          pointerEvents: "none", zIndex: 0,
        }} />

        {/* Contenido scrolleable dentro del contenedor */}
        <div style={{ position: "absolute", inset: 0, overflowY: "auto", zIndex: 1 }}>
        <div style={{ padding: "12px 8px 24px", display: "flex", flexDirection: "column" }}>

          {/* Chip fecha */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <span style={{ background: "rgba(17,27,33,0.85)", color: "#8696A0", fontSize: 11.5, padding: "4px 12px", borderRadius: 8, backdropFilter: "blur(4px)" }}>HOY</span>
          </div>

          {/* Notas de video */}
          <AnimatePresence>
            {VIDEOS.slice(0, visibleCount).map((src, i) => (
              <VideoNote
                key={src} src={src} timeStr={timeStr}
                seen={i < visibleCount - 1 || showAudio}
                onEnded={() => handleVideoEnded(i)}
                onPlayStart={() => setRecordingIdx(i)}
                onPlayStop={() => setRecordingIdx(null)}
                gain={2.5}
              />
            ))}
          </AnimatePresence>

          {/* Nota de audio */}
          <AnimatePresence>
            {showAudio && (
              <AudioNote
                timeStr={timeStr}
                onPlayStart={() => setRecordingIdx(null)}
                onAudioEnded={handleAudioEnded}
                darkRef={darkRef}
              />
            )}
          </AnimatePresence>

        </div>{/* fin padding */}
        </div>{/* fin scroll */}
      </div>{/* fin chat wrapper */}

      {/* ── PANTALLA DE LLAMADA ── */}
      <AnimatePresence>
        {showCall && !showTikTok && (
          <CallScreen
            onEnd={() => setShowCall(false)}
            onCallEnded={() => setShowTikTok(true)}
          />
        )}
      </AnimatePresence>

      {/* ── LOGIN TIKTOK ── */}
      <AnimatePresence>
        {showTikTok && !showFeed && <TikTokLogin onLogin={() => setShowFeed(true)} />}
      </AnimatePresence>

      {/* ── FEED TIKTOK ── */}
      <AnimatePresence>
        {showFeed && <TikTokFeed devSubStage={devSubStage} onComplete={onComplete} />}
      </AnimatePresence>
    </motion.div>
  );
}

// ── TikTok Login v44.5.0 ─────────────────────────────────────────────────────

function TikTokLogin({ onLogin }: { onLogin: () => void }) {
  const [showPass, setShowPass] = useState(true);
  const tapRef = useRef<HTMLAudioElement>(null);
  const EMAIL = "@cima.labs";
  const PASS   = "aurelius777";

  function handleLogin() {
    if (tapRef.current) { tapRef.current.currentTime = 0; tapRef.current.play().catch(() => {}); }
    onLogin();
  }

  return (
    <motion.div
      style={{
        position: "absolute", inset: 0, zIndex: 20,
        background: "#000",
        display: "flex", flexDirection: "column",
        fontFamily: "var(--font-montserrat)",
        overflowY: "auto",
      }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
    >
      <audio ref={tapRef} src="/sounds/tap boton.mp3" />
      {/* Status bar placeholder */}
      <div style={{ height: 44, flexShrink: 0 }} />


      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "0 24px 40px" }}>

        {/* Logo TikTok */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Sombra cian */}
            <path d="M21.5 6h5.8c.4 3.2 2.4 6 5.2 7.6v5.6c-2.8-.1-5.5-1-7.7-2.6v11.8c0 5.9-4.8 10.6-10.6 10.6C8.4 39 4 34.3 4 28.7c0-5.6 4.4-10.2 9.9-10.6v5.7c-2.5.4-4.4 2.5-4.4 5 0 2.8 2.3 5.1 5.1 5.1 2.9 0 5.2-2.3 5.2-5.1V6z" fill="#69C9D0"/>
            {/* Sombra roja */}
            <path d="M23.5 4h5.8c.4 3.2 2.4 6 5.2 7.6v5.6c-2.8-.1-5.5-1-7.7-2.6v11.8c0 5.9-4.8 10.6-10.6 10.6-2.1 0-4-.6-5.7-1.7 1.8 1.1 3.9 1.8 6.2 1.8 5.8 0 10.6-4.7 10.6-10.6V14.6c2.2 1.6 4.9 2.5 7.7 2.6v-5.6C32.2 10 30.1 7.2 29.3 4h-5.8z" fill="#EE1D52"/>
            {/* Forma principal blanca */}
            <path d="M22.5 5h5.8c.4 3.2 2.4 6 5.2 7.6v5.6c-2.8-.1-5.5-1-7.7-2.6v11.8c0 5.9-4.8 10.6-10.6 10.6S4.6 33.3 4.6 27.7c0-5.6 4.4-10.2 9.9-10.6v5.7c-2.5.4-4.4 2.5-4.4 5 0 2.8 2.3 5.1 5.1 5.1 2.9 0 5.2-2.3 5.2-5.1V5z" fill="white"/>
          </svg>
        </div>

        {/* Título */}
        <h1 style={{ color: "#fff", fontSize: 24, fontWeight: 700, margin: "0 0 6px", textAlign: "center" }}>
          Iniciar sesión
        </h1>
        <p style={{ color: "#888", fontSize: 13, textAlign: "center", margin: "0 0 32px" }}>
          Gestiona tu cuenta, revisa notificaciones,<br/>comenta en videos y más.
        </p>

        {/* Campo email */}
        <div style={{ marginBottom: 14 }}>
          <div style={{
            background: "#1a1a1a", borderRadius: 8,
            display: "flex", alignItems: "center",
            padding: "14px 16px", gap: 10,
            border: "1px solid #2a2a2a",
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#888">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            <span style={{ color: "#fff", fontSize: 15, flex: 1 }}>{EMAIL}</span>
          </div>
        </div>

        {/* Campo contraseña */}
        <div style={{ marginBottom: 6 }}>
          <div style={{
            background: "#1a1a1a", borderRadius: 8,
            display: "flex", alignItems: "center",
            padding: "14px 16px", gap: 10,
            border: "1px solid #2a2a2a",
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#888">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z"/>
            </svg>
            <span style={{ color: "#fff", fontSize: 15, flex: 1, letterSpacing: showPass ? 0 : 4 }}>
              {showPass ? PASS : "•".repeat(PASS.length)}
            </span>
            <div onClick={() => setShowPass(p => !p)} style={{ cursor: "pointer", padding: 4 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#888">
                {showPass
                  ? <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                  : <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                }
              </svg>
            </div>
          </div>
        </div>

        {/* ¿Olvidaste? */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 28 }}>
          <span style={{ color: "#EE1D52", fontSize: 13, cursor: "pointer" }}>¿Olvidaste la contraseña?</span>
        </div>

        {/* Botón iniciar sesión */}
        <motion.button
          onClick={handleLogin}
          whileTap={{ scale: 0.96 }}
          animate={{
            scale: [1, 1.04, 1],
            boxShadow: [
              "0 0 0px 0px rgba(238,29,82,0)",
              "0 0 18px 6px rgba(238,29,82,0.55)",
              "0 0 0px 0px rgba(238,29,82,0)",
            ],
          }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: "100%", padding: "15px 0",
            background: "#EE1D52",
            border: "none", borderRadius: 8,
            color: "#fff", fontSize: 16, fontWeight: 700,
            cursor: "pointer", letterSpacing: 0.3,
          }}
        >
          Iniciar sesión
        </motion.button>

        {/* Divisor */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "28px 0" }}>
          <div style={{ flex: 1, height: 1, background: "#2a2a2a" }} />
          <span style={{ color: "#555", fontSize: 12 }}>o continúa con</span>
          <div style={{ flex: 1, height: 1, background: "#2a2a2a" }} />
        </div>

        {/* Opciones sociales */}
        <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
          {[
            { icon: "G", color: "#fff", bg: "#1a1a1a", label: "Google" },
            { icon: "f", color: "#1877F2", bg: "#1a1a1a", label: "Facebook" },
            { icon: "🍎", color: "#fff", bg: "#1a1a1a", label: "Apple" },
          ].map(({ icon, color, bg, label }) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer" }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: bg, border: "1px solid #2a2a2a", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color, fontSize: 20, fontWeight: 700 }}>{icon}</span>
              </div>
              <span style={{ color: "#555", fontSize: 11 }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ marginTop: "auto", paddingTop: 32, display: "flex", justifyContent: "center", gap: 4 }}>
          <span style={{ color: "#555", fontSize: 13 }}>¿No tienes cuenta?</span>
          <span style={{ color: "#EE1D52", fontSize: 13, cursor: "pointer", fontWeight: 600 }}>Regístrate</span>
        </div>
      </div>
    </motion.div>
  );
}

// ── TikTok Feed (Para Ti) ─────────────────────────────────────────────────────

const FEED_VIDEOS = [
  { src: "/tiktok/video1.mp4", user: "@cima.labs", desc: "No vendes porque eres igual a las masas. #copiabarata #masas", likes: "14.2K", comments: "832", bookmarks: "3.1K", shares: "2.4K", music: "Cima Labs - Original Sound" },
  { src: "/tiktok/video2.mp4", user: "@cima.labs", desc: "Si ganas la atención, ¡vendes! #atencion #recursomasvalioso", likes: "9.8K",  comments: "541", bookmarks: "1.9K", shares: "1.7K", music: "Cima Labs - Original Sound" },
  { src: "/tiktok/video3.mp4", user: "@cima.labs", desc: "¿Sigues haciéndolo manual? Esto te va a cambiar la vida. #claude #automatizacion", likes: "21.3K", comments: "1.2K", bookmarks: "5.4K", shares: "4.1K", music: "Cima Labs - Original Sound" },
];

const COMMENTS_BY_VIDEO = [
  [
    { user: "maria_glez92", avatar: "M", text: "Dios mío esto es exactamente lo que necesitaba 😱🔥", likes: 847 },
    { user: "sergio.mk", avatar: "S", text: "Llevo 3 meses buscando esto y aquí estaba todo el tiempo 🤯", likes: 634 },
    { user: "laura_emp", avatar: "L", text: "Acabo de implementarlo y ya estoy viendo resultados increíbles", likes: 521 },
    { user: "carlos_biz", avatar: "C", text: "Esto debería ser ilegal 😂 demasiado bueno", likes: 489 },
    { user: "ana.digital", avatar: "A", text: "Mi competencia no sabe que existe esto y lo prefiero así 🤫", likes: 412 },
    { user: "javier_pro", avatar: "J", text: "Llevo años en marketing y esto cambió completamente mi perspectiva", likes: 378 },
    { user: "valeria.ok", avatar: "V", text: "Estaba a punto de cerrar mi negocio... gracias @cima.labs 🙏", likes: 356 },
  ],
  [
    { user: "diego.results", avatar: "D", text: "Primera semana usando esto: +340% de conversiones. No es broma 📈", likes: 923 },
    { user: "patri_gg", avatar: "P", text: "Literalmente llorando de emoción esto ES LO QUE BUSQUÉ SIEMPRE 😭", likes: 781 },
    { user: "ro.ventas", avatar: "R", text: "Ya lo compartí con 20 personas de mi equipo. Obligatorio", likes: 612 },
    { user: "luis_ent", avatar: "L", text: "El sistema más completo que he visto en años de emprender 🚀", likes: 544 },
    { user: "nat.growth", avatar: "N", text: "¿Por qué nadie hablaba de esto antes? Increíble @cima.labs", likes: 498 },
    { user: "fer.mkt", avatar: "F", text: "Me salvó el mes. Literal. GRACIAS 🔥🔥🔥", likes: 431 },
  ],
  [
    { user: "ximena.ceo", avatar: "X", text: "Tres meses después: mi empresa facturó el doble. Este video fue el inicio 💪", likes: 1204 },
    { user: "pablo_dev", avatar: "P", text: "Pensé que era exagerado hasta que lo probé. No lo es. EN SERIO", likes: 876 },
    { user: "clau.biz", avatar: "C", text: "Mandé esto al grupo familiar completo jajaja 😂 todos necesitan esto", likes: 743 },
    { user: "andres.ok", avatar: "A", text: "El ROI que calculé después de aplicarlo fue de 1800%. DIOS MÍO", likes: 692 },
    { user: "sof.mktg", avatar: "S", text: "@cima.labs es el único que habla con verdad en este mundo de humo", likes: 587 },
    { user: "mike.emp", avatar: "M", text: "Tomé acción inmediatamente después de ver esto y no me arrepiento", likes: 534 },
    { user: "ale.pro", avatar: "A", text: "Esto debería enseñarse en universidades. Nivel otro 🎓🔥", likes: 478 },
  ],
];

// ── Chat de Aurelius (Parte 7) ────────────────────────────────────────────────

function AureliusChat({ devSubStage, onComplete }: { devSubStage?: WhatsAppSubStage; onComplete?: () => void }) {
  const [messages, setMessages] = useState<string[]>([]);
  const [bothReady, setBothReady] = useState(false);
  const [sent, setSent] = useState(false);
  const [typing, setTyping] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(() => devSubStage === "video-call");
  const [callAnswered, setCallAnswered] = useState(false);
  const [callSeconds, setCallSeconds] = useState(0);
  const [camOff, setCamOff] = useState(true);
  const [signalGlitch, setSignalGlitch] = useState(false);
  const [signalLabel, setSignalLabel] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [showVIP, setShowVIP] = useState(false);
  const noSignalCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const noSignalRafRef = useRef<number | null>(null);
  const glitchAudioRef = useRef<HTMLAudioElement | null>(null);
  const selfVideoRef = useRef<HTMLVideoElement | null>(null);
  const camStreamRef = useRef<MediaStream | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const waitRef = useRef<HTMLAudioElement | null>(null);
  const callVideoRef = useRef<HTMLVideoElement | null>(null);
  const glitchCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const glitchRafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!callAnswered) return;
    const interval = setInterval(() => setCallSeconds(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, [callAnswered]);

  useEffect(() => {
    if (!callAnswered) return;
    const t = setTimeout(() => {
      setSignalGlitch(true);
      setSignalLabel(true);
      // Audio: reproducir y cortar exactamente a los 3s
      const audio = new Audio("/sounds/señal inestable.mp3");
      audio.play().catch(() => {});
      glitchAudioRef.current = audio;
      const stopAudio = setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;
        glitchAudioRef.current = null;
      }, 2000);
      // Efecto visual termina a los 3s, etiqueta permanece
      setTimeout(() => setSignalGlitch(false), 3000);
      return () => clearTimeout(stopAudio);
    }, 4000);
    return () => clearTimeout(t);
  }, [callAnswered]);

  // Canvas de estática (señal perdida) cuando el video termina
  useEffect(() => {
    if (!videoEnded) {
      if (noSignalRafRef.current) cancelAnimationFrame(noSignalRafRef.current);
      noSignalRafRef.current = null;
      return;
    }
    function drawStatic() {
      const canvas = noSignalCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const W = canvas.width;
      const H = canvas.height;
      const imageData = ctx.createImageData(W, H);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const v = Math.random() * 255;
        data[i] = v; data[i+1] = v; data[i+2] = v; data[i+3] = 255;
      }
      ctx.putImageData(imageData, 0, 0);
      noSignalRafRef.current = requestAnimationFrame(drawStatic);
    }
    noSignalRafRef.current = requestAnimationFrame(drawStatic);
    // Audio
    const nsAudio = new Audio("/sounds/no signal.mp3");
    nsAudio.play().catch(() => {});
    setTimeout(() => { nsAudio.pause(); nsAudio.currentTime = 0; }, 1000);
    // Tras 1s: detener estática y mostrar botón VIP
    const t = setTimeout(() => {
      if (noSignalRafRef.current) cancelAnimationFrame(noSignalRafRef.current);
      noSignalRafRef.current = null;
      setVideoEnded(false);
      setShowVIP(true);
    }, 1000);
    return () => {
      clearTimeout(t);
      if (noSignalRafRef.current) cancelAnimationFrame(noSignalRafRef.current);
    };
  }, [videoEnded]);

  // Loop canvas: renderiza el video a baja res (480p simulado) + ruido
  useEffect(() => {
    if (!signalGlitch) {
      if (glitchRafRef.current) cancelAnimationFrame(glitchRafRef.current);
      glitchRafRef.current = null;
      return;
    }
    const LOW_W = 64;  // ancho muy reducido para pixelación agresiva
    const LOW_H = 36;
    function drawFrame() {
      const video = callVideoRef.current;
      const canvas = glitchCanvasRef.current;
      if (!video || !canvas) { glitchRafRef.current = requestAnimationFrame(drawFrame); return; }
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const W = canvas.width;
      const H = canvas.height;
      // 1. Dibujar video a resolución baja en canvas auxiliar
      const offscreen = document.createElement("canvas");
      offscreen.width = LOW_W;
      offscreen.height = LOW_H;
      const offCtx = offscreen.getContext("2d")!;
      offCtx.drawImage(video, 0, 0, LOW_W, LOW_H);
      // 2. Escalar de vuelta al tamaño full — efecto pixelado
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(offscreen, 0, 0, W, H);
      // 3. Añadir ruido digital (puntos aleatorios)
      const noiseLevel = 0.18;
      const imageData = ctx.getImageData(0, 0, W, H);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        if (Math.random() < noiseLevel) {
          const noise = (Math.random() - 0.5) * 140;
          data[i]     = Math.min(255, Math.max(0, data[i]     + noise));
          data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
          data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
        }
      }
      ctx.putImageData(imageData, 0, 0);
      // 4. Franjas horizontales aleatorias
      if (Math.random() < 0.3) {
        const y = Math.random() * H;
        const h = Math.random() * 8 + 2;
        ctx.save();
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = Math.random() > 0.5 ? "rgba(255,255,255,0.15)" : "rgba(0,200,255,0.1)";
        ctx.fillRect(0, y, W, h);
        ctx.restore();
      }
      glitchRafRef.current = requestAnimationFrame(drawFrame);
    }
    glitchRafRef.current = requestAnimationFrame(drawFrame);
    return () => {
      if (glitchRafRef.current) cancelAnimationFrame(glitchRafRef.current);
    };
  }, [signalGlitch]);

  const fmtTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  async function toggleCam() {
    if (!camOff) {
      // Apagar cámara
      camStreamRef.current?.getTracks().forEach(t => t.stop());
      camStreamRef.current = null;
      if (selfVideoRef.current) selfVideoRef.current.srcObject = null;
      setCamOff(true);
    } else {
      // Encender cámara
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        camStreamRef.current = stream;
        if (selfVideoRef.current) {
          selfVideoRef.current.srcObject = stream;
          selfVideoRef.current.play().catch(() => {});
        }
        setCamOff(false);
      } catch {
        // Usuario denegó permiso — no hacer nada
      }
    }
  }

  useEffect(() => {
    // Primer mensaje tras 800ms
    const t1 = setTimeout(() => {
      new Audio("/sounds/tap mensaje.mp3").play().catch(() => {});
      setMessages(["no puedo tardar mucho"]);
      // Segundo mensaje tras 900ms más
      const t2 = setTimeout(() => {
        new Audio("/sounds/tap mensaje.mp3").play().catch(() => {});
        setMessages(prev => [...prev, "hablemos por unos segundos."]);
        // Input aparece 600ms después del segundo mensaje
        setTimeout(() => setBothReady(true), 600);
      }, 900);
      return () => clearTimeout(t2);
    }, 800);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sent, typing]);

  // Cleanup al desmontar: para audio de espera, stream de cámara y canvas RAF
  useEffect(() => {
    return () => {
      waitRef.current?.pause();
      waitRef.current = null;
      glitchAudioRef.current?.pause();
      glitchAudioRef.current = null;
      camStreamRef.current?.getTracks().forEach(t => t.stop());
      camStreamRef.current = null;
      if (glitchRafRef.current) cancelAnimationFrame(glitchRafRef.current);
      if (callVideoRef.current) {
        callVideoRef.current.pause();
        callVideoRef.current.src = "";
      }
    };
  }, []);

  function handleSend() {
    if (sent) return;
    new Audio("/sounds/tap boton.mp3").play().catch(() => {});
    setSent(true);
    setTimeout(() => setTyping(true), 200);
    // Videollamada entrante tras 1s de empezar a escribir
    setTimeout(() => {
      setTyping(false);
      setShowVideoCall(true);
      // Sonido de llamada entrante en loop
      const audio = new Audio("/sounds/llamada en espera.mp3");
      audio.loop = true;
      audio.play().catch(() => {});
      waitRef.current = audio;
    }, 1000);
  }

  function handleAnswer() {
    waitRef.current?.pause();
    waitRef.current = null;
    new Audio("/sounds/tap boton.mp3").play().catch(() => {});
    setCallAnswered(true);
  }

  const TIME = (() => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2,"0")}:${now.getMinutes().toString().padStart(2,"0")}`;
  })();

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.38, ease: [0.25, 1, 0.5, 1] }}
      style={{
        position: "absolute", inset: 0, zIndex: 70,
        display: "flex", flexDirection: "column",
        background: "#0B141A",
        fontFamily: "var(--font-montserrat)",
      }}
    >
      {/* Header WhatsApp — igual que chat analista */}
      <div style={{
        background: "#1F2C34",
        paddingTop: 14, paddingBottom: 10,
        paddingLeft: 14, paddingRight: 14,
        display: "flex", alignItems: "center", gap: 10,
        flexShrink: 0, zIndex: 3, position: "relative",
      }}>
        {/* Avatar */}
        <div style={{ width: 42, height: 42, borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: "2px solid rgba(255,255,255,0.08)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/aurelius-perfil.jpg" alt="Aurelius" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        {/* Nombre + estado */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 1 }}>
          <span style={{ fontSize: 16, fontWeight: 600, color: "#E9EDEF" }}>Aurelius</span>
          <span style={{ fontSize: 12, color: "#25D366" }}>en línea</span>
        </div>
        {/* Iconos decorativos */}
        <div style={{ display: "flex", gap: 18, opacity: 0.55 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
            <path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4z"/>
          </svg>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
          </svg>
        </div>
      </div>

      {/* Fondo del chat — igual que analista */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url('/payaso fondo chat.jpg')",
          backgroundSize: "cover", backgroundPosition: "center",
          opacity: 0.35, pointerEvents: "none", zIndex: 0,
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "rgba(11,20,26,0.72)",
          pointerEvents: "none", zIndex: 0,
        }} />

      {/* Mensajes */}
      <div style={{
        flex: 1, overflowY: "auto", padding: "16px 12px",
        display: "flex", flexDirection: "column", gap: 6,
        position: "relative", zIndex: 2,
      }}>
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              style={{
                alignSelf: "flex-start",
                background: "#1F2C34",
                borderRadius: "0 12px 12px 12px",
                padding: "8px 12px 6px",
                maxWidth: "78%",
              }}
            >
              <span style={{ color: "#E9EDEF", fontSize: 14.5, lineHeight: 1.45 }}>{msg}</span>
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 3 }}>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}>{TIME}</span>
              </div>
            </motion.div>
          ))}

          {/* Mensaje enviado por el usuario */}
          {sent && (
            <motion.div
              key="sent"
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              style={{
                alignSelf: "flex-end",
                background: "#005C4B",
                borderRadius: "12px 0 12px 12px",
                padding: "8px 12px 6px",
                maxWidth: "78%",
              }}
            >
              <span style={{ color: "#E9EDEF", fontSize: 14.5, lineHeight: 1.45 }}>
                claro aqui estoy Aurelius, hablemos de inmediato.
              </span>
              <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 4, marginTop: 3 }}>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}>{TIME}</span>
                {/* Doble check azul */}
                <svg width="16" height="11" viewBox="0 0 16 11" fill="#53BDEB">
                  <path d="M11.071.828 4.915 6.984 2.172 4.241.757 5.656l4.158 4.157 7.571-7.571-1.415-1.414zM15.243.828l-7.57 7.571-1.415-1.415 7.571-7.57 1.414 1.414z"/>
                </svg>
              </div>
            </motion.div>
          )}

          {/* Typing indicator de Aurelius */}
          {typing && (
            <motion.div
              key="typing"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                alignSelf: "flex-start",
                background: "#1F2C34",
                borderRadius: "0 12px 12px 12px",
                padding: "10px 14px",
                display: "flex", gap: 4, alignItems: "center",
              }}
            >
              {[0, 1, 2].map(d => (
                <motion.div key={d}
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8, delay: d * 0.18, ease: "easeInOut" }}
                  style={{ width: 7, height: 7, borderRadius: "50%", background: "rgba(255,255,255,0.45)" }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Barra de input — aparece solo cuando ambos mensajes están listos */}
      <AnimatePresence>
      {bothReady && <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{
          position: "relative", zIndex: 2,
          background: "#1A2530",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          padding: "8px 10px",
          display: "flex", alignItems: "center", gap: 8,
          paddingBottom: "max(8px, env(safe-area-inset-bottom, 8px))",
          flexShrink: 0,
        }}>
        {/* Emoji icon */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="rgba(255,255,255,0.4)">
          <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
        </svg>
        {/* Campo de texto pre-rellenado */}
        <div style={{
          flex: 1,
          background: "#2A3942",
          borderRadius: 22,
          padding: "9px 14px",
          color: sent ? "rgba(233,237,239,0.35)" : "#E9EDEF",
          fontSize: 14.5,
          lineHeight: 1.4,
          fontFamily: "var(--font-montserrat)",
          userSelect: "none",
          transition: "color 0.2s",
        }}>
          claro aqui estoy Aurelius, hablemos de inmediato.
        </div>
        {/* Botón enviar */}
        <motion.div
          onClick={handleSend}
          whileTap={{ scale: 0.88 }}
          animate={!sent ? {
            scale: [1, 1.08, 1],
            boxShadow: [
              "0 0 0px rgba(0,168,132,0)",
              "0 0 22px rgba(0,168,132,0.75)",
              "0 0 0px rgba(0,168,132,0)",
            ],
          } : {}}
          transition={!sent ? { repeat: Infinity, duration: 1.2, ease: "easeInOut" } : {}}
          style={{
            width: 44, height: 44, borderRadius: "50%",
            background: sent ? "#2A3942" : "#00A884",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: sent ? "default" : "pointer",
            flexShrink: 0,
            transition: "background 0.3s",
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </motion.div>
      </motion.div>}
      </AnimatePresence>

      </div>{/* cierre fondo chat */}

      {/* ── Videollamada entrante de Aurelius ── */}
      <AnimatePresence>
        {showVideoCall && !callAnswered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              position: "absolute", inset: 0, zIndex: 80,
              display: "flex", flexDirection: "column",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            {/* Fondo: fondo videocall */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/fondo videocall.jpg"
              alt=""
              style={{
                position: "absolute", inset: 0,
                width: "100%", height: "100%",
                objectFit: "cover", objectPosition: "center",
              }}
            />
            {/* Gradiente oscuro encima para legibilidad */}
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.65) 100%)",
            }} />

            {/* Contenido */}
            <div style={{ position: "relative", zIndex: 2, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>

              {/* Status bar */}
              <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 24px 0", marginBottom: 8 }}>
                <span style={{ color: "white", fontSize: 15, fontWeight: 600, fontFamily: "var(--font-montserrat)" }}>
                  {new Date().getHours().toString().padStart(2,"0")}:{new Date().getMinutes().toString().padStart(2,"0")}
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 1 }}>
                    {[3,5,7,9].map((h,i) => <div key={i} style={{ width: 3, height: h, background: "white", borderRadius: 1, opacity: i < 3 ? 1 : 0.4 }} />)}
                  </div>
                  <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
                    <path d="M7.5 8.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" fill="white" />
                    <path d="M4.5 6.2C5.4 5.3 6.4 4.8 7.5 4.8s2.1.5 3 1.4" stroke="white" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                    <path d="M2 3.8C3.5 2.3 5.4 1.5 7.5 1.5s4 .8 5.5 2.3" stroke="white" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                  </svg>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ width: 24, height: 12, border: "1.5px solid rgba(255,255,255,0.8)", borderRadius: 3, padding: "1.5px", display: "flex", alignItems: "center" }}>
                      <div style={{ width: "78%", height: "100%", background: "white", borderRadius: 1.5 }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Nombre + tipo de llamada */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                style={{ textAlign: "center", marginTop: 32 }}
              >
                <p style={{ color: "white", fontSize: 34, fontWeight: 300, fontFamily: "var(--font-montserrat)", letterSpacing: "-0.01em" }}>Aurelius</p>
                <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 16, marginTop: 6, fontFamily: "var(--font-montserrat)" }}>Videollamada de WhatsApp</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 8 }}>
                  <motion.span
                    style={{ color: "#25D366", fontSize: 13, fontFamily: "var(--font-montserrat)" }}
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ repeat: Infinity, duration: 1.3, ease: "easeInOut" }}
                  >
                    ● @cima.labs
                  </motion.span>
                </div>
              </motion.div>

              {/* Foto circular con anillos pulsantes */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                style={{ position: "relative", marginTop: 48, width: 118, height: 118 }}
              >
                {[1, 2, 3].map(r => (
                  <motion.div key={r}
                    animate={{ scale: [1, 1 + r * 0.18], opacity: [0.25, 0] }}
                    transition={{ repeat: Infinity, duration: 1.8, delay: r * 0.4, ease: "easeOut" }}
                    style={{
                      position: "absolute",
                      inset: -(r * 18),
                      borderRadius: "50%",
                      border: "1.5px solid rgba(255,255,255,0.4)",
                    }}
                  />
                ))}
                <div style={{
                  width: 118, height: 118, borderRadius: "50%", overflow: "hidden",
                  border: "3px solid rgba(255,255,255,0.5)",
                  boxShadow: "0 0 0 2px rgba(255,255,255,0.15), 0 8px 32px rgba(0,0,0,0.4)",
                }}>
                  <img src="/aurelius-perfil.jpg" alt="Aurelius" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              </motion.div>
            </div>

            {/* Botón Contestar (solo verde, sin declinar) */}
            <div style={{ position: "absolute", bottom: 80, zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <motion.div
                onClick={handleAnswer}
                animate={{ scale: [1, 1.06, 1], boxShadow: ["0 0 0 0 rgba(37,211,102,0.5)", "0 0 0 16px rgba(37,211,102,0)", "0 0 0 0 rgba(37,211,102,0)"] }}
                transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                whileTap={{ scale: 0.92 }}
                style={{
                  width: 72, height: 72, borderRadius: "50%",
                  background: "rgba(37,211,102,0.88)",
                  backdropFilter: "blur(12px)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 4px 20px rgba(37,211,102,0.5)",
                }}
              >
                {/* Icono videocámara */}
                <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                  <path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4z"/>
                </svg>
              </motion.div>
              <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, fontFamily: "var(--font-montserrat)" }}>Contestar</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Llamada activa — video de Aurelius ── */}
      <AnimatePresence>
        {callAnswered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{ position: "absolute", inset: 0, zIndex: 80, background: "#000" }}
          >
            {/* CSS keyframes para blink de etiqueta */}
            <style>{`
              @keyframes blink-red {
                0%, 49% { opacity: 1; }
                50%, 100% { opacity: 0; }
              }
            `}</style>

            {/* Video de fondo — siempre renderiza para que canvas pueda leerlo */}
            <video
              ref={callVideoRef}
              src="/videollamada-final.mp4"
              autoPlay
              playsInline
              onEnded={() => setVideoEnded(true)}
              style={{
                width: "100%", height: "100%", objectFit: "cover",
                opacity: (signalGlitch || videoEnded) ? 0 : 1,
              }}
            />

            {/* Canvas: video pixelado 480p simulado + ruido digital */}
            {signalGlitch && (
              <canvas
                ref={glitchCanvasRef}
                width={390}
                height={844}
                style={{
                  position: "absolute", inset: 0, width: "100%", height: "100%",
                  imageRendering: "pixelated",
                  zIndex: 1,
                }}
              />
            )}

            {/* Canvas: estática de señal perdida al terminar el video */}
            {videoEnded && (
              <canvas
                ref={noSignalCanvasRef}
                width={390}
                height={844}
                style={{
                  position: "absolute", inset: 0, width: "100%", height: "100%",
                  zIndex: 10,
                }}
              />
            )}

            {/* Pantalla VIP tras la estática */}
            {showVIP && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                style={{
                  position: "absolute", inset: 0, zIndex: 10,
                  background: "#000",
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", gap: 32,
                }}
              >
                <motion.button
                  initial={{ opacity: 0, scale: 0.9, boxShadow: "0 4px 20px rgba(212,175,55,0.25), 0 0 0px rgba(212,175,55,0)" }}
                  animate={{ opacity: 1, scale: 1, boxShadow: [
                    "0 4px 20px rgba(212,175,55,0.25), 0 0 0px rgba(212,175,55,0)",
                    "0 4px 40px rgba(212,175,55,0.55), 0 0 60px rgba(212,175,55,0.18)",
                    "0 4px 20px rgba(212,175,55,0.25), 0 0 0px rgba(212,175,55,0)",
                  ]}}
                  transition={{
                    opacity: { delay: 0.3, duration: 0.4 },
                    scale: { delay: 0.3, duration: 0.4 },
                    boxShadow: { delay: 0.3, duration: 2.4, repeat: Infinity, ease: "easeInOut" },
                  }}
                  whileHover={{ scale: 1.025, boxShadow: "0 6px 50px rgba(212,175,55,0.65)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { new Audio("/sounds/rise landing.mp3").play().catch(() => {}); onComplete?.(); }}
                  style={{
                    background: "linear-gradient(135deg, #D4AF37 0%, #F5D76E 50%, #D4AF37 100%)",
                    border: "none",
                    borderRadius: 14,
                    padding: "18px 48px",
                    fontSize: 18,
                    fontWeight: 700,
                    fontFamily: "var(--font-montserrat)",
                    letterSpacing: "0.06em",
                    color: "#000",
                    cursor: "pointer",
                  }}
                >
                  ACCESO VIP
                </motion.button>
              </motion.div>
            )}

            {/* Gradiente top */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 160,
              background: "linear-gradient(180deg, rgba(0,0,0,0.72) 0%, transparent 100%)",
              pointerEvents: "none",
            }} />

            {/* Gradiente bottom */}
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0, height: 200,
              background: "linear-gradient(0deg, rgba(0,0,0,0.78) 0%, transparent 100%)",
              pointerEvents: "none",
            }} />

            {/* ── TOP UI ── */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 2, padding: "14px 20px 0" }}>
              {/* Status bar */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ color: "white", fontSize: 15, fontWeight: 600, fontFamily: "var(--font-montserrat)" }}>
                  {new Date().getHours().toString().padStart(2,"0")}:{new Date().getMinutes().toString().padStart(2,"0")}
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 1 }}>
                    {[3,5,7,9].map((h,i) => <div key={i} style={{ width: 3, height: h, background: "white", borderRadius: 1, opacity: i < 3 ? 1 : 0.4 }} />)}
                  </div>
                  <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
                    <path d="M7.5 8.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" fill="white" />
                    <path d="M4.5 6.2C5.4 5.3 6.4 4.8 7.5 4.8s2.1.5 3 1.4" stroke="white" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                    <path d="M2 3.8C3.5 2.3 5.4 1.5 7.5 1.5s4 .8 5.5 2.3" stroke="white" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                  </svg>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ width: 24, height: 12, border: "1.5px solid rgba(255,255,255,0.8)", borderRadius: 3, padding: "1.5px", display: "flex", alignItems: "center" }}>
                      <div style={{ width: "78%", height: "100%", background: "white", borderRadius: 1.5 }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Nombre + timer */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 4 }}>
                <p style={{ color: "white", fontSize: 20, fontWeight: 500, fontFamily: "var(--font-montserrat)", margin: 0 }}>Aurelius</p>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, fontFamily: "var(--font-montserrat)", margin: "4px 0 0" }}>
                  {fmtTime(callSeconds)}
                </p>
                {signalLabel && (
                  <p style={{
                    color: "#FF3B30",
                    fontSize: 11,
                    fontFamily: "var(--font-mono, monospace)",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    margin: "5px 0 0",
                    animation: "blink-red 0.5s steps(1) infinite",
                    textTransform: "uppercase",
                  }}>
                    ● señal inestable
                  </p>
                )}
              </div>
            </div>

            {/* ── MINI SELFVIEW (esquina superior derecha) ── */}
            <div style={{
              position: "absolute", top: 100, right: 14, zIndex: 3,
              width: 72, height: 96, borderRadius: 12, overflow: "hidden",
              border: "2px solid rgba(255,255,255,0.3)",
              background: "#1a1a1a",
              boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {/* Video de la cámara del usuario */}
              <video
                ref={selfVideoRef}
                autoPlay
                playsInline
                muted
                style={{
                  width: "100%", height: "100%", objectFit: "cover",
                  display: camOff ? "none" : "block",
                  transform: "scaleX(-1)",
                }}
              />
              {camOff && (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="rgba(255,255,255,0.3)">
                  <path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4z"/>
                </svg>
              )}
            </div>

            {/* ── BOTTOM CONTROLS ── */}
            <div style={{
              position: "absolute", bottom: 44, left: 0, right: 0, zIndex: 2,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 20,
            }}>
              {/* Micrófono — deshabilitado */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: "50%",
                  background: "rgba(255,255,255,0.08)",
                  backdropFilter: "blur(12px)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  opacity: 0.35,
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                    <rect x="9" y="2" width="6" height="12" rx="3"/>
                    <path d="M19 10a7 7 0 0 1-14 0M12 19v3M9 22h6"/>
                  </svg>
                </div>
                <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, fontFamily: "var(--font-montserrat)" }}>Silencio</span>
              </div>

              {/* Colgar — deshabilitado */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{
                  width: 68, height: 68, borderRadius: "50%",
                  background: "#FF3B30",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  opacity: 0.35,
                }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                    <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02L6.6 10.8z"/>
                  </svg>
                </div>
                <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, fontFamily: "var(--font-montserrat)" }}>Colgar</span>
              </div>

              {/* Cámara — activa getUserMedia */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <motion.div
                  onClick={toggleCam}
                  whileTap={{ scale: 0.9 }}
                  style={{
                    width: 56, height: 56, borderRadius: "50%",
                    background: camOff ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.18)",
                    backdropFilter: "blur(12px)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={camOff ? "#000" : "white"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4z"/>
                    {camOff && <line x1="1" y1="1" x2="23" y2="23"/>}
                  </svg>
                </motion.div>
                <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, fontFamily: "var(--font-montserrat)" }}>
                  {camOff ? "Cámara" : "Cámara"}
                </span>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}

function TikTokFeed({ devSubStage, onComplete }: { devSubStage?: WhatsAppSubStage; onComplete?: () => void }) {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const activeIdxRef = useRef(0);
  const [liked, setLiked] = useState<boolean[]>([false, false, false]);
  const [bookmarked, setBookmarked] = useState<boolean[]>([false, false, false]);
  const [openComments, setOpenComments] = useState<number | null>(null);
  const [ended, setEnded] = useState<boolean[]>([false, false, false]);
  const [showNotif, setShowNotif] = useState(false);
  const [showAurelius, setShowAurelius] = useState(() => devSubStage === "aurelius-chat" || devSubStage === "video-call");
  const [likedComments, setLikedComments] = useState<Record<string, boolean>>({});
  const [commentLikes, setCommentLikes] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    COMMENTS_BY_VIDEO.forEach((arr, vi) => arr.forEach((c, ci) => { init[`${vi}-${ci}`] = c.likes; }));
    return init;
  });

  function toggleCommentLike(vi: number, ci: number) {
    const key = `${vi}-${ci}`;
    setLikedComments(prev => {
      const next = { ...prev, [key]: !prev[key] };
      setCommentLikes(lk => ({ ...lk, [key]: lk[key] + (next[key] ? 1 : -1) }));
      return next;
    });
  }

  // Play active video, pause others
  const syncPlay = useCallback((idx: number) => {
    if (showAureliusRef.current) return;
    activeIdxRef.current = idx;
    setActiveIdx(idx);
    setEnded(prev => prev.map((_, i) => i === idx ? false : prev[i]));
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === idx) { v.currentTime = 0; v.play().catch(() => {}); }
      else { v.pause(); v.currentTime = 0; }
    });
  }, []);

  // Auto-play first video on mount — solo si AureliusChat no está visible
  useEffect(() => {
    if (!showAurelius) syncPlay(0);
  }, [syncPlay, showAurelius]);

  // Ref para saber si el video activo ya terminó (necesario dentro del listener)
  const endedRef = useRef<boolean[]>([false, false, false]);
  // Ref que el IntersectionObserver lee para no reproducir si Aurelius está visible
  const showAureliusRef = useRef(showAurelius);

  // Bloquear scroll con preventDefault (sin glitch visual)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const idx = activeIdxRef.current;
      const dy = touchStartY - e.touches[0].clientY;
      if (dy > 0 && !endedRef.current[idx]) { e.preventDefault(); return; }
      if (dy < 0 && idx >= 1) { e.preventDefault(); return; }
    };

    const handleWheel = (e: WheelEvent) => {
      const idx = activeIdxRef.current;
      if (e.deltaY > 0 && !endedRef.current[idx]) { e.preventDefault(); return; }
      if (e.deltaY < 0 && idx >= 1) { e.preventDefault(); return; }
    };

    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchmove", handleTouchMove, { passive: false });
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove", handleTouchMove);
      el.removeEventListener("wheel", handleWheel);
    };
  }, []);

  // IntersectionObserver — detect which slide is in view
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !showAureliusRef.current) {
            syncPlay(i);
          }
        },
        { threshold: 0.6 }
      );
      obs.observe(v);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, [syncPlay]);

  // Pausa todos los videos cuando AureliusChat toma el control (flujo normal o dev nav)
  useEffect(() => {
    showAureliusRef.current = showAurelius;
    if (!showAurelius) return;
    videoRefs.current.forEach(v => { if (v) v.pause(); });
  }, [showAurelius]);

  // Cleanup: pausa y libera todos los videos al desmontar el feed
  useEffect(() => {
    return () => {
      videoRefs.current.forEach(v => {
        if (!v) return;
        v.pause();
        v.src = "";
        v.load();
      });
    };
  }, []);

  return (
    <motion.div
      style={{
        position: "absolute", inset: 0, zIndex: 25,
        background: "#000",
        overflow: "hidden",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      {/* Top bar — absolute dentro del contenedor 9:16 */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, zIndex: 30,
        display: "flex", alignItems: "center", justifyContent: "center",
        paddingTop: 44, paddingBottom: 8,
        background: "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 100%)",
        pointerEvents: "none",
      }}>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 16, fontWeight: 600, fontFamily: "var(--font-montserrat)" }}>Siguiendo</span>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <span style={{ color: "#fff", fontSize: 16, fontWeight: 700, fontFamily: "var(--font-montserrat)" }}>Para ti</span>
            <div style={{ width: 20, height: 2, background: "#fff", borderRadius: 2 }} />
          </div>
          <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 16, fontWeight: 600, fontFamily: "var(--font-montserrat)" }}>Explora</span>
        </div>
        {/* Search icon */}
        <div style={{ position: "absolute", right: 16, top: 44 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
        </div>
      </div>

      {/* Scroll container — ocupa todo menos el nav inferior */}
      <div ref={scrollRef} style={{
        position: "absolute", top: 0, left: 0, right: 0, bottom: 56,
        overflowY: "scroll",
        scrollSnapType: "y mandatory",
        WebkitOverflowScrolling: "touch",
      }}>
      {/* Video slides */}
      {FEED_VIDEOS.map((item, i) => (
        <div
          key={i}
          style={{
            position: "relative",
            width: "100%", height: "calc(100vh - 56px)",
            scrollSnapAlign: "start",
            scrollSnapStop: "always",
            flexShrink: 0,
            overflow: "hidden",
          }}
        >
          {/* Video */}
          <video
            ref={el => { videoRefs.current[i] = el; }}
            src={item.src}
            muted={false}
            playsInline
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onEnded={() => {
              setEnded(prev => {
                const n = [...prev]; n[i] = true;
                endedRef.current = n;
                return n;
              });
              if (i === FEED_VIDEOS.length - 1) {
                setTimeout(() => {
                  new Audio("/sounds/tap mensaje.mp3").play().catch(() => {});
                  setShowNotif(true);
                }, 800);
              }
            }}
          />

          {/* Indicadores de video — izquierda centro */}
          <div style={{
            position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
            zIndex: 10,
          }}>
            {FEED_VIDEOS.map((_, di) => (
              <motion.div
                key={di}
                animate={{ height: activeIdx === di ? 28 : 8, opacity: activeIdx === di ? 1 : 0.35 }}
                transition={{ duration: 0.3 }}
                style={{
                  width: 3, borderRadius: 2,
                  background: activeIdx === di ? "#fff" : "rgba(255,255,255,0.6)",
                }}
              />
            ))}
          </div>

          {/* Swipe up hint — aparece cuando el video termina (solo si no es el último) */}
          <AnimatePresence>
            {ended[i] && i < FEED_VIDEOS.length - 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  position: "absolute", inset: 0, zIndex: 11,
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  pointerEvents: "none",
                }}
              >
                <motion.div
                  animate={{ y: [0, -18, 0] }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="white" style={{ opacity: 0.9 }}>
                    <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
                  </svg>
                  <span style={{
                    color: "#fff", fontSize: 13, fontWeight: 600, letterSpacing: "0.1em",
                    fontFamily: "var(--font-montserrat)", textShadow: "0 2px 8px rgba(0,0,0,0.8)",
                  }}>
                    Desliza hacia arriba
                  </span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Gradient overlay bottom */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: "55%",
            background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)",
            pointerEvents: "none",
          }} />

          {/* Right actions */}
          <div style={{
            position: "absolute", right: 12, bottom: 20,
            display: "flex", flexDirection: "column", alignItems: "center", gap: 20,
          }}>
            {/* Avatar + follow */}
            <div style={{ position: "relative", marginBottom: 8 }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", border: "2px solid #fff", overflow: "hidden", background: "#333" }}>
                <img src="/aurelius-perfil.jpg" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{
                position: "absolute", bottom: -8, left: "50%", transform: "translateX(-50%)",
                width: 20, height: 20, borderRadius: "50%",
                background: "#EE1D52", display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ color: "#fff", fontSize: 14, lineHeight: 1 }}>+</span>
              </div>
            </div>

            {/* Like */}
            <motion.div
              onClick={() => setLiked(prev => { const n = [...prev]; n[i] = !n[i]; return n; })}
              whileTap={{ scale: 1.3 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer" }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill={liked[i] ? "#EE1D52" : "white"}>
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <span style={{ color: "#fff", fontSize: 12, fontWeight: 600, fontFamily: "var(--font-montserrat)" }}>{item.likes}</span>
            </motion.div>

            {/* Comment */}
            <motion.div
              onClick={() => setOpenComments(i)}
              whileTap={{ scale: 1.2 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer" }}
            >
              <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
                <path d="M21 6.5C21 5.12 19.88 4 18.5 4h-13C4.12 4 3 5.12 3 6.5v8C3 15.88 4.12 17 5.5 17H7v3.5l3.5-3.5H18.5C19.88 17 21 15.88 21 14.5v-8z"/>
              </svg>
              <span style={{ color: "#fff", fontSize: 12, fontWeight: 600, fontFamily: "var(--font-montserrat)" }}>{item.comments}</span>
            </motion.div>

            {/* Bookmark */}
            <motion.div
              onClick={() => setBookmarked(prev => { const n = [...prev]; n[i] = !n[i]; return n; })}
              whileTap={{ scale: 1.3 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer" }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill={bookmarked[i] ? "#FFD700" : "white"}>
                <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
              </svg>
              <span style={{ color: "#fff", fontSize: 12, fontWeight: 600, fontFamily: "var(--font-montserrat)" }}>{item.bookmarks}</span>
            </motion.div>

            {/* Share */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
              </svg>
              <span style={{ color: "#fff", fontSize: 12, fontWeight: 600, fontFamily: "var(--font-montserrat)" }}>{item.shares}</span>
            </div>

            {/* Spinning music disc */}
            <motion.div
              animate={{ rotate: activeIdx === i ? 360 : 0 }}
              transition={{ duration: 4, repeat: activeIdx === i ? Infinity : 0, ease: "linear" }}
              style={{
                width: 44, height: 44, borderRadius: "50%",
                border: "3px solid #fff",
                overflow: "hidden", background: "#111",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <img src="/aurelius-perfil.jpg" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </motion.div>
          </div>

          {/* Bottom info */}
          <div style={{
            position: "absolute", bottom: 20, left: 12, right: 80,
          }}>
            <p style={{ color: "#fff", fontSize: 15, fontWeight: 700, margin: "0 0 6px", fontFamily: "var(--font-montserrat)" }}>
              {item.user}
            </p>
            <p style={{ color: "#fff", fontSize: 13, margin: "0 0 10px", lineHeight: 1.4, fontFamily: "var(--font-montserrat)" }}>
              {item.desc}
            </p>
            {/* Music row */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
              </svg>
              <span style={{ color: "#fff", fontSize: 12, fontFamily: "var(--font-montserrat)" }}>{item.music}</span>
            </div>
          </div>
        </div>
      ))}
      </div>{/* fin scroll container */}

      {/* Bottom nav — absolute dentro del contenedor 9:16 */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 30,
        height: 56,
        background: "rgba(0,0,0,0.92)",
        display: "flex", alignItems: "center", justifyContent: "space-around",
        borderTop: "1px solid rgba(255,255,255,0.08)",
      }}>
        {[
          { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>, label: "Inicio", active: true },
          { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="rgba(255,255,255,0.45)"><path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>, label: "Buscar", active: false },
          { icon: (
              <div style={{ width: 42, height: 28, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ position: "absolute", width: 38, height: 26, background: "#69C9D0", borderRadius: 6, left: 4 }} />
                <div style={{ position: "absolute", width: 38, height: 26, background: "#EE1D52", borderRadius: 6, right: 4 }} />
                <div style={{ position: "relative", width: 38, height: 26, background: "#fff", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 20, color: "#000", fontWeight: 300 }}>+</span>
                </div>
              </div>
            ), label: "", active: false },
          { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="rgba(255,255,255,0.45)"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>, label: "Bandeja", active: false },
          { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="rgba(255,255,255,0.45)"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>, label: "Perfil", active: false },
        ].map(({ icon, label, active }, idx) => (
          <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, cursor: "pointer" }}>
            {icon}
            {label && <span style={{ fontSize: 10, color: active ? "#fff" : "rgba(255,255,255,0.45)", fontFamily: "var(--font-montserrat)" }}>{label}</span>}
          </div>
        ))}
      </div>

      {/* Comments panel */}
      <AnimatePresence>
        {openComments !== null && (
          <>
            {/* Backdrop */}
            <motion.div
              onClick={() => setOpenComments(null)}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: "absolute", inset: 0, zIndex: 40, background: "rgba(0,0,0,0.5)" }}
            />
            {/* Sheet */}
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ duration: 0.32, ease: [0.25, 1, 0.5, 1] }}
              style={{
                position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 41,
                height: "70vh",
                background: "#1a1a1a",
                borderRadius: "16px 16px 0 0",
                display: "flex", flexDirection: "column",
                fontFamily: "var(--font-montserrat)",
              }}
            >
              {/* Handle */}
              <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0" }}>
                <div style={{ width: 36, height: 4, borderRadius: 2, background: "#444" }} />
              </div>

              {/* Header */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "12px 16px 10px", borderBottom: "1px solid #2a2a2a",
              }}>
                <span style={{ color: "#fff", fontSize: 15, fontWeight: 700 }}>
                  {FEED_VIDEOS[openComments].comments} comentarios
                </span>
                <motion.div
                  onClick={() => setOpenComments(null)}
                  whileTap={{ scale: 0.9 }}
                  style={{ cursor: "pointer", padding: 4 }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="rgba(255,255,255,0.6)">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </motion.div>
              </div>

              {/* Comment list */}
              <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
                {COMMENTS_BY_VIDEO[openComments].map((c, ci) => {
                  const key = `${openComments}-${ci}`;
                  const isLiked = !!likedComments[key];
                  const avatarId = (openComments * 10 + ci + 1) * 7 % 70 + 1;
                  return (
                    <motion.div
                      key={ci}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: ci * 0.06, duration: 0.25 }}
                      style={{ display: "flex", gap: 12, padding: "10px 16px", alignItems: "flex-start" }}
                    >
                      <div style={{
                        width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                        overflow: "hidden", background: "#333",
                      }}>
                        <img
                          src={`https://i.pravatar.cc/72?img=${avatarId}`}
                          alt=""
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <span style={{ color: "#aaa", fontSize: 12, display: "block", marginBottom: 3 }}>@{c.user}</span>
                        <span style={{ color: "#fff", fontSize: 13, lineHeight: 1.45 }}>{c.text}</span>
                      </div>
                      <motion.div
                        onClick={() => toggleCommentLike(openComments, ci)}
                        whileTap={{ scale: 1.35 }}
                        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, flexShrink: 0, cursor: "pointer", paddingTop: 2 }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill={isLiked ? "#EE1D52" : "rgba(255,255,255,0.4)"}>
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                        <span style={{ color: isLiked ? "#EE1D52" : "rgba(255,255,255,0.4)", fontSize: 10 }}>
                          {commentLikes[key]}
                        </span>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Notificación iOS banner — aparece al terminar video 3 ── */}
      <AnimatePresence>
        {showNotif && !showAurelius && (
          <motion.div
            initial={{ y: -120, opacity: 0 }}
            animate={{
              y: 0,
              opacity: [0, 1],
              boxShadow: [
                "0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.25), 0 0 0px rgba(255,255,255,0)",
                "0 8px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.4), 0 0 28px rgba(255,255,255,0.18)",
                "0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.25), 0 0 0px rgba(255,255,255,0)",
              ],
              border: [
                "1px solid rgba(255,255,255,0.22)",
                "1px solid rgba(255,255,255,0.6)",
                "1px solid rgba(255,255,255,0.22)",
              ],
            }}
            exit={{ y: -120, opacity: 0 }}
            transition={{
              y: { duration: 0.5, ease: [0.23, 1, 0.32, 1] },
              opacity: { duration: 0.5 },
              boxShadow: { delay: 0.5, duration: 1.1, repeat: Infinity, ease: "easeInOut" },
              border: { delay: 0.5, duration: 1.1, repeat: Infinity, ease: "easeInOut" },
            }}
            onClick={() => { new Audio("/sounds/tap boton.mp3").play().catch(() => {}); setShowNotif(false); setShowAurelius(true); }}
            style={{
              position: "absolute", top: 12, left: 12, right: 12, zIndex: 60,
              backdropFilter: "blur(40px) saturate(1.8)",
              WebkitBackdropFilter: "blur(40px) saturate(1.8)",
              borderRadius: 20,
              border: "1px solid rgba(255,255,255,0.22)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.25)",
              background: "rgba(30,30,30,0.82)",
              padding: "10px 14px",
              display: "flex", alignItems: "center", gap: 11,
              cursor: "pointer",
            }}
          >
            {/* Icono WhatsApp */}
            <div style={{
              width: 44, height: 44, borderRadius: 12, background: "#25D366",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, boxShadow: "0 2px 8px rgba(37,211,102,0.4)",
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.128.558 4.159 1.535 5.903L0 24l6.293-1.504A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.007-1.373l-.36-.214-3.733.891.933-3.632-.235-.374A9.818 9.818 0 0 1 2.182 12C2.182 6.578 6.578 2.182 12 2.182S21.818 6.578 21.818 12 17.422 21.818 12 21.818z" />
              </svg>
            </div>
            {/* Texto */}
            <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#fff", fontFamily: "var(--font-montserrat)" }}>Aurelius</span>
                <motion.span
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1.1, ease: "easeInOut" }}
                  style={{ fontSize: 10, fontWeight: 700, color: "#FF3B30", fontFamily: "var(--font-montserrat)", letterSpacing: "0.05em", textTransform: "uppercase" }}
                >
                  ● Mensaje urgente
                </motion.span>
              </div>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", fontFamily: "var(--font-montserrat)", marginTop: 2 }}>
                no puedo tardar mucho...
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Chat de Aurelius ── */}
      <AnimatePresence>
        {showAurelius && <AureliusChat devSubStage={devSubStage} onComplete={onComplete} />}
      </AnimatePresence>

    </motion.div>
  );
}
