import {
    Scene,
    Engine,
    Vector3,
    CubeTexture,
    HemisphericLight,
    SceneLoader,
    ActionManager,
    ExecuteCodeAction,
    ArcRotateCamera,
    //FreeCamera,
    //Animation,
  } from "@babylonjs/core";
  import "@babylonjs/loaders";
import { LoadingScreen } from "./LoadingScreen";
  
  export class CharacterAnimations {
    scene: Scene;
    engine: Engine;
    //camera!: FreeCamera;
    playerCamera!: ArcRotateCamera;
  
    constructor(private canvas: HTMLCanvasElement) {
      this.engine = new Engine(this.canvas, true);

      const loading = new LoadingScreen()

      this.scene = this.CreateScene();
      this.CreateCharacter();
      this.CreateEnvironment();
      this.engine.loadingScreen = loading;
      //this.CreateCutscene();
  
      this.engine.runRenderLoop(() => {
        
        this.scene.render();
      });
    }
  
    CreateScene(): Scene {
      const scene = new Scene(this.engine);
/*
      this.camera = new FreeCamera("camera", new Vector3(10, 2, -10), this.scene);
      this.camera.minZ = 0.5;
      this.camera.speed = 0.5;
      this.camera.rotation._y = Math.PI;
      this.camera.position._x = -60;
      this.camera.position._y = 180;
      this.camera.position._z = -100;
*/
      const envTex = CubeTexture.CreateFromPrefilteredData(
        "../assets/environment/environment.env",
        scene
      );
  
      scene.environmentTexture = envTex;
  
      scene.createDefaultSkybox(envTex, true);
  
      scene.environmentIntensity = 0.5;

      const hemiLight = new HemisphericLight(
        "hemiLight",
        new Vector3(0, 1, 0),
        this.scene
      );
  
      hemiLight.intensity = 0.75;

      return scene;
    }

    async CreateEnvironment(): Promise<void> {
      await SceneLoader.ImportMeshAsync("", "../assets/models/", "map3.glb");
  
    }

  
    async CreateCharacter(): Promise<void> {

      //const camera = new FreeCamera("camrea", new Vector3(0, 0, 10), this.scene);

      this.playerCamera = new ArcRotateCamera("arcRotateCamera", -5*Math.PI/4, 1.2, 20*Math.PI, new Vector3(0, 0, 0), this.scene);
      this.playerCamera.attachControl();
      this.playerCamera.speed = 0.1;
      this.playerCamera.wheelPrecision = 10;
      

      const model = await SceneLoader.ImportMeshAsync(
        "",
        "../assets/models/",
        "climber.glb",
        this.scene
      );
  
      const player = model.meshes[0];
      player.scaling.setAll(5);
      player.position._x = -20;
      player.position._z = 1;

      this.playerCamera.setTarget(player);

      const climb = this.scene.getAnimationGroupByName("climb")!;

      const hang = this.scene.getAnimationGroupByName("hang")!;

      const hopLeft = this.scene.getAnimationGroupByName("hop_left")!;

      const hopRight = this.scene.getAnimationGroupByName("hop_right")!;

      const shimmyLeft = this.scene.getAnimationGroupByName("shimmy_left")!;

      const shimmyRight = this.scene.getAnimationGroupByName("shimmy_right")!;

      let keyStatus: { [key: string]: boolean } = {
        c: false,
        h: false,
        r: false,
        l: false,
        d: false,
        g: false

    };

      this.scene.actionManager = new ActionManager(this.scene);

      this.scene.actionManager.registerAction( new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, (event) => {
        let key = event.sourceEvent.key;
        if (key in keyStatus) {
          keyStatus[key] = true;
        }
      }));

      this.scene.actionManager.registerAction( new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, (event) => {
        let key = event.sourceEvent.key;
        if (key in keyStatus) {
          keyStatus[key] = false;
        }
      }))

      let moving = false;

      this.scene.onBeforeRenderObservable.add(() => {
        if(keyStatus.h || keyStatus.c || keyStatus.r || keyStatus.l || keyStatus.d || keyStatus.g) {
          moving = true;
          if(keyStatus.c) {
            climb.start(true, 1, climb.from, climb.to, false);
            player.moveWithCollisions(player.up.scaleInPlace(0.2));
          }
          if(keyStatus.r) {
            shimmyRight.start(false, 1, shimmyRight.from, shimmyRight.to, true);
            player.moveWithCollisions(player.right.scaleInPlace(-0.1));
          }
          if(keyStatus.l) {
            shimmyLeft.start(true, 1, shimmyLeft.from, shimmyLeft.to, true);
            player.moveWithCollisions(player.right.scaleInPlace(0.1));
          }
          if(keyStatus.d) {
            hopRight.start(true, 1, hopRight.from, hopRight.to, false);
            player.moveWithCollisions(player.right.scaleInPlace(-0.4));
          }
          if(keyStatus.g) {
            hopLeft.start(true, 1, hopLeft.from, hopLeft.to, false);
            player.moveWithCollisions(player.right.scaleInPlace(0.4));
          }
        }
        else if(moving) {
          hang.start(true, 1, hang.from, hang.to, true);
          climb.stop();
          shimmyLeft.stop();
          shimmyRight.stop();
          hopLeft.stop();
          hopRight.stop();
          moving = false;
        }
      });


    }
/*
    async CreateCutscene(): Promise<void> {
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
  
      this.camera.animations.push(camAnim);
  
      await this.scene.beginAnimation(this.camera, 0, 36 * fps).waitAsync();
      this.EndCutscene();
    }
  
    EndCutscene(): void {
      this.scene.activeCamera = this.playerCamera;
    }*/
  }
