export type AllTextures = typeof allTextures;
export type TextureKeys = keyof AllTextures;

export const allTextures = {
  "100.png": PIXI.Texture.from("assets/sprites/100.png"),
  "dot1.png": PIXI.Texture.from("assets/sprites/dot1.png"),
  "ghost0.png": PIXI.Texture.from("assets/sprites/ghost0.png"),
  "pacman0.png": PIXI.Texture.from("assets/sprites/pacman0.png"),
  "pacman1.png": PIXI.Texture.from("assets/sprites/pacman1.png"),
  "pacman2.png": PIXI.Texture.from("assets/sprites/pacman2.png"),
  "ready.png": PIXI.Texture.from("assets/sprites/ready.png"),
  "wall.png": PIXI.Texture.from("assets/sprites/wall.png"),
} as const;
