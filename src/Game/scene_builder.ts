import {
  type Scene,
  FreeCamera,
  Vector3,
  HemisphericLight,
  CubeTexture,
  MeshBuilder,
  StandardMaterial,
  Texture
} from "@babylonjs/core";
import '@babylonjs/loaders';


export class Game_SceneBuilder {
  public constructor(private scene: Scene){}

  /*
  The only mean of this class is to build the scene using '.exec()'

  Note : This class doesn't define an "object" but rather an "algorithm".
  -- It should be seen as a "namespace" containing different utility functions that act on 'Game.game.scene'.
  -- The '.exec()' function is the only thing that should be called as it's just a way to execute the whole "namespace" in a certain way (to build the scene).  
  
  !\ The following implementation isn't complete and is just for testing /!
  */


  public exec() {
    const camera = new FreeCamera("camera", new Vector3(0, 1, -5), this.scene);
    camera.attachControl();
    camera.speed = 0.25;

    const hemiLight = new HemisphericLight(
      "hemiLight",
      new Vector3(0, 1, 0),
      this.scene
    );

    hemiLight.intensity = 0.75;

    const ground = MeshBuilder.CreateGround(
      "ground",
      { width: 10, height: 10 },
      this.scene
    );
    ground.material = this.createGroundMaterial();

    const envTex = CubeTexture.CreateFromPrefilteredData(
      "../assets/environment/environment.env",
      this.scene
    );

    this.scene.environmentTexture = envTex; // ?????
    this.scene.createDefaultSkybox(envTex, true);
    this.scene.environmentIntensity = 0.5;
  }

  private createGroundMaterial(): StandardMaterial {
    const groundMat = new StandardMaterial("groundMat", this.scene);
    //const uvScale = 4;
    const texArray: Texture[] = [];

    const diffuseTex = new Texture(
      "../assets/textures/coast.jpg",
      this.scene
    );
    groundMat.diffuseTexture = diffuseTex;
    texArray.push(diffuseTex);
    return groundMat;
  }
}