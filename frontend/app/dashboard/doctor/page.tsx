"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";

interface PendingCase {
  id: number;
  patient: string;
  summary: string;
  risk: "low" | "medium" | "high";
}

const MOCK_CASES: PendingCase[] = [
  { id: 1, patient: "Aarav S.", summary: "Reports persistent anxiety over 2 weeks. Sleep disturbance noted.", risk: "medium" },
  { id: 2, patient: "Priya M.", summary: "Expressed hopelessness in recent chat session. Flagged by AI.", risk: "high" },
  { id: 3, patient: "Rohan K.", summary: "Mild stress related to academic pressure. Improving trend.", risk: "low" },
];

const RISK_COLORS = {
  low: "bg-success/20 text-success",
  medium: "bg-warning/20 text-warning",
  high: "bg-danger/20 text-danger",
};

export default function DoctorDashboard() {
  const [cases, setCases] = useState(MOCK_CASES);
  const [current, setCurrent] = useState(0);

  const swipe = (action: "approve" | "flag") => {
    console.log(`${action} case ${cases[current]?.id}`);
    setCurrent((c) => c + 1);
  };

  const activeCase = cases[current];

  return (
    <div className="max-w-2xl mx-auto px-4 pt-20 pb-10 space-y-8">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold"
      >
        👨‍⚕️ Doctor Dashboard
      </motion.h1>

      <p className="text-text-muted text-sm">
        Swipe to verify AI-flagged cases — approve safe assessments or flag for review.
      </p>

      {/* Tinder-style Card */}
      <div className="relative h-64">
        <AnimatePresence mode="wait">
          {activeCase ? (
            <motion.div
              key={activeCase.id}
              initial={{ opacity: 0, scale: 0.9, rotateZ: -3 }}
              animate={{ opacity: 1, scale: 1, rotateZ: 0 }}
              exit={{ opacity: 0, x: 300, rotateZ: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="absolute inset-0"
            >
              <Card className="h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{activeCase.patient}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${RISK_COLORS[activeCase.risk]}`}>
                      {activeCase.risk} risk
                    </span>
                  </div>
                  <p className="text-text-muted text-sm leading-relaxed">{activeCase.summary}</p>
                </div>
                <div className="flex gap-3 mt-4">
                  <Button variant="danger" className="flex-1" onClick={() => swipe("flag")}>
                    🚩 Flag
                  </Button>
                  <Button variant="primary" className="flex-1" onClick={() => swipe("approve")}>
                    ✅ Approve
                  </Button>
                </div>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center h-full text-text-muted text-sm"
            >
              All cases reviewed ✓
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="text-text-muted text-xs text-center">
        {current} of {cases.length} cases reviewed
      </p>
    </div>
  );
}
