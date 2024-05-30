//# Third-party :
import type { Scene, AbstractMesh, Skeleton } from "@babylonjs/core";
import { SceneLoader } from "@babylonjs/core";


//-----------------------------------------------------------------------------------


type PlayerModel = {
  mesh: AbstractMesh,
  skeleton: Skeleton
};

type PlayerAnim = {
  hang: ()=>void,
  climb: ()=>void,
  hopLeft: ()=>void,
  hopRight: ()=>void,
  shimmyLeft: ()=>void,
  shimmyRight: ()=>void,
}

export class Player {
  public constructor(private scene: Scene){}

  //# ¤¤¤¤¤¤¤¤¤¤¤¤ ATTRIBUTES ¤¤¤¤¤¤¤¤¤¤¤¤ #//
  private _model?: PlayerModel;
  private _anim? : PlayerAnim;

  //# ¤¤¤¤¤¤¤¤¤¤¤¤¤¤ GETTERS ¤¤¤¤¤¤¤¤¤¤¤¤¤ #//
  public get model(): PlayerModel{return this._model!}
  public get anim() : PlayerAnim{return this._anim!}



  //# ¤¤¤¤¤¤¤¤¤¤¤¤¤¤ METHODS ¤¤¤¤¤¤¤¤¤¤¤¤¤ #//
  public async importPlayerModel() {
    const {meshes, skeletons} = await SceneLoader.ImportMeshAsync(
      "", "../assets/models/", "climber.glb", this.scene
    );
    this._model = {mesh: meshes[0], skeleton: skeletons[0]};
  }

  public setAnim() {
    const HANG_ANIM         = this.scene.getAnimationGroupByName("hang")!;
    const CLIMB_ANIM        = this.scene.getAnimationGroupByName("climb")!;
    const HOP_LEFT_ANIM     = this.scene.getAnimationGroupByName("hop_left")!;
    const HOP_RIGHT_ANIM    = this.scene.getAnimationGroupByName("hop_right")!;
    const SHIMMY_LEFT_ANIM  = this.scene.getAnimationGroupByName("shimmy_left")!;
    const SHIMMY_RIGHT_ANIM = this.scene.getAnimationGroupByName("shimmy_right")!;

    const player_mesh = this.model.mesh;

    this._anim = {
      hang: ()=>{
        HANG_ANIM.start(true, 1, HANG_ANIM.from, HANG_ANIM.to, true);
        CLIMB_ANIM.stop();
        SHIMMY_LEFT_ANIM.stop();
        SHIMMY_RIGHT_ANIM.stop();
        HOP_LEFT_ANIM.stop();
        HOP_RIGHT_ANIM.stop();
      },
      climb: ()=>{
        CLIMB_ANIM.start(true, 1, CLIMB_ANIM.from, CLIMB_ANIM.to, false);
        player_mesh.moveWithCollisions(player_mesh.up.scaleInPlace(0.2));
      },
      hopLeft: ()=>{
        HOP_LEFT_ANIM.start(true, 1, HOP_LEFT_ANIM.from, HOP_LEFT_ANIM.to, false);
        player_mesh.moveWithCollisions(player_mesh.right.scaleInPlace(0.4));
      },
      hopRight: ()=>{
        HOP_RIGHT_ANIM.start(true, 1, HOP_RIGHT_ANIM.from, HOP_RIGHT_ANIM.to, false);
        player_mesh.moveWithCollisions(player_mesh.right.scaleInPlace(-0.4));
      },
      shimmyLeft: ()=>{
        SHIMMY_LEFT_ANIM.start(true, 1, SHIMMY_LEFT_ANIM.from, SHIMMY_LEFT_ANIM.to, true);
        player_mesh.moveWithCollisions(player_mesh.right.scaleInPlace(0.1));
      },
      shimmyRight: ()=>{
        SHIMMY_RIGHT_ANIM.start(false, 1, SHIMMY_RIGHT_ANIM.from, SHIMMY_RIGHT_ANIM.to, true);
        player_mesh.moveWithCollisions(player_mesh.right.scaleInPlace(-0.1));
      },
    }
  }
}
