import { GameView } from "./view";
import * as V from "./view";
import { GameAnims, resetAnims } from "./anims";
import * as A from "./animDefs";
import Keyboard from "pixi.js-keyboard";
import { tileValue, tileInDir, nonWallDirs } from "./field";
import deepEqual from "deep-equal";

export function gameLoop(
  view: GameView,
  anims: GameAnims,
  container: PIXI.Container,
): () => void {
  return () => {
    // if ready animation is not started: start it
    if (anims.readyAnims === "notStarted") {
      const anim = A.readyAnim(view, container, 300, 300);
      anims.readyAnims = anim;
      anim.play();

      requestAnimationFrame(gameLoop(view, anims, container));
    // otherwise, if it is active, let it play
    } else if (anims.readyAnims.isActive()) {
      requestAnimationFrame(gameLoop(view, anims, container));
    // otherwise, let the game play!
    } else {
      // read input
      Keyboard.update();
      const wPressed = Keyboard.isKeyDown("KeyW");
      const aPressed = Keyboard.isKeyDown("KeyA");
      const sPressed = Keyboard.isKeyDown("KeyS");
      const dPressed = Keyboard.isKeyDown("KeyD");
      const rPressed = Keyboard.isKeyDown("KeyR");
      if (rPressed) {
        V.resetView(view, container);
        resetAnims(anims);
        requestAnimationFrame(gameLoop(view, anims, container));
      } else {
        // info
        const pacmanLoc = V.pacmanLoc(view.pacman.sprite);
        const ghostLoc = V.pacmanLoc(view.ghost.sprite);
        const pacmanDie = deepEqual(pacmanLoc, ghostLoc);
        const thisTile = tileValue(view.field, pacmanLoc);
        const nextTile = tileInDir(pacmanLoc, view.pacman.extra.moveDir, view.field);
        const eatDot = thisTile === "dot";
        // update dot
        if (eatDot) {
          view.field[pacmanLoc.toString()].sprite.visible = false;
        }
        // update alive status
        if (pacmanDie) {
          view.pacman.extra.alive = false;
        }
        // update pacman dir
        if (wPressed) {
          view.pacman.extra.moveDir = "up";
        } else if (aPressed) {
          view.pacman.extra.moveDir = "left";
        } else if (sPressed) {
          view.pacman.extra.moveDir = "down";
        } else if (dPressed) {
          view.pacman.extra.moveDir = "right";
        }
        // update eat dot animation
        if (eatDot && view.pacman.extra.alive) {
          A.dotAnim(view, container, view.pacman.sprite.x, view.pacman.sprite.y).play();
        }
        // update move animations
        if (
          view.pacman.extra.alive &&
          (anims.pacmanMoveAnims === undefined || ! anims.pacmanMoveAnims.isActive())
        ) {
          if (nextTile === "wall") {
            const anim = A.pacmanRotate(view);
            anims.pacmanMoveAnims = anim;
            anim.play();
          } else {
            const anim = A.pacmanMove(view);
            anims.pacmanMoveAnims = anim;
            anim.play();
          }
        }
        if (
          view.pacman.extra.alive &&
          (anims.ghostMoveAnims === undefined || ! anims.ghostMoveAnims.isActive())
        ) {
          const possibleDirs = nonWallDirs(view.field, ghostLoc);
          const randomIndex = getRandomInt(0, possibleDirs.length - 1);
          const randomDir = possibleDirs[randomIndex];
          const anim = A.ghostMove(view, randomDir);
          anims.ghostMoveAnims = anim;
          anim.play();
        }
        if (
          ! view.pacman.extra.alive &&
          (anims.deathAnims === undefined || ! anims.deathAnims.isActive())
        ) {
          const anim = A.deathAnim(view);
          anims.deathAnims = anim;
          anim.play();
        }

        requestAnimationFrame(gameLoop(view, anims, container));
      }
    }
  };
}

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}