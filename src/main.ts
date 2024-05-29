//# Local :
import "./UI/style.css";
import { Game } from "./game.ts";


//-----------------------------------------------------------------------------------


// DOM's Shortcuts :
const START_BTN = document.getElementById("start")!;
const MENU = document.querySelector("nav")!;

async function startGame() {
  MENU.classList.add("notplaying");

  //Game.engine.displayLoadingUI();
  await Game.buildScene();
  await Game.initPlayer();
  //Game.engine.hideLoadingUI();

  /*DEBUG ::*/ console.log("Game initialised");
  /*DEBUG ::*/ console.log("---------------------\n---------------------");
  /*DEBUG ::*/ console.log("START Cinematic");

  await Game.playCinematic();

  /*DEBUG ::*/ console.log("END Cinematic");

  Game.play();
}

START_BTN.addEventListener("click", startGame);