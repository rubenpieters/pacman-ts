import { TileValue, Dir } from "./types";

export type FieldKey = [number, number];

export type Field = Record<string, { value: TileValue, sprite: PIXI.Sprite }>;

export function tileValue(
  field: Field,
  loc: FieldKey,
): TileValue | undefined {
  if (loc.toString() in field && field[loc.toString()]?.sprite.visible) {
    return field[loc.toString()]?.value;
  }
  return undefined;
}

export function locInDir(
  loc: FieldKey,
  dir: Dir,
): [number, number] {
  switch (dir) {
    case "up": return [loc[0], loc[1] - 1];
    case "down": return [loc[0], loc[1] + 1];
    case "left": return [loc[0] - 1, loc[1]];
    case "right": return [loc[0] + 1, loc[1]];
  }
}

export function tileInDir(
  loc: FieldKey,
  dir: Dir,
  field: Field,
): TileValue | undefined {
  return tileValue(field, locInDir(loc, dir));
}

export function nonWallDirs(
  field: Field,
  loc: FieldKey,
) {
  const dirs: Dir[] = ["up", "down", "left", "right"];
  return dirs
    .map(d => { return { dir: d, val: tileInDir(loc, d, field) } })
    .filter(({ val }) => val !== "wall")
    .map(({ dir }) => dir)
    ;
}

export function parseField(
  l: string[]
): Record<string, TileValue> {
  let rowId = 0;
  let colId = 0;
  let field: Record<string, TileValue> = {};
  for (const str of l) {
    for (const c of str) {
      const v = parseChar(c);
      if (v !== undefined) {
        field[[colId, rowId].toString()] = v;
      }
      colId++;
    }
    colId = 0;
    rowId++;
  }
  return field;
}

export function parseChar(
  c: string,
): TileValue | undefined {
  switch (c) {
    case "w": return "wall";
    case ".": return "dot";
    default: return undefined;
  }
}