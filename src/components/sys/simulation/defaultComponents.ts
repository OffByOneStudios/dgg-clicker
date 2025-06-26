import type { ComponentType } from "../index";
import type { ReactNode } from "react";
import React from "react";
import { FaUser, FaUserPlus, FaStar, FaShieldAlt, FaCrown, FaGift, FaRobot, FaHeart, FaMicrophone, FaTrophy } from "react-icons/fa";

export const defaultComponents: ComponentType[] = [
  { id: "viewer", name: "Viewer", cost: 10, costFactor: 1.15, pointsPerSecond: 1, moneyPerSecond: 0.001, researchPerSecond: 0, owned: 0 },
  { id: "follower", name: "Follower", cost: 100, costFactor: 1.15, pointsPerSecond: 5, moneyPerSecond: 0.005, researchPerSecond: 0, owned: 0 },
  { id: "subscriber", name: "Subscriber", cost: 1100, costFactor: 1.15, pointsPerSecond: 25, moneyPerSecond: 0.025, researchPerSecond: 0, owned: 0 },
  { id: "moderator", name: "Moderator", cost: 12000, costFactor: 1.15, pointsPerSecond: 100, moneyPerSecond: 0.1, researchPerSecond: 0, owned: 0 },
  { id: "vip", name: "VIP", cost: 130000, costFactor: 1.15, pointsPerSecond: 400, moneyPerSecond: 0.4, researchPerSecond: 0, owned: 0 },
  { id: "gifter", name: "Gifter", cost: 1400000, costFactor: 1.15, pointsPerSecond: 1600, moneyPerSecond: 1.6, researchPerSecond: 0, owned: 0 },
  { id: "bot", name: "Chat Bot", cost: 20000000, costFactor: 1.15, pointsPerSecond: 6400, moneyPerSecond: 6.4, researchPerSecond: 0, owned: 0 },
  { id: "superfan", name: "Superfan", cost: 330000000, costFactor: 1.15, pointsPerSecond: 25000, moneyPerSecond: 25, researchPerSecond: 0, owned: 0 },
  { id: "hypecaster", name: "Hype Caster", cost: 5100000000, costFactor: 1.15, pointsPerSecond: 100000, moneyPerSecond: 100, researchPerSecond: 0, owned: 0 },
  { id: "legend", name: "Legend", cost: 75000000000, costFactor: 1.15, pointsPerSecond: 400000, moneyPerSecond: 400, researchPerSecond: 0, owned: 0 },
];

export const componentIcons: Record<string, ReactNode> = {
  viewer: React.createElement(FaUser, { size: 24 }),
  follower: React.createElement(FaUserPlus, { size: 24 }),
  subscriber: React.createElement(FaStar, { size: 24 }),
  moderator: React.createElement(FaShieldAlt, { size: 24 }),
  vip: React.createElement(FaCrown, { size: 24 }),
  gifter: React.createElement(FaGift, { size: 24 }),
  bot: React.createElement(FaRobot, { size: 24 }),
  superfan: React.createElement(FaHeart, { size: 24 }),
  hypecaster: React.createElement(FaMicrophone, { size: 24 }),
  legend: React.createElement(FaTrophy, { size: 24 }),
};
