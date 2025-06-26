import React, { createContext, useContext, useEffect, useState, ReactNode, useRef } from "react";
import { defaultComponents } from "./simulation/defaultComponents";

// Types
export type ComponentType = {
  id: string;
  name: string;
  cost: number;
  costFactor: number;
  pointsPerSecond: number;
  moneyPerSecond: number
  researchPerSecond: number;
  owned: number;
};

export type ClickerContextType = {
  score: number;
  components: ComponentType[];
  handleClick: () => void;
  buyComponent: (id: string) => void;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  resetGame: () => void;
};

const ClickerContext = createContext<ClickerContextType | undefined>(undefined);

function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}

function useInterval(callback: () => void, delay: number | null) {
  useEffect(() => {
    if (delay === null) return;
    const id = setInterval(callback, delay);
    return () => clearInterval(id);
  }, [callback, delay]);
}

export const ClickerProvider = ({ children }: { children: ReactNode }) => {
  const [score, setScore] = useLocalStorage<number>("score", 0);
  const [components, setComponents] = useLocalStorage<ComponentType[]>("components", defaultComponents);

  // refs to always have latest value
  const componentsRef = useRef(components);
  const scoreRef = useRef(score);
  useEffect(() => { componentsRef.current = components; }, [components]);
  useEffect(() => { scoreRef.current = score; }, [score]);

  const handleClick = () => setScore(s => s + 1);

  const buyComponent = (id: string) => {
    setComponents(prev => {
      const comp = prev.find(c => c.id === id);
      if (!comp) return prev;
      if (scoreRef.current < comp.cost) return prev;
      setScore(s => s - comp.cost);
      return prev.map(c =>
        c.id === id ? { ...c, owned: c.owned + 1 } : c
      );
    });
  };

  // Reset all owned components and score
  const resetGame = () => {
    setComponents(prev => prev.map(c => ({ ...c, owned: 0 })));
    setScore(0);
  };

  // Add points over time with a faster interval and correct time delta
  const intervalMs = 100; // 0.1 second
  const lastTickRef = useRef(Date.now());
  useInterval(() => {
    const now = Date.now();
    const deltaSec = (now - lastTickRef.current) / 1000;
    lastTickRef.current = now;
    const comps = componentsRef.current;
    const totalPPS = comps.reduce((sum, c) => sum + c.pointsPerSecond * c.owned, 0);
    setScore(s => s + totalPPS * deltaSec);
  }, intervalMs);

  return (
    <ClickerContext.Provider value={{ score, components, handleClick, buyComponent, setScore, resetGame }}>
      {children}
    </ClickerContext.Provider>
  );
};

export function useClicker() {
  const ctx = useContext(ClickerContext);
  if (!ctx) throw new Error("useClicker must be used within ClickerProvider");
  return ctx;
}
