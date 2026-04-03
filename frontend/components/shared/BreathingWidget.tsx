"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const PHASES = [
  { label: "Breathe In", duration: 4, scale: 1.6 },
  { label: "Hold", duration: 4, scale: 1.6 },
  { label: "Breathe Out", duration: 4, scale: 1 },
];

export default function BreathingWidget() {
  const [phase, setPhase] = useState(0);
  const [active, setActive] = useState(false);

  const current = PHASES[phase];

  const handleAnimationComplete = () => {
    setPhase((p) => (p + 1) % PHASES.length);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <motion.div
        className="w-36 h-36 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center cursor-pointer select-none"
        animate={active ? { scale: current.scale } : { scale: 1 }}
        transition={active ? { duration: current.duration, ease: "easeInOut" } : {}}
        onAnimationComplete={active ? handleAnimationComplete : undefined}
        onClick={() => setActive(!active)}
      >
        <span className="text-sm font-medium text-white/90 text-center">
          {active ? current.label : "Tap to start"}
        </span>
      </motion.div>

      <p className="text-text-muted text-xs">
        {active ? "Follow the circle" : "Interactive breathing exercise"}
      </p>
    </div>
  );
}
