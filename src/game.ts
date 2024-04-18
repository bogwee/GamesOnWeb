import {
  Scene,
  Engine,
} from "@babylonjs/core";


export class Game {
  private static game_instance : Game

  private canvas: HTMLCanvasElement;
  private engine: Engine;
  private scene: Scene;

  private constructor() {
    this.canvas = document.getElementById('renderCanvas')! as HTMLCanvasElement;
    this.engine = new Engine(this.canvas, true);
    this.scene = this.createScene();

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }

  private createScene(): Scene {
    /*DEBUG ::*/ return new Scene(this.engine); 
  }

  public static getGame(): Game {
    if (!Game.game_instance) {
      Game.game_instance = new Game()
    }

    return Game.game_instance;
  }

  public getCanvas(): HTMLCanvasElement {return this.canvas;}
  public getScene(): Scene {return this.scene;}
  public getEngine(): Engine {return this.engine;}
}