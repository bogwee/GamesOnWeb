/*
Fichier contenant les différentes "state machine (sm)" :

 - main_sm : sm représentant l'état du jeu :
      - sur le menu
      - en jeux
      - en pause

 - player_sm : ... 
*/
export enum MainState { MENU, PAUSE, GAME, WIN, LOSE }

export class MainStateMachine extends AbstractStateMachine{
}