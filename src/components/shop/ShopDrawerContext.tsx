import React, { createContext, useContext, useState, ReactNode } from "react";

interface ShopDrawerContextType {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const ShopDrawerContext = createContext<ShopDrawerContextType | undefined>(undefined);

export function ShopDrawerProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  return (
    <ShopDrawerContext.Provider value={{ isOpen, open, close }}>
      {children}
    </ShopDrawerContext.Provider>
  );
}

export function useShopDrawer() {
  const ctx = useContext(ShopDrawerContext);
  if (!ctx) throw new Error("useShopDrawer must be used within ShopDrawerProvider");
  return ctx;
}
