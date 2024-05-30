//# Third-party :
import { Scene, Engine, Animation } from "@babylonjs/core";
import { ArcRotateCamera, FreeCamera, Vector3 } from "@babylonjs/core";

import type { AbstractMesh } from "@babylonjs/core";
import { SceneLoader } from "@babylonjs/core";
import '@babylonjs/loaders';


//# Local :
import { Player } from "./player_keyboard.ts";
import { Game_SceneBuilder } from "./Game/scene_builder.ts";
import { Game_PlayerInitialiser } from "./Game/player_initialiser_keyboard.ts";


//-----------------------------------------------------------------------------------

type GameCameras      = {[keys: string]: FreeCamera|ArcRotateCamera};
type MapMeshes        = {[keys: string]: AbstractMesh[]};


export class Game {
  //# ¤¤¤¤¤¤¤¤¤ CLASS ATTRIBUTES ¤¤¤¤¤¤¤¤¤ #//
  private static _instance : Game;


  //# ¤¤¤¤¤¤¤¤¤¤¤¤ ATTRIBUTES ¤¤¤¤¤¤¤¤¤¤¤¤ #//
  private _canvas : HTMLCanvasElement;
  private _engine : Engine;
  private _scene  : Scene;
  private _player : Player;

  private _cameras   : GameCameras;
  private _mapMeshes : MapMeshes;



  //# ¤¤¤¤¤¤¤¤¤¤¤ CONSTRUCTORS ¤¤¤¤¤¤¤¤¤¤¤ #//
  private constructor() {
    this._canvas = document.getElementById('renderCanvas')! as HTMLCanvasElement;
    this._engine = new Engine(this._canvas, true);
    this._scene  = new Scene(this._engine);
    this._player = new Player(this._scene);

    this._cameras = {};
    this.setCameras();

    this._mapMeshes = {}
    this.setMap()
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
  public static get canvas()   : HTMLCanvasElement {return Game.game._canvas;}
  public static get engine()   : Engine {return Game.game._engine;}
  public static get scene()    : Scene  {return Game.game._scene;}
  public static get player()   : Player {return Game.game._player;}
  public static get cameras()  : GameCameras {return Game.game._cameras;}
  public static get mapMeshes(): MapMeshes   {return Game.game._mapMeshes;}

  //# ¤¤¤¤¤¤¤¤¤¤¤ CLASS METHODS ¤¤¤¤¤¤¤¤¤¤ #//

  //********** Game Initialisation *********//

  private setCameras() {
    //* Cinematic Camera :

    const cinematic_cam = new FreeCamera(
      "CinematicCamera", new Vector3(10, 2, -10), this._scene
    );
    cinematic_cam.minZ = 0.5;
    cinematic_cam.speed = 0.5;
    cinematic_cam.rotation._y = Math.PI;
    cinematic_cam.position._x = -60;
    cinematic_cam.position._y = 180;
    cinematic_cam.position._z = -100;

    this._cameras["CinematicCamera"] = cinematic_cam;

    //* Player Camera :

    const player_cam = new ArcRotateCamera(
      "PlayerCamera", 0, 1, 10, new Vector3(0, 1, 0), this._scene
    );
    player_cam.attachControl();
    player_cam.minZ = 0.5;
    player_cam.speed = 0.1;
    player_cam.wheelPrecision = 10;
  
    this._cameras["PlayerCamera"] = player_cam;
  }

  private setMap() {
    SceneLoader.ImportMeshAsync(
      "", "../../assets/models/Map/", "decors.glb"
    ).then((data) => {
      this._mapMeshes["Decors"] = data.meshes;
    });

    SceneLoader.ImportMeshAsync(
      "", "../../assets/models/Map/", "obstacles.glb"
    ).then((data) => {
      this._mapMeshes["Obtsacles"] = data.meshes;
    });

    SceneLoader.ImportMeshAsync(
      "", "../../assets/models/Map/", "slippery-objects.glb"
    ).then((data) => {
      this._mapMeshes["SlipperyObjects"] = data.meshes;
    });

    SceneLoader.ImportMeshAsync(
      "", "../../assets/models/Map/", "grippable-objects.glb"
    ).then((data) => {
      this._mapMeshes["GrippableObjects"] = data.meshes;
    });

    SceneLoader.ImportMeshAsync(
      "", "../../assets/models/Map/", "end.glb"
    ).then((data) => {
      this._mapMeshes["End"] = data.meshes;
    });
  }

  public static async buildScene() {
    const scene_builder = new Game_SceneBuilder(Game.scene);
    scene_builder.exec();
  }

  public static async initPlayer() {
    const player_initialiser = new Game_PlayerInitialiser(
      Game.scene, Game.player, Game.mapMeshes
    );
    Game.player.importPlayerModel().then(
      () => player_initialiser.exec()
    );
  }

  //************** Game Action *************//

  public static async playCinematic() {
    Game.scene.activeCamera = Game.cameras["CinematicCamera"];

    const cam = Game.cameras["CinematicCamera"];
    const fps = 60;
    const camAnim = new Animation(
      "camAnim",
      "position",
      fps,
      Animation.ANIMATIONTYPE_VECTOR3,
      Animation.ANIMATIONLOOPMODE_CONSTANT,
      true
    );

    camAnim.setKeys([
      { frame: 0, value: new Vector3(-60, 180, -100) },
      { frame: 12 * fps, value: new Vector3(-60, 170, 40) },
      { frame: 17 * fps, value: new Vector3(-80, 150, 60) },
      { frame: 22 * fps, value: new Vector3(-70, 120, 70) },
      { frame: 27 * fps, value: new Vector3(-10, 85, 100) },
      { frame: 32 * fps, value: new Vector3(-40, 30, 100) },
      { frame: 36 * fps, value: new Vector3(-25, 10, 30) },
    ]);

    cam.animations.push(camAnim);
    await this.scene.beginAnimation(cam, 0, 36 * fps).waitAsync();

    Game.scene.activeCamera = Game.cameras["PlayerCamera"];
  }

  public static play() {
    Game.engine.runRenderLoop(() => Game.scene.render());
  }
}