export type Emote = "IdleMouthClosed" | "IdleMouthOpen" | "Happy" | "Sad" | "Dissapointed" | "Scared";

export type Character = {
  name: string;
  emotes: Record<Emote, string>; // maps emote to image filename
};

export const pepe: Character = {
    name: "Pepe",
    emotes: {
        IdleMouthClosed: "/img/char/pepe/idle_mouth_closed.gif",
        IdleMouthOpen: "/img/char/pepe/idle_mouth_open.gif",
        Happy: "/img/char/pepe/happy.png",
        Sad: "/img/char/pepe/sad.png",
        Dissapointed: "/img/char/pepe/dissapointed.png",
        Scared: "/img/char/pepe/scared.png",
    },
};

export const characters: Record<string, Character> = {
  Pepe: pepe,
};
