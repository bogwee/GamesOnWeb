//# Third-party :
import type { Scene } from "@babylonjs/core";
import {
  ActionManager,
  ExecuteCodeAction,
  PhysicsImpostor,
} from "@babylonjs/core";
import "@babylonjs/loaders"; //???? Est-ce réellement utile ????

//# Local :
import type { Player } from "../player_keyboard.ts";


//-----------------------------------------------------------------------------------


export class Game_PlayerInitialiser {
  public constructor(
    private scene: Scene,
    private player: Player,
  ){}


  public exec() {
    this.setPlayerCamera();

    this.setPlayerMesh();

    const HANG_ANIM         = this.scene.getAnimationGroupByName("hang")!;
    const CLIMB_ANIM        = this.scene.getAnimationGroupByName("climb")!;
    const HOP_LEFT_ANIM     = this.scene.getAnimationGroupByName("hop_left")!;
    const HOP_RIGHT_ANIM    = this.scene.getAnimationGroupByName("hop_right")!;
    const SHIMMY_LEFT_ANIM  = this.scene.getAnimationGroupByName("shimmy_left")!;
    const SHIMMY_RIGHT_ANIM = this.scene.getAnimationGroupByName("shimmy_right")!;


    const player_mesh = this.player.model.mesh;

    const keyStatus: { [key: string]: boolean } = {
      h: false,
      c: false,
      r: false,
      l: false,
      d: false,
      g: false
    };

    this.scene.actionManager = new ActionManager(this.scene);

    this.scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, (event) => {
      let key = event.sourceEvent.key;
      if (key in keyStatus)
        keyStatus[key] = true;
    }));

    this.scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, (event) => {
      let key = event.sourceEvent.key;
      if (key in keyStatus)
        keyStatus[key] = false;
    }))


    let moving = false;

    this.scene.onBeforeRenderObservable.add(() => {
      // If any key is pressed :
      if(
        keyStatus.h || keyStatus.c || keyStatus.r || keyStatus.l || keyStatus.d || keyStatus.g
      ) {
        moving = true;

        if(keyStatus.c) {
          CLIMB_ANIM.start(true, 1, CLIMB_ANIM.from, CLIMB_ANIM.to, false);
          player_mesh.moveWithCollisions(player_mesh.up.scaleInPlace(0.2));
        }

        if(keyStatus.r) {
          SHIMMY_RIGHT_ANIM.start(false, 1, SHIMMY_RIGHT_ANIM.from, SHIMMY_RIGHT_ANIM.to, true);
          player_mesh.moveWithCollisions(player_mesh.right.scaleInPlace(-0.1));
        }

        if(keyStatus.l) {
          SHIMMY_LEFT_ANIM.start(true, 1, SHIMMY_LEFT_ANIM.from, SHIMMY_LEFT_ANIM.to, true);
          player_mesh.moveWithCollisions(player_mesh.right.scaleInPlace(0.1));
        }

        if(keyStatus.d) {
          HOP_RIGHT_ANIM.start(true, 1, HOP_RIGHT_ANIM.from, HOP_RIGHT_ANIM.to, false);
          player_mesh.moveWithCollisions(player_mesh.right.scaleInPlace(-0.4));
        }
        
        if(keyStatus.g) {
          HOP_LEFT_ANIM.start(true, 1, HOP_LEFT_ANIM.from, HOP_LEFT_ANIM.to, false);
          player_mesh.moveWithCollisions(player_mesh.right.scaleInPlace(0.4));
        }

      } else if(moving) {
        moving = false;

        HANG_ANIM.start(true, 1, HANG_ANIM.from, HANG_ANIM.to, true);
        CLIMB_ANIM.stop();
        SHIMMY_LEFT_ANIM.stop();
        SHIMMY_RIGHT_ANIM.stop();
        HOP_LEFT_ANIM.stop();
        HOP_RIGHT_ANIM.stop();
      }
    });
  }

  private setPlayerCamera() {
    // The type 'any' is necessary as '.getCameraByName()' return a 'Camera' which doesn't have the '.setTarget()' method
    const cam: any = this.scene.getCameraByName("PlayerCamera")!;
    cam.setTarget(this.player.model.mesh);
  }

  private setPlayerMesh() {
    this.player.model.mesh.scaling.setAll(5);
    this.player.model.mesh.position._x = -20;
    this.player.model.mesh.position._z = 1;
    this.player.model.mesh.physicsImpostor = new PhysicsImpostor(
      this.player.model.mesh,
      PhysicsImpostor.MeshImpostor,
      { mass:70, restitution:0 }
    );
    //this._model.mesh.rotate(Vector3.Up(), Math.PI); //???? Est-ce réellement utile ????
  }
}
