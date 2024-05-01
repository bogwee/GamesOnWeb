import type { IPointerEvent, PickingInfo, PointerEventTypes, Scene } from "@babylonjs/core";
import type { Player } from "../player.ts";


enum MouseButton { LEFT=1, WHEEL=2, RIGHT=3 }

export class Game_ActionManager {
  constructor(
    private scene: Scene,
    private player: Player
  ){}


  public exec() {
    this.scene.onPointerDown = (
      event: IPointerEvent,
      info: PickingInfo,
      type: PointerEventTypes
    ) => {
      switch (event.button + 1) {
        case MouseButton.LEFT: break; //Do something with left hand...
        case MouseButton.RIGHT: break; //Do something with right hand...
      }
    };
  }
}