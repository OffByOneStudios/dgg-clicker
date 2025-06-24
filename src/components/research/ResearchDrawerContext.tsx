import React, { createContext, useContext, useState, ReactNode } from "react";

interface ResearchDrawerContextType {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const ResearchDrawerContext = createContext<ResearchDrawerContextType | undefined>(undefined);

export function ResearchDrawerProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  return (
    <ResearchDrawerContext.Provider value={{ isOpen, open, close }}>
      {children}
    </ResearchDrawerContext.Provider>
  );
}

export function useResearchDrawer() {
  const ctx = useContext(ResearchDrawerContext);
  if (!ctx) throw new Error("useResearchDrawer must be used within ResearchDrawerProvider");
  return ctx;
}
