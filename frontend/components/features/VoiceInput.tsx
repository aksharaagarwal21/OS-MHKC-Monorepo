"use client";

import { useEffect, useRef, useState } from "react";

interface VoiceInputProps {
  onResult: (transcript: string) => void;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function VoiceInput({ onResult }: VoiceInputProps) {
  const [listening, setListening] = useState(false);
  const recogRef = useRef<any>(null);

  useEffect(() => {
    const w = window as any;
    const SpeechRecognition = w.SpeechRecognition || w.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = false;
      recog.lang = "en-IN"; // default vernacular support
      recog.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        onResult(transcript);
        setListening(false);
      };
      recog.onend = () => setListening(false);
      recogRef.current = recog;
    }
  }, [onResult]);

  const toggle = () => {
    if (!recogRef.current) return;
    if (listening) {
      recogRef.current.stop();
    } else {
      recogRef.current.start();
      setListening(true);
    }
  };

  return (
    <button
      onClick={toggle}
      className={`p-2 rounded-full transition-colors ${
        listening
          ? "bg-danger text-white animate-pulse"
          : "bg-surface-lighter text-text-muted hover:text-text"
      }`}
      title="Voice input"
    >
      🎤
    </button>
  );
}
