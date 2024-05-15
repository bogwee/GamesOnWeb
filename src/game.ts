//# Third-party :
import { Scene, Engine } from "@babylonjs/core";

//# Local :
//import { Player } from "../player_mouse.ts";
import { Player } from "./player_keyboard.ts";
import { Game_SceneBuilder } from "./Game/scene_builder.ts";
//import { Game_PlayerInitialiser } from "./Game/player_initialiser_mouse.ts";
import { Game_PlayerInitialiser } from "./Game/player_initialiser_keyboard.ts";


//-----------------------------------------------------------------------------------


export class Game {
  //# ¤¤¤¤¤¤¤¤¤ CLASS ATTRIBUTES ¤¤¤¤¤¤¤¤¤ #//
  private static _instance : Game;


  //# ¤¤¤¤¤¤¤¤¤¤¤¤ ATTRIBUTES ¤¤¤¤¤¤¤¤¤¤¤¤ #//
  private _canvas: HTMLCanvasElement;
  private _engine: Engine;
  private _scene:  Scene;
  private _player: Player;


  //# ¤¤¤¤¤¤¤¤¤¤¤ CONSTRUCTORS ¤¤¤¤¤¤¤¤¤¤¤ #//
  private constructor() {
    this._canvas = document.getElementById('renderCanvas')! as HTMLCanvasElement;
    this._engine = new Engine(this._canvas, true);
    this._scene  = new Scene(this._engine);
    this._player = new Player(this._scene);
  }


  //# ¤¤¤¤¤¤¤¤¤¤¤¤¤¤ GETTERS ¤¤¤¤¤¤¤¤¤¤¤¤¤ #//
  public static get game(): Game {
    if (!Game._instance)
      Game._instance = new Game()
    return Game._instance;
  }

  // I made the following getters static bcs typing 'Game.game.<attribute>'
  // each time you need to access an attribute of the game is annoying.
  // Instead, typing 'Game.<attribute>' seem better.
  public static get canvas(): HTMLCanvasElement {return Game.game._canvas;}
  public static get engine(): Engine {return Game.game._engine;}
  public static get scene() : Scene  {return Game.game._scene;}
  public static get player(): Player {return Game.game._player;}


  //# ¤¤¤¤¤¤¤¤¤¤¤ CLASS METHODS ¤¤¤¤¤¤¤¤¤¤ #//

  //********** Game Initialisation *********//

  public static buildScene() {
    const scene_builder = new Game_SceneBuilder(Game.scene);
    scene_builder.exec();
  }

  public static initPlayer() {
    const player_initialiser = new Game_PlayerInitialiser(
      Game.scene,
      Game.player,
    );
    Game.player.importPlayerModel().then(
      () => player_initialiser.exec()
    );
  }

  //************** Game Action *************//

  public static playCinematic() {
    //TODO : Implèmenter la cinématique ici
  }

  public static play() {
    Game.engine.runRenderLoop(() => {
      Game.scene.render();
    });
  }
}