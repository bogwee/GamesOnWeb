import {
  Scene,
  FreeCamera,
  Vector3,
  HemisphericLight,
  CubeTexture,
  MeshBuilder,
  StandardMaterial,
  Texture,
} from "@babylonjs/core";


export class Game_SceneBuilder {
  public constructor(private scene: Scene){};


  //! The following functions are only for testing


  public initScene(): void {
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

    const ball = MeshBuilder.CreateSphere("ball", { diameter: 1 }, this.scene);

    ball.position = new Vector3(0, 1, 0);

    ground.material = this.createGroundMaterial();
    ball.material = this.createBallMaterial();

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

  private createBallMaterial(): StandardMaterial {
    const ballMat = new StandardMaterial("ballMat", this.scene);
    //const uvScale = 1;
    const texArray: Texture[] = [];
  
    const diffuseTex = new Texture(
      "../assets/textures/trail.jpg",
      this.scene
    );
    ballMat.diffuseTexture = diffuseTex;
    texArray.push(diffuseTex);
  
    return ballMat;
  }
}