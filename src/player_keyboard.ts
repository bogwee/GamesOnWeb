//# Third-party :
import type { Scene, AbstractMesh, Skeleton, AnimationGroup } from "@babylonjs/core";
import { SceneLoader } from "@babylonjs/core";


//-----------------------------------------------------------------------------------


type PlayerModel = {
  mesh: AbstractMesh,
  skeleton: Skeleton
};

type PlayerAnimationDict = { [key: string]: AnimationGroup };

export class Player {
  //# ¤¤¤¤¤¤¤¤¤¤¤¤ ATTRIBUTES ¤¤¤¤¤¤¤¤¤¤¤¤ #//
  private _model?: PlayerModel;
  private _animations : PlayerAnimationDict;


  //# ¤¤¤¤¤¤¤¤¤¤¤ CONSTRUCTORS ¤¤¤¤¤¤¤¤¤¤¤ #//
  public constructor(private scene: Scene){
    this._animations = {
      "climb": this.scene.getAnimationGroupByName("climb")!,
      "hang": this.scene.getAnimationGroupByName("hang")!,
      "hop_left": this.scene.getAnimationGroupByName("hop_left")!,
      "hop_right": this.scene.getAnimationGroupByName("hop_right")!,
      "shimmy_left": this.scene.getAnimationGroupByName("shimmy_left")!,
      "shimmy_right": this.scene.getAnimationGroupByName("shimmy_right")!
    }
  }


  //# ¤¤¤¤¤¤¤¤¤¤¤¤¤¤ GETTERS ¤¤¤¤¤¤¤¤¤¤¤¤¤ #//
  public get model(): PlayerModel{return this._model!}
  public get animations(): PlayerAnimationDict {return this._animations}

  //# ¤¤¤¤¤¤¤¤¤¤¤¤¤¤ METHODS ¤¤¤¤¤¤¤¤¤¤¤¤¤ #//

  //********* Player Initialisation ********//

  public async importPlayerModel() {
    const {meshes, skeletons} = await SceneLoader.ImportMeshAsync(
      "", "../assets/models/", "climber.glb", this.scene
    );
    this._model = {mesh: meshes[0], skeleton: skeletons[0]};
  }

  //************* Player Actions ***********//

  //...
}