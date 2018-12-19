class Board extends CGFobject {
    constructor(scene) {
        super(scene);

        this.scene = scene;
        this.lines = 8;
        this.columns = 8;

        this.pickObjs = [];
        this.square = new MyRectangle(scene,null,0,1,0,1);

        for(var i = 0; i < 8*8 ; i++) {
            this.pickObjs.push(new MyRectangle(scene,null,0,1,0,1));
        }

        this.grey_material = new CGFappearance(scene);
        this.grey_material.setDiffuse(0.6,0.6,0.6,1);
        this.grey_material.setTexture(this.scene.graph.textures["boardQuad"]);


        this.matrixpecas = [];

        this.initPecas();
    }

    initPecas(){
        var numPeca = [  [8,7,6,5,0,0,0,0],
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

    movePeca(x,y,x2,y2){                                  /// TODO falta mover as pecas na matriz
        this.logCoords(x,y);
        this.matrixpecas[x][y].setCoords(x2,y2);
        console.log(this.matrixpecas);
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
                
                if(this.matrixpecas[ii][jj] != null)
                    this.matrixpecas[ii][jj].display();
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
    }
}