import { allTextures } from "./textures";
import { Dir } from "./types";

export type PacmanExtra = { moveDir: Dir };

export type GameView = {
  pacman: { sprite: PIXI.Sprite, extra: PacmanExtra },
}

export function pacmanLoc<S extends { x: number, y: number}>(
  sprite: S
): { x: number, y: number } {
  return {
    x: Math.floor(sprite.x / 30),
    y: Math.floor(sprite.y / 30),
  }
}

export function initialPacman(
  container: PIXI.Container,
): {
  sprite: PIXI.Sprite,
  extra: PacmanExtra,
} {
  const sprite = new PIXI.Sprite(allTextures["pacman0.png"]);
  sprite.x = 60;
  sprite.y = 60;
  sprite.pivot.set(15, 15);
  container.addChild(sprite);
  const extra: PacmanExtra = { moveDir: "right" };
  return { sprite, extra };
}

export function initialView(
  container: PIXI.Container,
): GameView {
  return {
    pacman: initialPacman(container),
  };
}
