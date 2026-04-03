"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import { motion } from "framer-motion";

const ARTICLES = [
  { id: 1, title: "Understanding Anxiety", tags: ["anxiety", "coping"], snippet: "Learn about coping mechanisms including deep breathing and grounding techniques." },
  { id: 2, title: "Mindfulness Meditation 101", tags: ["mindfulness"], snippet: "Start with 5 minutes daily and gradually increase your practice." },
  { id: 3, title: "Breaking the Stigma in India", tags: ["cultural", "india"], snippet: "Organizations like NIMHANS and iCall are making therapy accessible." },
];

export default function PatientDashboard() {
  const [mood, setMood] = useState(5);

  return (
    <div className="max-w-4xl mx-auto px-4 pt-20 pb-10 space-y-8">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold"
      >
        🧑‍⚕️ Patient Dashboard
      </motion.h1>

      {/* Mood Slider */}
      <Card>
        <h2 className="font-semibold mb-3">How are you feeling today?</h2>
        <div className="flex items-center gap-4">
          <span className="text-2xl">😞</span>
          <input
            type="range"
            min={1}
            max={10}
            value={mood}
            onChange={(e) => setMood(Number(e.target.value))}
            className="flex-1 accent-primary"
          />
          <span className="text-2xl">😊</span>
        </div>
        <p className="text-center text-text-muted text-sm mt-2">
          Mood: <span className="text-primary-light font-semibold">{mood}/10</span>
        </p>
      </Card>

      {/* Wiki Feed */}
      <section>
        <h2 className="font-semibold mb-3">📰 Wellness Articles</h2>
        <div className="grid gap-3">
          {ARTICLES.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="hover:border-primary/20 transition-colors cursor-pointer">
                <h3 className="font-medium text-sm">{a.title}</h3>
                <p className="text-text-muted text-xs mt-1">{a.snippet}</p>
                <div className="flex gap-1 mt-2">
                  {a.tags.map((t) => (
                    <span key={t} className="px-2 py-0.5 bg-primary/10 text-primary-light text-[10px] rounded-full">
                      {t}
                    </span>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
