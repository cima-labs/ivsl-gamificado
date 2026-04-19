"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface QualificationProps {
  onComplete: () => void;
  onFilterDone?: () => void;
  onStart?: () => void;
}

interface Question {
  id: number;
  label: string;
  question: string;
  optionA: string;
  optionB: string;
  diagnosisA: string;
  diagnosisB: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    label: "PRUEBA 01 · LA ILUSIÓN",
    question: "Si uno de tus clientes entra hoy a tu página o embudo de ventas, ¿cuál es la cruda realidad en los primeros 5 segundos?",
    optionA: "Se da cuenta de inmediato que es el mismo video de ventas aburrido de siempre.",
    optionB: "Se queda hipnotizado y ve el contenido hasta el final.",
    diagnosisA: "SINCERIDAD DETECTADA. SABES QUE TU SISTEMA ES PREDECIBLE. AVANZAS.",
    diagnosisB: "AUTOENGAÑO DETECTADO. SI ESO FUERA CIERTO, NO ESTARÍAS AQUÍ.",
  },
  {
    id: 2,
    label: "PRUEBA 02 · LA FUGA DE CAPITAL",
    question: "Como jugador en este mercado, ¿dónde estás perdiendo más dinero exactamente ahora?",
    optionA: "Atraigo gente a mi embudo, pero se aburren y se van antes de que les ofrezca mi producto.",
    optionB: "Tengo el mejor producto de mi sector, pero mi página web lo hace ver barato y poco confiable.",
    diagnosisA: "ERROR DE RETENCIÓN CONFIRMADO. TU OFERTA ES BUENA, PERO TU ENVOLTORIO NO TIENE PODER.",
    diagnosisB: "ERROR DE RETENCIÓN CONFIRMADO. TU OFERTA ES BUENA, PERO TU ENVOLTORIO NO TIENE PODER.",
  },
  {
    id: 3,
    label: "ÚLTIMA PRUEBA · EL EGO",
    question: "Cuando ves que tu competencia vende millones con un producto que es peor que el tuyo, ¿qué te dices a ti mismo en silencio?",
    optionA: "Que ellos tienen más suerte, mejores contactos o más dinero para invertir en anuncios.",
    optionB: "Que ellos entendieron las nuevas reglas del juego, y yo me quedé atrapado en el pasado.",
    diagnosisA: "MENTALIDAD ACEPTADA. EL MERCADO NO CASTIGA A LOS MALOS PRODUCTOS, CASTIGA A LOS ABURRIDOS.",
    diagnosisB: "MENTALIDAD ACEPTADA. EL MERCADO NO CASTIGA A LOS MALOS PRODUCTOS, CASTIGA A LOS ABURRIDOS.",
  },
];

function Typewriter({ text, speed = 18 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const t = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(t); setDone(true); }
    }, speed);
    return () => clearInterval(t);
  }, [text, speed]);

  return <span>{displayed}{!done && <span className="animate-pulse">▋</span>}</span>;
}

export default function Qualification({ onComplete, onFilterDone, onStart }: QualificationProps) {
  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<("A" | "B" | null)[]>([null, null, null]);
  const [showDiagnosis, setShowDiagnosis] = useState<boolean[]>([false, false, false]);
  const [allDone, setAllDone] = useState(false);

  const tapRef = useRef<HTMLAudioElement>(null);

  useEffect(() => { onStart?.(); }, []);

  function playTap() {
    if (!tapRef.current) return;
    tapRef.current.currentTime = 0;
    tapRef.current.play().catch(() => {});
  }

  function handleSelect(qIndex: number, option: "A" | "B") {
    if (answers[qIndex]) return;
    playTap();

    const newAnswers = [...answers];
    newAnswers[qIndex] = option;
    setAnswers(newAnswers);

    const newDiag = [...showDiagnosis];
    newDiag[qIndex] = true;
    setShowDiagnosis(newDiag);

    setTimeout(() => {
      if (qIndex < QUESTIONS.length - 1) {
        setCurrentQ(qIndex + 1);
      } else {
        setAllDone(true);
        onFilterDone?.();
        setTimeout(() => onComplete(), 2800);
      }
    }, 2000);
  }

  return (
    <motion.div
      className="absolute inset-0 velvet flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Audio tap */}
      <audio ref={tapRef} src="/sounds/tap boton.mp3" />

      {/* Video de fondo */}
      <video
        src="/fondochimenea.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0.32, zIndex: 0 }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to bottom, #050505 0%, rgba(5,5,5,0.82) 40%, rgba(5,5,5,0.88) 100%)", zIndex: 1 }}
      />

      {/* Contenido */}
      <div className="relative flex flex-col flex-1 min-h-0" style={{ zIndex: 2 }}>

        {/* Header */}
        <div
          className="flex items-center justify-between px-5 flex-shrink-0"
          style={{ paddingTop: "calc(env(safe-area-inset-top) + 14px)", paddingBottom: "4%", borderBottom: "1px solid rgba(212,175,55,0.12)" }}
        >
          <p
            className="text-[9px] tracking-[0.4em] uppercase"
            style={{ fontFamily: "var(--font-montserrat)", color: "rgba(212,175,55,0.7)", fontWeight: 600, marginLeft: 12 }}
          >
            Cima Labs
          </p>
          <p
            className="text-[8px] tracking-[0.3em]"
            style={{ fontFamily: "var(--font-montserrat)", color: "rgba(212,175,55,0.35)", marginRight: 12 }}
          >
            v2.0
          </p>
        </div>

        {/* ── PANTALLA INTRO ── */}
        {!started && (
          <div className="flex-1 flex flex-col px-5 py-8">
            <div className="flex-1 flex items-center justify-center">
              <p
                className="text-[15px] leading-relaxed italic text-center px-2"
                style={{ fontFamily: "var(--font-playfair)", color: "rgba(255,255,255,0.85)" }}
              >
                "En mi círculo no aceptamos víctimas, solo jugadores dispuestos a ver la realidad. Elige con cuidado."
              </p>
            </div>

            <motion.div className="flex flex-col items-center gap-3 mt-6">
              <motion.button
                onClick={() => {
                  playTap();
                  setStarted(true);
                }}
                className="uppercase font-bold"
                style={{
                  width: "calc(100% - 40px)",
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "11px",
                  letterSpacing: "0.45em",
                  padding: "19px 0",
                  background: "linear-gradient(135deg, #BF953F 0%, #D4AF37 35%, #FCF6BA 60%, #D4AF37 80%, #AA771C 100%)",
                  color: "#0a0800",
                  border: "none",
                  borderRadius: "50px",
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: 1, y: 0,
                  boxShadow: [
                    "0 4px 20px rgba(212,175,55,0.25), 0 0 0px rgba(212,175,55,0)",
                    "0 4px 40px rgba(212,175,55,0.55), 0 0 60px rgba(212,175,55,0.18)",
                    "0 4px 20px rgba(212,175,55,0.25), 0 0 0px rgba(212,175,55,0)",
                  ],
                }}
                transition={{
                  opacity: { delay: 0.6, duration: 0.5 },
                  y: { delay: 0.6, duration: 0.5 },
                  boxShadow: { delay: 0.6, duration: 2.4, repeat: Infinity, ease: "easeInOut" },
                }}
                whileHover={{ scale: 1.025, boxShadow: "0 6px 50px rgba(212,175,55,0.65)" }}
                whileTap={{ scale: 0.97 }}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" style={{ display: "inline", marginRight: 8, verticalAlign: "middle" }}><polygon points="0,0 10,5 0,10"/></svg>Iniciar Filtro
              </motion.button>
              <p
                className="text-[7px] tracking-[0.3em] uppercase"
                style={{ fontFamily: "var(--font-montserrat)", color: "rgba(212,175,55,0.3)" }}
              >
                Protocolo de acceso · Cima Labs
              </p>
            </motion.div>
          </div>
        )}

        {/* ── FILTRO COMPLETADO — centro de pantalla ── */}
        <AnimatePresence>
          {allDone && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              style={{ zIndex: 3 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9 }}
            >
              <motion.p
                className="text-[28px] font-bold tracking-[0.04em] uppercase text-center px-6"
                style={{
                  fontFamily: "var(--font-montserrat)",
                  background: "linear-gradient(135deg, #BF953F, #D4AF37, #FCF6BA, #D4AF37, #AA771C)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
                animate={{ opacity: [0.65, 1, 0.65] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
              >
                Filtro Completado
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── PANTALLA PREGUNTAS ── */}
        {started && !allDone && (
          <div className="flex-1 overflow-y-auto flex flex-col px-5" style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 24, paddingBottom: 20 }}>

            {/* Preguntas respondidas — tarjetas compactas */}
            <AnimatePresence>
              {QUESTIONS.map((q, i) => {
                const isAnswered = answers[i] !== null;
                const isActive = i === currentQ && !allDone;
                if (!isAnswered || isActive) return null;
                return (
                  <motion.div
                    key={`done-${q.id}`}
                    className="flex flex-col items-center px-3 py-2 mb-2 gap-1"
                    style={{ border: "1px solid rgba(212,175,55,0.15)", background: "rgba(0,0,0,0.35)", borderRadius: "10px" }}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.35 }}
                  >
                    <div className="flex items-center gap-2">
                      <span style={{ color: "#25D366", fontSize: 9 }}>✓</span>
                      <p
                        style={{ fontFamily: "var(--font-montserrat)", fontSize: 8, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(212,175,55,0.45)" }}
                      >
                        {q.label}
                      </p>
                    </div>
                    <p
                      style={{
                        fontFamily: "var(--font-montserrat)",
                        fontSize: 9,
                        lineHeight: 1.3,
                        color: "rgba(255,255,255,0.25)",
                        textAlign: "center",
                        wordBreak: "break-word",
                        overflowWrap: "break-word",
                      }}
                    >
                      {(answers[i] === "A" ? q.optionA : q.optionB).slice(0, 60)}…
                    </p>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Pregunta activa */}
            <AnimatePresence mode="wait">
              {!allDone && QUESTIONS.map((q, i) => {
                if (i !== currentQ) return null;
                return (
                  <motion.div
                    key={`q-${q.id}`}
                    className="flex flex-col justify-center gap-6 py-6"
                    style={{ minHeight: "62vh" }}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.5 }}
                  >
                    {/* Label */}
                    <p
                      className="text-[9px] tracking-[0.45em] uppercase text-center"
                      style={{ fontFamily: "var(--font-montserrat)", color: "rgba(212,175,55,0.65)" }}
                    >
                      {q.label}
                    </p>

                    <div className="h-px mx-auto w-10" style={{ background: "rgba(212,175,55,0.25)" }} />

                    {/* Texto pregunta — más grande */}
                    <p
                      className="text-[16px] leading-relaxed text-center"
                      style={{ fontFamily: "var(--font-montserrat)", color: "rgba(255,255,255,0.92)", fontWeight: 500 }}
                    >
                      <Typewriter text={q.question} speed={18} />
                    </p>

                    {/* Opciones */}
                    <div className="flex flex-col gap-3 mt-1">
                      {(["A", "B"] as const).map((opt) => {
                        const optText = opt === "A" ? q.optionA : q.optionB;
                        const isSelected = answers[i] === opt;
                        const isOther = !!(answers[i] && answers[i] !== opt);

                        return (
                          <motion.button
                            key={opt}
                            onClick={() => handleSelect(i, opt)}
                            className="w-full text-left"
                            style={{
                              fontFamily: "var(--font-montserrat)",
                              fontSize: "12px",
                              lineHeight: "1.6",
                              padding: "14px 16px",
                              background: isSelected
                                ? "rgba(212,175,55,0.22)"
                                : "rgba(212,175,55,0.07)",
                              border: isSelected
                                ? "1px solid rgba(212,175,55,0.8)"
                                : "1px solid rgba(212,175,55,0.28)",
                              color: isOther ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.92)",
                              cursor: answers[i] ? "default" : "pointer",
                              borderRadius: "14px",
                              boxShadow: isSelected
                                ? "0 0 18px rgba(212,175,55,0.35), inset 0 0 20px rgba(212,175,55,0.08)"
                                : "none",
                              wordBreak: "break-word",
                              overflowWrap: "break-word",
                            }}
                            whileHover={
                              !answers[i]
                                ? {
                                    background: "rgba(212,175,55,0.13)",
                                    borderColor: "rgba(212,175,55,0.55)",
                                    boxShadow: "0 0 14px rgba(212,175,55,0.2)",
                                  }
                                : {}
                            }
                            whileTap={!answers[i] ? { scale: 0.985 } : {}}
                            animate={
                              isSelected
                                ? { boxShadow: ["0 0 12px rgba(212,175,55,0.3)", "0 0 28px rgba(212,175,55,0.6)", "0 0 16px rgba(212,175,55,0.35)"] }
                                : {}
                            }
                            transition={isSelected ? { duration: 0.5 } : {}}
                          >
                            {optText}
                          </motion.button>
                        );
                      })}
                    </div>

                    {/* Diagnóstico */}
                    <AnimatePresence>
                      {showDiagnosis[i] && answers[i] && (
                        <motion.div
                          style={{
                            border: "1px solid rgba(212,175,55,0.35)",
                            background: "rgba(0,0,0,0.55)",
                            borderRadius: "14px",
                            padding: "16px 18px",
                            width: "100%",
                            boxSizing: "border-box",
                          }}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4 }}
                        >
                          <p
                            style={{
                              fontFamily: "var(--font-montserrat)",
                              fontSize: 7,
                              letterSpacing: "0.45em",
                              textTransform: "uppercase",
                              color: "rgba(212,175,55,0.4)",
                              marginBottom: 8,
                            }}
                          >
                            DIAGNÓSTICO
                          </p>
                          <p
                            style={{
                              fontFamily: "var(--font-montserrat)",
                              fontSize: 12,
                              lineHeight: 1.65,
                              color: "#D4AF37",
                              fontWeight: 700,
                              wordBreak: "break-word",
                              overflowWrap: "break-word",
                              whiteSpace: "normal",
                            }}
                          >
                            {answers[i] === "A" ? q.diagnosisA : q.diagnosisB}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>

          </div>
        )}
      </div>
    </motion.div>
  );
}
