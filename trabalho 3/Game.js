
class Game {
    constructor(scene) {
        this.scene=scene;
    	this.currTime=0;		/// vamos ter um contador para o tempo
    	this.board= new Board(scene,this);
    	this.difficulty;
    	this.playSequence;		/// guardar as jogadas para depois poder reproduzir (se calhar guardar os boards) e para o undo
    	this.result1;			/// resultado do jogo player 1
    	this.result2;			/// resultado do jogo player 2
    	this.gameType;			/// tipo de jogo (H/H,H/M,M/M)t
        this.player=0;          /// Current player 0/1
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
    	/// CONTADOR
    	this.updateTimer(time);			


    	this.board.update();
    }

    display(){
    	this.board.display();
    }

}