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
        this.validMoves = []; // [ [x2,y2], [x2,y2], ...] array com as coordenadas de destino para a peca picked 
        this.validMovesId = [];

        this.animrun = false; /// animation running
        this.animX;
        this.animY;
        this.animX2;
        this.animY2;

        this.gameOver = false;
        
        ///  LOGICA
        this.scene.makeRequest("init_game");

        this.pickObjs = [];
        this.square = new MyRectangle(scene,null,0,1,0,1);

        for(var i = 0; i < this.lines*this.columns ; i++) {
            this.pickObjs.push(new MyRectangle(scene,null,0,1,0,1));
        }

        this.grey_material = new CGFappearance(scene);
        this.grey_material.setDiffuse(0.6,0.6,0.6,1);
        this.grey_material.setTexture(this.scene.graph.textures["boardQuad"]);

        this.green_material = new CGFappearance(scene);
        this.green_material.setDiffuse(0,1,0,1);
        this.green_material.setTexture(this.scene.graph.textures["boardQuad"]);

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
        
        this.matrixpecas = [];

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
        console.log("HandlePick");
        console.log("id: " + id);
        var x = Math.floor((id-1)/8);
        console.log("x: " + x);
        var y = (id-1) % 8;
        console.log("y: " + y);

        console.log(this.matrixpecas[x][y]);

        if(!this.picked){           /// if it is not the same piece (maybe in plog)
            /// Check if its a piece
            if(this.matrixpecas[x][y] != null && this.matrixpecas[x][y].player == this.game.player) {
                this.picked = true;
                this.pickedX = x;
                this.pickedY = y;
                console.log("PICKED!");

                console.log("num peca: " + this.matrixpecas[x][y].num);
                
                this.scene.makeRequest(
                    "possible_plays("+ this.game.player +","+ this.boardToPlog() +","+ this.matrixpecas[x][y].num +",8,8)",
                    (data) => {
                        console.log("Request successful. Reply: " + data.target.response);
                        this.parseValidMoves(data.target.response);
                    }
                );
            }
        } else {
            /// if it's valid to move
            if ( this.validMovesId.includes(id - 1) ) {
                console.log("movepeca");
                this.movePeca(this.pickedX,this.pickedY,x,y);
                
                
                if(this.matrixpecas[x][y] != null)
                    this.scene.makeRequest(
                        "value(" + this.boardToPlog() + "," + this.game.player + ")",
                        (data) => {
                            if(this.game.player == 1)
                                this.game.result1 = parseInt(data.target.response);
                            else 
                                this.game.result2 = parseInt(data.target.response);
                        });
                
                this.scene.makeRequest("is_game_over", (data) => {
                    console.log("Request successful. Reply: " + data.target.response);
                    this.gameOver = (data.target.response == "1");
                    
                    if(this.gameOver)
                        this.scene.makeRequest("quit");
                });
                
                /// Move camera to other player
                this.game.changePlayer();
            }

            this.validMovesId = [];
            this.picked = !this.picked;
        }
    }

    restartGame(){
        this.initPecas();
        this.capturedBy1=[];
        this.capturedBy2=[];
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

    plogToBoard(plogBoard){
        var matrix = [  Array(8).fill(undefined), Array(8).fill(undefined),
                        Array(8).fill(undefined), Array(8).fill(undefined),
                        Array(8).fill(undefined), Array(8).fill(undefined),
                        Array(8).fill(undefined), Array(8).fill(undefined)];

        plogBoard = plogBoard.slice(1,-1);
        
        var line, peca, endLine, endPeca, num, player;

        for(var i = 0 ; i < this.lines ; i++) {
            endLine = plogBoard.indexOf("]");
            line = plogBoard.slice(1,endLine+1);

            for(var j = 0 ; j < this.columns ; j++) {
                endPeca = line.indexOf(",");
                peca = line.slice(0, endPeca);

                if(peca == "0-0")
                    matrix[j][i] = null;
                else {
                    player = peca.slice(0,1);
                    num = peca.slice(2,peca.length);

                    matrix[j][i] = this.searchPeca(player,num);
                    matrix[j][i].setCoords(j,i);
                }
                
                line = line.slice(endPeca+1,line.length);
            }
            plogBoard = plogBoard.slice(endLine+2,plogBoard.length);
        }

        this.matrixpecas = matrix;
    }

    searchPeca(player,num) {
        
        for(var i = 0 ; i < this.matrixpecas.length ; i++) {
            for(var j = 0 ; j < this.matrixpecas[i].length ; j++) {
                var peca = this.matrixpecas[i][j];
        
                if(peca != null)
                    if(peca.player == player && peca.num == num)
                        return peca;     
            }
        }
    }

    parseValidMoves(moves) {
        moves = moves.slice(1,-1);
        moves = moves.split(",");

        for(var i = 0 ; i < moves.length ; i++) {
            var move = moves[i].slice(4,-2);

            var x = parseInt(move.slice(move.indexOf("-")+1, move.length));
            var y = parseInt(move);
            
            this.validMoves.push([x,y]);
            this.validMovesId.push(x * 8 + y);
        }

        console.log(this.validMovesId);
    }

    movePeca(x,y,x2,y2){
        //this.startAnimation(x,y,x2,y2);
        
        var destinyPlayer = 0;
        
        if(this.matrixpecas[x2][y2] != null) {
            if( (destinyPlayer = this.matrixpecas[x2][y2].player) == 2)
                this.capturedBy1.push(this.matrixpecas[x2][y2]);
            else
                this.capturedBy2.push(this.matrixpecas[x2][y2]);

            this.matrixpecas[x2][y2].captured = true;
        }
        
        var plogMove = y + "-" + x + "-" + y2 + "-" + x2 + "-" + destinyPlayer;

        this.scene.makeRequest(
            "make_move("+ this.game.player +","+ this.boardToPlog() +","+ this.matrixpecas[x][y].num +",8,"+ plogMove +")",
            (data) => {
                console.log("Request successful. Reply: " + data.target.response);
                this.animX = this.animX2;
                this.animY = this.animY2;
                this.animX2 = null;
                this.animY2 = null;
                this.plogToBoard(data.target.response);
            }
        );
    }

    startAnimation(x,y,x2,y2){
        var points = [[x,0,y],[x2,0,y2]];
        var span = 2;

        this.animX = x;
        this.animY = y;
        this.animX2 = x2;
        this.animY2 = y2;
        this.pecaAnimation = new LinearAnimation(this.scene, points, span, "");
        console.log("animations points : " + x +" - " + y + "/" + x2 + " - " + y2);

        this.animrun = true;
        this.matrixpecas[x][y].animationRun = true;
    }

    update(time){
        if(this.pecaAnimation!=null){
            this.pecaAnimation.update(time);
        }
    }

    logCoords(x,y){
      console.log("Coordinate x: " + x + "\nCoordinate y : " + y );
    }

    display() {

        if( this.gameOver )
            return;
        //this.scene.makeRequest("quit");
        this.scene.logPicking();
        
        for(var ii = 0; ii < this.matrixpecas.length ; ii++) {
            for(var jj = 0; jj < this.matrixpecas[ii].length ; jj++) {
                var id = ii * 8 + jj;
                
                this.scene.pushMatrix();
                    this.scene.translate(ii,0,jj + 1);
                    this.scene.rotate(-90*DEGREE_TO_RAD,1,0,0);
                    
                    if((this.validMovesId.length > 0) && this.validMovesId.includes(id))
                        this.green_material.apply();
                    else
                        this.grey_material.apply();
                    
                    this.scene.registerForPick(id + 1, this.pickObjs[id]);
                    this.pickObjs[id].display();
                this.scene.popMatrix();

                ///console.log("jj antes : " + jj);
                
                if(this.matrixpecas[ii][jj] != null){
                    this.scene.pushMatrix();

                    /// animations
                    var matrix = mat4.create();

                    ///console.log("animx : " + this.animx+ "animy : " + this.animy + "ii : " + ii +"jj : " + jj );
                    if(this.pecaAnimation != null) 
                        if(ii == this.animX && jj == this.animY){
                            ///console.log(this.pecaAnimation.getMatrix());
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