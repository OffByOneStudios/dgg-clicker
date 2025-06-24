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
  globalVolume: number;
  setGlobalVolume: (volume: number) => void;
};

const AudioEngineContext = createContext<AudioContextType | undefined>(undefined);

const SFX_URLS = [
  '/audio/sfx/combobreak.wav',
  '/audio/sfx/sectionfail.wav',
  '/audio/sfx/sectionpass.wav',
  '/audio/sfx/soft-hitclap.wav',
];

export function AudioEngineProvider({ children, tracks = [] }: { children: React.ReactNode; tracks?: string[] }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [globalVolume, setGlobalVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sfxRef = useRef<HTMLAudioElement | null>(null);
  const sfxCache = useRef<Record<string, HTMLAudioElement>>({});

  // Preload SFX on mount
  React.useEffect(() => {
    SFX_URLS.forEach(url => {
      const audio = new Audio(url);
      audio.load();
      sfxCache.current[url] = audio;
    });
  }, []);

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
    audioRef.current.volume = globalVolume;
    audioRef.current.play();
  }, [tracks, currentTrack, globalVolume]);

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
        audioRef.current.volume = globalVolume;
        if (isPlaying) audioRef.current.play();
      }
      return nextIdx;
    });
  }, [tracks, isPlaying, globalVolume]);

  // Previous track
  const prev = useCallback(() => {
    if (!tracks.length) return;
    setCurrentTrack(idx => {
      const prevIdx = (idx - 1 + tracks.length) % tracks.length;
      if (audioRef.current) {
        audioRef.current.src = tracks[prevIdx];
        audioRef.current.volume = globalVolume;
        if (isPlaying) audioRef.current.play();
      }
      return prevIdx;
    });
  }, [tracks, isPlaying, globalVolume]);

  // Set track
  const setTrack = useCallback((idx: number) => {
    if (!tracks.length) return;
    setCurrentTrack(idx % tracks.length);
    if (audioRef.current) {
      audioRef.current.src = tracks[idx % tracks.length];
      audioRef.current.volume = globalVolume;
      if (isPlaying) audioRef.current.play();
    }
  }, [tracks, isPlaying, globalVolume]);

  // Play one-off SFX
  const playSfx = useCallback((url: string, volume: number = 1) => {
    let audio: HTMLAudioElement | undefined = sfxCache.current[url];
    if (audio) {
      // Clone to allow overlapping
      const clone = audio.cloneNode(true) as HTMLAudioElement;
      clone.volume = Math.max(0, Math.min(1, volume * globalVolume));
      clone.play();
      // Optionally clean up after play
      clone.onended = () => { clone.remove(); };
    } else {
      // fallback: load and play if not preloaded
      audio = new Audio(url);
      audio.volume = Math.max(0, Math.min(1, volume * globalVolume));
      audio.play();
    }
  }, [globalVolume]);

  // Clean up on unmount
  React.useEffect(() => {
    return () => {
      audioRef.current?.pause();
      sfxRef.current?.pause();
    };
  }, []);

  return (
    <AudioEngineContext.Provider value={{ isPlaying, currentTrack, tracks, play, pause, next, prev, setTrack, playSfx, globalVolume, setGlobalVolume }}>
      {children}
    </AudioEngineContext.Provider>
  );
}

export function useAudioEngine() {
  const ctx = useContext(AudioEngineContext);
  if (!ctx) throw new Error("useAudioEngine must be used within AudioEngineProvider");
  return ctx;
}
