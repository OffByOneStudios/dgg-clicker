import type { ResearchNodeProps } from "./ResearchCard";

export const techTreeNodes: ResearchNodeProps[] = [
	{
		id: "currency-root",
		type: "research",
		position: { x: 100, y: 0 },
		data: {
			title: "Currency",
			description: "Unlocks the ability to earn and spend points. Foundation for all upgrades.",
			image: "https://placehold.co/128x128?text=Currency",
		},
	},
	{
		id: "cards-root",
		type: "research",
		position: { x: 350, y: 0 },
		data: {
			title: "Cards",
			description: "Unlocks card-based upgrades and abilities for your stream.",
			image: "https://placehold.co/128x128?text=Cards",
		},
	},
	{
		id: "orbiters-root",
		type: "research",
		position: { x: 600, y: 0 },
		data: {
			title: "Orbiters",
			description: "Unlocks orbiting helpers that boost your stream in unique ways.",
			image: "https://placehold.co/128x128?text=Orbiters",
		},
	},
	// Example mid-tree nodes
	{
		id: "currency-boost",
		type: "research",
		position: { x: 100, y: 150 },
		data: {
			title: "Currency Boost",
			description: "Increase point generation speed.",
			image: "https://placehold.co/128x128?text=Boost",
		},
	},
	{
		id: "card-combos",
		type: "research",
		position: { x: 350, y: 150 },
		data: {
			title: "Card Combos",
			description: "Unlock combo effects for cards.",
			image: "https://placehold.co/128x128?text=Combos",
		},
	},
	{
		id: "orbiter-upgrade",
		type: "research",
		position: { x: 600, y: 150 },
		data: {
			title: "Orbiter Upgrade",
			description: "Upgrade your orbiters for more power.",
			image: "https://placehold.co/128x128?text=Upgrade",
		},
	},
	// Capstone nodes
	{
		id: "currency-capstone",
		type: "research",
		position: { x: 100, y: 300 },
		data: {
			title: "Currency Mastery",
			description: "Become a master of currency and unlock all point upgrades.",
			image: "https://placehold.co/128x128?text=Mastery",
		},
	},
	{
		id: "cards-capstone",
		type: "research",
		position: { x: 350, y: 300 },
		data: {
			title: "Card Mastery",
			description: "Unlock the ultimate card powers.",
			image: "https://placehold.co/128x128?text=Mastery",
		},
	},
	{
		id: "orbiters-capstone",
		type: "research",
		position: { x: 600, y: 300 },
		data: {
			title: "Orbiter Mastery",
			description: "Your orbiters reach their full potential.",
			image: "https://placehold.co/128x128?text=Mastery",
		},
	},
];

export const techTreeEdges = [
	// Currency branch
	{ id: "e-currency-root-boost", source: "currency-root", target: "currency-boost" },
	{ id: "e-currency-boost-cap", source: "currency-boost", target: "currency-capstone" },
	// Cards branch
	{ id: "e-cards-root-combo", source: "cards-root", target: "card-combos" },
	{ id: "e-cards-combo-cap", source: "card-combos", target: "cards-capstone" },
	// Orbiters branch
	{ id: "e-orbiters-root-upgrade", source: "orbiters-root", target: "orbiter-upgrade" },
	{ id: "e-orbiters-upgrade-cap", source: "orbiter-upgrade", target: "orbiters-capstone" },
];