//# Third-party :
import type {
  Scene, IPointerEvent, PickingInfo, PointerEventTypes
} from "@babylonjs/core";
import { PhysicsImpostor } from "@babylonjs/core";
import "@babylonjs/loaders"; //???? Est-ce réellement utile ????

//# Local :
import type { Player } from "../player_mouse.ts";


//-----------------------------------------------------------------------------------

export class Game_PlayerInitialiser {
  public constructor(
    private scene: Scene,
    private player: Player
  ){}



  public exec() {
    this.setPlayerCamera();
    this.setPlayerMesh();

    enum MouseButton { LEFT=1, WHEEL=2, RIGHT=3 }

    this.scene.onPointerDown = (
      event: IPointerEvent,
      _info: PickingInfo,
      _type: PointerEventTypes,
    ) => {
      switch (event.button + 1) {
        case MouseButton.LEFT: {
          let hand = this.player.lhand;
          if (hand.isFree())
            hand.grab();
          else
            hand.free();
          break;
        }
        case MouseButton.RIGHT: {
          let hand = this.player.rhand;
          if (hand.isFree())
            hand.grab();
          else
            hand.free();
          break;
        }
      }
    };

    this.scene.onBeforeRenderObservable.add(() => {
      let pointer_pos: number[] = [this.scene.pointerX, this.scene.pointerY];
      
      /*
      TODO :
       - Making the hand follow the mouse (use 'pointer_pos')
       - Making the player slide if ...
       ...
      */
    });
  }

  private setPlayerCamera() {
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