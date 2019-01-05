/**
*     Marcador class shows the time and player score
**/

class Marcador {
    constructor(scene,game) {
        this.scene = scene;
        this.game = game;

        this.timer = 0;

        this.square = new MyRectangle(scene,null,0,1,0,1);

        this.initNumbers();

        this.black_material = new CGFappearance(scene);
        this.black_material.setDiffuse(0,0,0,0);

        this.white_material = new CGFappearance(scene);
        this.white_material.setDiffuse(1,1,1,1);

    }

    initNumbers(){
        this.min1Tex = new CGFappearance(this.scene);
        this.min2Tex = new CGFappearance(this.scene);
        this.minPts = new CGFappearance(this.scene);
        this.minPts.setTexture(this.scene.graph.textures["clock_pts"]);
        this.sec1Tex = new CGFappearance(this.scene);
        this.sec2Tex = new CGFappearance(this.scene);
        this.player1_1 = new CGFappearance(this.scene);
        this.player1_1.setTexture(this.scene.graph.textures["clock_0"]);
        this.player1_2 = new CGFappearance(this.scene);
        this.player1_2.setTexture(this.scene.graph.textures["clock_0"]);
        this.tracoTex = new CGFappearance(this.scene);
        this.tracoTex.setTexture(this.scene.graph.textures["clock_traco"]);
        this.player2_1 = new CGFappearance(this.scene);
        this.player2_1.setTexture(this.scene.graph.textures["clock_0"]);
        this.player2_2 = new CGFappearance(this.scene);
        this.player2_2.setTexture(this.scene.graph.textures["clock_0"]);
    }

    updateTextures(){

        /// TIMER
        this.min1Tex.setTexture(this.scene.graph.textures["clock_" + Math.floor(this.timer / 600)]);
        this.min2Tex.setTexture(this.scene.graph.textures["clock_" + Math.floor(this.timer / 60)]);
        this.sec1Tex.setTexture(this.scene.graph.textures["clock_" + Math.floor((this.timer % 60) / 10 )]);
        this.sec2Tex.setTexture(this.scene.graph.textures["clock_" + Math.floor(this.timer % 10)]);

        /// SCORE
        this.player1_1.setTexture(this.scene.graph.textures["clock_" + Math.floor(this.game.result1 / 10)]);
        this.player1_2.setTexture(this.scene.graph.textures["clock_" + this.game.result1 % 10]);
        this.player2_1.setTexture(this.scene.graph.textures["clock_" + Math.floor(this.game.result2 / 10)]);
        this.player2_2.setTexture(this.scene.graph.textures["clock_" + this.game.result2 % 10]);

    }
/*
    updateTimer(time){
    	this.currTime+=time;
    }*/

    update(time){
    	/// CONTADOR
        this.timer += time;

        this.updateTextures();

    	//this.board.update();
    }

    display(){

        /// BODY

        this.scene.pushMatrix();
            this.scene.translate(0,1,0.3);
            this.scene.rotate(-Math.PI/2,1,0,0);
            this.scene.scale(7,0.3,1);
            this.square.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.rotate(Math.PI/2,1,0,0);
            this.scene.scale(7,1,1);
            this.square.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0,0,1);
            this.scene.scale(7,0.3,1);
            this.square.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0,1,0);
            this.scene.rotate(Math.PI,1,0,0);
            this.scene.scale(7,1,1);
            this.square.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0,0.3,1);
            this.scene.rotate(-Math.PI/4,1,0,0);
            this.scene.scale(7,1,1);
            this.square.display();
        this.scene.popMatrix();

        ///                 SCREEN
        /*

            <translate x="0.5" y="0.4" z="0.96" />
            <rotate axis="x" angle="-45" />
            <scale x="0.6" y="0.6" z="1"/>
            */

        this.scene.pushMatrix();
            this.white_material.apply();
            this.scene.translate(0.5,0.4,0.95);
            this.scene.rotate(-Math.PI/4,1,0,0);
            this.scene.scale(6,0.8,1);
            this.square.display();
        this.scene.popMatrix();

        ///                TIMER

        this.scene.pushMatrix();
            this.min1Tex.apply();
            this.scene.translate(0.7,0.55,0.81);
            this.scene.rotate(-Math.PI/4,1,0,0);
            this.scene.scale(0.4,0.4,1);
            this.square.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.min2Tex.apply();
            this.scene.translate(1.1,0.55,0.81);
            this.scene.rotate(-Math.PI/4,1,0,0);
            this.scene.scale(0.4,0.4,1);
            this.square.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.minPts.apply();
            this.scene.translate(1.5,0.55,0.81);
            this.scene.rotate(-Math.PI/4,1,0,0);
            this.scene.scale(0.4,0.4,1);
            this.square.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.sec1Tex.apply();
            this.scene.translate(1.9,0.55,0.81);
            this.scene.rotate(-Math.PI/4,1,0,0);
            this.scene.scale(0.4,0.4,1);
            this.square.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.sec2Tex.apply();
            this.scene.translate(2.3,0.55,0.81);
            this.scene.rotate(-Math.PI/4,1,0,0);
            this.scene.scale(0.4,0.4,1);
            this.square.display();
        this.scene.popMatrix();

        ///                SCORES

        this.scene.pushMatrix();
            this.player1_1.apply();
            this.scene.translate(3.2,0.5,0.88);
            this.scene.rotate(-Math.PI/4,1,0,0);
            this.scene.scale(0.6,0.6,1);
            this.square.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.player1_2.apply();
            this.scene.translate(3.8,0.5,0.89);
            this.scene.rotate(-Math.PI/4,1,0,0);
            this.scene.scale(0.6,0.6,1);
            this.square.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.tracoTex.apply();
            this.scene.translate(4.4,0.5,0.88);
            this.scene.rotate(-Math.PI/4,1,0,0);
            this.scene.scale(0.6,0.6,1);
            this.square.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.player2_1.apply();
            this.scene.translate(5,0.5,0.89);
            this.scene.rotate(-Math.PI/4,1,0,0);
            this.scene.scale(0.6,0.6,1);
            this.square.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.player2_2.apply();
            this.scene.translate(5.6,0.5,0.88);
            this.scene.rotate(-Math.PI/4,1,0,0);
            this.scene.scale(0.6,0.6,1);
            this.square.display();
        this.scene.popMatrix();

/*
        this.scene.pushMatrix();
            this.minPts.apply();
            this.scene.translate(,0.4,0.96);
            this.scene.rotate(-Math.PI/4,1,0,0);
            this.scene.scale(0.6,0.6,1);
            this.square.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.minPts.apply();
            this.scene.translate(0.5,0.4,0.96);
            this.scene.rotate(-Math.PI/4,1,0,0);
            this.scene.scale(0.6,0.6,1);
            this.square.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.minPts.apply();
            this.scene.translate(0.5,0.4,0.96);
            this.scene.rotate(-Math.PI/4,1,0,0);
            this.scene.scale(0.6,0.6,1);
            this.square.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.minPts.apply();
            this.scene.translate(0.5,0.4,0.96);
            this.scene.rotate(-Math.PI/4,1,0,0);
            this.scene.scale(0.6,0.6,1);
            this.square.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.minPts.apply();
            this.scene.translate(0.5,0.4,0.96);
            this.scene.rotate(-Math.PI/4,1,0,0);
            this.scene.scale(0.6,0.6,1);
            this.square.display();
        this.scene.popMatrix();

        */

    }

}