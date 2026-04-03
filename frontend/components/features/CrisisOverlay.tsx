"use client";

import { motion, AnimatePresence } from "framer-motion";

interface CrisisOverlayProps {
  visible: boolean;
  onClose: () => void;
}

export default function CrisisOverlay({ visible, onClose }: CrisisOverlayProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="glass rounded-2xl p-8 max-w-md mx-4 text-center space-y-4 border border-danger/30"
          >
            <div className="text-4xl">🚨</div>
            <h2 className="text-xl font-bold text-danger">
              You Are Not Alone
            </h2>
            <p className="text-text-muted text-sm leading-relaxed">
              If you or someone you know is in crisis, please reach out immediately:
            </p>
            <div className="space-y-2 text-sm">
              <a
                href="tel:9152987821"
                className="block px-4 py-2 rounded-lg bg-danger/20 text-danger hover:bg-danger/30 transition-colors"
              >
                📞 iCall — 9152987821
              </a>
              <a
                href="tel:08046110007"
                className="block px-4 py-2 rounded-lg bg-warning/20 text-warning hover:bg-warning/30 transition-colors"
              >
                📞 NIMHANS — 080-46110007
              </a>
              <a
                href="tel:9820466726"
                className="block px-4 py-2 rounded-lg bg-primary/20 text-primary-light hover:bg-primary/30 transition-colors"
              >
                📞 Vandrevala Foundation — 9820466726
              </a>
            </div>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2 rounded-lg bg-surface-lighter text-text-muted hover:text-text transition-colors text-sm"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
