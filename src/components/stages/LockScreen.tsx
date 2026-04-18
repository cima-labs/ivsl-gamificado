"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LockScreenProps {
  onOpen: () => void;
}

export default function LockScreen({ onOpen }: LockScreenProps) {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [notifVisible, setNotifVisible] = useState(false);
  const [pressed, setPressed] = useState(false);
  const tapRef = typeof window !== "undefined" ? (() => { const a = document.createElement("audio"); a.src = "/sounds/tap boton.mp3"; return a; })() : null;

  useEffect(() => {
    function tick() {
      const now = new Date();
      const h = now.getHours().toString().padStart(2, "0");
      const m = now.getMinutes().toString().padStart(2, "0");
      setTime(`${h}:${m}`);
      const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
      const months = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
      setDate(`${days[now.getDay()]}, ${now.getDate()} de ${months[now.getMonth()]}`);
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      setNotifVisible(true);
      const sfx = new Audio("/sounds/tap mensaje.mp3");
      sfx.play().catch(() => {});
    }, 1000);
    return () => clearTimeout(t);
  }, []);

  function handleNotifPress() {
    tapRef?.play().catch(() => {});
    setPressed(true);
    setTimeout(onOpen, 350);
  }

  return (
    <motion.div
      className="absolute inset-0 flex flex-col"
      style={{ overflow: "hidden" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Fondo Aurelius */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('/aurelius lockscreen.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          zIndex: 0,
        }}
      />

      {/* Velo oscuro sutil para legibilidad */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0.08) 40%, rgba(0,0,0,0.28) 100%)",
          zIndex: 1,
        }}
      />

      {/* Contenido */}
      <div className="relative flex flex-col items-center w-full h-full" style={{ zIndex: 2 }}>

        {/* Status bar iOS 26 */}
        <div className="w-full flex justify-between items-center px-6 pt-3">
          <span style={{
            fontSize: 15,
            fontWeight: 600,
            color: "white",
            fontFamily: "var(--font-montserrat)",
            textShadow: "0 1px 4px rgba(0,0,0,0.4)",
          }}>
            {time}
          </span>
          <div className="flex items-center gap-2">
            {/* Signal */}
            <div className="flex items-end gap-px">
              {[3, 5, 7, 9].map((h, i) => (
                <div key={i} style={{
                  width: 3, height: h,
                  background: "white",
                  borderRadius: 1,
                  opacity: i < 3 ? 1 : 0.4,
                }} />
              ))}
            </div>
            {/* WiFi */}
            <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
              <path d="M7.5 8.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" fill="white" />
              <path d="M4.5 6.2C5.4 5.3 6.4 4.8 7.5 4.8s2.1.5 3 1.4" stroke="white" strokeWidth="1.2" strokeLinecap="round" fill="none" />
              <path d="M2 3.8C3.5 2.3 5.4 1.5 7.5 1.5s4 .8 5.5 2.3" stroke="white" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            </svg>
            {/* Battery */}
            <div className="flex items-center gap-0.5">
              <div style={{
                width: 24, height: 12,
                border: "1.5px solid rgba(255,255,255,0.8)",
                borderRadius: 3,
                padding: "1.5px",
                display: "flex",
                alignItems: "center",
              }}>
                <div style={{ width: "78%", height: "100%", background: "white", borderRadius: 1.5 }} />
              </div>
              <div style={{ width: 2, height: 5, background: "rgba(255,255,255,0.6)", borderRadius: 1 }} />
            </div>
          </div>
        </div>

        {/* Dynamic Island */}
        <div style={{
          width: 120, height: 34,
          background: "#000",
          borderRadius: 20,
          marginTop: 2,
          boxShadow: "0 2px 12px rgba(0,0,0,0.5)",
        }} />

        {/* Hora grande — estilo iOS 26 (peso ultra-light) */}
        <motion.div
          className="flex flex-col items-center mt-8"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <p style={{
            fontSize: "clamp(5.5rem, 24vw, 7.5rem)",
            fontWeight: 100,
            color: "white",
            fontFamily: "var(--font-montserrat)",
            letterSpacing: "-0.04em",
            lineHeight: 1,
            textShadow: "0 2px 16px rgba(0,0,0,0.35)",
          }}>
            {time}
          </p>
          <p style={{
            fontSize: 15,
            fontWeight: 400,
            color: "rgba(255,255,255,0.82)",
            fontFamily: "var(--font-montserrat)",
            marginTop: 6,
            letterSpacing: "0.01em",
            textShadow: "0 1px 6px rgba(0,0,0,0.4)",
          }}>
            {date}
          </p>
        </motion.div>

        {/* Notificación WhatsApp — liquid glass iOS 26 */}
        <div className="w-full px-4" style={{ marginTop: "30vh" }}>
          <AnimatePresence>
            {notifVisible && (
              <motion.div
                initial={{ opacity: 0, y: -60, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: pressed ? 0.96 : 1 }}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                onClick={handleNotifPress}
                style={{
                  backdropFilter: "blur(40px) saturate(1.8)",
                  WebkitBackdropFilter: "blur(40px) saturate(1.8)",
                  borderRadius: 20,
                  border: "1px solid rgba(255,255,255,0.28)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.35)",
                  background: "rgba(255,255,255,0.18)",
                  padding: "13px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: 11,
                  cursor: "pointer",
                }}
              >
                {/* Icono WhatsApp con liquid glass */}
                <div style={{
                  width: 44, height: 44,
                  borderRadius: 12,
                  background: "#25D366",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: "0 2px 8px rgba(37,211,102,0.4)",
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.128.558 4.159 1.535 5.903L0 24l6.293-1.504A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.007-1.373l-.36-.214-3.733.891.933-3.632-.235-.374A9.818 9.818 0 0 1 2.182 12C2.182 6.578 6.578 2.182 12 2.182S21.818 6.578 21.818 12 17.422 21.818 12 21.818z" />
                  </svg>
                </div>

                {/* Texto */}
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "white",
                      fontFamily: "var(--font-montserrat)",
                      textShadow: "0 1px 3px rgba(0,0,0,0.2)",
                    }}>
                      La Analista
                    </span>
                    <span style={{
                      fontSize: 11,
                      color: "rgba(255,255,255,0.6)",
                      fontFamily: "var(--font-montserrat)",
                    }}>
                      ahora
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="rgba(255,255,255,0.6)" style={{ display: "block", flexShrink: 0 }}>
                      <path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4z" />
                    </svg>
                    <span style={{ fontSize: 13, lineHeight: "13px", color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-montserrat)" }}>
                      Mensaje de video
                    </span>
                    <span style={{ fontSize: 13, lineHeight: "13px", color: "rgba(255,255,255,0.38)", fontFamily: "var(--font-montserrat)" }}>
                      0:59
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Barra inferior */}
        <motion.div
          className="w-full flex flex-col items-center gap-2 pb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.8 }}
        >
          {/* Texto toca para abrir */}
          <p style={{
            fontSize: 12,
            color: "rgba(255,255,255,0.55)",
            fontFamily: "var(--font-montserrat)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}>
            Toca para abrir
          </p>

          {/* Home indicator */}
          <div style={{
            width: 134, height: 5,
            background: "rgba(255,255,255,0.6)",
            borderRadius: 3,
          }} />
        </motion.div>
      </div>
    </motion.div>
  );
}
