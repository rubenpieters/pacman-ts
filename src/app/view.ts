import { allTextures, TextureKey } from "./textures";
import { Dir, TileValue } from "./types";
import { Field, FieldKey, parseField } from "./field";

export type PacmanExtra = { moveDir: Dir };

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
  sprite.x = 60;
  sprite.y = 60;
  sprite.pivot.set(15, 15);
  container.addChild(sprite);
  const extra: PacmanExtra = { moveDir: "right" };
  return { sprite, extra };
}

export function initialGhost(
  container: PIXI.Container,
): {
  sprite: PIXI.Sprite,
} {
  const sprite = new PIXI.Sprite(allTextures["ghost0.png"]);
  sprite.x = 300;
  sprite.y = 300;
  sprite.pivot.set(15, 15);
  container.addChild(sprite);
  return { sprite };
}

export function initialView(
  container: PIXI.Container,
): GameView {
  return {
    field: initialField(container),
    pacman: initialPacman(container),
    ghost: initialGhost(container),
    particles: [],
    currentParticleId: 0,
  };
}

export function initialField(
  container: PIXI.Container,
): Field {
  function mkFieldSprite(value: TileValue, key: FieldKey): PIXI.Sprite {
    const sprite = new PIXI.Sprite(allTextures[tileValueSprite(value)]);
    sprite.x = key[0] * 30;
    sprite.y = key[1] * 30;
    sprite.pivot.set(tileOffset(value), tileOffset(value));
    container.addChild(sprite);
    return sprite;
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