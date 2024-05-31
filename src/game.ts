//# Third-party :
import { Scene, Engine, Animation } from "@babylonjs/core";
import { ArcRotateCamera, FreeCamera, Vector3 } from "@babylonjs/core";

import type { AbstractMesh } from "@babylonjs/core";
import { SceneLoader } from "@babylonjs/core";
import '@babylonjs/loaders';

import { ActionManager, ExecuteCodeAction, Matrix } from "@babylonjs/core";

//# Local :
import { Player } from "./player_keyboard.ts";
import { Game_SceneBuilder } from "./Game/scene_builder.ts";
import { Game_PlayerInitialiser } from "./Game/player_initialiser_keyboard.ts";


//-----------------------------------------------------------------------------------


type GameCameras = {[keys: string]: FreeCamera|ArcRotateCamera};
type MapMeshes = {[keys: string]: AbstractMesh[]};
type Kind = "Decors"|"Obstacles"|"SlipperyObjects"|"GrippableObjects"|"End";



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
    //this.setMap()
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
      "CinematicCamera", new Vector3(-100, 220, -80), this._scene
    );
    cinematic_cam.minZ = 0.5;
    cinematic_cam.speed = 0.5;
    cinematic_cam.rotation._y = Math.PI;

    this._cameras["CinematicCamera"] = cinematic_cam;

    //* Player Camera :
    
    //constants to fix camera position
    const arcAlpha = 1.5046653238154635 + (1.6172777427591525 - 1.159866067925365);
    const arcBeta = 1.5296884191499718 + (1.2714331445491482 - 1.2535226809366065);
    const arcRadius = 44.649908575154164 + (47.23366662045099 - 44.649908575154164);

    const player_cam = new ArcRotateCamera(
      "PlayerCamera", arcAlpha, arcBeta, arcRadius, new Vector3(0, 0, 0), this._scene
    );
    player_cam.minZ = 0.5;
    player_cam.speed = 0.1;
    player_cam.wheelPrecision = 10;
  
    this._cameras["PlayerCamera"] = player_cam;
  }

  private async setMap() {
    this._mapMeshes["Decors"] = (await SceneLoader.ImportMeshAsync(
      "", "../../assets/models/Map/", "decors.glb"
    )).meshes;

    this._mapMeshes["Obstacles"] = (await SceneLoader.ImportMeshAsync(
      "", "../../assets/models/Map/", "obstacles.glb"
    )).meshes;

    this._mapMeshes["SlipperyObjects"] = (await SceneLoader.ImportMeshAsync(
      "", "../../assets/models/Map/", "slippery-objects.glb"
    )).meshes;

    this._mapMeshes["GrippableObjects"] = (await SceneLoader.ImportMeshAsync(
      "", "../../assets/models/Map/", "grippable-objects.glb"
    )).meshes;

    this._mapMeshes["End"] = (await SceneLoader.ImportMeshAsync(
      "", "../../assets/models/Map/", "end.glb"
    )).meshes;
  }

  public static async buildScene() {
    const scene_builder = new Game_SceneBuilder(Game.scene);
    scene_builder.exec();
    await Game.game.setMap();
  }

  public static async initPlayer() {
    const player_initialiser = new Game_PlayerInitialiser(
      Game.scene, Game.player
    );
    Game.player.importPlayerModel().then(() => {
        player_initialiser.exec();
        Game.player.setAnim();
        Game.initPlayerActions();
    });
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
      {frame: 0, value: new Vector3(-100, 220, -80) },
      { frame: 5 * fps, value: new Vector3(-55, 170, 45) },
      { frame: 5 * fps, value: new Vector3(-75, 170, 30) },
      { frame: 7 * fps, value: new Vector3(-75, 130, 40) },
      { frame: 10 * fps, value: new Vector3(-15, 115, 50) },
      { frame: 10 * fps, value: new Vector3(5, 110, 30) },
      { frame: 12 * fps, value: new Vector3(13, 75, 0) },
      { frame: 13 * fps, value: new Vector3(13, 75, 0) },
      { frame: 15 * fps, value: new Vector3(-7, 100, 30) },
      { frame: 17 * fps, value: new Vector3(-40, 70, 60) },
      { frame: 20 * fps, value: new Vector3(-32, 150, 120) },
      { frame: 21 * fps, value: new Vector3(-32, 150, 120) },
      { frame: 25 * fps, value: new Vector3(-32, 35, 120) },
      { frame: 26 * fps, value: new Vector3(-32, 35, 120)}]);

    cam.animations.push(camAnim);
    await this.scene.beginAnimation(cam, 0, 26 * fps).waitAsync();

    Game.scene.activeCamera = Game.cameras["PlayerCamera"];
  }

  public static play() {
    Game.engine.runRenderLoop(() => Game.scene.render());
  }

  // --- Playing :

  private static atPos(pos: Vector3): Kind {
    const ray = this.scene.createPickingRay(
      pos.x, pos.y,
      Matrix.Identity(),
      Game.scene.getCameraByName("PlayerCamera")
    );

    const hit = Game.scene.pickWithRay(ray);
    if (!hit || !hit.pickedMesh) return "Decors";
    const pickedMesh = hit.pickedMesh;

    const KINDS: Kind[] = [
      "Decors", "Obstacles", "SlipperyObjects", "GrippableObjects", "End"
    ];

    console.log(pickedMesh);

    for (let kind of KINDS) {
      if (Game.mapMeshes[kind].includes(pickedMesh))
        return kind;
    }

    return "Decors";
  }

  private static switchMoves(key: string) {
    switch (key) {
      case "c": Game.player.anim.climb(); break;
      case "g": Game.player.anim.hopLeft(); break;
      case "d": Game.player.anim.hopRight(); break;
      case "l": Game.player.anim.shimmyLeft(); break;
      case "r": Game.player.anim.shimmyRight(); break;
    }
  }

  private static initPlayerActions() {
    //* Inputs :
    let needUpdates = false;
    let key_pressed: "h"|"c"|"r"|"l"|"d"|"g"|null = null;

    Game.scene.actionManager = new ActionManager(Game.scene);
    Game.scene.actionManager.registerAction(new ExecuteCodeAction(
      ActionManager.OnKeyDownTrigger, 
      (event) => key_pressed = event.sourceEvent.key
    ));
    Game.scene.actionManager.registerAction(new ExecuteCodeAction(
      ActionManager.OnKeyUpTrigger,
      (_event) => key_pressed = null,
    ))


    //* Logic :
    let isMoving: boolean = false;
    let isFalling: boolean;
    let isSliding: boolean;

    const player_mesh: AbstractMesh = Game.player.model.mesh;

    let isHoldable = (s:string) => {
      return ["SlipperyObjects","GrippableObjects"].includes(s);
    };

    Game.scene.onBeforeRenderObservable.add(() => {
      if (!needUpdates && !isFalling && !isSliding)
        return;

      isFalling = Game.atPos(player_mesh.position) == "Decors";
      isSliding = Game.atPos(player_mesh.position) == "SlipperyObjects";

      // Gravity :
      if (isFalling || isSliding) {
        Game.player.anim.hang();

        if (isFalling) {
          player_mesh.position.y -= 1;
          isFalling = !(
            key_pressed == "h" && isHoldable(Game.atPos(player_mesh.position))
          );
          return;
        }

        player_mesh.position.y -= 0.5;
      }

      if(key_pressed) {
        isMoving = true;
        Game.switchMoves(key_pressed);
      } else if(isMoving) {
        isMoving = false;
        Game.player.anim.hang();
      }

      needUpdates = false;
    });
  }
}