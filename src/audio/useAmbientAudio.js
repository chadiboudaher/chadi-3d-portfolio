import { useCallback, useEffect, useRef, useState } from "react";

const AMBIENCE_SRC = "/audio/camp-ambience.mp3";
const DEFAULT_VOLUME = 0.2;
const FADE_DURATION_MS = 2200;

export default function useAmbientAudio() {
  const audioRef = useRef(null);
  const fadeFrameRef = useRef(null);
  const mutedRef = useRef(false);
  const [isMuted, setIsMuted] = useState(false);

  const fadeIn = useCallback((audio) => {
    const startedAt = performance.now();

    const updateVolume = (now) => {
      const progress = Math.min((now - startedAt) / FADE_DURATION_MS, 1);
      audio.volume = DEFAULT_VOLUME * progress;

      if (progress < 1) {
        fadeFrameRef.current = requestAnimationFrame(updateVolume);
      } else {
        fadeFrameRef.current = null;
      }
    };

    fadeFrameRef.current = requestAnimationFrame(updateVolume);
  }, []);

  const start = useCallback(() => {
    if (audioRef.current) return;

    const audio = new Audio(AMBIENCE_SRC);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0;
    audio.muted = mutedRef.current;
    audio.setAttribute("playsinline", "");
    audioRef.current = audio;

    audio
      .play()
      .then(() => fadeIn(audio))
      .catch(() => {
        // The control remains available so a later user gesture can retry playback.
      });
  }, [fadeIn]);

  const toggleMuted = useCallback(() => {
    const nextMuted = !mutedRef.current;
    mutedRef.current = nextMuted;
    setIsMuted(nextMuted);

    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = nextMuted;
    if (!nextMuted && audio.paused) {
      audio
        .play()
        .then(() => {
          if (audio.volume === 0) fadeIn(audio);
        })
        .catch(() => {});
    }
  }, [fadeIn]);

  useEffect(
    () => () => {
      if (fadeFrameRef.current !== null) {
        cancelAnimationFrame(fadeFrameRef.current);
      }

      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        audio.removeAttribute("src");
        audio.load();
        audioRef.current = null;
      }
    },
    [],
  );

  return { isMuted, start, toggleMuted };
}
