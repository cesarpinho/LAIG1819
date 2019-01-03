
class Game {
    constructor(scene) {
    	this.currTime = 0;		/// vamos ter um contador para o tempo
    	this.board = new Board(scene);
    	this.difficulty;
    	this.playSequence = [];		/// guardar as jogadas para depois poder reproduzir (se calhar guardar os boards) e para o undo
    	this.result1;			/// resultado do jogo player 1
    	this.result2;			/// resultado do jogo player 2
		this.playerType1;			/// tipo de jogo (H/H,H/M,M/M)
		this.playerType2;

    }

    handlePick(id){
    	this.board.handlePick(id);
    }

    updateTimer(time){
    	this.currTime+=time;
    }

    update(time){
    	/// CONTADOR
    	this.updateTimer(time);			

    	this.board.update();
    }

    display(){
    	this.board.display();
    }

}