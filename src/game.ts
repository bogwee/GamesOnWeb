//# Third-party :
import { Scene, Engine, Animation, Vector3 } from "@babylonjs/core";

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

  public static async playCinematic() {
    const cam: any = this.scene.getCameraByName("CinematicCamera");
    Game.scene.activeCamera = cam;

    const camKeys = [];
    const fps = 60;
    const camAnim = new Animation(
      "camAnim",
      "position",
      fps,
      Animation.ANIMATIONTYPE_VECTOR3,
      Animation.ANIMATIONLOOPMODE_CONSTANT,
      true
    );

    camKeys.push({ frame: 0, value: new Vector3(-60, 180, -100) });
    camKeys.push({ frame: 12 * fps, value: new Vector3(-60, 170, 40) });
    camKeys.push({ frame: 17 * fps, value: new Vector3(-80, 150, 60) });
    camKeys.push({ frame: 22 * fps, value: new Vector3(-70, 120, 70) });
    camKeys.push({ frame: 27 * fps, value: new Vector3(-10, 85, 100) });
    camKeys.push({ frame: 32 * fps, value: new Vector3(-40, 30, 100) });
    camKeys.push({ frame: 36 * fps, value: new Vector3(-25, 10, 30) });
  
    camAnim.setKeys(camKeys);
  
    cam.animations.push(camAnim);

    await this.scene.beginAnimation(cam, 0, 36 * fps).waitAsync();
  }

  public static play() {
    Game.engine.runRenderLoop(() => {
      Game.scene.render();
    });
  }
}