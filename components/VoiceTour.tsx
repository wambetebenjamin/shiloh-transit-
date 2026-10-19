"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

const script = `Welcome to Shiloh Transit. We make booking your bus or matatu seat fast, simple, and reliable. Search any route across Kenya, pick your seat on a live seat map, pay via M-Pesa or card, and receive your e-ticket instantly. Your journey starts here.`;

/**
 * Site voice tour. Starts on the first scroll or click (never
 * autoplay), runs once, then the listeners are removed. After the
 * utterance ends the button label changes to "Replay tour".
 */
export default function VoiceTour() {
  const [speaking, setSpeaking] = useState(false);
  const [muted, setMuted] = useState(false);
  const [finished, setFinished] = useState(false);
  const startedRef = useRef(false);

  const cleanupRef = useRef<() => void>(() => undefined);

  const speak = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(script);
    utterance.rate = 0.92;
    utterance.pitch = 1.05;
    utterance.lang = "en-KE";
    utterance.onstart = () => {
      setSpeaking(true);
      setMuted(false);
      setFinished(false);
    };
    utterance.onend = () => {
      setSpeaking(false);
      setFinished(true);
    };
    utterance.onerror = () => {
      setSpeaking(false);
      setFinished(true);
    };
    synth.speak(utterance);
    setSpeaking(true);
    setMuted(false);
  };

  useEffect(() => {
    const runOnce = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      cleanup();
      speak();
    };
    const cleanup = () => {
      window.removeEventListener("scroll", runOnce);
      window.removeEventListener("click", runOnce);
      cleanupRef.current = () => undefined;
    };
    cleanupRef.current = cleanup;
    window.addEventListener("scroll", runOnce, { passive: true });
    window.addEventListener("click", runOnce);
    return () => {
      window.removeEventListener("scroll", runOnce);
      window.removeEventListener("click", runOnce);
    };
  }, []);

  const handleClick = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (finished) {
      speak();
      return;
    }
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      setMuted(true);
      return;
    }
    if (!startedRef.current) {
      startedRef.current = true;
      cleanupRef.current();
      speak();
      return;
    }
    if (muted) {
      speak();
      return;
    }
    speak();
  };

  const label = finished ? "Replay tour" : "Site voice tour, click to mute";
  const tooltip = finished ? "Replay tour" : "Hear what this site is about";

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`fab fab--voice${speaking ? " fab__ring" : ""}`}
      aria-label={label}
      title={tooltip}
      style={{ zIndex: 9998 }}
    >
      {speaking && !finished ? <Volume2 size={24} /> : muted && !finished ? (
        <VolumeX size={24} />
      ) : (
        <Volume2 size={24} />
      )}
      <span className="fab__tooltip" role="tooltip">
        {tooltip}
      </span>
    </button>
  );
}
