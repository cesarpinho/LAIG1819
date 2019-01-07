/**
*     Marcador class shows the time and player score
**/

class Marcador {
    constructor(scene,game) {
        this.scene = scene;
        this.game = game;

        this.on=false;
        this.gametypechosen=false;
        this.gamedifficultychosen=false;

        this.timer = 0;

        var nurbsSurface = new CGFnurbsSurface(3, 1, [  // U = 0
                [ // V = 0..1;
                    [-0.5,1,0,1],
                    [0.5,1,0,1],
                ],
                // U = 1
                [ // V = 0..1
                    [-1,0.7,0,1],
                    [1,0.7,0,1],
                ],
                [ // V = 0..1
                    [-1,-0.7,0,1],
                    [1,-0.7,0,1],
                ],
                [ // V = 0..1
                    [-0.5,-1,0,1],
                    [0.5,-1,0,1], 
                ]
            ]);

        this.button = new CGFnurbsObject(scene, 20, 20, nurbsSurface);

        this.square = new MyRectangle(scene,null,0,1,0,1);

        this.initNumbers();

        this.black_material = new CGFappearance(scene);
        this.black_material.setDiffuse(0,0,0,0);

        this.white_material = new CGFappearance(scene);
        this.white_material.setDiffuse(1,1,1,1);

        this.tablet_grey_material = new CGFappearance(scene);
        this.tablet_grey_material.setEmission(0,0,0,1);

        this.tablet_off_material = new CGFappearance(scene);
        this.tablet_off_material.setEmission(0.1,0.1,0.1,1);
        this.tablet_off_material.setDiffuse(0.1,0.1,0.1,0.5);
        this.tablet_off_material.setSpecular(0.1,0.1,0.1,0.5);

        this.tablet_on_material = new CGFappearance(scene);
        this.tablet_on_material.setDiffuse(0.2,0.2,0.2,0);
        this.tablet_on_material.setSpecular(0,0,0,0);

        this.tabletButtons = [];
        
        /// create tablet buttons
        for(var i = 0; i < 7 ; i++) {
            ///this.tabletButtons.push(this.square);
            this.tabletButtons.push(new CGFnurbsObject(this.scene, 20, 20, nurbsSurface));
        }


        this.initButtons();
        ///this.pickObjs=[];

        ///this.pickObjs.push(this.button);

    }

    initNumbers(){
        this.min1Tex = new CGFappearance(this.scene);
        this.min1Tex.setTexture(this.scene.graph.textures["clock_0"]);
        this.min2Tex = new CGFappearance(this.scene);
        this.min2Tex.setTexture(this.scene.graph.textures["clock_0"]);
        this.minPts = new CGFappearance(this.scene);
        this.minPts.setTexture(this.scene.graph.textures["clock_pts"]);
        this.sec1Tex = new CGFappearance(this.scene);
        this.sec1Tex.setTexture(this.scene.graph.textures["clock_0"]);
        this.sec2Tex = new CGFappearance(this.scene);
        this.sec2Tex.setTexture(this.scene.graph.textures["clock_0"]);
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

    initButtons(){

        this.startbutton_tex = new CGFappearance(this.scene);
        this.startbutton_tex.setTexture(this.scene.graph.textures["startgame_button"]);

        this.HvsH_button_tex = new CGFappearance(this.scene);
        this.HvsH_button_tex.setTexture(this.scene.graph.textures["HvsH_button"]);

        this.HvsM_button_tex = new CGFappearance(this.scene);
        this.HvsM_button_tex.setTexture(this.scene.graph.textures["HvsM_button"]);

        this.MvsM_button_tex = new CGFappearance(this.scene);
        this.MvsM_button_tex.setTexture(this.scene.graph.textures["MvsM_button"]);

        this.easy_button_tex = new CGFappearance(this.scene);
        this.easy_button_tex.setTexture(this.scene.graph.textures["easy_button"]);

        this.hard_button_tex = new CGFappearance(this.scene);
        this.hard_button_tex.setTexture(this.scene.graph.textures["hard_button"]);

        this.restart_button_tex = new CGFappearance(this.scene);
        this.restart_button_tex.setTexture(this.scene.graph.textures["restart_button"]);

        this.undo_button_tex = new CGFappearance(this.scene);
        this.undo_button_tex.setTexture(this.scene.graph.textures["undo_button"]);

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

    update2(time){

        /// START BUTTON

        if((this.gamedifficultychosen && this.gametypechosen) || (this.gametypechosen && this.game.playerType[1] == 0))
        this.startbutton_tex.setTexture(this.scene.graph.textures["startgame_button_brilho"]);
            else    this.startbutton_tex.setTexture(this.scene.graph.textures["startgame_button"]);

    }

    /// Handler dos picks no tablet
    /**
      * 100 - ON/OFF
      * 101 - H/H
      * 102 - H/M
      * 103 - M/M
      * 104 - EASY
      * 105 - HARD
      * 106 - START GAME
      *
      * 107 - RESTART GAME BUTTON
      */

    handlePick(id){
        console.log("picked with id : " + id);

        switch(id){
            case 100:
                this.on=!this.on;
                console.log(this.on);
                break;
            case 101:
                this.gametypechosen=true;
                this.game.playerType = [0,0];
                break;
            case 102:
                this.gametypechosen=true;
                this.game.playerType = [0,1];
                break;
            case 103:
                this.gametypechosen=true;
                this.game.playerType = [1,1];
                break;
            case 104:
                this.gamedifficultychosen=true;
                this.game.difficulty = "computer1";
                break;
            case 105:
                this.gamedifficultychosen=true;
                this.game.difficulty = "computer2";
                break;
            case 106:
                if((this.gamedifficultychosen && this.gametypechosen) || (this.gametypechosen && this.game.playerType[1] == 0)){
                    this.game.playing=true;
                }
                break;
            case 107:
                this.game.restartGame();
                break;
            case 108:
                this.game.board.undo();
                break;
            default:
                console.log("?????????????????????");
                break;
        }

        ///console.log("this.on : " + this.on);

    }

    restartGame(){
        this.timer=0;
    }

    display(){

        this.scene.pushMatrix();

        this.scene.translate(1.2,0.7,3);
        this.scene.scale(0.7,0.7,0.7);

        /// TABLET

        ////    BUTTONS

        /// ON/OFF BUTTON

        this.scene.pushMatrix();
            this.scene.registerForPick(100,this.button);
            this.black_material.apply();
            this.scene.translate(3.5,9.87,0.01);
            this.scene.scale(0.08,0.08,0.09);
            this.scene.scale(5,1,1);
            this.button.display();
            this.scene.clearPickRegistration();
        this.scene.popMatrix();

        ///console.log("thism.game.playing : " +this.game.playing);

        if(this.on){

            if(!this.game.playing){

                    /// GAME TYPE BUTTONS

                this.scene.pushMatrix();
                    this.HvsH_button_tex.apply();
                    this.scene.registerForPick(101,this.tabletButtons[0]);
                    this.scene.translate(3.5,6,0.02);
                    this.scene.scale(0.4,0.4,0.4);
                    this.scene.scale(5,1,1);
                    this.tabletButtons[i].display();
                this.scene.popMatrix();
                this.scene.pushMatrix();
                    this.HvsM_button_tex.apply();
                    this.scene.registerForPick(102,this.tabletButtons[1]);
                    this.scene.translate(3.5,5,0.02);
                    this.scene.scale(0.4,0.4,0.4);
                    this.scene.scale(5,1,1);
                    this.tabletButtons[i].display();
                this.scene.popMatrix();
                this.scene.pushMatrix();
                    this.MvsM_button_tex.apply();
                    this.scene.registerForPick(103,this.tabletButtons[2]);
                    this.scene.translate(3.5,4,0.02);
                    this.scene.scale(0.4,0.4,0.4);
                    this.scene.scale(5,1,1);
                    this.tabletButtons[i].display();
                this.scene.popMatrix();

                if(this.game.playerType[1] != 0){
                this.scene.pushMatrix();   /// GAME DIFICULTY EASY
                    this.scene.registerForPick(104,this.tabletButtons[3]);
                    this.scene.translate(2,2.5,0.02);
                    this.scene.scale(0.3,0.3,0.3);
                    this.scene.scale(5,1,1);
                    this.easy_button_tex.apply();
                    this.tabletButtons[3].display();
                this.scene.popMatrix();

                this.scene.pushMatrix();   /// GAME DIFICULTY HARD
                    this.scene.registerForPick(105,this.tabletButtons[4]);
                    this.scene.translate(5,2.5,0.02);
                    this.scene.scale(0.3,0.3,0.3);
                    this.scene.scale(5,1,1);
                    this.hard_button_tex.apply();
                    this.tabletButtons[4].display();
                this.scene.popMatrix();
                }

                this.scene.pushMatrix();    /// START BUTTON
                    this.scene.registerForPick(106,this.tabletButtons[5]);
                    this.scene.translate(3.5,7.5,0.02);
                    this.scene.scale(0.6,0.6,0.6);
                    this.scene.scale(5,1,1);
                    this.startbutton_tex.apply();
                    this.tabletButtons[5].display();
                this.scene.popMatrix();

            } else {

                /// IN-GAME MENU

                this.scene.pushMatrix();    /// RESTART GAME BUTTON
                    this.restart_button_tex.apply();
                    this.scene.registerForPick(107,this.tabletButtons[6]);
                    this.scene.translate(3.5,6,0.02);
                    this.scene.scale(0.3,0.4,0.3);
                    this.scene.scale(5,1,1);
                    this.tabletButtons[6].display();
                this.scene.popMatrix();

                this.scene.pushMatrix();    /// UNDO GAME BUTTON
                    this.undo_button_tex.apply();
                    this.scene.registerForPick(108,this.tabletButtons[6]);
                    this.scene.translate(1,2,0.02);
                    this.scene.scale(0.3,0.7,0.3);
                    this.scene.scale(5,1,1);
                    this.square.display();
                this.scene.popMatrix();

                this.scene.clearPickRegistration();

            }
        }

        /// TABLET SCREEN

        this.scene.pushMatrix();
            this.on ? this.tablet_off_material.apply() : this.tablet_on_material.apply();
            this.scene.translate(0.25,0.25,0.01);
            this.scene.scale(6.5,9.5,1);
            this.square.display();
        this.scene.popMatrix();

        /// TABLET BODY

        this.tablet_grey_material.apply();
        this.scene.pushMatrix();    /// top
            this.scene.translate(0,10,0);
            this.scene.rotate(-Math.PI/2,1,0,0);
            this.scene.scale(7,0.2,1);
            this.square.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();    /// bot
            this.scene.translate(0,0,-0.2);
            this.scene.rotate(Math.PI/2,1,0,0);
            this.scene.scale(7,0.2,1);
            this.square.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();    /// right
            this.scene.translate(7,0,0);
            this.scene.rotate(Math.PI/2,0,1,0);
            this.scene.scale(0.2,10,1);
            this.square.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();    /// left
            this.scene.translate(0,0,-0.2);
            this.scene.rotate(-Math.PI/2,0,1,0);
            this.scene.scale(0.2,10,1);
            this.square.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();    /// back
            this.scene.translate(7,0,-0.2);
            this.scene.rotate(Math.PI,0,1,0);
            this.scene.scale(7,10,1);
            this.square.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();   /// front
            this.scene.scale(7,10,1);
            this.square.display();
        this.scene.popMatrix();

        /// MARCADOR

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

        this.scene.popMatrix();
    }

}