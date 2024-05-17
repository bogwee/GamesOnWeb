//# Third-party :
import type { Scene, AbstractMesh, Skeleton } from "@babylonjs/core";
import { SceneLoader } from "@babylonjs/core";


//-----------------------------------------------------------------------------------


type PlayerModel = {
  mesh: AbstractMesh,
  skeleton: Skeleton
};

export class Player {
  public constructor(private scene: Scene){}

  //# ¤¤¤¤¤¤¤¤¤¤¤¤ ATTRIBUTES ¤¤¤¤¤¤¤¤¤¤¤¤ #//
  private _model?: PlayerModel;


  //# ¤¤¤¤¤¤¤¤¤¤¤¤¤¤ GETTERS ¤¤¤¤¤¤¤¤¤¤¤¤¤ #//
  public get model(): PlayerModel{return this._model!}


  //# ¤¤¤¤¤¤¤¤¤¤¤¤¤¤ METHODS ¤¤¤¤¤¤¤¤¤¤¤¤¤ #//
  public async importPlayerModel() {
    const {meshes, skeletons} = await SceneLoader.ImportMeshAsync(
      "", "../assets/models/", "climber.glb", this.scene
    );
    this._model = {mesh: meshes[0], skeleton: skeletons[0]};
  }
}
