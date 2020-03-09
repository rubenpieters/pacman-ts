import * as PIXI from "pixi.js";

import { gameLoop } from "./game";
import { allTextures } from "./textures"
import { initialView } from "./view";
import { initialAnims } from "./anims";

window.addEventListener("load", main);

function main(): void {
  const app = new PIXI.Application({ width: 600, height: 600 });
  
  document.body.appendChild(app.view);

  const container = new PIXI.Container();
  app.stage.addChild(container);

  const view = initialView(container);
  const anims = initialAnims();

  requestAnimationFrame(gameLoop(view, anims));
}