import { allTextures, TextureKey } from "./textures";
import { Dir, TileValue } from "./types";
import { Field, FieldKey, parseField } from "./field";
import { Container } from "pixi.js";

export type PacmanExtra = {
  moveDir: Dir,
  alive: boolean,
};

export type GameView = {
  pacman: { sprite: PIXI.Sprite, extra: PacmanExtra },
  ghost: { sprite: PIXI.Sprite },
  field: Field,
  particles: { sprite: PIXI.Sprite, id: number }[],
  currentParticleId: number,
}

export function pacmanLoc<S extends { x: number, y: number}>(
  sprite: S
): [number, number] {
  return [
    Math.floor(sprite.x / 30),
    Math.floor(sprite.y / 30),
  ];
}

export function initialPacman(
  container: PIXI.Container,
): {
  sprite: PIXI.Sprite,
  extra: PacmanExtra,
} {
  const sprite = new PIXI.Sprite(allTextures["pacman0.png"]);
  sprite.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
  sprite.x = 60;
  sprite.y = 60;
  sprite.pivot.set(15, 15);
  container.addChild(sprite);
  const extra: PacmanExtra = { moveDir: "right", alive: true };
  return { sprite, extra };
}

export function initialGhost(
  container: PIXI.Container,
): {
  sprite: PIXI.Sprite,
} {
  const sprite = new PIXI.Sprite(allTextures["ghost0.png"]);
  sprite.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
  sprite.x = 540;
  sprite.y = 540;
  sprite.width = 30;
  sprite.height = 30;
  sprite.pivot.set(10, 9);
  container.addChild(sprite);
  return { sprite };
}

export function initialView(
  container: PIXI.Container,
): GameView {
  const field = initialField(container);
  const ghost = initialGhost(container);
  const pacman = initialPacman(container);
  return {
    field,
    ghost,
    pacman,
    particles: [],
    currentParticleId: 0,
  };
}

const initialMap: Record<string, TileValue> = parseField(
  [ "wwwwwwwwwwwwwwwwwwww"
  , "w........ww........w"
  , "w...ww...ww....ww..w"
  , "w...ww...ww....ww..w"
  , "w..................w"
  , "wwww..ww....ww..wwww"
  , "wwww..ww....ww..wwww"
  , "w.....ww....ww.....w"
  , "w.....ww....ww.....w"
  , "w..................w"
  , "w.....ww....ww.....w"
  , "wwww..ww....ww..wwww"
  , "wwww..ww....ww..wwww"
  , "w..................w"
  , "w...w.........w....w"
  , "w...w.wwwwwww.w....w"
  , "w...w....ww...w....w"
  , "w..wwwww.ww.wwww...w"
  , "w..................w"
  , "wwwwwwwwwwwwwwwwwwww"
  ]
);

export function initialField(
  container: PIXI.Container,
): Field {
  function mkFieldSprite(value: TileValue, key: FieldKey): PIXI.Sprite {
    const sprite = new PIXI.Sprite(allTextures[tileValueSprite(value)]);
    sprite.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    sprite.x = key[0] * 30;
    sprite.y = key[1] * 30;
    sprite.pivot.set(tileOffset(value), tileOffset(value));
    container.addChild(sprite);
    return sprite;
  }

  let field: Field = {};
  Object.entries(initialMap).forEach(([keyList, tileValue]) => {
    const split = keyList.split(",", 2).map(x => Number.parseInt(x));
    const key: [number, number] = [split[0], split[1]];
    field[key.toString()] = { value: tileValue, sprite: mkFieldSprite(tileValue, key) };
  });

  return field;
}

export function tileValueSprite(
  tileValue: TileValue
): TextureKey {
  switch (tileValue) {
    case "wall": return "wall.png";
    case "dot": return "dot1.png";
  }
}

export function tileOffset(
  tileValue: TileValue
): number {
  switch (tileValue) {
    case "wall": return 10;
    case "dot": return 5;
  }
}

export function resetView(
  view: GameView,
  container: Container,
) {
  view.pacman.sprite.x = 60;
  view.pacman.sprite.y = 60;
  view.pacman.sprite.angle = 0;
  view.pacman.sprite.texture = allTextures["pacman0.png"];
  view.pacman.extra = { moveDir: "right", alive: true };
  view.ghost.sprite.x = 540;
  view.ghost.sprite.y = 540;
  view.particles.forEach(p => {
    container.removeChild(p.sprite);
  });
  view.particles = [];
  for (const k in view.field) {
    container.removeChild(view.field[k].sprite);
  }
  view.field = initialField(container);
}