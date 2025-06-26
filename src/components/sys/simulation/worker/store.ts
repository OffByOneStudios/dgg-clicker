import type {
  SimulationState
} from "../types";

// store.ts
// Contains the simulation state and related types for the worker

// --- SimulationState type (restored) ---
export let state: SimulationState = {
  score: 0,
  money: 0,
  research: 0,
  components: [],
  paused: false,
  lastTick: Date.now(),
  inventory: [],
  pepeEquipment: {
    pc: { id: "pc", type: "equipment", name: "PC", owned: false, effect: "" },
    monitor: { id: "monitor", type: "equipment", name: "Monitor", owned: false, effect: "" },
    keyboard: { id: "keyboard", type: "equipment", name: "Keyboard", owned: false, effect: "" },
    mouse: { id: "mouse", type: "equipment", name: "Mouse", owned: false, effect: "" },
    microphone: { id: "microphone", type: "equipment", name: "Microphone", owned: false, effect: "" },
    camera: { id: "camera", type: "equipment", name: "Camera", owned: false, effect: "" },
    chair: { id: "chair", type: "equipment", name: "Chair", owned: false, effect: "" },
    skills: [null, null, null],
    ultimate: null,
  },
};
