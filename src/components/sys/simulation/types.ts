// types.ts
// Centralized type definitions for simulation context and worker

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
  inventory: InventoryItem[];
  pepeEquipment: PepeEquipment;
};

// --- Message Types Enum ---
export enum WorkerMessageType {
  INIT = 'init',
  CLICK = 'click',
  BUY_COMPONENT = 'buyComponent',
  RESET = 'reset',
  PAUSE = 'pause',
  RESUME = 'resume',
  BUY_ITEM = 'buyItem',
  CONSUME_ITEM = 'consumeItem',
  EQUIP_ITEM = 'equipItem',
  SET_RESOURCES = "setResources",
}

export enum ConsumableType {
    VIEW_BOT = "viewBot",
    SPONSORED_STREAM = "sponsoredStream",
    QUESTIONABLE_TWEET = "questionableTweet",
    PLATFORM_GROYPER = "platformGroyper",
}

// In your Shop UI, import the enum and use it to render consumables
// Example: Add to your shop items array
export const consumableShopItems = [
  {
    id: ConsumableType.VIEW_BOT,
    name: "View Bot",
    cost: 100,
    description: "+10 Viewers (costs $100)",
  },
  {
    id: ConsumableType.SPONSORED_STREAM,
    name: "Sponsored Stream",
    cost: 200,
    description: "+$200 (costs $200, get $400)",
  },
  {
    id: ConsumableType.QUESTIONABLE_TWEET,
    name: "Questionable Tweet",
    cost: 0,
    description: "+20 Viewers, -10 Followers",
  },
  {
    id: ConsumableType.PLATFORM_GROYPER,
    name: "Platform Groyper",
    cost: 0,
    description: "+5 Subscribers, -5 Followers",
  },
];

export enum SimulationComponentId {
  VIEWER = "viewer",
  FOLLOWER = "follower",
  SUBSCRIBER = "subscriber",
  MODERATOR = "moderator",
  VIP = "vip",
  GIFTER = "gifter",
  BOT = "bot",
  SUPERFAN = "superfan",
  HYPECASTER = "hypecaster",
  LEGEND = "legend",
}