import "./style.css";

import { Game } from "./game.ts";
import { Game_SceneBuilder } from "./scene_builder.ts";

const START_BTN = document.getElementById("start")!;
const MENU = document.querySelector("nav")!;

function main() {
  MENU.classList.add("notplaying")
  const scene_builder = new Game_SceneBuilder(Game.getGame().getScene());
  scene_builder.initScene();
}

START_BTN.addEventListener("click", main);
