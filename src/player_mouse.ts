//# Third-party :
import type { Scene, AbstractMesh, Skeleton, AnimationGroup, Bone } from "@babylonjs/core";
import { SceneLoader, Vector3 } from "@babylonjs/core";


//-----------------------------------------------------------------------------------


enum HandState { FIXED, FREE }

export class PlayerHand {
  public constructor(
    private _state: HandState,
    private _hand_anim: AnimationGroup,
  ) {}


  //# ¤¤¤¤¤¤¤¤¤¤¤¤¤¤ GETTERS ¤¤¤¤¤¤¤¤¤¤¤¤¤ #//
  public get pos(): Vector3 {
    //TODO : Computing position of hand
    return new Vector3(0,0,0);
  }


  //# ¤¤¤¤¤¤¤¤¤¤¤ BOOL CHECKERS ¤¤¤¤¤¤¤¤¤¤ #//
  public isFree(): boolean {return this._state == HandState.FREE;}


  //# ¤¤¤¤¤¤¤¤¤¤¤¤ ANIMATIONS ¤¤¤¤¤¤¤¤¤¤¤¤ #//
  private close() {
    this._hand_anim.start(true, 1, this._hand_anim.from, this._hand_anim.to, true);
  }

  private open() {
    this._hand_anim.start(true, 1, this._hand_anim.to, this._hand_anim.from, true);
  }


  //# ¤¤¤¤¤¤¤¤¤¤¤¤¤¤ METHODS ¤¤¤¤¤¤¤¤¤¤¤¤¤ #//
  public grab() {
    this._state = HandState.FIXED;
    this.close();
  }

  public free() {
    this._state = HandState.FREE;
    this.open();
  }
}


//-----------------------------------------------------------------------------------


type PlayerModel = {
  mesh: AbstractMesh,
  skeleton: Skeleton
};
type PlayerArms = {
  left_arm: {
    hand: Bone,
    shoulder: Bone,
    humerus: Bone,
    forearm: Bone,
  },
  right_arm: {
    hand: Bone,
    shoulder: Bone,
    humerus: Bone,
    forearm: Bone,
  }, 
};

export class Player {
  public constructor(private scene: Scene){}


  //# ¤¤¤¤¤¤¤¤¤¤¤¤ ATTRIBUTES ¤¤¤¤¤¤¤¤¤¤¤¤ #//
  private _model?: PlayerModel;
  private _lhand?: PlayerHand;
  private _rhand?: PlayerHand;
  private _arms?: PlayerArms;


  //# ¤¤¤¤¤¤¤¤¤¤¤¤¤¤ GETTERS ¤¤¤¤¤¤¤¤¤¤¤¤¤ #//
  // Bcs the player's attributes are 'Nullable', it's better to use the following getters.
  // Otherwise typescript might complain.
  public get model(): PlayerModel{return this._model!}
  public get lhand(): PlayerHand {return this._lhand!}
  public get rhand(): PlayerHand {return this._rhand!}
  private get arms(): PlayerArms {return this._arms!}

  public  get freeHands(): PlayerHand[] {
    return [this.lhand, this.rhand].filter((hand) => hand.isFree());
  }

  //# ¤¤¤¤¤¤¤¤¤¤¤¤¤¤ METHODS ¤¤¤¤¤¤¤¤¤¤¤¤¤ #//

  //********* Player Initialisation ********//

  public async importPlayerModel() {
    const {meshes, skeletons} = await SceneLoader.ImportMeshAsync(
      "", "../assets/models/", "handdy.glb", this.scene
    );
    this._model = {mesh: meshes[0], skeleton: skeletons[0]};



    this._lhand = new PlayerHand(
      HandState.FREE,
      this.scene.getAnimationGroupByName("leftHand")!,
    );
    this._rhand = new PlayerHand(
      HandState.FREE,
      this.scene.getAnimationGroupByName("rightHand")!,
    );

    const player_bones = this.model.skeleton.bones;

    this._arms = {
      left_arm: {
        hand: player_bones[10],
        shoulder: player_bones[9],
        humerus: player_bones[10],
        forearm: player_bones[11],
      },
      right_arm: {
        hand: player_bones[34],
        shoulder: player_bones[36],
        humerus: player_bones[37],
        forearm: player_bones[38],
      },
    };
  }

  //************* Player Actions ***********//

  //...
}