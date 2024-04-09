/*
Fichier contenant les différentes "state machine (sm)" :

 - main_sm : sm représentant l'état du jeu :
      - sur le menu
      - en jeux
      - en pause

 - player_sm : ... 
*/

abstract class AbstractStateMachine {
}


enum MainState { MENU, PAUSE, GAME, WIN, LOSE }
enum PlayerState { LEFT_ARM, RIGHT_ARM }


class MainStateMachine extends AbstractStateMachine{
}


class PlayerStateMachine extends AbstractStateMachine {
}
