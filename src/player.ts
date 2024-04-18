import {Scene, Vector3, MeshBuilder} from "@babylonjs/core";

import {Game} from "./game.js";


enum HandState {
  FIXED, // The hand can't move
  FREE   // The hand is constantly following the mouse 
}

class PlayerHand {

  private state : HandState;
  private hand_position : Vector3;

  public isFree() : boolean {return this.state == HandState.FREE;}
  public isFixed(): boolean {return this.state == HandState.FIXED;}

  public constructor(position: Vector3, init_state: HandState) {
    this.state = init_state;
    this.hand_position = position;
  }

  /*Grab a grip with the hand*/
  public grab(): void {
    if (this.isFixed()) return

    // Test if current 'hand_position' is a grip :
    let is_a_grip = true;  //DEBUG :: Always true
    // utiliser : pick + predicate
    if  (!is_a_grip) return;

    // ...
    this.state = HandState.FIXED;
  }

  /*Release the hand.*/
  public release(): void {
    if (this.isFree()) return;

    // ...
    this.state = HandState.FREE;
  }

    /*Make the hand follow the mouse.*/
  public update(): void {
    if (this.isFixed()) return;

    let scene: Scene = Game.getGame().getScene();
    let mouse_coordinate: Vector3; 

    scene.onPointerMove = (evt) => {
      const pickInfo = scene.pick(scene.pointerX, scene.pointerY);
      /*DEBUG ::*/console.log(pickInfo);
      if (pickInfo.hit) {
          const mouse_coordinate = pickInfo.pickedPoint!;
          console.log(worldPointer);

          text.text = `x: ${worldPointer.x.toFixed(1)}, y: ${worldPointer.y.toFixed(1)}, z: ${worldPointer.z.toFixed(1)}`;
      } else {
          rectangle.isVisible = false;
      }
    }
    //...
  }
}


enum PlayerState { NONE, LEFT_HAND, RIGHT_HAND }

export class Player_VTest {
 private state: PlayerState;

 private left_hand: PlayerHand;
 private private_hand: PlayerHand;

 constructor() {
  this.sm = PlayerState.NONE;
 }

 public followMouse() {

 }
}











export class Player {
  //TODO
}
