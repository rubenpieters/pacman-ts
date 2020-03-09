import { GameView } from "./view";
import { GameAnims } from "./anims";
import { pacmanMove } from "./animDefs";
import Keyboard from "pixi.js-keyboard";

export function gameLoop(
  view: GameView,
  anims: GameAnims,
): () => void {
  return () => {
    // read input
    Keyboard.update();
    const wPressed = Keyboard.isKeyDown("KeyW");
    const aPressed = Keyboard.isKeyDown("KeyA");
    const sPressed = Keyboard.isKeyDown("KeyS");
    const dPressed = Keyboard.isKeyDown("KeyD");
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
    // update move animations
    if (anims.pacmanMoveAnims !== undefined && ! anims.pacmanMoveAnims.isActive()) {
      anims.pacmanMoveAnims = undefined;
    }
    if (anims.pacmanMoveAnims === undefined) {
      const anim = pacmanMove(view);
      anims.pacmanMoveAnims = anim;
      anim.play();
    }


    requestAnimationFrame(gameLoop(view, anims));
  };
}