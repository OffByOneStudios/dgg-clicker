// Simple Markov Chain implementation for chatbots
// Usage: const mc = new MarkovChain(); mc.train(["hello world", ...]); mc.generate();

import React, { createContext, useContext, useEffect, useRef, ReactNode, MutableRefObject } from "react";

export class MarkovChain {
  private chain: Record<string, string[]> = {};
  private startWords: string[] = [];

  train(sentences: string[]) {
    for (const sentence of sentences) {
      const words = sentence.split(/\s+/).filter(Boolean);
      if (words.length === 0) continue;
      this.startWords.push(words[0]);
      for (let i = 0; i < words.length - 1; i++) {
        const key = words[i].toLowerCase();
        if (!this.chain[key]) this.chain[key] = [];
        this.chain[key].push(words[i + 1]);
      }
      // Mark sentence end
      const lastWord = words[words.length - 1].toLowerCase();
      if (!this.chain[lastWord]) this.chain[lastWord] = [];
      this.chain[lastWord].push(null as any);
    }
  }

  generate(maxWords = 20): string {
    if (this.startWords.length === 0) return "";
    let word = this.random(this.startWords);
    const result = [word];
    for (let i = 1; i < maxWords; i++) {
      const nextWords = this.chain[word.toLowerCase()];
      if (!nextWords || nextWords.length === 0) break;
      const next = this.random(nextWords);
      if (!next) break;
      result.push(next);
      word = next;
    }
    return result.join(" ");
  }

  private random<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }
}

// Context and Provider for MarkovChain
export const MarkovChainContext = createContext<MutableRefObject<MarkovChain | null> | null>(null);

export const MarkovChainProvider = ({ children }: { children: ReactNode }) => {
  const markovRef = useRef<MarkovChain | null>(null);

  useEffect(() => {
    const loadCorpus = async () => {
      try {
        const res = await fetch("/txt/chat_corpus.txt");
        const text = await res.text();
        const lines = text.split(/\r?\n/).filter(Boolean);
        markovRef.current = new MarkovChain();
        markovRef.current.train(lines);
      } catch (e) {
        markovRef.current = new MarkovChain();
      }
    };
    loadCorpus();
  }, []);

  return React.createElement(
    MarkovChainContext.Provider,
    { value: markovRef },
    children
  );
};

export const useMarkovChain = () => {
  const ctx = useContext(MarkovChainContext);
  if (!ctx) throw new Error("useMarkovChain must be used within a MarkovChainProvider");
  return ctx;
};
