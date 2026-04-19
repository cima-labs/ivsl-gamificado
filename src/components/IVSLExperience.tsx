"use client";

import { useState, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import WaitingRoom from "./stages/WaitingRoom";
import Spectacle from "./stages/Spectacle";
import Qualification from "./stages/Qualification";
import Scanning from "./stages/Scanning";
import Diagnosis from "./stages/Diagnosis";
import Selection from "./stages/Selection";
import Entering from "./stages/Entering";
import VideoFinal from "./stages/VideoFinal";
import LockScreen from "./stages/LockScreen";
import WhatsAppChat, { WhatsAppSubStage } from "./stages/WhatsAppChat";
import LandingPage from "./stages/LandingPage";

export type Stage =
  | "waiting" | "spectacle" | "qualification" | "scanning" | "diagnosis"
  | "entering" | "videofinal" | "lockscreen"
  | "whatsapp" | "call-screen" | "tiktok-login" | "tiktok-feed" | "aurelius-chat" | "video-call"
  | "selection" | "landing";

export const STAGE_ORDER: Stage[] = [
  "waiting", "spectacle", "qualification", "scanning", "diagnosis",
  "entering", "videofinal", "lockscreen",
  "whatsapp", "call-screen", "tiktok-login", "tiktok-feed", "aurelius-chat", "video-call",
  "landing",
];

export const STAGE_LABELS: Record<Stage, string> = {
  waiting:       "1·Waiting",
  spectacle:     "2·Spectacle",
  qualification: "3·Qualif.",
  scanning:      "4·Scanning",
  diagnosis:     "5·Diagnosis",
  entering:      "6·Entering",
  videofinal:    "7·Video",
  lockscreen:    "8·Lock",
  whatsapp:      "9·Analista",
  "call-screen": "10·CallScreen",
  "tiktok-login":"11·TikLogin",
  "tiktok-feed": "12·TikFeed",
  "aurelius-chat":"13·Aurelius",
  "video-call":  "14·VideoCall",
  selection:     "15·Selection",
  landing:       "15·Landing",
};

// Etapas que renderizan WhatsAppChat con un sub-stage
const WHATSAPP_SUBSTAGES: Partial<Record<Stage, WhatsAppSubStage>> = {
  whatsapp:        "analista",
  "call-screen":   "call-screen",
  "tiktok-login":  "tiktok-login",
  "tiktok-feed":   "tiktok-feed",
  "aurelius-chat": "aurelius-chat",
  "video-call":    "video-call",
};

interface IVSLExperienceProps {
  devStage?: Stage;
  onStageChange?: (s: Stage) => void;
}

export default function IVSLExperience({ devStage, onStageChange }: IVSLExperienceProps) {
  const [internalStage, setInternalStage] = useState<Stage>("waiting");
  const stage = devStage ?? internalStage;
  function setStage(s: Stage) {
    setInternalStage(s);
    onStageChange?.(s);
  }
  const tensionRef = useRef<HTMLAudioElement>(null);

  function startTension() {
    if (!tensionRef.current) return;
    tensionRef.current.volume = 0.55;
    tensionRef.current.currentTime = 0;
    tensionRef.current.play().catch(() => {});
  }

  function stopTension() {
    const audio = tensionRef.current;
    if (!audio) return;
    audio.volume = 0;
    audio.pause();
    audio.currentTime = 0;
  }

  function startTensionFresh() {
    const audio = tensionRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    audio.volume = 0.55;
    audio.play().catch(() => {});
  }

  const whatsappSubStage = WHATSAPP_SUBSTAGES[stage];

  return (
    <div className="relative w-full h-full bg-[#050505]">
      <audio ref={tensionRef} src="/sounds/pista tension.mp3" loop />

      <AnimatePresence mode="wait">
        {stage === "waiting" && (
          <WaitingRoom key="waiting" onEnter={() => setStage("spectacle")} />
        )}
        {stage === "spectacle" && (
          <Spectacle key="spectacle" onComplete={() => setStage("qualification")} />
        )}
        {stage === "qualification" && (
          <Qualification key="qualification" onStart={startTensionFresh} onFilterDone={stopTension} onComplete={() => setStage("scanning")} />
        )}
        {stage === "scanning" && (
          <Scanning key="scanning" onComplete={() => setStage("diagnosis")} />
        )}
        {stage === "diagnosis" && (
          <Diagnosis key="diagnosis" onComplete={() => setStage("entering")} />
        )}
        {stage === "entering" && (
          <Entering key="entering" onComplete={() => setStage("videofinal")} />
        )}
        {stage === "videofinal" && (
          <VideoFinal key="videofinal" onComplete={() => setStage("lockscreen")} />
        )}
        {stage === "lockscreen" && (
          <LockScreen key="lockscreen" onOpen={() => setStage("whatsapp")} />
        )}
        {whatsappSubStage && (
          <WhatsAppChat key={stage} devSubStage={whatsappSubStage} onComplete={() => setStage("landing")} />
        )}
        {stage === "selection" && (
          <Selection key="selection" />
        )}
        {stage === "landing" && (
          <LandingPage key="landing" />
        )}
      </AnimatePresence>
    </div>
  );
}
