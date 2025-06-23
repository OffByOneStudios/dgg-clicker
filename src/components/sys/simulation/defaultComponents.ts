import type { ComponentType } from "../index";
import type { ReactNode } from "react";
import React from "react";
import { FaMousePointer, FaUserNurse, FaSeedling, FaGem, FaIndustry, FaUniversity, FaPlaceOfWorship, FaHatWizard, FaRocket, FaFlask } from "react-icons/fa";

export const defaultComponents: ComponentType[] = [
  { id: "cursor", name: "Cursor", cost: 10, costFactor: 1.15, pointsPerSecond: 1, owned: 0 },
  { id: "grandma", name: "Grandma", cost: 100, costFactor: 1.15, pointsPerSecond: 5, owned: 0 },
  { id: "farm", name: "Farm", cost: 1100, costFactor: 1.15, pointsPerSecond: 25, owned: 0 },
  { id: "mine", name: "Mine", cost: 12000, costFactor: 1.15, pointsPerSecond: 100, owned: 0 },
  { id: "factory", name: "Factory", cost: 130000, costFactor: 1.15, pointsPerSecond: 400, owned: 0 },
  { id: "bank", name: "Bank", cost: 1400000, costFactor: 1.15, pointsPerSecond: 1600, owned: 0 },
  { id: "temple", name: "Temple", cost: 20000000, costFactor: 1.15, pointsPerSecond: 6400, owned: 0 },
  { id: "wizard", name: "Wizard Tower", cost: 330000000, costFactor: 1.15, pointsPerSecond: 25000, owned: 0 },
  { id: "shipment", name: "Shipment", cost: 5100000000, costFactor: 1.15, pointsPerSecond: 100000, owned: 0 },
  { id: "alchemy", name: "Alchemy Lab", cost: 75000000000, costFactor: 1.15, pointsPerSecond: 400000, owned: 0 },
];

export const componentIcons: Record<string, ReactNode> = {
  cursor: React.createElement(FaMousePointer, { size: 24 }),
  grandma: React.createElement(FaUserNurse, { size: 24 }),
  farm: React.createElement(FaSeedling, { size: 24 }),
  mine: React.createElement(FaGem, { size: 24 }),
  factory: React.createElement(FaIndustry, { size: 24 }),
  bank: React.createElement(FaUniversity, { size: 24 }),
  temple: React.createElement(FaPlaceOfWorship, { size: 24 }),
  wizard: React.createElement(FaHatWizard, { size: 24 }),
  shipment: React.createElement(FaRocket, { size: 24 }),
  alchemy: React.createElement(FaFlask, { size: 24 }),
};
