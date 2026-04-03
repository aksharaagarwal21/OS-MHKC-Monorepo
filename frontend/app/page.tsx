"use client";

import BreathingWidget from "@/components/shared/BreathingWidget";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Link from "next/link";
import { motion } from "framer-motion";

const FEATURES = [
  { icon: "💬", title: "AI Chat", desc: "Multi-persona therapeutic conversations", href: "/chat" },
  { icon: "📊", title: "Mood Tracker", desc: "Daily emotional check-ins & insights", href: "/dashboard/patient" },
  { icon: "🩺", title: "Doctor View", desc: "Clinical verification dashboard", href: "/dashboard/doctor" },
  { icon: "🛡️", title: "Admin Panel", desc: "Enterprise moderation & analytics", href: "/dashboard/admin" },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center px-4 py-20 gap-16">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl space-y-6"
      >
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-light via-accent to-accent-light bg-clip-text text-transparent">
          Mental Health Knowledge Companion
        </h1>
        <p className="text-text-muted text-lg leading-relaxed">
          An AI-powered safe space for emotional wellness — culturally sensitive,
          clinically informed, and always available.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/chat">
            <Button size="lg">Start Chatting</Button>
          </Link>
          <Link href="/dashboard/patient">
            <Button variant="outline" size="lg">Dashboard</Button>
          </Link>
        </div>
      </motion.section>

      {/* Breathing Widget */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <BreathingWidget />
      </motion.section>

      {/* Feature Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl w-full">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 * i }}
          >
            <Link href={f.href}>
              <Card className="hover:border-primary/30 transition-colors cursor-pointer h-full">
                <span className="text-3xl">{f.icon}</span>
                <h3 className="font-semibold mt-3">{f.title}</h3>
                <p className="text-text-muted text-xs mt-1">{f.desc}</p>
              </Card>
            </Link>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
