import * as GSAP from "gsap";

export type GameAnims = {
  pacmanMoveAnims: GSAP.Timeline | undefined,
  ghostMoveAnims: GSAP.Timeline | undefined,
  readyAnims: GSAP.Timeline | "notStarted",
}

export function initialAnims(): GameAnims {
  return {
    pacmanMoveAnims: undefined,
    ghostMoveAnims: undefined,
    readyAnims: "notStarted",
  };
}
