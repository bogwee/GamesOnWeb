//# Third-party :
import type { Tuple } from "@babylonjs/core";
import type { Scene, AbstractMesh, Skeleton, Bone } from "@babylonjs/core";
import { SceneLoader, Vector3 } from "@babylonjs/core";


//-----------------------------------------------------------------------------------


enum HandState { FIXED, FREE }
type PlayerHandSkeleton = {
  main_bone  : Bone,
  fing_thumb : Tuple<Bone, 4>,
  fing_index : Tuple<Bone, 4>,
  fing_middle: Tuple<Bone, 4>,
  fing_ring  : Tuple<Bone, 4>,
  fing_pinky : Tuple<Bone, 4>,
};

export class PlayerHand {
  public constructor(
    private _side: "left" | "right",
    private _state: HandState,
    //Note : Contrairement aux os des bras du joueur, il n'est pas nécessaire de récupérer les os de la main.
    //-- Il suffit simplemnt de réaliser une animation pour "fermer" et "ouvrir" les mains.
    private _hand_skeleton: PlayerHandSkeleton
  ) {}


  //# ¤¤¤¤¤¤¤¤¤¤¤¤¤¤ GETTERS ¤¤¤¤¤¤¤¤¤¤¤¤¤ #//
  public get pos(): Vector3 {
    //TODO : Computing position of hand
    return new Vector3(0,0,0);
  }


  //# ¤¤¤¤¤¤¤¤¤¤¤ BOOL CHECKERS ¤¤¤¤¤¤¤¤¤¤ #//
  public isFree(): boolean {return this._state == HandState.FREE;}


  //# ¤¤¤¤¤¤¤¤¤¤¤¤ ANIMATIONS ¤¤¤¤¤¤¤¤¤¤¤¤ #//
  private closeHand() {
    switch (this._side) {
      case "left": {
        //Close left hand
        break;
      }
      case "right": {
        //Close right hand
        break;
      }
    }
  }

  private openHand() {
    switch (this._side) {
      case "left": {
        //Open left hand
        break;
      }
      case "right": {
        //Open right hand
        break;
      }
    }
  }


  //# ¤¤¤¤¤¤¤¤¤¤¤¤¤¤ METHODS ¤¤¤¤¤¤¤¤¤¤¤¤¤ #//
  public grab() {
    this._state = HandState.FIXED;
    this.closeHand();
  }

  public free() {
    this._state = HandState.FREE;
    this.openHand();
  }
}


//-----------------------------------------------------------------------------------


type PlayerModel = {
  mesh: AbstractMesh,
  skeleton: Skeleton
};
type PlayerArms = {
  left_arm: {
    shoulder: Bone,
    humerus: Bone,
    forearm: Bone,
  },
  right_arm: {
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
  // Bcs the player's attriubtes are 'Nullable', it's better to use the following getters.
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
      "", "../assets/models/", "climber.glb", this.scene
    );
    this._model = {mesh: meshes[0], skeleton: skeletons[0]};

    const player_bones = this.model.skeleton.bones;

    const lhand_skeleton: PlayerHandSkeleton = {
      main_bone  : this.model.skeleton.bones[10],
      fing_thumb : player_bones.slice(11, 15) as Tuple<Bone, 4>,
      fing_index : player_bones.slice(15, 19) as Tuple<Bone, 4>,
      fing_middle: player_bones.slice(19, 23) as Tuple<Bone, 4>,
      fing_ring  : player_bones.slice(23, 27) as Tuple<Bone, 4>,
      fing_pinky : player_bones.slice(27, 31) as Tuple<Bone, 4>,
    };

    const rhand_skeleton: PlayerHandSkeleton = {
      main_bone  : this.model.skeleton.bones[34],
      fing_thumb : player_bones.slice(35, 39) as Tuple<Bone, 4>,
      fing_index : player_bones.slice(39, 43) as Tuple<Bone, 4>,
      fing_middle: player_bones.slice(43, 47) as Tuple<Bone, 4>,
      fing_ring  : player_bones.slice(47, 51) as Tuple<Bone, 4>,
      fing_pinky : player_bones.slice(51, 55) as Tuple<Bone, 4>,
    };

    this._lhand = new PlayerHand("left", HandState.FREE, lhand_skeleton);
    this._rhand = new PlayerHand("right", HandState.FREE, rhand_skeleton);
  
    this._arms = {
      left_arm: {
        shoulder: player_bones[9],
        humerus: player_bones[10],
        forearm: player_bones[11],
      },
      right_arm: {
        shoulder: player_bones[36],
        humerus: player_bones[37],
        forearm: player_bones[38],
      },
    };
  }

  //************* Player Actions ***********//

  //...
}