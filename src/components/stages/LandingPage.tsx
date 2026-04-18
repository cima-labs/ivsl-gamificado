"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, type Transition } from "framer-motion";

const PURCHASE_URL_VITALICIO = "#";
const PURCHASE_URL_ANUAL = "#";

// ── Paleta dorada ─────────────────────────────────────────────────────────────
const NEON_CYAN   = "#D4AF37";
const NEON_BLUE   = "#BF953F";
const NEON_PURPLE = "#AA771C";

// ── Texto dorado con gradiente elegante ───────────────────────────────────────
const GOLD_TEXT: React.CSSProperties = {
  background: "linear-gradient(135deg, #BF953F 0%, #FCF6BA 50%, #AA771C 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

const fadeUpTransition: Transition = { duration: 0.6, ease: "easeOut" };
const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: fadeUpTransition,
};

// ── Botón gold estándar del proyecto ──────────────────────────────────────────
function GoldButton({ children, onClick, href }: { children: React.ReactNode; onClick?: () => void; href?: string }) {
  const el = (
    <motion.button
      initial={{ boxShadow: "0 4px 20px rgba(212,175,55,0.25), 0 0 0px rgba(212,175,55,0)" }}
      animate={{ boxShadow: [
        "0 4px 20px rgba(212,175,55,0.25), 0 0 0px rgba(212,175,55,0)",
        "0 4px 40px rgba(212,175,55,0.55), 0 0 60px rgba(212,175,55,0.18)",
        "0 4px 20px rgba(212,175,55,0.25), 0 0 0px rgba(212,175,55,0)",
      ]}}
      transition={{ boxShadow: { duration: 2.4, repeat: Infinity, ease: "easeInOut" } }}
      whileHover={{ scale: 1.025, boxShadow: "0 6px 50px rgba(212,175,55,0.65)" }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      style={{
        background: "linear-gradient(135deg, #BF953F 0%, #FCF6BA 50%, #AA771C 100%)",
        border: "none", borderRadius: 50, padding: "16px 40px",
        fontSize: 15, fontWeight: 700, fontFamily: "var(--font-montserrat)",
        letterSpacing: "0.08em", color: "#000", cursor: "pointer", width: "100%",
      }}
    >
      {children}
    </motion.button>
  );
  if (href && href !== "#") {
    return <a href={href} target="_blank" rel="noopener noreferrer" style={{ display: "block", width: "100%" }}>{el}</a>;
  }
  return el;
}

// ── Botón verde WhatsApp ───────────────────────────────────────────────────────
function GreenButton({ children, href }: { children: React.ReactNode; href?: string }) {
  const el = (
    <motion.button
      initial={{ boxShadow: "0 4px 20px rgba(37,211,102,0.25), 0 0 0px rgba(37,211,102,0)" }}
      animate={{ boxShadow: [
        "0 4px 20px rgba(37,211,102,0.25), 0 0 0px rgba(37,211,102,0)",
        "0 4px 40px rgba(37,211,102,0.55), 0 0 60px rgba(37,211,102,0.18)",
        "0 4px 20px rgba(37,211,102,0.25), 0 0 0px rgba(37,211,102,0)",
      ]}}
      transition={{ boxShadow: { duration: 2.4, repeat: Infinity, ease: "easeInOut" } }}
      whileHover={{ scale: 1.025, boxShadow: "0 6px 50px rgba(37,211,102,0.65)" }}
      whileTap={{ scale: 0.97 }}
      style={{
        background: "#25D366", border: "none", borderRadius: 50,
        padding: "16px 40px", fontSize: 15, fontWeight: 700,
        fontFamily: "var(--font-montserrat)", letterSpacing: "0.08em",
        color: "#000", cursor: "pointer", width: "100%",
      }}
    >
      {children}
    </motion.button>
  );
  if (href && href !== "#") {
    return <a href={href} target="_blank" rel="noopener noreferrer" style={{ display: "block", width: "100%" }}>{el}</a>;
  }
  return el;
}

// ── Divisor neon con animación de scroll ──────────────────────────────────────
function ScrollHint({ prefix }: { prefix: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
      <motion.span
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{ fontFamily: "var(--font-montserrat)", fontSize: 8, letterSpacing: "0.25em", color: "#fff", textTransform: "uppercase", marginBottom: 3 }}
      >desliza</motion.span>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0, 1, 0], y: [0, 6, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.22, ease: "easeInOut" }}
        >
          <svg width="14" height="8" viewBox="0 0 14 8" fill="none" style={{ display: "block" }}>
            <polyline points="1,1 7,7 13,1" fill="none" stroke={`url(#${prefix}${i})`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <defs>
              <linearGradient id={`${prefix}${i}`} x1="0" y1="0" x2="14" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor={NEON_CYAN} />
                <stop offset="100%" stopColor={NEON_PURPLE} />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

function NeonDivider({ hint = true, id = "d" }: { hint?: boolean; id?: string }) {
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ width: "100%", height: 1, background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.5), rgba(252,246,186,0.4), rgba(212,175,55,0.5), transparent)" }} />
      {hint && (
        <div style={{ padding: "8px 0" }}>
          <ScrollHint prefix={id} />
        </div>
      )}
      <div style={{ width: "100%", height: 1, background: "linear-gradient(90deg, transparent, rgba(170,119,28,0.4), rgba(212,175,55,0.5), rgba(170,119,28,0.4), transparent)" }} />
    </div>
  );
}

// ── Section Header reutilizable ───────────────────────────────────────────────
function SectionHeader({ label, title, subtitle }: { label: string; title: string; subtitle?: string }) {
  const fadeUpTransition: Transition = { duration: 0.6, ease: "easeOut" };
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={fadeUpTransition}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%" }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 28, height: 1, background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.6))" }} />
        <span style={{
          fontFamily: "var(--font-montserrat)", fontSize: 10, fontWeight: 700,
          letterSpacing: "0.25em", textTransform: "uppercase" as const, ...GOLD_TEXT,
        }}>{label}</span>
        <div style={{ width: 28, height: 1, background: "linear-gradient(90deg, rgba(212,175,55,0.6), transparent)" }} />
      </div>
      <motion.h2
        animate={{ backgroundPosition: ["-200% center", "200% center"] }}
        transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 1.2, ease: "linear" }}
        style={{
          fontFamily: "var(--font-playfair)", fontSize: "clamp(20px, 5.5vw, 28px)",
          fontWeight: 700, textAlign: "center" as const, lineHeight: 1.2, margin: 0,
          letterSpacing: "0.04em",
          background: "linear-gradient(90deg, #AA771C 0%, #BF953F 15%, #AA771C 30%, #D4AF37 40%, #FCF6BA 48%, #FFFEF0 50%, #FCF6BA 52%, #D4AF37 60%, #AA771C 70%, #BF953F 85%, #AA771C 100%)",
          backgroundSize: "300% 100%",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >{title}</motion.h2>
      {subtitle && (
        <p style={{
          fontFamily: "var(--font-montserrat)", fontSize: 11.5,
          color: "rgba(255,255,255,0.45)", textAlign: "center", margin: 0, letterSpacing: "0.04em",
        }}>{subtitle}</p>
      )}
    </motion.div>
  );
}

// ── FAQ Item ───────────────────────────────────────────────────────────────────
function FaqItem({ question, answer, index }: { question: string; answer: React.ReactNode; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: "easeOut" }}
      style={{
        borderRadius: 14,
        border: open ? "1px solid rgba(212,175,55,0.35)" : "1px solid rgba(212,175,55,0.12)",
        background: open ? "rgba(212,175,55,0.05)" : "rgba(5,10,24,0.7)",
        boxShadow: open ? "0 0 24px rgba(212,175,55,0.08)" : "none",
        overflow: "hidden",
        transition: "border-color 0.25s, background 0.25s, box-shadow 0.25s",
      }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", background: "none", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", gap: 12,
          padding: "16px 16px",
        }}
      >
        {/* Número */}
        <span style={{
          fontFamily: "var(--font-playfair)", fontSize: 11, fontWeight: 700,
          background: "linear-gradient(135deg, #BF953F 0%, #FCF6BA 50%, #AA771C 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          backgroundClip: "text", flexShrink: 0, letterSpacing: "0.05em",
          opacity: open ? 1 : 0.6, transition: "opacity 0.25s",
        }}>0{index + 1}</span>

        {/* Separador vertical */}
        <div style={{ width: 1, height: 16, background: "rgba(212,175,55,0.25)", flexShrink: 0 }} />

        <span style={{
          fontFamily: "var(--font-montserrat)", fontSize: 12, fontWeight: 600,
          color: open ? "#fff" : "rgba(255,255,255,0.75)",
          letterSpacing: "0.03em", textAlign: "left", flex: 1,
          transition: "color 0.25s",
        }}>{question}</span>

        {/* Ícono +/− */}
        <motion.div
          animate={{ rotate: open ? 45 : 0, backgroundColor: open ? "rgba(212,175,55,0.2)" : "rgba(255,255,255,0.05)" }}
          transition={{ duration: 0.22 }}
          style={{
            width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
            border: "1px solid rgba(212,175,55,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <line x1="5" y1="1" x2="5" y2="9" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="1" y1="5" x2="9" y2="5" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ padding: "0 16px 16px 44px" }}>
              <div style={{ width: "100%", height: 1, background: "rgba(212,175,55,0.1)", marginBottom: 12 }} />
              <p style={{
                fontFamily: "var(--font-montserrat)", fontSize: 11.5,
                color: "rgba(255,255,255,0.62)", lineHeight: 1.7, margin: 0,
              }}>{answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Componente principal ───────────────────────────────────────────────────────
export default function LandingPage() {
  const ofertaRef = useRef<HTMLDivElement>(null);

  const [expiryDate, setExpiryDate] = useState("");
  const [lote2Date, setLote2Date] = useState("");

  useEffect(() => {
    const key = "ivsl_offer_start";
    const stored = parseInt(localStorage.getItem(key) || "0", 10);
    const start = stored > 1000000000000 ? stored : Date.now();
    if (!stored || stored < 1000000000000) localStorage.setItem(key, String(start));
    const months = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
    const fmt = (d: Date) => `${d.getDate()} de ${months[d.getMonth()]} de ${d.getFullYear()}`;
    setExpiryDate(fmt(new Date(start)));
    setLote2Date(fmt(new Date(start + 24 * 60 * 60 * 1000)));
  }, []);

  const G = (t: string) => <span style={{ ...GOLD_TEXT, fontWeight: 700 }}>{t}</span>;
  const Gv = (t: string) => <span style={{ color: "#4ADE80", fontWeight: 700 }}>{t}</span>;

  const agents: { num: string; title: string; desc: React.ReactNode; icon: (color: string) => React.ReactElement; glow: string }[] = [
    {
      num: "01",
      title: "AGENTE ARQUITECTO DE NICHO",
      desc: <>Le describes tu oferta y tu público. Él te devuelve el {G("avatar ideal")}, sus {G("miedos y deseos")}, el {G("gancho central")} y la {G("estructura completa del embudo")} adaptada a tu nicho.</>,
      icon: (color: string) => (
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={{ display: "block" }}>
          <polygon points="10,2 19,18 1,18" fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
        </svg>
      ),
      glow: NEON_CYAN,
    },
    {
      num: "02",
      title: "AGENTE COPYWRITER",
      desc: <>Toma la arquitectura del Agente 1 y escribe {G("todos los scripts")}: el video de tensión, la llamada, las preguntas de cualificación, los diálogos de WhatsApp, la videollamada y el {G("copy de la landing")}. Todo listo para usar.</>,
      icon: (color: string) => (
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={{ display: "block" }}>
          <circle cx="10" cy="10" r="8.5" fill="none" stroke={color} strokeWidth="2"/>
        </svg>
      ),
      glow: NEON_BLUE,
    },
    {
      num: "03",
      title: "AGENTE DIRECTOR CREATIVO",
      desc: <>Te dice {G("exactamente qué grabar")}, cómo editarlo, qué efectos usar y qué música poner en cada parte. Sus instrucciones son tan precisas que {G("cualquiera puede ejecutarlas")} sin experiencia previa.</>,
      icon: (color: string) => (
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={{ display: "block" }}>
          <rect x="2.5" y="2.5" width="15" height="15" fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
        </svg>
      ),
      glow: NEON_PURPLE,
    },
    {
      num: "04",
      title: "AGENTE EJECUTOR TÉCNICO",
      desc: <>Con los guiones y assets listos, {G("construye el iVSL completo")} en código. Tú solo entregas los archivos. Él monta todo el flujo funcional {G("sin que escribas una sola línea")}.</>,
      icon: (color: string) => (
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={{ display: "block" }}>
          <line x1="3" y1="3" x2="17" y2="17" stroke={color} strokeWidth="2" strokeLinecap="round"/>
          <line x1="17" y1="3" x2="3" y2="17" stroke={color} strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      glow: NEON_CYAN,
    },
  ];

  const includes = [
    "Mentoría 1 a 1 para acompañarte en toda tu implementación",
    "Videoclase paso a paso mostrando todo en la práctica",
    "Los 4 agentes guía listos para usar desde el día 1",
    "Creación de avatares ultrarrealistas para tu iVSL",
    "Estructuración completa de embudos gamificados",
    "Edición audiovisual completa incluida",
    "Comunidad privada en WhatsApp para networking",
  ];

  const communityMessages = [
    { name: "Carlos M.", color: "#53BDEB", avatar: "https://i.pravatar.cc/40?img=11", time: "10:24", text: "implementé el agente 1 y en 2 días ya tenía todo el embudo estructurado 🔥", sent: false },
    { name: "Valeria R.", color: "#FC8B7B", avatar: "https://i.pravatar.cc/40?img=32", time: "10:31", text: "el agente copywriter me escribió un guion mejor que el que yo tardaba 3 semanas en hacer 😭", sent: false },
    { name: "Diego F.", color: "#6BCB77", avatar: "https://i.pravatar.cc/40?img=7", time: "11:05", text: "primera semana: tiempo en página pasó de 1m a 7m con el iVSL. las métricas hablan solas 📈", sent: false },
    { name: "Mariana L.", color: "#C497EB", avatar: "https://i.pravatar.cc/40?img=47", time: "11:22", text: "pregunta: el agente director funciona con CapCut también? o solo Premiere", sent: false },
    { name: "Carlos M.", color: "#53BDEB", avatar: "https://i.pravatar.cc/40?img=11", time: "11:24", text: "sí, con cualquier editor 👌 el agente te da los cortes exactos y tú los aplicas", sent: false },
    { name: "Luis A.", color: "#F7C948", avatar: "https://i.pravatar.cc/40?img=3", time: "12:10", text: "cerré 3 ventas con mi primer iVSL. el sistema es exactamente lo que promete 🙌", sent: false },
  ];

  const faqs: { q: string; a: React.ReactNode }[] = [
    // Capacidad
    { q: "¿Necesito saber programar o editar video para usar el sistema?", a: <>Para nada. El {G("Agente Ejecutor")} construye todo el código por ti y el {G("Agente Director Creativo")} te dice exactamente qué grabar y cómo editarlo. Si puedes {G("seguir instrucciones")}, puedes implementarlo.</> },
    { q: "¿Funciona si nunca he usado inteligencia artificial antes?", a: <>Sí. Los agentes están diseñados para guiarte {G("paso a paso desde cero")}. No necesitas {G("experiencia previa")} con IA ni con herramientas técnicas. La {G("videoclase")} te muestra todo en la práctica.</> },
    { q: "¿Cuánto tiempo lleva tener mi primer iVSL listo?", a: <>La mayoría de los miembros tienen su primer iVSL funcional en {G("5 a 7 días")} siguiendo las videoclases. Con dedicación de {G("1 a 2 horas diarias")} es suficiente.</> },
    // Confianza
    { q: "¿Los agentes funcionan para mi nicho específico?", a: <>Sí. El {G("Agente Arquitecto")} analiza tu oferta y tu público antes de construir nada. No importa si vendes infoproductos, servicios, e-commerce o tienes un negocio local: {G("el sistema se adapta a ti")}.</> },
    { q: "¿Esto es otro curso teórico que no lleva a resultados?", a: <>No. Cada agente tiene una {G("función práctica")} dentro del embudo: uno planifica, otro escribe, otro dirige la producción y otro construye el sistema completo. El resultado es un {G("iVSL funcional")}, no un PDF.</> },
    // Riesgo
    { q: "¿Qué pasa si compro y no me funciona?", a: <>Tienes {G("15 días de garantía incondicional")}. Si no estás satisfecho por cualquier razón, te devolvemos el {G("100% de tu inversión")} sin preguntas. Solo escribes al soporte de WhatsApp y procesamos el reembolso en {G("menos de 48h")}.</> },
    { q: "¿El acceso vitalicio incluye actualizaciones y versiones futuras?", a: <>Sí. Cada mejora en los agentes, cada nueva funcionalidad y cada versión futura que lancemos la recibirás {G("automáticamente")} y {G("sin ningún costo adicional")}.</> },
  ];

  const s = {
    root: {
      position: "absolute" as const, inset: 0,
      backgroundColor: "#000",
      backgroundImage: [
        "linear-gradient(to bottom, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.70) 40%, rgba(0,0,0,0.78) 70%, rgba(0,0,0,0.88) 100%)",
        "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(212,175,55,0.07) 0%, transparent 60%)",
        "radial-gradient(ellipse 80% 40% at 50% 100%, rgba(212,175,55,0.05) 0%, transparent 60%)",
        "url('/fondo landing.jpg')",
      ].join(", "),
      backgroundSize: "auto, auto, auto, 100% auto",
      backgroundPosition: "center, center, center, top center",
      backgroundRepeat: "no-repeat, no-repeat, no-repeat, no-repeat",
      backgroundAttachment: "scroll, scroll, scroll, scroll",
      overflowY: "auto" as const,
      scrollbarWidth: "none" as const,
      fontFamily: "var(--font-montserrat)",
    } as React.CSSProperties,
    section: {
      width: "100%", padding: "48px 24px",
      display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 24,
    },
    label: {
      fontFamily: "var(--font-montserrat)", fontSize: 10, fontWeight: 700,
      letterSpacing: "0.2em", textTransform: "uppercase" as const,
      ...GOLD_TEXT,
    },
    h2: {
      fontFamily: "var(--font-playfair)", fontSize: "clamp(20px, 5vw, 26px)",
      fontWeight: 700, color: "#fff", textAlign: "center" as const,
      lineHeight: 1.25, margin: 0,
    },
  };

  return (
    <div style={s.root}>

      {/* ── 1. HERO ───────────────────────────────────────────────────────────── */}
      <div style={{
        ...s.section,
        height: "100svh", justifyContent: "center", position: "relative",
        background: "transparent",
        borderBottom: `1px solid rgba(212,175,55,0.08)`,
        boxSizing: "border-box",
      }}>
        {/* Logo + Cima Labs — fijado arriba */}
        <div style={{ position: "absolute", top: 28, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <img src="/logo.png" alt="Cima Labs" style={{ height: 62, objectFit: "contain", filter: "sepia(1) saturate(2) hue-rotate(5deg) brightness(1.1)" }} />
          <span style={{ fontFamily: "var(--font-montserrat)", fontSize: 9, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", ...GOLD_TEXT }}>· Cima Labs ·</span>
        </div>

        {/* Desliza dentro del hero */}
        <div style={{ position: "absolute", bottom: 20, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <ScrollHint prefix="hero" />
        </div>

        <motion.div {...fadeUp} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, width: "100%" }}>

          <motion.h1
            animate={{ backgroundPosition: ["-200% center", "200% center"] }}
            transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 1.2, ease: "linear" }}
            style={{
              fontFamily: "var(--font-playfair)", fontSize: "clamp(38px, 10vw, 52px)",
              fontWeight: 700, textAlign: "center", lineHeight: 1.0, margin: 0,
              background: "linear-gradient(90deg, #AA771C 0%, #BF953F 15%, #AA771C 30%, #D4AF37 40%, #FCF6BA 48%, #FFFEF0 50%, #FCF6BA 52%, #D4AF37 60%, #AA771C 70%, #BF953F 85%, #AA771C 100%)",
              backgroundSize: "300% 100%",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              backgroundClip: "text", letterSpacing: "0.01em",
              filter: "drop-shadow(0 0 22px rgba(212,175,55,0.45))",
            }}
          >
            iVSL<br />GAMIFICADO
          </motion.h1>

          <div style={{ display: "flex", alignItems: "center", gap: 10, width: "100%" }}>
            <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${NEON_CYAN}70)` }} />
            <p style={{
              fontFamily: "var(--font-montserrat)", fontSize: 12, fontWeight: 400,
              color: "rgba(255,255,255,0.7)", textAlign: "center", lineHeight: 1.4,
              margin: 0, letterSpacing: "0.06em", fontStyle: "italic", whiteSpace: "nowrap",
            }}>
              La muerte del VSL tradicional
            </p>
            <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${NEON_PURPLE}70, transparent)` }} />
          </div>

          {/* Indicadores de oferta */}
          <div style={{ display: "flex", gap: 20, marginTop: 8 }}>
            {["4 Agentes IA", "Acceso Vitalicio", "Garantía 15 días"].map((tag, i) => {
              const color = i === 0 ? NEON_CYAN : i === 1 ? NEON_BLUE : NEON_PURPLE;
              return (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                  <motion.div
                    animate={{
                      opacity: [1, 0.2, 1],
                      boxShadow: [
                        `0 0 4px ${color}`,
                        `0 0 12px ${color}, 0 0 20px ${color}80`,
                        `0 0 4px ${color}`,
                      ],
                    }}
                    transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }}
                    style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: color,
                    }}
                  />
                  <span style={{ fontFamily: "var(--font-montserrat)", fontSize: 9, color: "rgba(255,255,255,0.45)", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{tag}</span>
                </div>
              );
            })}
          </div>


        </motion.div>
      </div>

      <NeonDivider hint={false} />

      {/* ── 1b. PROMESA ──────────────────────────────────────────────────────── */}
      <div style={{ ...s.section, paddingTop: 52, paddingBottom: 52, gap: 20 }}>
        <motion.div {...fadeUp} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, width: "100%" }}>
          <motion.h2
            animate={{ backgroundPosition: ["-200% center", "200% center"] }}
            transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 1.2, ease: "linear" }}
            style={{
              ...s.h2,
              fontSize: "clamp(22px, 6vw, 30px)",
              lineHeight: 1.2,
              background: "linear-gradient(90deg, #AA771C 0%, #BF953F 15%, #AA771C 30%, #D4AF37 40%, #FCF6BA 48%, #FFFEF0 50%, #FCF6BA 52%, #D4AF37 60%, #AA771C 70%, #BF953F 85%, #AA771C 100%)",
              backgroundSize: "300% 100%",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}
          >
            ¡Lo que esperabas<br />en la palma de tu mano!
          </motion.h2>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: 13,
            lineHeight: 1.75,
            color: "rgba(255,255,255,0.72)",
            textAlign: "center",
            margin: 0,
            maxWidth: 300,
          }}>
            Un iVSL gamificado adaptado a tu nicho, con tu oferta y tu voz. Sin saber copy, sin programar, sin edición profesional.
          </p>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: 15,
            fontWeight: 700,
            lineHeight: 1.4,
            textAlign: "center",
            margin: 0,
            maxWidth: 280,
            ...GOLD_TEXT,
          }}>
            Tú pones tu oferta.<br />Los 4 agentes hacen el resto.
          </p>
        </motion.div>
      </div>

      <NeonDivider hint={false} />

      {/* ── 2. LOS 4 AGENTES ─────────────────────────────────────────────────── */}
      <div style={s.section}>
        <motion.div {...fadeUp} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <div style={{ width: 28, height: 1, background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.6))" }} />
            <span style={{
              fontFamily: "var(--font-montserrat)", fontSize: 10, fontWeight: 700,
              letterSpacing: "0.25em", textTransform: "uppercase" as const,
              ...GOLD_TEXT,
            }}>El Sistema</span>
            <div style={{ width: 28, height: 1, background: "linear-gradient(90deg, rgba(212,175,55,0.6), transparent)" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <motion.span
              animate={{ backgroundPosition: ["-200% center", "200% center"] }}
              transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 1.2, ease: "linear" }}
              style={{
                fontFamily: "var(--font-playfair)", fontWeight: 700,
                fontSize: "clamp(20px, 5.5vw, 28px)", letterSpacing: "0.04em",
                textAlign: "center" as const, lineHeight: 1.2, fontVariantNumeric: "lining-nums",
                display: "block",
                background: "linear-gradient(90deg, #AA771C 0%, #BF953F 15%, #AA771C 30%, #D4AF37 40%, #FCF6BA 48%, #FFFEF0 50%, #FCF6BA 52%, #D4AF37 60%, #AA771C 70%, #BF953F 85%, #AA771C 100%)",
                backgroundSize: "300% 100%",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}
            >LOS 4 AGENTES IA</motion.span>
            <motion.span
              animate={{ backgroundPosition: ["-200% center", "200% center"] }}
              transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 1.2, ease: "linear", delay: 0.15 }}
              style={{
                fontFamily: "var(--font-playfair)", fontWeight: 700,
                fontSize: "clamp(20px, 5.5vw, 28px)", letterSpacing: "0.04em",
                textAlign: "center" as const, lineHeight: 1.2, display: "block",
                background: "linear-gradient(90deg, #AA771C 0%, #BF953F 15%, #AA771C 30%, #D4AF37 40%, #FCF6BA 48%, #FFFEF0 50%, #FCF6BA 52%, #D4AF37 60%, #AA771C 70%, #BF953F 85%, #AA771C 100%)",
                backgroundSize: "300% 100%",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}
            >TRABAJANDO PARA TI</motion.span>
          </div>
          <p style={{
            fontFamily: "var(--font-montserrat)", fontSize: 11.5,
            color: "rgba(255,255,255,0.45)", textAlign: "center", margin: 0,
            letterSpacing: "0.04em",
          }}>La arquitectura detrás del embudo</p>
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
          {agents.map((a, i) => (
            <React.Fragment key={a.num}>
              <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
              style={{
                background: `rgba(5,10,24,0.85)`,
                border: `1px solid ${a.glow}40`,
                borderRadius: 14, padding: "20px 18px",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
                boxShadow: `0 0 20px ${a.glow}10, inset 0 0 30px ${a.glow}05`,
                position: "relative",
              }}
            >
              <div style={{
                width: 44, height: 44, flexShrink: 0, borderRadius: 12,
                background: `${a.glow}15`,
                border: `1px solid ${a.glow}55`,
                boxShadow: `0 0 12px ${a.glow}30`,
                display: "flex", alignItems: "center", justifyContent: "center",
                filter: `drop-shadow(0 0 5px ${a.glow}90)`,
              }}>
                {a.icon(a.glow)}
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", textAlign: "center" }}>
                <span style={{
                  position: "absolute", top: 12, left: 14,
                  fontFamily: "var(--font-montserrat)", fontSize: 9, fontWeight: 700,
                  letterSpacing: "0.18em", textTransform: "uppercase" as const,
                  background: `linear-gradient(135deg, ${a.glow}22, ${a.glow}40)`,
                  border: `1px solid ${a.glow}60`,
                  borderRadius: 50, padding: "3px 10px",
                  color: a.glow,
                  boxShadow: `0 0 8px ${a.glow}30`,
                }}>FASE {a.num}</span>
                <span style={{ fontFamily: "var(--font-montserrat)", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", ...GOLD_TEXT }}>{a.title}</span>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: 11, color: "rgba(255,255,255,0.58)", lineHeight: 1.6, margin: 0 }}>{a.desc}</p>
              </div>
            </motion.div>
            {i < agents.length - 1 && (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 18 }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ display: "block" }}>
                  <polyline points="2,2 7,10 12,2" fill="none" stroke="url(#arrowGrad)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  <defs>
                    <linearGradient id="arrowGrad" x1="0" y1="0" x2="0" y2="14" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#BF953F" />
                      <stop offset="100%" stopColor="#AA771C" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <NeonDivider id="d1" />

      {/* ── 3. QUÉ INCLUYE ───────────────────────────────────────────────────── */}
      <div style={s.section}>
        <SectionHeader label="Todo incluido" title="¿QUÉ OBTIENES?" />

        <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
          {includes.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08, ease: "easeOut" }}
              style={{
                display: "flex", alignItems: "center", gap: 14,
                background: "rgba(5,10,24,0.85)",
                border: `1px solid rgba(212,175,55,0.2)`,
                borderLeft: `3px solid ${NEON_CYAN}`,
                borderRadius: 12, padding: "14px 16px",
                boxShadow: `0 0 20px rgba(212,175,55,0.05), inset 0 0 20px rgba(212,175,55,0.03)`,
              }}
            >
              <div style={{
                width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                background: `linear-gradient(135deg, ${NEON_CYAN}25, ${NEON_BLUE}15)`,
                border: `1px solid ${NEON_CYAN}60`,
                boxShadow: `0 0 12px ${NEON_CYAN}35`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ display: "block" }}>
                  <polyline points="1.5,7 5,10.5 11.5,2.5" stroke={NEON_CYAN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span style={{
                fontFamily: "var(--font-montserrat)", fontSize: 12, fontWeight: 600,
                color: "rgba(255,255,255,0.9)", lineHeight: 1.4, flex: 1,
              }}>{item}</span>
              <span style={{
                fontFamily: "var(--font-montserrat)", fontSize: 9, fontWeight: 700,
                letterSpacing: "0.1em", color: `${NEON_CYAN}90`,
              }}>0{i + 1}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <NeonDivider id="d2" />

      {/* ── 4. COMUNIDAD WHATSAPP ────────────────────────────────────────────── */}
      <div style={s.section}>
        <SectionHeader label="Evidencia real" title="NO ESTÁS SOLO" subtitle="Una comunidad activa de miembros implementando el sistema en tiempo real." />

        {/* Mock WhatsApp Group — interfaz real */}
        {/* Mock WhatsApp iOS 26 — Liquid Glass */}
        <motion.div
          {...fadeUp}
          style={{
            width: "100%", borderRadius: 20, overflow: "hidden",
            boxShadow: "0 16px 56px rgba(0,0,0,0.9), 0 0 0 0.5px rgba(255,255,255,0.08)",
          }}
        >
          {/* Header iOS 26 — Liquid Glass */}
          <div style={{
            background: "rgba(28,28,30,0.82)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            borderBottom: "0.5px solid rgba(255,255,255,0.1)",
            padding: "10px 14px 10px",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            {/* Back + avatar integrado estilo iOS 26 */}
            <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
              <svg width="9" height="16" viewBox="0 0 9 16" fill="none"><path d="M8 1L1 8l7 7" stroke="#00A884" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <div style={{
                width: 34, height: 34, borderRadius: "50%", overflow: "hidden",
                border: "1.5px solid rgba(0,168,132,0.4)",
              }}>
                <img src="/logo.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "sepia(1) saturate(2) hue-rotate(5deg) brightness(1.1)" }} />
              </div>
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#FFFFFF", fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif", lineHeight: 1.2 }}>iVSL Gamificado</div>
              <div style={{ fontSize: 11, color: "#8E8E93", fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif", marginTop: 1 }}>
                <span style={{ color: "#30D158" }}>●</span> 47 participantes
              </div>
            </div>

            <div style={{ display: "flex", gap: 18, flexShrink: 0, alignItems: "center" }}>
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none"><path d="M15 10l4.553-2.669A1 1 0 0121 8.235v7.53a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" stroke="#00A884" strokeWidth="1.8" strokeLinecap="round"/></svg>
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.27-.27.67-.38 1.02-.24 1.1.4 2.28.62 3.58.62.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.18 21 3 13.82 3 5c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.32.22 2.58.62 3.76.12.34.02.72-.22.98l-2.3 2.06z" stroke="#00A884" strokeWidth="1.8" strokeLinecap="round"/></svg>
            </div>
          </div>

          {/* Chat background */}
          <div style={{
            background: "#000000",
            backgroundImage: "radial-gradient(ellipse 100% 100% at 50% 0%, rgba(0,168,132,0.04) 0%, transparent 60%)",
            padding: "12px 10px 14px",
            display: "flex", flexDirection: "column", gap: 6,
          }}>
            {/* Fecha */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>
              <span style={{
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(8px)",
                borderRadius: 10, padding: "3px 12px",
                fontSize: 11, color: "rgba(255,255,255,0.45)",
                fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
              }}>Hoy</span>
            </div>

            {communityMessages.map((msg, i) => (
              <div key={i} style={{ display: "flex", gap: 7, alignItems: "flex-end" }}>
                <img src={msg.avatar} alt="" style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0, marginBottom: 1 }} />
                <div style={{
                  background: "rgba(44,44,46,0.95)",
                  backdropFilter: "blur(12px)",
                  borderRadius: "2px 18px 18px 18px",
                  padding: "7px 11px 6px",
                  maxWidth: "80%",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.5)",
                }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: msg.color, fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif", marginBottom: 2 }}>{msg.name}</div>
                  <div style={{ fontSize: 13, color: "#FFFFFF", lineHeight: 1.4, fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif" }}>{msg.text}</div>
                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
                    <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif" }}>{msg.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <NeonDivider id="d3" />

      {/* ── 5. OFERTA ────────────────────────────────────────────────────────── */}
      <div ref={ofertaRef} style={{
        ...s.section,
        background: "radial-gradient(ellipse at 50% 50%, rgba(212,175,55,0.04) 0%, transparent 65%)",
      }}>
        <SectionHeader label="Acceso al sistema" title="ELIGE TU ACCESO" />

        {/* Lote 1 — Vitalicio (destacado) */}
        <motion.div
          {...fadeUp}
          style={{
            width: "100%", borderRadius: 18,
            border: `1px solid ${NEON_CYAN}55`,
            background: `rgba(212,175,55,0.04)`,
            padding: "24px 20px",
            boxShadow: `0 0 30px ${NEON_CYAN}15, inset 0 0 40px ${NEON_CYAN}05`,
            display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
            position: "relative",
          }}
        >
          <div style={{
            position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
            background: "linear-gradient(135deg, #BF953F, #FCF6BA, #AA771C)",
            borderRadius: 50, padding: "4px 16px",
            fontFamily: "var(--font-montserrat)", fontSize: 9, fontWeight: 700,
            letterSpacing: "0.15em", color: "#000",
          }}>MÁS POPULAR</div>

          <div style={{ textAlign: "center", width: "100%" }}>
            <div style={{
              width: "100%",
              background: "linear-gradient(135deg, #BF953F 0%, #FCF6BA 50%, #AA771C 100%)",
              borderRadius: 10, padding: "10px 16px", marginBottom: 14,
              display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
              boxShadow: "0 4px 20px rgba(212,175,55,0.35)",
            }}>
              <span style={{ fontFamily: "var(--font-montserrat)", fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", color: "rgba(0,0,0,0.5)" }}>ACCESO VITALICIO + MENTORÍA 1 A 1</span>
              <span style={{ fontFamily: "var(--font-playfair)", fontSize: 28, fontWeight: 700, color: "#000", letterSpacing: "0.06em", fontVariantNumeric: "lining-nums" }}>LOTE 1</span>
            </div>
            <div style={{ position: "relative", display: "inline-block", marginBottom: 2 }}>
              <span style={{ fontFamily: "var(--font-montserrat)", fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,0.6)" }}>$147 USD</span>
              <div style={{ position: "absolute", top: "50%", left: -14, right: -14, height: 1, background: "rgba(255,255,255,0.6)", transform: "translateY(-50%)" }} />
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6, justifyContent: "center" }}>
              <div style={{
                fontFamily: "var(--font-playfair)", fontSize: 52, fontWeight: 700, lineHeight: 1,
                background: "linear-gradient(135deg, #BF953F, #FCF6BA, #D4AF37)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                fontVariantNumeric: "lining-nums",
              }}>$97</div>
              <span style={{ fontFamily: "var(--font-montserrat)", fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.55)", marginBottom: 6 }}>USD</span>
            </div>
            <div style={{ fontFamily: "var(--font-montserrat)", fontSize: 10, color: "rgba(255,255,255,0.38)", marginTop: 4 }}>pago único · sin recurrencia</div>
          </div>

          <div style={{ width: "100%" }}>
            <GreenButton href={PURCHASE_URL_VITALICIO}>ACTIVAR ACCESO VIP</GreenButton>
          </div>

          {/* Advertencia fecha */}
          <div style={{
            width: "100%", borderRadius: 10, padding: "12px 14px",
            background: "#000", border: "1.5px solid #FF3B30",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
            boxShadow: "0 0 16px rgba(255,59,48,0.2)",
          }}>
            <motion.span animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1.2, repeat: Infinity }} style={{ fontSize: 22, lineHeight: 1 }}>⚠️</motion.span>
            <div style={{ fontFamily: "var(--font-montserrat)", fontSize: 11, fontWeight: 800, color: "#FF3B30", letterSpacing: "0.08em", textAlign: "center" }}>ATENCIÓN</div>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: 11, color: "#fff", margin: 0, lineHeight: 1.65, fontWeight: 600, textAlign: "center" }}>
              Esta oferta es válida hasta el <span style={{ color: "#FF3B30", fontWeight: 700 }}>{expiryDate}</span>. Después el Lote 1 se cierra y el Lote 2 queda disponible a su precio oficial de <span style={{ fontWeight: 700, whiteSpace: "nowrap" }}>$147 USD</span>.
            </p>
          </div>
        </motion.div>

        {/* Lote 2 — Anual (DESACTIVADO) */}
        <motion.div
          {...fadeUp}
          style={{
            width: "100%", borderRadius: 18,
            border: `1px solid rgba(255,255,255,0.08)`,
            background: `rgba(20,20,20,0.6)`,
            padding: "20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 14,
            position: "relative", overflow: "hidden",
            opacity: 0.72,
            filter: "grayscale(0.45)",
          }}
        >
          {/* Overlay de bloqueo */}
          <div style={{
            position: "absolute", inset: 0, zIndex: 2,
            background: "rgba(0,0,0,0.18)",
            backdropFilter: "blur(0.4px)",
            WebkitBackdropFilter: "blur(0.4px)",
            borderRadius: 18,
            pointerEvents: "none",
          }} />

          {/* Badge BLOQUEADO */}
          <div style={{
            position: "absolute", top: 12, right: 14, zIndex: 3,
            display: "flex", alignItems: "center", gap: 5,
            background: "rgba(0,0,0,0.7)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 50, padding: "4px 10px",
          }}>
            <span style={{ fontSize: 10, lineHeight: 1 }}>🔒</span>
            <span style={{ fontFamily: "var(--font-montserrat)", fontSize: 8.5, fontWeight: 700, letterSpacing: "0.15em", color: "rgba(255,255,255,0.45)" }}>BLOQUEADO</span>
          </div>

          <div style={{ textAlign: "center", width: "100%", zIndex: 1 }}>
            <div style={{
              width: "100%",
              background: "linear-gradient(135deg, rgba(80,80,80,0.3), rgba(120,120,120,0.15), rgba(80,80,80,0.3))",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10, padding: "10px 16px", marginBottom: 14,
              display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
            }}>
              <span style={{ fontFamily: "var(--font-montserrat)", fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", color: "rgba(255,255,255,0.3)" }}>ACCESO ANUAL</span>
              <span style={{ fontFamily: "var(--font-playfair)", fontSize: 28, fontWeight: 700, letterSpacing: "0.06em", fontVariantNumeric: "lining-nums", color: "rgba(255,255,255,0.35)" }}>LOTE 2</span>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6, justifyContent: "center" }}>
              <div style={{ fontFamily: "var(--font-playfair)", fontSize: 44, fontWeight: 700, color: "rgba(255,255,255,0.3)", lineHeight: 1, fontVariantNumeric: "lining-nums" }}>$147</div>
              <span style={{ fontFamily: "var(--font-montserrat)", fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.2)", marginBottom: 5 }}>USD</span>
            </div>
            <div style={{ fontFamily: "var(--font-montserrat)", fontSize: 10, color: "rgba(255,255,255,0.18)", marginTop: 4 }}>renovación anual</div>
          </div>

          <div style={{
            fontFamily: "var(--font-montserrat)", fontSize: 11, color: "rgba(255,255,255,0.38)",
            textAlign: "center", lineHeight: 1.6, zIndex: 1,
          }}>
            Disponible el <span style={{ color: "rgba(255,255,255,0.6)", fontWeight: 700 }}>{lote2Date}</span>
          </div>

          <div style={{ width: "100%", zIndex: 1 }}>
            <div style={{
              width: "100%", background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)", borderRadius: 50,
              padding: "14px 32px", fontSize: 13, fontWeight: 700,
              fontFamily: "var(--font-montserrat)", letterSpacing: "0.08em",
              color: "rgba(255,255,255,0.2)", textAlign: "center",
              cursor: "not-allowed", boxSizing: "border-box",
            }}>🔒 ACCESO ANUAL</div>
          </div>

        </motion.div>

        {/* Nota precio Lote 2 */}
        <motion.div
          {...fadeUp}
          style={{
            width: "100%", borderRadius: 12,
            border: "1px solid rgba(255,59,48,0.25)",
            background: "rgba(255,59,48,0.06)",
            padding: "12px 16px", textAlign: "center",
          }}
        >
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: 11, fontWeight: 600, color: "#FF3B30", margin: 0, lineHeight: 1.5 }}>
            Después este precio oficial se mantendra.
          </p>
        </motion.div>
      </div>

      <NeonDivider id="d4" />

      {/* ── 6. GARANTÍA + VITALICIO + SOPORTE ───────────────────────────────── */}
      <div style={s.section}>
        {/* Card Garantía */}
        {([
          {
            icon: (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L3 6v6c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V6L12 2z" fill="rgba(37,211,102,0.18)" stroke="#25D366" strokeWidth="1.6" strokeLinejoin="round"/>
                <polyline points="8,12 11,15 16,9" stroke="#25D366" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ),
            title: "GARANTÍA INCONDICIONAL DE 15 DÍAS",
            desc: <>Si en los primeros {Gv("15 días")} no estás completamente satisfecho con el sistema, te devolvemos el {Gv("100% de tu inversión")}. {Gv("Sin preguntas.")} Sin burocracia.</>,
          },
          {
            icon: (
              <svg width="36" height="20" viewBox="0 0 50 26" fill="none">
                <path d="M25 13C25 13 20 4 13 4C7.477 4 3 8.477 3 13C3 17.523 7.477 22 13 22C20 22 25 13 25 13Z" fill="none" stroke="#25D366" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M25 13C25 13 30 22 37 22C42.523 22 47 17.523 47 13C47 8.477 42.523 4 37 4C30 4 25 13 25 13Z" fill="none" stroke="#25D366" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ),
            title: "ACCESO VITALICIO",
            desc: <>{Gv("Paga una sola vez")} y accede {Gv("para siempre")}. Sin mensualidades ni sorpresas. Todas las {Gv("actualizaciones y versiones futuras")} de los agentes incluidas {Gv("automáticamente")}.</>,
          },
          {
            icon: (
              <svg width="30" height="30" viewBox="0 0 24 24" style={{ display: "block" }}>
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.38 1.26 4.82L2.05 22l5.38-1.41a9.82 9.82 0 004.61 1.15c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2z" fill="#25D366"/>
                <path d="M17.12 14.56c-.22-.11-1.32-.65-1.52-.73-.2-.07-.35-.11-.5.11-.15.22-.58.73-.71.88-.13.15-.26.17-.48.06-.22-.11-.94-.35-1.79-1.1-.66-.59-1.11-1.32-1.24-1.54-.13-.22-.01-.34.1-.45.1-.1.22-.26.33-.39.11-.13.15-.22.22-.37.07-.15.04-.28-.02-.39-.06-.11-.5-1.21-.69-1.66-.18-.43-.37-.37-.5-.38-.13 0-.28-.01-.43-.01s-.39.06-.6.28c-.2.22-.78.76-.78 1.86s.8 2.16.91 2.31c.11.15 1.57 2.4 3.81 3.36.53.23.95.37 1.27.47.54.17 1.02.15 1.4.09.43-.06 1.32-.54 1.5-1.06.19-.52.19-.97.13-1.06-.06-.09-.2-.15-.42-.26z" fill="white"/>
              </svg>
            ),
            title: "SOPORTE DIRECTO EN WHATSAPP",
            desc: <>Respuesta en {Gv("menos de 24 horas")}. {Gv("Acompañamiento real")} durante tu implementación. {Gv("No estás solo")} en este proceso.</>,
          },
        ] as { icon: React.ReactElement; title: string; desc: React.ReactNode }[]).map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
            style={{
              width: "100%", borderRadius: 18,
              border: "1px solid rgba(37,211,102,0.25)",
              background: "rgba(37,211,102,0.04)",
              boxShadow: "0 0 24px rgba(37,211,102,0.08)",
              padding: "22px 20px",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 12, textAlign: "center",
            }}
          >
            <div style={{
              width: 56, height: 56, borderRadius: "50%",
              background: "rgba(37,211,102,0.1)",
              border: "1px solid rgba(37,211,102,0.35)",
              boxShadow: "0 0 20px rgba(37,211,102,0.25), inset 0 0 16px rgba(37,211,102,0.08)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>{item.icon}</div>
            <div>
              <div style={{ fontFamily: "var(--font-montserrat)", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "#25D366", marginBottom: 8 }}>
                {item.title}
              </div>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: 11.5, color: "rgba(255,255,255,0.58)", lineHeight: 1.7, margin: 0 }}>
                {item.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <NeonDivider id="d7" />

      {/* ── 9. FAQ ────────────────────────────────────────────────────────────── */}
      <div style={s.section}>
        <SectionHeader label="Dudas" title="PREGUNTAS FRECUENTES" />

        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
          {faqs.map((faq, i) => (
            <FaqItem key={i} index={i} question={faq.q} answer={faq.a} />
          ))}
        </div>
      </div>

      <NeonDivider id="d8" hint={false} />

      {/* ── 10. CTA FINAL ────────────────────────────────────────────────────── */}
      <div style={{
        ...s.section,
        background: "radial-gradient(ellipse at 50% 60%, rgba(212,175,55,0.05) 0%, transparent 60%)",
        paddingBottom: 64,
      }}>
        <motion.div {...fadeUp} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, width: "100%", textAlign: "center" }}>
          <h2 style={{
            fontFamily: "var(--font-playfair)", fontSize: "clamp(20px, 5.5vw, 28px)",
            fontWeight: 700, textAlign: "center", lineHeight: 1.2, margin: 0,
            letterSpacing: "0.04em", ...GOLD_TEXT,
          }}>¿LISTO PARA ACTIVAR<br />TU SISTEMA?</h2>
          <div style={{ width: "100%", maxWidth: 300 }}>
            <GoldButton onClick={() => ofertaRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}>ACTIVAR ACCESO VIP</GoldButton>
          </div>
          <div style={{ fontFamily: "var(--font-montserrat)", fontSize: 10, color: "rgba(255,255,255,0.25)", letterSpacing: "0.05em" }}>
            Cima Labs · Todos los derechos reservados
          </div>
        </motion.div>
      </div>

    </div>
  );
}
