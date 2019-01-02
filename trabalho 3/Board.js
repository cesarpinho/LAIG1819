/**
*     Board class
*/

class Board extends CGFobject {
    constructor(scene,game) {
        super(scene);

        this.scene = scene;
        this.game = game;
        this.lines = 8;
        this.columns = 8;

        this.picked = false;
        this.pickedX;
        this.pickedY;
        this.moves = [];

        this.animrun = false; /// animation running
        this.animX;
        this.animY;

        ///                                     LOGICA

        this.currPlayer = "";

        this.pickObjs = [];
        this.square = new MyRectangle(scene,null,0,1,0,1);

        for(var i = 0; i < this.lines*this.columns ; i++) {
            this.pickObjs.push(new MyRectangle(scene,null,0,1,0,1));
        }

        this.grey_material = new CGFappearance(scene);
        this.grey_material.setDiffuse(0.6,0.6,0.6,1);
        this.grey_material.setTexture(this.scene.graph.textures["boardQuad"]);

        this.matrixpecas = [];
        this.capturedBy1 = [];
        this.capturedBy2 = [];

        this.initPecas();
    }

    initPecas(){
        var numPeca = [ [8,7,6,5,0,0,0,0],
                        [0,0,0,0,12,11,10,9],
                        [4,3,2,1,0,0,0,0],
                        [0,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,0],
                        [0,0,0,0,1,2,3,4],
                        [9,10,11,12,0,0,0,0],
                        [0,0,0,0,5,6,7,8]];

        for(var i = 0 ; i < this.lines ; i++){
            var line = [];

            for(var j = 0 ; j < this.columns ; j++) {
                switch(j) {
                    case 0:
                    case 2:
                        if(i < 4)
                            line.push(new Peca(this.scene,numPeca[j][i],i,j,1));
                        else
                            line.push(null);
                        break;
                    case 1:
                        if(i >= 4)
                            line.push(new Peca(this.scene,numPeca[j][i],i,j,1));
                        else
                            line.push(null);
                        break;
                    case 5:
                    case 7:
                        if(i >= 4)
                            line.push(new Peca(this.scene,numPeca[j][i],i,j,2));
                        else
                            line.push(null);
                        break;
                    case 6:
                        if(i < 4)
                            line.push(new Peca(this.scene,numPeca[j][i],i,j,2));
                        else
                            line.push(null);
                        break;
                    default:
                        line.push(null);
                        break;
                }
            }
            this.matrixpecas.push(line);
        }
    }

    handlePick(id){
        console.log("\n\n\nHandlePick");
        console.log("id: " + id);
        var x = Math.floor((id-1)/8);
        console.log("x: indside board id: " + x);
        var y = (id-1) % 8;
        console.log("y: indside board id: " + y);
        console.log(this.matrixpecas);

        this.currPlayer='1';

        if(!this.picked){           /// if it is not the same piece (maybe in plog)
            /// Check if its a piece
            if(this.matrixpecas[x][y] != null){
                this.picked = true;
                this.pickedX = x;
                this.pickedY = y;
                console.log("PICKed!");


            ///  LOGICA AQUI (?)
                /// TODO: check if game over
                console.log("num peca: " + this.matrixpecas[x][y].num.toString());
                var numPeca = this.matrixpecas[x][y].num.toString();

                this.scene.makeRequest("possible_plays("+ this.currPlayer + ","+ this.boardToPlog() +","+this.matrixpecas[x][y].num+",8,8)");
            }
        } else {
            console.log("movepeca");
            /// if it's valid to move
            if (!( this.pickedX==x && this.pickedY == y)){      /// verificar se é o mesmo player tambem
                this.movePeca(this.pickedX,this.pickedY,x,y);
                if(this.matrixpecas[x][y]!=null)
                    if(this.matrixpecas[x][y].player==1)
                        this.game.result2++;
                    else this.game.result1++;

                /// Move camera to other player
                this.game.changePlayer();
            }
            this.picked =! this.picked;
        }
    }

    /// retorna o board no formato usado na aplicação em prolog [1-2,1-8]
    boardToPlog(){      
        var plogBoard = "[";

        for(var i = 0 ; i < this.lines ; i++) {
            plogBoard += "[";

            for(var j = 0 ; j < this.columns ; j++) {
                if(this.matrixpecas[j][i] == null)
                    plogBoard += "0-0";
                else 
                    plogBoard += this.matrixpecas[j][i].player + "-" + this.matrixpecas[j][i].num;
                
                plogBoard += ",";
            }
            plogBoard = plogBoard.slice(0,-1);
            plogBoard += "],";
        }
        
        plogBoard = plogBoard.slice(0,-1);
        plogBoard += "]";
        
        return plogBoard;
    }

    plogToBoard(){

    }

    movePeca(x,y,x2,y2){
            this.startAnimation(x,y,x2,y2);
            this.logCoords(x,y);
            this.matrixpecas[x][y].setCoords(x2,y2);            /// set Peca coordinates
            if(this.matrixpecas[x2][y2]!=null)
                if(this.matrixpecas[x2][y2].player==2)
                    this.capturedBy1.push(this.matrixpecas[x2][y2]);
                else this.capturedBy2.push(this.matrixpecas[x2][y2]);

            if(this.matrixpecas[x2][y2]!=null)
                this.matrixpecas[x2][y2].captured=true;

            console.log(this.capturedBy1);
            this.matrixpecas[x2][y2] = this.matrixpecas[x][y];  ///                         move it in
            console.log("pecas : ");
            console.log(this.capturedBy1);
            console.log(this.matrixpecas);
            this.matrixpecas[x][y] = null;                      ///                         the matrix
    }

    startAnimation(x,y,x2,y2){

        var points = [[x,0,y],[x2,0,y2]];
        var span = 2;

        this.animX = x;
        this.animY = y;
        this.pecaAnimation = new LinearAnimation(this.scene, points, span, "");

        this.animrun = true;

        ///console.log(this.pecaAnimation);

    }

    update(time){
        if(this.pecaAnimation!=null)
        this.pecaAnimation.update(time);
    }

    logCoords(x,y){
      console.log("Coordinate x: " + x + "\nCoordinate y : " + y );
    }

    display() {

        this.scene.logPicking();
        
        for(var ii = 0; ii < this.matrixpecas.length ; ii++) {
            for(var jj = 0; jj < this.matrixpecas[ii].length ; jj++) {
                var id = ii * 8 + jj;
                
                
                this.scene.pushMatrix();
                    this.scene.translate(ii,0,jj + 1);
                    this.scene.rotate(-90*DEGREE_TO_RAD,1,0,0);
                    this.grey_material.apply();
                    this.scene.registerForPick(id + 1, this.pickObjs[id]);
                    this.pickObjs[id].display();
                this.scene.popMatrix();
                
                if(this.matrixpecas[ii][jj] != null){
                    this.scene.pushMatrix();

                    /// animations
                    var matrix = mat4.create();

                    ///console.log("animx : " + this.animx+ "animy : " + this.animy + "ii : " + ii +"jj : " + jj );
                    if(this.pecaAnimation!=null)
                        if(ii == this.animX && jj == this.animY){
                            matrix = this.pecaAnimation.getMatrix();
                            this.scene.multMatrix(matrix);
                        }


                        ///if(this.pecaAnimation!=null)
                        ///console.log(matrix);

                    this.matrixpecas[ii][jj].display();
                    this.scene.popMatrix();
                }
            }
        }

        this.scene.clearPickRegistration();

        this.scene.pushMatrix();
            this.scene.translate(-3, 0, this.lines/2 + 3);
            this.scene.scale(2, 1, 6);
            this.scene.rotate(-90 * DEGREE_TO_RAD, 1,0,0);
            this.grey_material.apply();
            this.square.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
            this.scene.translate(this.columns + 1, 0, this.lines/2 + 3);
            this.scene.scale(2, 1, 6);
            this.scene.rotate(-90 * DEGREE_TO_RAD, 1,0,0);
            this.grey_material.apply();
            this.square.display();
        this.scene.popMatrix();

        for(var i = 0; i < this.capturedBy1.length ; i++) {
            this.scene.pushMatrix();
                this.scene.translate(-2.5 + (i > 5 ? 1 : 0), 0, 1.5 + (i > 5 ? (i - 6) : i));
                this.capturedBy1[i].display();
            this.scene.popMatrix();
        }

        for(var i = 0; i < this.capturedBy2.length ; i++) {
            this.scene.pushMatrix();
                this.scene.translate(9.5 + (i > 5 ? 1 : 0), 0, 1.5 + (i > 5 ? (i - 6) : i));
                this.capturedBy2[i].display();
            this.scene.popMatrix();
        }
    }
}