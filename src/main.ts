//import { Playground } from './createScene';
//import { Gravity } from './firstScene';
import './style.css';
//import { Engine } from '@babylonjs/core';
import { StandardMaterials } from './StandardMaterials';

//import { CustomModels } from './customModels';

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

  //const engine = new Engine(renderCanvas, true);

  new StandardMaterials(renderCanvas);
/*
  window.addEventListener('resize', () => {
    engine.resize();
  });

  engine.runRenderLoop(() => {
    scene.render();
  });*/
}


start.addEventListener("click", main);
