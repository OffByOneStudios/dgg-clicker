import { useRef, useEffect, useState, createContext, useContext, ReactNode } from "react";
import { defaultComponents } from "./defaultComponents";
import type {
  ComponentType,
  InventoryConsumable,
  InventoryEquipment,
  InventoryItem,
  EquipmentId,
  SkillSlotType,
  PepeEquipment,
  SimulationState
} from "./types";
import { toaster } from '../../ui/toaster';

// Context Types
export type ClickerContextType = {
  score: number;
  money: number;
  research: number;
  components: ComponentType[];
  handleClick: () => void;
  buyComponent: (id: string) => void;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  setMoney: React.Dispatch<React.SetStateAction<number>>;
  setResearch: React.Dispatch<React.SetStateAction<number>>;
  resetGame: () => void;
  paused: boolean;
  setPaused: React.Dispatch<React.SetStateAction<boolean>>;
  inventory: InventoryItem[];
  buyItem: (id: string) => void;
  consumeItem: (id: string) => void;
  equipItem: (id: string) => void;
  pepeEquipment: PepeEquipment;
  setPepeEquipment: React.Dispatch<React.SetStateAction<PepeEquipment>>;
};

const ClickerContext = createContext<ClickerContextType | undefined>(undefined);

export const defaultPepeEquipment: PepeEquipment = {
  pc: { id: "pc", type: "equipment", name: "PC", owned: false, effect: "" },
  monitor: { id: "monitor", type: "equipment", name: "Monitor", owned: false, effect: "" },
  keyboard: { id: "keyboard", type: "equipment", name: "Keyboard", owned: false, effect: "" },
  mouse: { id: "mouse", type: "equipment", name: "Mouse", owned: false, effect: "" },
  microphone: { id: "microphone", type: "equipment", name: "Microphone", owned: false, effect: "" },
  camera: { id: "camera", type: "equipment", name: "Camera", owned: false, effect: "" },
  chair: { id: "chair", type: "equipment", name: "Chair", owned: false, effect: "" },
  skills: [null, null, null],
  ultimate: null,
};

export const ClickerProvider = ({ children }: { children: ReactNode }) => {
  const [score, setScore] = useState(0);
  const [money, setMoney] = useState(0);
  const [research, setResearch] = useState(0);
  const [components, setComponents] = useState(defaultComponents);
  const [paused, setPaused] = useState(false);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [pepeEquipment, setPepeEquipment] = useState<PepeEquipment>(defaultPepeEquipment);
  const workerRef = useRef<Worker | null>(null);
  

  useEffect(() => {
    const worker = new Worker(new URL("./worker/index.ts", import.meta.url), { type: "module" });
    workerRef.current = worker;
    worker.postMessage({ type: "init", payload: { }});
    worker.onmessage = (e) => {
      if (e.data.type === "state") {
        setScore(e.data.score);
        setMoney(e.data.money);
        setResearch(e.data.research);
        setComponents(e.data.components);
        setInventory(e.data.inventory || []);
        setPepeEquipment(e.data.pepeEquipment || defaultPepeEquipment);
      } else if (e.data.type === "sendToast" && e.data.payload) {
        toaster.create({
          title: e.data.payload.message,
          type: e.data.payload.status || 'info',
          duration: 3000,
          closable: true,
        });
      }
    };
    // Debug: expose setResources on window
    (window as any).setResources = (resources: { score?: number; money?: number; research?: number }) => {
      worker.postMessage({ type: "setResources", payload: resources });
    };
    return () => worker.terminate();
  }, []);

  // Proxy actions to worker
  const handleClick = () => workerRef.current?.postMessage({ type: "click" });
  const buyComponent = (id: string) => workerRef.current?.postMessage({ type: "buyComponent", payload: { id } });
  const resetGame = () => workerRef.current?.postMessage({ type: "reset" });
  const buyItem = (id: string) => workerRef.current?.postMessage({ type: "buyItem", payload: { id } });
  const consumeItem = (id: string) => workerRef.current?.postMessage({ type: "consumeItem", payload: { id } });
  const equipItem = (id: string) => workerRef.current?.postMessage({ type: "equipItem", payload: { id } });
  useEffect(() => {
    if (paused) workerRef.current?.postMessage({ type: "pause" });
    else workerRef.current?.postMessage({ type: "resume" });
  }, [paused]);

  return (
    <ClickerContext.Provider value={{ score, money, research, components, handleClick, buyComponent, setScore, setMoney, setResearch, resetGame, paused, setPaused, inventory, buyItem, consumeItem, equipItem, pepeEquipment, setPepeEquipment }}>
      {children}
    </ClickerContext.Provider>
  );
};

export function useClicker() {
  const ctx = useContext(ClickerContext);
  if (!ctx) throw new Error("useClicker must be used within ClickerProvider");
  return ctx;
}
