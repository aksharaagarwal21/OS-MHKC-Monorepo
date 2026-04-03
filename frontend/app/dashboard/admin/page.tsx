"use client";

import Card from "@/components/ui/Card";
import { motion } from "framer-motion";

// Simple heatmap data (7 days × 4 time-slots)
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const SLOTS = ["Morning", "Afternoon", "Evening", "Night"];
const HEATMAP: number[][] = [
  [3, 7, 5, 2],
  [4, 9, 6, 3],
  [2, 5, 8, 4],
  [6, 8, 7, 5],
  [5, 6, 9, 6],
  [8, 4, 3, 2],
  [7, 3, 2, 1],
];

function heatColor(val: number): string {
  if (val >= 8) return "bg-danger/70";
  if (val >= 6) return "bg-warning/60";
  if (val >= 4) return "bg-primary/50";
  return "bg-success/40";
}

const FLAGGED = [
  { user: "anon_142", reason: "Keyword: self-harm detected", time: "12m ago" },
  { user: "anon_087", reason: "Repeated crisis triggers", time: "1h ago" },
  { user: "anon_301", reason: "Unusual session length (3h+)", time: "3h ago" },
];

export default function AdminDashboard() {
  return (
    <div className="max-w-5xl mx-auto px-4 pt-20 pb-10 space-y-8">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold"
      >
        🛡️ Admin Dashboard
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Heatmap */}
        <Card>
          <h2 className="font-semibold mb-4">Platform Activity Heatmap</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr>
                  <th className="text-left text-text-muted pr-2"></th>
                  {SLOTS.map((s) => (
                    <th key={s} className="text-center text-text-muted px-1 pb-2">{s}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DAYS.map((day, di) => (
                  <tr key={day}>
                    <td className="text-text-muted pr-2 py-1">{day}</td>
                    {HEATMAP[di].map((val, si) => (
                      <td key={si} className="px-1 py-1">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: (di * 4 + si) * 0.03 }}
                          className={`w-full h-8 rounded-md ${heatColor(val)} flex items-center justify-center text-white/80 font-medium`}
                        >
                          {val}
                        </motion.div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Moderation Queue */}
        <Card>
          <h2 className="font-semibold mb-4">⚠️ Moderation Queue</h2>
          <div className="space-y-3">
            {FLAGGED.map((f, i) => (
              <motion.div
                key={f.user}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg bg-surface-lighter/50"
              >
                <div>
                  <p className="text-sm font-medium">{f.user}</p>
                  <p className="text-xs text-text-muted">{f.reason}</p>
                </div>
                <span className="text-[10px] text-text-muted">{f.time}</span>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Active Users", value: "1,247", icon: "👥" },
          { label: "Sessions Today", value: "342", icon: "💬" },
          { label: "Crisis Flags", value: "7", icon: "🚨" },
          { label: "Avg. Mood", value: "6.3", icon: "📊" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="text-center">
              <span className="text-2xl">{s.icon}</span>
              <p className="text-xl font-bold mt-1">{s.value}</p>
              <p className="text-text-muted text-xs">{s.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
