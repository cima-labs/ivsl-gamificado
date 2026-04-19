"use client";

import { useState } from "react";
import IVSLExperience, { STAGE_ORDER, STAGE_LABELS, Stage } from "@/components/IVSLExperience";

const IS_DEV = process.env.NODE_ENV === "development";

export default function Home() {
  const [devStage, setDevStage] = useState<Stage>("waiting");
  const currentIdx = STAGE_ORDER.indexOf(devStage);

  return (
    <main className="w-full bg-black flex items-center justify-center overflow-hidden" style={{ height: "100svh" }}>
      <div
        className="relative overflow-hidden bg-[#050505] app-container"
        style={{ width: "100%", height: "100%" }}
      >
        <IVSLExperience
          devStage={IS_DEV ? devStage : undefined}
          onStageChange={IS_DEV ? setDevStage : undefined}
        />
      </div>

      {/* ── DEV NAV — fuera del 9:16, solo en desarrollo ── */}
      {IS_DEV && (
        <div style={{
          position: "fixed", bottom: 20, right: 20,
          zIndex: 9999, display: "flex", alignItems: "center", gap: 8,
          background: "rgba(10,10,10,0.9)", border: "1px solid rgba(212,175,55,0.3)",
          borderRadius: "50px", padding: "8px 14px", backdropFilter: "blur(12px)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
        }}>
          <button
            onClick={() => currentIdx > 0 && setDevStage(STAGE_ORDER[currentIdx - 1])}
            disabled={currentIdx === 0}
            style={{
              background: "none", border: "none",
              color: currentIdx === 0 ? "rgba(255,255,255,0.2)" : "rgba(212,175,55,0.9)",
              fontSize: 20, cursor: currentIdx === 0 ? "default" : "pointer", lineHeight: 1, padding: "0 4px",
            }}
          >‹</button>
          <span style={{
            fontFamily: "monospace", fontSize: 11, color: "rgba(212,175,55,0.85)",
            letterSpacing: "0.05em", minWidth: 90, textAlign: "center",
          }}>
            {STAGE_LABELS[devStage]}
          </span>
          <button
            onClick={() => currentIdx < STAGE_ORDER.length - 1 && setDevStage(STAGE_ORDER[currentIdx + 1])}
            disabled={currentIdx === STAGE_ORDER.length - 1}
            style={{
              background: "none", border: "none",
              color: currentIdx === STAGE_ORDER.length - 1 ? "rgba(255,255,255,0.2)" : "rgba(212,175,55,0.9)",
              fontSize: 20, cursor: currentIdx === STAGE_ORDER.length - 1 ? "default" : "pointer", lineHeight: 1, padding: "0 4px",
            }}
          >›</button>
        </div>
      )}
    </main>
  );
}
