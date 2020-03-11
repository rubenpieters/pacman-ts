import { GameView } from "./view";
import * as GSAP from "gsap";
import { Dir } from "./types";
import { TextureKey, allTextures } from "./textures";
import { Container } from "pixi.js";

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
  const l: TextureKey[] = ["pacman0.png", "pacman1.png", "pacman2.png", "pacman1.png", "pacman0.png"];
  const anim = new GSAP.TimelineMax({ paused: true })
    .add(pacmanRotate(view).play(), 0)
    .add(frameByFrame(view.pacman.sprite, 0.05, l). play(), 0)
    .add(new GSAP.TweenMax(view.pacman.sprite, 0.2, { [moveLens(dir)]: newValue, ease: GSAP.Linear.easeNone }), 0)
    ;
  return anim;
}

export function ghostMove(
  view: GameView,
  dir: Dir,
): GSAP.Timeline {
  const current = view.ghost.sprite[moveLens(dir)];
  const newValue = current + moveOffset(dir);
  const anim = new GSAP.TimelineMax({ paused: true })
    .add(new GSAP.TweenMax(view.ghost.sprite, 0.2, { [moveLens(dir)]: newValue, ease: GSAP.Linear.easeNone }), 0)
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

export function dotAnim(
  view: GameView,
  container: Container,
  pX: number,
  pY: number,
): GSAP.Timeline {
  const particleAnim = (id: number) => {
    const particle = view.particles.find(x => x.id === id);
    if (particle === undefined) {
      throw `no particle with index ${id}`;
    }
    return new GSAP.TimelineMax({ paused: true })
      .add(new GSAP.TweenMax(particle.sprite, 1.5, { y: pY - 30, alpha: 0 }))
      ;
  };
  return withParticle(particleAnim, view, container,
    (view, container) => createParticle("100.png", view, container, pX, pY, 20*2, 12*2),
    (view, container, id) => deleteParticle(view, container, id),
    1.5,
  );
}

export function readyAnim(
  view: GameView,
  container: Container,
  pX: number,
  pY: number,
): GSAP.Timeline {
  const particleAnim = (id: number) => {
    const particle = view.particles.find(x => x.id === id);
    if (particle === undefined) {
      throw `no particle with index ${id}`;
    }
    return new GSAP.TimelineMax({ paused: true })
      .add(new GSAP.TweenMax(particle.sprite, 1.5, { y: pY - 30, alpha: 0 }))
      ;
  };
  return withParticle(particleAnim, view, container,
    (view, container) => createParticle("ready.png", view, container, pX, pY, 50*2, 10*2),
    (view, container, id) => deleteParticle(view, container, id),
    1.5,
  );
}

// Helper

function frameByFrame(
  sprite: PIXI.Sprite,
  time: number,
  frames: TextureKey[],
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

function createParticle(
  texture: TextureKey,
  view: GameView,
  container: Container,
  x: number,
  y: number,
  width: number,
  height: number,
): number {
  const currentId = view.currentParticleId;
  const particle = new PIXI.Sprite(allTextures[texture]);
  particle.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
  particle.x = x;
  particle.y = y;
  particle.width = width;
  particle.height = height;
  particle.pivot.set(width / 2, height / 2);
  container.addChild(particle);
  view.particles.push({ sprite: particle, id: currentId });
  view.currentParticleId += 1;
  return currentId;
}

function deleteParticle(
  view: GameView,
  container: Container,
  id: number,
): void {
  const particle = view.particles.find(x => x.id === id);
  if (particle !== undefined) {
    container.removeChild(particle.sprite);
  }
}

function withParticle(
  particleAnim: (id: number) => GSAP.Timeline,
  view: GameView,
  container: Container,
  createF: (view: GameView, container: Container) => number,
  deleteF: (view: GameView, container: Container, id: number) => void,
  duration: number,
): GSAP.Timeline {
  let ref: { v: number } = { v: undefined as any };
  const anim = new GSAP.TimelineMax({ paused: true })
    .add(() => { ref.v = createF(view, container) })
    .add(() => particleAnim(ref.v).play())
    .add(() => deleteF(view, container, ref.v), duration)
    ;
  return anim;
}