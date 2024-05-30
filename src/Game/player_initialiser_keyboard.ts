//# Third-party :
import type { Scene, AbstractMesh } from "@babylonjs/core";
import {
  ActionManager,
  ExecuteCodeAction,
  PhysicsImpostor,
} from "@babylonjs/core";
import "@babylonjs/loaders";

//# Local :
import type { Player } from "../player_keyboard.ts";


//-----------------------------------------------------------------------------------

type MapMeshes = {[keys: string]: AbstractMesh[]};

export class Game_PlayerInitialiser {
  public constructor(
    private scene: Scene,
    private player: Player,
    private mapMeshes: MapMeshes,
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


    const KEYS = ["h","c","r","l","d","g"];
    let key_pressed:"h"|"c"|"r"|"l"|"d"|"g"|null = null;
 
    this.scene.actionManager = new ActionManager(this.scene);

    this.scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, (event) => {
      let key = event.sourceEvent.key;
      if (KEYS.includes(key))
        key_pressed = key;
    }));

    this.scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, (event) => {
      let key = event.sourceEvent.key;
      if (KEYS.includes(key))
        key_pressed = null;
    }))

    const player_mesh: AbstractMesh = this.player.model.mesh;
    let moving = false;

    this.scene.onBeforeRenderObservable.add(() => {
      //let player_pos = player_mesh.position

      if(key_pressed) {
        moving = true;

        switch (key_pressed) {
          case "c": {
            //if (isAHold(pos))
            CLIMB_ANIM.start(true, 1, CLIMB_ANIM.from, CLIMB_ANIM.to, false);
            player_mesh.moveWithCollisions(player_mesh.up.scaleInPlace(0.2));
            break;
          }

          case "r": {
            SHIMMY_RIGHT_ANIM.start(false, 1, SHIMMY_RIGHT_ANIM.from, SHIMMY_RIGHT_ANIM.to, true);
            player_mesh.moveWithCollisions(player_mesh.right.scaleInPlace(-0.1));
            break;
          } 

          case "l": {
            SHIMMY_LEFT_ANIM.start(true, 1, SHIMMY_LEFT_ANIM.from, SHIMMY_LEFT_ANIM.to, true);
            player_mesh.moveWithCollisions(player_mesh.right.scaleInPlace(0.1));
            break;
          }

          case "d": {
            HOP_RIGHT_ANIM.start(true, 1, HOP_RIGHT_ANIM.from, HOP_RIGHT_ANIM.to, false);
            player_mesh.moveWithCollisions(player_mesh.right.scaleInPlace(-0.4));
            break;
          }

          case "g": {
            HOP_LEFT_ANIM.start(true, 1, HOP_LEFT_ANIM.from, HOP_LEFT_ANIM.to, false);
            player_mesh.moveWithCollisions(player_mesh.right.scaleInPlace(0.4));
            break;
          }
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
  }
}
