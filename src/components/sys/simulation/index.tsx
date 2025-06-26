import { useRef, useEffect, useState, createContext, useContext, ReactNode } from "react";
import { defaultComponents } from "./defaultComponents";

// Types
export type ComponentType = {
  id: string;
  name: string;
  cost: number;
  costFactor: number;
  pointsPerSecond: number;
  moneyPerSecond?: number;
  researchPerSecond?: number;
  owned: number;
};

// Inventory Types
export type InventoryConsumable = {
  id: string;
  type: "consumable";
  name: string;
  amount: number;
  effect: string; // effect descriptor, can be a string or function name
};

export type InventoryEquipment = {
  id: string;
  type: "equipment";
  name: string;
  owned: boolean;
  effect: string; // effect descriptor, can be a string or function name
};

export type InventoryItem = InventoryConsumable | InventoryEquipment;

// Equipment Types
export type EquipmentId =
  | "pc"
  | "monitor"
  | "keyboard"
  | "mouse"
  | "microphone"
  | "camera"
  | "chair";

export type SkillSlotType = "skill" | "ultimate";

export type PepeEquipment = {
  pc: InventoryEquipment;
  monitor: InventoryEquipment;
  keyboard: InventoryEquipment;
  mouse: InventoryEquipment;
  microphone: InventoryEquipment;
  camera: InventoryEquipment;
  chair: InventoryEquipment;
  skills: (InventoryEquipment | null)[]; // 3 skill slots
  ultimate: InventoryEquipment | null; // 1 ultimate slot
};

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
    const worker = new Worker(new URL("./worker/index.ts", import.meta.url));
    workerRef.current = worker;
    worker.postMessage({ type: "init", payload: { score: 0, money: 0, research: 0, components: defaultComponents, paused: false, inventory: [], pepeEquipment: defaultPepeEquipment } });
    worker.onmessage = (e) => {
      if (e.data.type === "state") {
        setScore(e.data.score);
        setMoney(e.data.money);
        setResearch(e.data.research);
        setComponents(e.data.components);
        setInventory(e.data.inventory || []);
        setPepeEquipment(e.data.pepeEquipment || defaultPepeEquipment);
      }
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
