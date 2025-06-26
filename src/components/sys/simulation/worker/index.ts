// clickerWorker.ts
// TypeScript version of clickerWorker.js

import { saveStateToIndexedDB, loadStateFromIndexedDB } from "./save";
import { defaultComponents } from "../defaultComponents";
import {
    WorkerMessageType,
    type InventoryEquipment,
    type InventoryItem,
} from "../types";
import { state } from "./store";
import {
    handleInit,
    handleClick,
    handleBuyComponent,
    handleReset,
    handlePause,
    handleResume,
    handleBuyItem,
    handleConsumeItem,
    handleEquipItem,
    handleSetResources
} from "./handlers";

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
        effects.forEach((effectStr: string) => {
            const [target, type, value] = effectStr.split(":");
            const percent = parseFloat(value);
            if (!target || !type || isNaN(percent)) return;
            if (target === "all") {
                comps.forEach((c: any) => {
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
        state.inventory.forEach((item: InventoryItem) => {
            if (item.type === "equipment" && item.owned) gatherBonus(item as InventoryEquipment);
        });
    }
    // Gather from pepeEquipment
    if (state.pepeEquipment) {
        Object.values(state.pepeEquipment).forEach((item: any) => {
            if (item && typeof item === "object" && (item as InventoryEquipment).type === "equipment" && (item as InventoryEquipment).owned) {
                gatherBonus(item as InventoryEquipment);
            }
        });
        if (Array.isArray(state.pepeEquipment.skills)) {
            state.pepeEquipment.skills.forEach((skill: InventoryEquipment | null) => {
                if (skill && skill.owned) gatherBonus(skill);
            });
        }
        if (state.pepeEquipment.ultimate && state.pepeEquipment.ultimate.owned) {
            gatherBonus(state.pepeEquipment.ultimate);
        }
    }

    // Calculate totals with bonuses
    let totalPPS = 0, totalMPS = 0, totalRPS = 0;
    comps.forEach((c: any) => {
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
        state.inventory.forEach((item: InventoryItem) => {
            if (item.type === "equipment" && item.owned) {
                applyEquipmentEffect(item as InventoryEquipment);
            }
        });
    }
    // Apply pepeEquipment effects every tick
    if (state.pepeEquipment) {
        Object.values(state.pepeEquipment).forEach((item: any) => {
            if (item && typeof item === "object" && (item as InventoryEquipment).type === "equipment" && (item as InventoryEquipment).owned) {
                applyEquipmentEffect(item as InventoryEquipment);
            }
        });
        // Skill slots
        if (Array.isArray(state.pepeEquipment.skills)) {
            state.pepeEquipment.skills.forEach((skill: InventoryEquipment | null) => {
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


function sendState() {
    (postMessage as any)({ type: 'state', ...state });
}

// (Remove from: function saveStateToIndexedDB(state: SimulationState) { ... } ... to ... }
// and function loadStateFromIndexedDB(cb: (s: SimulationState | undefined) => void) { ... } ... to ... }

let initialized = false;
let tickInterval: ReturnType<typeof setInterval> | null = null;
let saveCounter = 0;
let ticking = false;

function startTicking() {
    if (!ticking) {
        ticking = true;
        setInterval(() => {
            tick();
            sendState();
            saveCounter++;
            if (saveCounter >= 20) {
                saveStateToIndexedDB(state);
                saveCounter = 0;
            }
        }, 100);
    }
}

export function sendToast(message: string, status: 'info' | 'success' | 'warning' | 'error' = 'info') {
    (postMessage as any)({ type: 'sendToast', payload: { message, status } });
}

onmessage = function (e: MessageEvent) {
    const { type, payload } = e.data;
    switch (type) {
        case WorkerMessageType.INIT:
            handleInit(payload, sendState, startTicking);
            return;
        case WorkerMessageType.CLICK:
            handleClick();
            break;
        case WorkerMessageType.BUY_COMPONENT:
            handleBuyComponent(payload);
            break;
        case WorkerMessageType.RESET:
            handleReset();
            break;
        case WorkerMessageType.PAUSE:
            handlePause();
            break;
        case WorkerMessageType.RESUME:
            handleResume();
            break;
        case WorkerMessageType.BUY_ITEM:
            handleBuyItem(payload);
            break;
        case WorkerMessageType.CONSUME_ITEM:
            handleConsumeItem(payload);
            break;
        case WorkerMessageType.EQUIP_ITEM:
            handleEquipItem(payload);
            break;
        case WorkerMessageType.SET_RESOURCES:
            handleSetResources(payload);
            break;
        default:
            break;
    }
    sendState();
    //saveStateToIndexedDB(state);
};
