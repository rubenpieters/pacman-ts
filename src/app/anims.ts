import * as GSAP from "gsap";

export type GameAnims = {
  pacmanMoveAnims: GSAP.Timeline | undefined,
}

export function initialAnims(): GameAnims {
  return {
    pacmanMoveAnims: undefined,
  };
}
