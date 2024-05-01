import { Scene, Engine } from "@babylonjs/core";

import { Player } from "./player.ts";
import { Game_SceneBuilder } from "./Game/scene_builder.ts";
import { Game_ActionManager } from "./Game/scene_actionManager.ts";


export class Game {
  private static _instance : Game


  private _canvas: HTMLCanvasElement;
  private _engine: Engine;
  private _scene: Scene;

  //TODO : Initialising player in the contructor and restricting its type to 'Player'
  private _player?: Player;


  private constructor() {
    this._canvas = document.getElementById('renderCanvas')! as HTMLCanvasElement;
    this._engine = new Engine(this._canvas, true);
    this._scene  = new Scene(this._engine);

    this._player = new Player(this._scene);

    this._engine.runRenderLoop(() => {
      this._scene.render();
    });

    this._engine.hideLoadingUI();
  }

 
  public static get game(): Game {
    if (!Game._instance)
      Game._instance = new Game()
    return Game._instance;
  }

  // I made the getters static bcs typing 'Game.game.<attribute>', each time you need to access an attribute of the game object is annoying.
  // Instead, typing 'Game.<attribute>' seem better.

  public static get canvas(): HTMLCanvasElement {return Game.game._canvas;}
  public static get engine(): Engine {return Game.game._engine;}
  public static get scene() : Scene  {return Game.game._scene;}

  public static get player(): Player {return Game.game._player!;}


  public static buildScene() {
    const scene_builder = new Game_SceneBuilder(Game.scene);
    scene_builder.exec();
  }

  public static manageSceneActions() {
    const scene_actionManager = new Game_ActionManager(Game.scene, Game.player);
    scene_actionManager.exec();
  }
}