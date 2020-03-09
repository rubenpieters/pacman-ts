import { GameView } from "./view";
import * as GSAP from "gsap";
import { Dir } from "./types";
import { TextureKeys, allTextures } from "./textures";

export function pacmanRotate(
  view: GameView,
): GSAP.Timeline {
  const dir = view.pacman.extra.moveDir;
  const anim = new GSAP.TimelineMax({ paused: true })
    .set(view.pacman.sprite, { angle: dirRotation(dir)})
    ;
  return anim;
}

export function pacmanMove(
  view: GameView,
): GSAP.Timeline {
  const dir = view.pacman.extra.moveDir;
  const current = view.pacman.sprite[moveLens(dir)];
  const newValue = current + moveOffset(dir);
  const l: TextureKeys[] = ["pacman0.png", "pacman1.png", "pacman2.png", "pacman1.png", "pacman0.png"];
  const anim = new GSAP.TimelineMax({ paused: true })
    .add(pacmanRotate(view).play(), 0)
    .add(frameByFrame(view.pacman.sprite, 0.05, l). play(), 0)
    .add(new GSAP.TweenMax(view.pacman.sprite, 0.2, { [moveLens(dir)]: newValue, ease: GSAP.Linear.easeNone }), 0)
    ;
  return anim;
}

function moveLens(
  dir: Dir,
): "x" | "y" {
  switch (dir) {
    case "up": return "y";
    case "down": return "y";
    case "left": return "x";
    case "right": return "x";
  }
}

function moveOffset(
  dir: Dir,
): number {
  switch (dir) {
    case "up": return -30;
    case "down": return 30;
    case "left": return -30;
    case "right": return 30;
  }
}

function dirRotation(
  dir: Dir,
): number {
  switch (dir) {
    case "up": return 270;
    case "down": return 90;
    case "left": return 180;
    case "right": return 0;
  }
}

export function frameByFrame(
  sprite: PIXI.Sprite,
  time: number,
  frames: TextureKeys[],
): GSAP.Timeline {
  const anim = new GSAP.TimelineMax({ paused: true });
  frames.forEach((frame, i) => {
    anim.set(sprite, { texture: allTextures[frame] });
    if (i < frames.length - 1) {
      anim.to({}, time, {});
    }
  });
  return anim;
}
