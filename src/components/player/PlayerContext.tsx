import React, { createContext, useContext, useState, ReactNode, useRef, useEffect } from "react";
import { characters, type Character, type Emote } from "./characters";

export type PlayerContextType = {
  currentPlayer: Character;
  currentEmote: Emote;
  setPlayer: (player: Character) => void;
  setEmote: (emote: Emote) => void;
  transition: (emote: Emote, duration: number) => void;
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentPlayer, setCurrentPlayer] = useState<Character>(characters["Pepe"]);
  const [currentEmote, setCurrentEmote] = useState<Emote>("IdleMouthClosed");
  const emoteTimeout = useRef<NodeJS.Timeout | null>(null);

  // Preload all emote images for all characters
  useEffect(() => {
    Object.values(characters).forEach(char => {
      Object.values(char.emotes).forEach(url => {
        const img = new window.Image();
        img.src = url;
      });
    });
  }, []);

  const setPlayer = (player: Character) => setCurrentPlayer(player);
  const setEmote = (emote: Emote) => setCurrentEmote(emote);

  const transition = (emote: Emote, duration: number) => {
    if (emoteTimeout.current) clearTimeout(emoteTimeout.current);
    setCurrentEmote(emote);
    emoteTimeout.current = setTimeout(() => {
      setCurrentEmote("IdleMouthClosed");
    }, duration);
  };

  return (
    <PlayerContext.Provider value={{ currentPlayer, currentEmote, setPlayer, setEmote, transition }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
}
