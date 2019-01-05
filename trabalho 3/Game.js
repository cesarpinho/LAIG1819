/**
*     Game class
*/

class Game {
    constructor(scene) {
        this.scene = scene;
        this.playing = false;     /// Diz se o jogo já começou ou não (criamos so uma instancia de Game onde vao decorrer todos os jogos)
    	this.currTime = 0;		/// vamos ter um contador para o tempo
    	this.board = new Board(scene,this);
        this.marcador = new Marcador(scene,this);
    	this.difficulty;            /// 0-easy 1-hard
    	this.playSequence = [];		/// guardar as jogadas para depois poder reproduzir (se calhar guardar os boards) e para o undo
    	this.result1 = 0;			/// resultado do jogo player 1
    	this.result2 = 0;			/// resultado do jogo player 2
    	this.playerType1;			/// 0-H 1-M
        this.playerType2;
        this.player = 1;          /// Current player 1/2
    }

    handlePick(id){
        console.log("IDDDDDDDDDDDD : " + id );
        if(id<100)
    	   this.board.handlePick(id);
        else this.marcador.handlePick(id);
    }

    restartGame(){
        console.log("RESTART GAME");
        this.result1=0;
        this.result2=0;
        this.board.restartGame();
        this.marcador.restartGame();
    }

    changePlayer(){

        switch(this.player) {
            case 1: 
                this.player ++;
                break;
            case 2:
                this.player --;
                break;
        }
     
        this.scene.cameraAnimation.startAnimation();
    }

    updateTimer(time){
    	this.currTime += time;
    }

    update(time){
    	/// CONTADOR
    	this.updateTimer(time);

    	this.board.update(time);
        this.marcador.update(time);
    }

    display(){
    }

}