import { SceneLoader, Vector3 } from "@babylonjs/core";
//Types :
import type { Tuple } from "@babylonjs/core";
import type { Scene, AbstractMesh, Skeleton, Bone } from "@babylonjs/core";


//-----------------------------------------------------------------------------------


type PlayerHandSkeleton = {
  main: Bone,
  fing_thumb : Tuple<Bone, 4>,
  fing_index : Tuple<Bone, 4>,
  fing_middle: Tuple<Bone, 4>,
  fing_ring  : Tuple<Bone, 4>,
  fing_pinky : Tuple<Bone, 4>,
}

enum HandState { FIXED, FREE }

export class PlayerHand {
  public constructor(
    private _side: "left" | "right",
    private _state: HandState,
    private _hand_skeleton: PlayerHandSkeleton
  ) {}

  public get pos(): Vector3 {
    //TODO : Computing position of hand
    return new Vector3(0,0,0);
  }

  public isFree(): boolean {return this._state == HandState.FREE;}


  private closeLeftHand() {
    //...
  }
  private closeRightHand() {
    //...
  }

  private openLeftHand() {
    //...
  }
  private openRightHand() {
    //...
  }


  public grab() {
    this._state = HandState.FIXED;

    switch(this._side) {
      case "left": this.closeLeftHand(); break;
      case "left": this.closeRightHand(); break;
    }
  }
  public free() {
    this._state = HandState.FREE;

    switch(this._side) {
      case "left": this.openLeftHand(); break;
      case "left": this.openRightHand(); break;
    }
  }
}


//-----------------------------------------------------------------------------------


type PlayerModel = {
  mesh: AbstractMesh,
  skeleton: Skeleton
};

export class Player {
  private _model?: PlayerModel;

  private _lhand?: PlayerHand;
  private _rhand?: PlayerHand;

  public constructor(private scene: Scene){
    this.createPlayer();
  }

  private async createPlayer() {
    const {meshes, skeletons} = await SceneLoader.ImportMeshAsync(
      "", "../assets/models/", "character.glb", this.scene
    );
    this._model = {mesh: meshes[0], skeleton: skeletons[0]}

    const lhand_skeleton: PlayerHandSkeleton = {
      main: this.model.skeleton.bones[10],
      fing_thumb : this.model.skeleton.bones.slice(11, 15) as Tuple<Bone, 4>,
      fing_index : this.model.skeleton.bones.slice(15, 19) as Tuple<Bone, 4>,
      fing_middle: this.model.skeleton.bones.slice(19, 23) as Tuple<Bone, 4>,
      fing_ring  : this.model.skeleton.bones.slice(23, 27) as Tuple<Bone, 4>,
      fing_pinky : this.model.skeleton.bones.slice(27, 31) as Tuple<Bone, 4>,
    }

    const rhand_skeleton: PlayerHandSkeleton = {
      main: this.model.skeleton.bones[34],
      fing_thumb : this.model.skeleton.bones.slice(35, 39) as Tuple<Bone, 4>,
      fing_index : this.model.skeleton.bones.slice(39, 43) as Tuple<Bone, 4>,
      fing_middle: this.model.skeleton.bones.slice(43, 47) as Tuple<Bone, 4>,
      fing_ring  : this.model.skeleton.bones.slice(47, 51) as Tuple<Bone, 4>,
      fing_pinky : this.model.skeleton.bones.slice(51, 55) as Tuple<Bone, 4>,
    }

    this._lhand = new PlayerHand("left", HandState.FREE, lhand_skeleton);
    this._rhand = new PlayerHand("right", HandState.FREE, rhand_skeleton);
  }


  private get model(): PlayerModel{return this._model!}

  private get lhand(): PlayerHand {return this._lhand!}
  private get rhand(): PlayerHand {return this._rhand!}

  public getFreeHands(): PlayerHand[] {
    return [this.lhand, this.rhand].filter((hand) => hand.isFree());
  }
}