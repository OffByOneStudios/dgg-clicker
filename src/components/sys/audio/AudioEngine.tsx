import React, { createContext, useContext, useRef, useState, useCallback } from "react";

export type AudioContextType = {
  isPlaying: boolean;
  currentTrack: number;
  tracks: string[];
  play: () => void;
  pause: () => void;
  next: () => void;
  prev: () => void;
  setTrack: (idx: number) => void;
  playSfx: (url: string, volume?: number) => void;
};

const AudioEngineContext = createContext<AudioContextType | undefined>(undefined);

export function AudioEngineProvider({ children, tracks = [] }: { children: React.ReactNode; tracks?: string[] }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sfxRef = useRef<HTMLAudioElement | null>(null);

  // Play current track
  const play = useCallback(() => {
    if (!tracks.length) return;
    setIsPlaying(true);
    if (!audioRef.current) {
      audioRef.current = new Audio(tracks[currentTrack]);
      audioRef.current.loop = false;
      audioRef.current.onended = () => next();
    }
    audioRef.current.src = tracks[currentTrack];
    audioRef.current.play();
  }, [tracks, currentTrack]);

  // Pause
  const pause = useCallback(() => {
    setIsPlaying(false);
    audioRef.current?.pause();
  }, []);

  // Next track
  const next = useCallback(() => {
    if (!tracks.length) return;
    setCurrentTrack(idx => {
      const nextIdx = (idx + 1) % tracks.length;
      if (audioRef.current) {
        audioRef.current.src = tracks[nextIdx];
        if (isPlaying) audioRef.current.play();
      }
      return nextIdx;
    });
  }, [tracks, isPlaying]);

  // Previous track
  const prev = useCallback(() => {
    if (!tracks.length) return;
    setCurrentTrack(idx => {
      const prevIdx = (idx - 1 + tracks.length) % tracks.length;
      if (audioRef.current) {
        audioRef.current.src = tracks[prevIdx];
        if (isPlaying) audioRef.current.play();
      }
      return prevIdx;
    });
  }, [tracks, isPlaying]);

  // Set track
  const setTrack = useCallback((idx: number) => {
    if (!tracks.length) return;
    setCurrentTrack(idx % tracks.length);
    if (audioRef.current) {
      audioRef.current.src = tracks[idx % tracks.length];
      if (isPlaying) audioRef.current.play();
    }
  }, [tracks, isPlaying]);

  // Play one-off SFX
  const playSfx = useCallback((url: string, volume: number = 1) => {
    if (sfxRef.current) {
      sfxRef.current.pause();
      sfxRef.current.currentTime = 0;
    }
    sfxRef.current = new Audio(url);
    sfxRef.current.volume = volume;
    sfxRef.current.play();
  }, []);

  // Clean up on unmount
  React.useEffect(() => {
    return () => {
      audioRef.current?.pause();
      sfxRef.current?.pause();
    };
  }, []);

  return (
    <AudioEngineContext.Provider value={{ isPlaying, currentTrack, tracks, play, pause, next, prev, setTrack, playSfx }}>
      {children}
    </AudioEngineContext.Provider>
  );
}

export function useAudioEngine() {
  const ctx = useContext(AudioEngineContext);
  if (!ctx) throw new Error("useAudioEngine must be used within AudioEngineProvider");
  return ctx;
}
