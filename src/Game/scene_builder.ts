//# Third-party :
import type { Scene } from "@babylonjs/core";
import {
  //? FreeCamera,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  CubeTexture,
  SceneLoader,
  CannonJSPlugin,
} from "@babylonjs/core";
import '@babylonjs/loaders'; //???? Est-ce réellement utile ????
import * as CANNON from "cannon";


//-----------------------------------------------------------------------------------


export class Game_SceneBuilder {
  public constructor(
    private scene: Scene
  ){}



  public exec() {
    const player_cam = new ArcRotateCamera(
      "PlayerCamera", 0, 1, 10, new Vector3(0, 1, 0), this.scene
    );
    player_cam.attachControl();
    player_cam.minZ = 0.5;
    player_cam.speed = 0.1;
    player_cam.wheelPrecision = 10;

    const envTex = CubeTexture.CreateFromPrefilteredData(
      "../../assets/environment/environment.env",
      this.scene,
    );

    this.scene.environmentTexture = envTex; // ?????
    this.scene.createDefaultSkybox(envTex, true);


    const hemiLight = new HemisphericLight(
      "hemiLight",
      new Vector3(0, 1, 0),
      this.scene,
    );

    hemiLight.intensity = 0.75;

    this.scene.environmentIntensity = 0.5;
  
    this.scene.enablePhysics(
      new Vector3(0, -9.81, 0), 
      new CannonJSPlugin(true, 10, CANNON)
    );

    SceneLoader.ImportMesh("", "../../assets/models/", "map_test.glb");
  }
}