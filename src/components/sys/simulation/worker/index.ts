// clickerWorker.ts
// TypeScript version of clickerWorker.js

import { saveStateToIndexedDB, loadStateFromIndexedDB } from "./save";
import { defaultComponents } from "../defaultComponents";

export type InventoryConsumable = {
  id: string;
  type: "consumable";
  name: string;
  amount: number;
  effect: string;
};

export type InventoryEquipment = {
  id: string;
  type: "equipment";
  name: string;
  owned: boolean;
  effect: string;
};

export type InventoryItem = InventoryConsumable | InventoryEquipment;

export type PepeEquipment = {
  pc: InventoryEquipment;
  monitor: InventoryEquipment;
  keyboard: InventoryEquipment;
  mouse: InventoryEquipment;
  microphone: InventoryEquipment;
  camera: InventoryEquipment;
  chair: InventoryEquipment;
  skills: (InventoryEquipment | null)[];
  ultimate: InventoryEquipment | null;
};

export type SimulationState = {
  score: number;
  money: number;
  research: number;
  components: any[];
  paused: boolean;
  lastTick: number;
  defaultComponents: any[];
  inventory: InventoryItem[];
  pepeEquipment: PepeEquipment;
};

let state: SimulationState = {
  score: 0,
  money: 0,
  research: 0,
  components: [],
  paused: false,
  lastTick: Date.now(),
  defaultComponents: [],
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

function tick() {
  if (state.paused) {
    state.lastTick = Date.now();
    return;
  }
  const now = Date.now();
  const deltaSec = (now - state.lastTick) / 1000;
  state.lastTick = now;
  const comps = state.components;

  // Gather equipment bonuses
  // Map: componentId -> { pps: percent, mps: percent, rps: percent }
  const equipmentBonuses: Record<string, { pps: number; mps: number; rps: number }> = {};
  const gatherBonus = (item: InventoryEquipment) => {
    if (!item.owned || !item.effect) return;
    // effect format: "componentId:pps:0.1" or "componentId:mps:0.2" or "componentId:rps:0.05"
    // or "all:pps:0.1" for all components
    const effects = Array.isArray(item.effect) ? item.effect : [item.effect];
    effects.forEach(effectStr => {
      const [target, type, value] = effectStr.split(":");
      const percent = parseFloat(value);
      if (!target || !type || isNaN(percent)) return;
      if (target === "all") {
        comps.forEach(c => {
          if (!equipmentBonuses[c.id]) equipmentBonuses[c.id] = { pps: 0, mps: 0, rps: 0 };
          equipmentBonuses[c.id][type as keyof typeof equipmentBonuses[string]] += percent;
        });
      } else {
        if (!equipmentBonuses[target]) equipmentBonuses[target] = { pps: 0, mps: 0, rps: 0 };
        equipmentBonuses[target][type as keyof typeof equipmentBonuses[string]] += percent;
      }
    });
  };
  // Gather from inventory
  if (Array.isArray(state.inventory)) {
    state.inventory.forEach(item => {
      if (item.type === "equipment" && item.owned) gatherBonus(item);
    });
  }
  // Gather from pepeEquipment
  if (state.pepeEquipment) {
    Object.values(state.pepeEquipment).forEach(item => {
      if (item && typeof item === "object" && (item as InventoryEquipment).type === "equipment" && (item as InventoryEquipment).owned) {
        gatherBonus(item as InventoryEquipment);
      }
    });
    if (Array.isArray(state.pepeEquipment.skills)) {
      state.pepeEquipment.skills.forEach(skill => {
        if (skill && skill.owned) gatherBonus(skill);
      });
    }
    if (state.pepeEquipment.ultimate && state.pepeEquipment.ultimate.owned) {
      gatherBonus(state.pepeEquipment.ultimate);
    }
  }

  // Calculate totals with bonuses
  let totalPPS = 0, totalMPS = 0, totalRPS = 0;
  comps.forEach(c => {
    const bonus = equipmentBonuses[c.id] || { pps: 0, mps: 0, rps: 0 };
    const pps = c.pointsPerSecond * c.owned * (1 + bonus.pps);
    const mps = (c.moneyPerSecond || 0) * c.owned * (1 + bonus.mps);
    const rps = (c.researchPerSecond || 0) * c.owned * (1 + bonus.rps);
    totalPPS += pps;
    totalMPS += mps;
    totalRPS += rps;
  });
  state.score += totalPPS * deltaSec;
  state.money += totalMPS * deltaSec;
  state.research += totalRPS * deltaSec;

  // Apply equipment effects every tick
  if (Array.isArray(state.inventory)) {
    state.inventory.forEach(item => {
      if (item.type === "equipment" && item.owned) {
        applyEquipmentEffect(item);
      }
    });
  }
  // Apply pepeEquipment effects every tick
  if (state.pepeEquipment) {
    Object.values(state.pepeEquipment).forEach(item => {
      if (item && typeof item === "object" && (item as InventoryEquipment).type === "equipment" && (item as InventoryEquipment).owned) {
        applyEquipmentEffect(item as InventoryEquipment);
      }
    });
    // Skill slots
    if (Array.isArray(state.pepeEquipment.skills)) {
      state.pepeEquipment.skills.forEach(skill => {
        if (skill && skill.owned) applyEquipmentEffect(skill);
      });
    }
    if (state.pepeEquipment.ultimate && state.pepeEquipment.ultimate.owned) {
      applyEquipmentEffect(state.pepeEquipment.ultimate);
    }
  }
}

function applyEquipmentEffect(item: InventoryEquipment) {
  if (item.effect === "doubleMoney") {
    state.money += (state as any).moneyPerSecond || 0;
  }
}

function applyConsumableEffect(item: InventoryConsumable) {
  if (item.effect === "boostScore") {
    state.score += 100;
  }
}

function sendState() {
  (postMessage as any)({ type: 'state', ...state });
}

// (Remove from: function saveStateToIndexedDB(state: SimulationState) { ... } ... to ... }
// and function loadStateFromIndexedDB(cb: (s: SimulationState | undefined) => void) { ... } ... to ... }

onmessage = function(e: MessageEvent) {
  const { type, payload } = e.data;
  switch(type) {
    case 'init':
      loadStateFromIndexedDB((saved) => {
        if (saved) {
          state = { ...state, ...saved, lastTick: Date.now() };
        } else {
          state = { 
            ...state, 
            ...payload, 
            components: defaultComponents.map(c => ({ ...c })), // Use imported defaultComponents
            lastTick: Date.now() 
          };
        }
        sendState();
      });
      return;
    case 'click':
      state.score += 1;
      break;
    case 'buyComponent': {
      const { id } = payload;
      const comp = state.components.find((c: any) => c.id === id);
      if (!comp) break;
      const owned = typeof comp.owned === 'number' && !isNaN(comp.owned) ? comp.owned : 0;
      const cost = typeof comp.cost === 'number' && !isNaN(comp.cost) ? comp.cost : 1;
      const costFactor = typeof comp.costFactor === 'number' && !isNaN(comp.costFactor) ? comp.costFactor : 1.15;
      const currentCost = Math.ceil(cost * Math.pow(costFactor, owned));
      if (state.score < currentCost) break;
      state.score -= currentCost;
      comp.owned = owned + 1;
      break;
    }
    case 'reset':
      state.score = 0;
      state.money = 0;
      state.research = 0;
      state.components = state.components.map((c: any) => ({ ...c, owned: 0 }));
      break;
    case 'pause':
      state.paused = true;
      break;
    case 'resume':
      state.paused = false;
      break;
    case 'buyItem': {
      const { id } = payload;
      let item = state.inventory.find(i => i.id === id);
      if (!item) {
        item = { id, type: "consumable", name: id, amount: 1, effect: "boostScore" };
        state.inventory.push(item);
      } else if (item.type === "consumable") {
        item.amount += 1;
      } else if (item.type === "equipment") {
        item.owned = true;
      }
      break;
    }
    case 'consumeItem': {
      const { id } = payload;
      const item = state.inventory.find(i => i.id === id && i.type === "consumable") as InventoryConsumable | undefined;
      if (item && item.amount > 0) {
        item.amount -= 1;
        applyConsumableEffect(item);
      }
      break;
    }
    case 'equipItem': {
      const { id, slot, slotType } = payload || {};
      if (slotType === "skill" && typeof slot === "number" && slot >= 0 && slot < 3) {
        const item = state.inventory.find(i => i.id === id && i.type === "equipment") as InventoryEquipment | undefined;
        if (item) {
          state.pepeEquipment.skills[slot] = { ...item, owned: true };
        }
      } else if (slotType === "ultimate") {
        const item = state.inventory.find(i => i.id === id && i.type === "equipment") as InventoryEquipment | undefined;
        if (item) {
          state.pepeEquipment.ultimate = { ...item, owned: true };
        }
      } else {
        // Only assign to main equipment slots, not skills/ultimate
        const equipmentKey = id as keyof PepeEquipment;
        if (
          equipmentKey === "pc" || equipmentKey === "monitor" || equipmentKey === "keyboard" || equipmentKey === "mouse" || equipmentKey === "microphone" || equipmentKey === "camera" || equipmentKey === "chair"
        ) {
          state.pepeEquipment[equipmentKey] = { ...state.pepeEquipment[equipmentKey], owned: true };
        }
      }
      break;
    }
    default:
      break;
  }
  sendState();
  saveStateToIndexedDB(state);
};

let saveCounter = 0;

setInterval(() => {
  tick();
  sendState();
  saveCounter++;
  if (saveCounter >= 20) {
    saveStateToIndexedDB(state);
    saveCounter = 0;
  }
}, 100);
