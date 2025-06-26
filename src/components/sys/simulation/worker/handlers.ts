import { defaultComponents } from "../defaultComponents";
import { loadStateFromIndexedDB, saveStateToIndexedDB } from "./save";
import { state } from "./store";
import { applyConsumableEffect } from "./consumables";
import { sendToast } from "./index";
import { consumableShopItems } from "../types";
import type { InventoryConsumable, InventoryEquipment, InventoryItem, PepeEquipment, ConsumableType } from "../types";

export function handleInit(payload: any, sendState: () => void, startTicking: () => void) {
  loadStateFromIndexedDB((saved) => {
    if (saved && saved.components && saved.components.length !== 0) {
      // Use the loaded state as-is, do not overwrite components!
      Object.assign(state, saved, { lastTick: Date.now() });
    } else {
      // Only use defaultComponents if nothing is loaded
      Object.assign(state, payload, {
        components: defaultComponents.map((c: any) => ({ ...c })),
        lastTick: Date.now()
      });
    }
    sendState();
    startTicking();
  });
}

export function handleClick() {
  state.score += 1;
}

export function handleBuyComponent(payload: any) {
  const { id } = payload;
  const comp = state.components.find((c: any) => c.id === id);
  if (!comp) return;
  const owned = typeof comp.owned === 'number' && !isNaN(comp.owned) ? comp.owned : 0;
  const cost = typeof comp.cost === 'number' && !isNaN(comp.cost) ? comp.cost : 1;
  const costFactor = typeof comp.costFactor === 'number' && !isNaN(comp.costFactor) ? comp.costFactor : 1.15;
  const currentCost = Math.ceil(cost * Math.pow(costFactor, owned));
  if (state.score < currentCost) return;
  state.score -= currentCost;
  comp.owned = owned + 1;
}

export function handleReset() {
  state.score = 0;
  state.money = 0;
  state.research = 0;
  state.components = state.components.map((c: any) => ({ ...c, owned: 0 }));
  state.inventory = [];
  
}

export function handlePause() {
  state.paused = true;
}

export function handleResume() {
  state.paused = false;
}

export function handleBuyItem(payload: any) {
  const { id } = payload;
  // Only allow purchase if user can afford it (for consumables with a cost)
  const consumable = consumableShopItems.find(item => item.id === id);
  if (consumable) {
    const cost = consumable.cost || 0;
    if (cost > 0 && state.money < cost) {
      sendToast("Not enough money to buy this consumable!", "error");
      return;
    }
    if (cost > 0) state.money -= cost;
  }
  let item = state.inventory.find((i: InventoryItem) => i.id === id);
  if (!item) {
    item = { id, type: "consumable", name: id, amount: 1, effect: id } as InventoryConsumable;
    state.inventory.push(item);
  } else if (item.type === "consumable") {
    (item as InventoryConsumable).amount += 1;
  } else if (item.type === "equipment") {
    (item as InventoryEquipment).owned = true;
  }
}

export function handleConsumeItem(payload: any) {
  const { id } = payload;
  const item = state.inventory.find((i: InventoryItem) => i.id === id && i.type === "consumable") as InventoryConsumable | undefined;
  if (item && item.amount > 0) {
    // Only apply if effect returns true (affordability check)
    if (applyConsumableEffect(item)) {
      item.amount -= 1;
    }
  }
}

export function handleEquipItem(payload: any) {
  const { id, slot, slotType } = payload || {};
  if (slotType === "skill" && typeof slot === "number" && slot >= 0 && slot < 3) {
    const item = state.inventory.find((i: InventoryItem) => i.id === id && i.type === "equipment") as InventoryEquipment | undefined;
    if (item) {
      state.pepeEquipment.skills[slot] = { ...item, owned: true };
    }
  } else if (slotType === "ultimate") {
    const item = state.inventory.find((i: InventoryItem) => i.id === id && i.type === "equipment") as InventoryEquipment | undefined;
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
}

export function handleSetResources(payload: { score?: number; money?: number; research?: number }) {
  if (typeof payload.score === 'number') state.score = payload.score;
  if (typeof payload.money === 'number') state.money = payload.money;
  if (typeof payload.research === 'number') state.research = payload.research;
}
