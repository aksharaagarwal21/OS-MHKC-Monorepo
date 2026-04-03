"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: "🏠" },
  { label: "Chat", href: "/chat", icon: "💬" },
  { label: "Patient", href: "/dashboard/patient", icon: "🧑‍⚕️" },
  { label: "Doctor", href: "/dashboard/doctor", icon: "👨‍⚕️" },
  { label: "Admin", href: "/dashboard/admin", icon: "🛡️" },
];

export default function SideNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-surface-light hover:bg-surface-lighter transition-colors text-xl"
        aria-label="Toggle navigation"
      >
        {open ? "✕" : "☰"}
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            exit={{ x: -260 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 h-full w-60 z-40 glass flex flex-col pt-16 px-4 gap-1"
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-muted hover:text-text hover:bg-surface-lighter/50 transition-colors text-sm"
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black z-30"
          />
        )}
      </AnimatePresence>
    </>
  );
}
