import * as GSAP from "gsap";

export type GameAnims = {
  pacmanMoveAnims: GSAP.Timeline | undefined,
  ghostMoveAnims: GSAP.Timeline | undefined,
  readyAnims: GSAP.Timeline | "notStarted",
  deathAnims: GSAP.Timeline | undefined,
}

export function initialAnims(): GameAnims {
  return {
    pacmanMoveAnims: undefined,
    ghostMoveAnims: undefined,
    readyAnims: "notStarted",
    deathAnims: undefined,
  };
}

export function resetAnims(
  anims: GameAnims,
): void {
  if (anims.pacmanMoveAnims !== undefined) {
    anims.pacmanMoveAnims.pause();
    anims.pacmanMoveAnims = undefined;
  }
  if (anims.ghostMoveAnims !== undefined) {
    anims.ghostMoveAnims.pause();
    anims.ghostMoveAnims = undefined;
  }
  if (anims.readyAnims !== "notStarted") {
    anims.readyAnims.pause();
    anims.readyAnims = "notStarted";
  }
  if (anims.deathAnims !== undefined) {
    anims.deathAnims.pause();
    anims.deathAnims = undefined;
  }

}