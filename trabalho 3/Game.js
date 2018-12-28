
class Game {
    constructor(scene) {
    	this.currTime=0;		/// vamos ter um contador para o tempo
    	this.board= new Board(scene);
    	this.difficulty;
    	this.playSequence;		/// guardar as jogadas para depois poder reproduzir (se calhar guardar os boards)
    	this.result1;			// resultado do jogo player 1
    	this.result1;			// resultado do jogo player 2
    }
}