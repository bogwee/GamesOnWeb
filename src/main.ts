import './style.css';
//import { StandardMaterials } from './StandardMaterials';
//import { PhysicsImpostors } from './Physics';
//import { CharacterAnimations } from './CharacterAnimations';
//import { Map } from './Map';
import { CharacterAnimations } from './Mechanics';
//import { CutScene } from './CutScene';

let start = document.getElementById("start")!;

let menu = document.querySelector("nav")!;


function main() {
  menu.classList.add("notplaying")

  const renderCanvas = document.getElementById(
    'renderCanvas'
  ) as HTMLCanvasElement;
  if (!renderCanvas) {
    return;
  }

  new CharacterAnimations(renderCanvas);
}


start.addEventListener("click", main);
