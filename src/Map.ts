import {
  Scene,
  Engine,
  FreeCamera,
  Vector3,
  HemisphericLight,
  CubeTexture,
  SceneLoader,
} from "@babylonjs/core";
import '@babylonjs/loaders';

export class Map {
  scene: Scene;
  engine: Engine;

  constructor(private canvas: HTMLCanvasElement) {
    this.engine = new Engine(this.canvas, true);

    //Wait for all elements to load
    this.engine.displayLoadingUI();

    this.scene = this.CreateScene();

    this.CreateEnvironment();

    this.CreateBoulder();

    

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }

  CreateScene(): Scene {
    const scene = new Scene(this.engine);
    const camera = new FreeCamera("camera", new Vector3(0, 1, -5), this.scene);
    camera.attachControl();
    camera.speed = 0.25;

    const hemiLight = new HemisphericLight(
      "hemiLight",
      new Vector3(0, 1, 0),
      this.scene
    );

    hemiLight.intensity = 0.75;

    const envTex = CubeTexture.CreateFromPrefilteredData(
      "../assets/environment/environment.env",
      scene
    );

    scene.environmentTexture = envTex;

    scene.createDefaultSkybox(envTex, true);

    scene.environmentIntensity = 0.5;


    return scene;
  }

  async CreateEnvironment(): Promise<void> {
    await SceneLoader.ImportMeshAsync("", "../assets/models/", "map2.glb");

    this.engine.hideLoadingUI();
  }



  async CreateBoulder():Promise<void> {

    const {meshes} = await SceneLoader.ImportMeshAsync("", "../assets/models/", "climber.glb");
    console.log("meshes", meshes);

    meshes[2].rotate(Vector3.Up(), Math.PI);

  }
}