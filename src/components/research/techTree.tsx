import type { ResearchNodeProps } from "./ResearchCard";


function nodeMock(id: string, title: string) {
    return {
        id: id,
		type: "research",
		position: { x: 0, y: 0 },
		data: {
			title: title,
			description: "lorem ipsum",
			image: "https://placehold.co/128x128?text=" + title,
		},
    }
}



export const techTreeNodes: ResearchNodeProps[] = [
	nodeMock("currency-root", "Currency Root"),
    nodeMock("currency-1", "Currency 1"),
    nodeMock("currency-2a", "Currency 2 a"),
    nodeMock("currency-2b", "Currency 2 b"),
    nodeMock("currency-c", "Currency c"),
    nodeMock("currency-d1", "Currency d1"),
    nodeMock("currency-d2", "Currency d2"),
    nodeMock("currency-d3", "Currency d3"),

    nodeMock("card-root", "card Root"),
    nodeMock("card-1", "card 1"),
    nodeMock("card-2a", "card 2 a"),
    nodeMock("card-2b", "card 2 b"),
    nodeMock("card-c", "card c"),
    nodeMock("card-d1", "card d1"),
    nodeMock("card-d2", "card d2"),
    nodeMock("card-d3", "card d3"),

    nodeMock("orbiter-root", "orbiter Root"),
    nodeMock("orbiter-1", "orbiter 1"),
    nodeMock("orbiter-2a", "orbiter 2 a"),
    nodeMock("orbiter-2b", "orbiter 2 b"),
    nodeMock("orbiter-c", "orbiter c"),
    nodeMock("orbiter-d1", "orbiter d1"),
    nodeMock("orbiter-d2", "orbiter d2"),
    nodeMock("orbiter-d3", "orbiter d3"),
];

export const techTreeEdges = [
    // Currency branch
    { id: "e-currency-root-1", source: "currency-root", target: "currency-1" },
    { id: "e-currency-1-2a", source: "currency-1", target: "currency-2a" },
    { id: "e-currency-1-2b", source: "currency-1", target: "currency-2b" },
    { id: "e-currency-2a-c", source: "currency-2a", target: "currency-c" },
    { id: "e-currency-c-d1", source: "currency-c", target: "currency-d1" },
    { id: "e-currency-c-d2", source: "currency-c", target: "currency-d2" },
    { id: "e-currency-c-d3", source: "currency-c", target: "currency-d3" },

    // Orbiter branch
    { id: "e-card-root-1", source: "card-root", target: "card-1" },
    { id: "e-card-1-2a", source: "card-1", target: "card-2a" },
    { id: "e-card-1-2b", source: "card-1", target: "card-2b" },
    { id: "e-card-2a-c", source: "card-2a", target: "card-c" },
    { id: "e-card-c-d1", source: "card-c", target: "card-d1" },
    { id: "e-card-c-d2", source: "card-c", target: "card-d2" },
    { id: "e-card-c-d3", source: "card-c", target: "card-d3" },

    // Orbiter branch
    { id: "e-orbiter-root-1", source: "orbiter-root", target: "orbiter-1" },
    { id: "e-orbiter-1-2a", source: "orbiter-1", target: "orbiter-2a" },
    { id: "e-orbiter-1-2b", source: "orbiter-1", target: "orbiter-2b" },
    { id: "e-orbiter-2a-c", source: "orbiter-2a", target: "orbiter-c" },
    { id: "e-orbiter-c-d1", source: "orbiter-c", target: "orbiter-d1" },
    { id: "e-orbiter-c-d2", source: "orbiter-c", target: "orbiter-d2" },
    { id: "e-orbiter-c-d3", source: "orbiter-c", target: "orbiter-d3" },
];