/**
*     Game class
*/

class Game {
    constructor(scene) {
        this.scene = scene;
    	this.currTime = 0;		/// vamos ter um contador para o tempo
    	this.board = new Board(scene,this);
        this.marcador = new Marcador(scene,this);
    	this.difficulty;
    	this.playSequence = [];		/// guardar as jogadas para depois poder reproduzir (se calhar guardar os boards) e para o undo
    	this.result1 = 0;			/// resultado do jogo player 1
    	this.result2 = 0;			/// resultado do jogo player 2
    	this.playerType1;			/// tipo de jogo (H/H,H/M,M/M)t
        this.playerType2;
        this.player=0;          /// Current player 0/1

        console.log(this.board.boardToPlog());
    }

    handlePick(id){
    	this.board.handlePick(id);
    }

    changePlayer(){
        this.player ^= 1;
        this.scene.cameraAnimation.startAnimation();
    }

    updateTimer(time){
    	this.currTime+=time;
    }

    update(time){

        console.log("result 1 : " + this.result1);
        console.log("result 2 : " + this.result2);
    	/// CONTADOR
    	this.updateTimer(time);

    	this.board.update(time);
        this.marcador.update(time);
    }

    display(){
    	///this.board.display();
    }

}