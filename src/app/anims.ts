import * as GSAP from "gsap";

export type GameAnims = {
  pacmanMoveAnims: GSAP.Timeline | undefined,
  readyAnims: GSAP.Timeline | "notStarted",
}

export function initialAnims(): GameAnims {
  return {
    pacmanMoveAnims: undefined,
    readyAnims: "notStarted",
  };
}
