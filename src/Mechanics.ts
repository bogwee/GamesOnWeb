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
    CannonJSPlugin,
    PhysicsImpostor,
    //FreeCamera,
  } from "@babylonjs/core";
  import "@babylonjs/loaders";
  import * as CANNON from "cannon";
  
  export class CharacterAnimations {
    scene: Scene;
    engine: Engine;
  
    constructor(private canvas: HTMLCanvasElement) {
      this.engine = new Engine(this.canvas, true);

      this.engine.displayLoadingUI();

      this.scene = this.CreateScene();
      this.CreateCharacter();
  
      this.engine.runRenderLoop(() => {
        
        this.scene.render();
      });
    }
  
    CreateScene(): Scene {
      const scene = new Scene(this.engine);

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

      scene.enablePhysics(
        new Vector3(0, -9.81, 0), 
        new CannonJSPlugin(true, 10, CANNON));
  
      hemiLight.intensity = 0.75;

      return scene;
    }

  
    async CreateCharacter(): Promise<void> {

      SceneLoader.ImportMesh("", "../assets/models/", "map3.glb");

      //const camera = new FreeCamera("camrea", new Vector3(0, 0, 10), this.scene);

      const camera = new ArcRotateCamera("arcRotateCamera", 0, 1, 10, new Vector3(0, 0, 0), this.scene);
      camera.attachControl();
      camera.minZ = 0.5;
      camera.speed = 0.1;
      camera.wheelPrecision = 10;
      

      const model = await SceneLoader.ImportMeshAsync(
        "",
        "../assets/models/",
        "climber.glb",
        this.scene
      );
  
      const player = model.meshes[0];//.rotate(Vector3.Up(), Math.PI/2);
      player.scaling.setAll(5);
      player.position._x = -20;
      player.position._z = 1;
      player.physicsImpostor = new PhysicsImpostor(player, PhysicsImpostor.MeshImpostor, { mass:70, restitution:0 })
      //player.rotate(Vector3.Up(), Math.PI);
      


      camera.setTarget(player);

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
        console.log(keyStatus);
      }));

      this.scene.actionManager.registerAction( new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, (event) => {
        let key = event.sourceEvent.key;
        if (key in keyStatus) {
          keyStatus[key] = false;
        }
        console.log(keyStatus);
      }))
/*
      this.scene.actionManager.registerAction( new ExecuteCodeAction(ActionManager.OnLeftPickTrigger, (event) => {
        let object = event.meshUnderPointer.;

        if(object == mesh)

      }))*/

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

    
      this.engine.hideLoadingUI();

    }
  }
