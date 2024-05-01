import "./UI/style.css";

import { Game } from "./game.ts";

// DOM's Shortcuts :

const START_BTN = document.getElementById("start")!;
const MENU = document.querySelector("nav")!;


function startGame() {
  MENU.classList.add("notplaying");

  Game.buildScene();

  //const player_initialiser = new Game_PlayerInitialiser(Game.game.scene);
  //player_initialiser.exec();
}


START_BTN.addEventListener("click", startGame);





/*
#Game :
-- Singleton accessible via 'Game.getGame()'
*Attributes : 
- engine            : Engine
- canvas            : HTMLCanvas
- scene             : Scene
*Methodes :
+ initScene         => Contruis la map du jeu
+ initPlayer        => Initialise le joueur


#Game_SceneBuilder(scene) :
-- Charger de la construction de la map
*Methodes :
+ exec              => exécute le builder


#Game_PlayerInitialiser(scene) :
-- Charger de l'initialisation du joueur
*Methodes :
+ exec()              => exécute l'initialisateur
+ getPlayer()         => renvoie le player initialiser


#MapComponent :
*Attributes :
- meshe               : ???
- texture             : ???
?- position : Vector3
*Methodes :
+ paste()             => place l'élément
+ isHoldable()        => indique si le joueur peut s'accrocher dessus


#Player_Hand
*Attributes :
- state               : Hand_State{ FIXED, FREE }
- position            : Vector3
*Methodes :
+ free()              => libère la main pour qu'elle suive la souris
+ grab()              => fixe la main (si possible) à sa position actuelle
+ isFree()            => indique si la main est libre
+ isFixed()           => indique si la main est fixée
+ getPosition()       => renvoie la position de la main


#Player :
-- Gère les déplacements (théoriques + visuelles) en fonction des inputs
*Attributes :
- lhand  : Player_Hand
- rhand  : Player_Hand
- gcente : Vector3
*Methodes :
+ getFreeHands()      => renvoie les mains libres
+ freeHand(hand)      => libère la main souhaitée : "left" | "right"
+ freeHands()         => libère les deux mains
+ rectifyGCenter()    => actualise le centre de gravité (en fontion de la position des mains)


#Player_Controller :
-- Gère l'aspect graphique des actions du joueur (ex : lever le bras)
*Attributes :
-
-
-
*Methodes :
-
-
-

*/