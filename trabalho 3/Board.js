class Board extends CGFobject {
    constructor(scene, lines, columns) {
        super(scene);

        this.scene = scene;
        this.lines = lines;
        this.columns = columns;
        this.color = 0;

        this.square = new MyRectangle(scene, null, 0, 1, 0, 1);

        this.black_material = new CGFappearance(scene);
        this.black_material.setDiffuse(0,0,0,1);

        this.white_material = new CGFappearance(scene);
        this.white_material.setDiffuse(0.9,0.9,0.9,1);

        this.matrixpecas = [];

        this.initPecas();
    }

    initPecas(){
      for(var i = 0 ; i < this.lines ; i++){
        var temp = [];
          for(var j = 0 ; j < this.columns ; j++){
            if(j==0)
            temp[j] = new Peca(this.scene,i,j,1);
            else if(j==7)
            temp[j] = new Peca(this.scene,i,j,2);
            else
            temp[j] = null;
          }
          this.matrixpecas.push(temp);
      }
    }

  movePeca(x,y,x2,y2){                                  /// TODO falta mover as pecas na matriz
      this.logCoords(x,y);
      this.matrixpecas[x][y].setCoords(x2,y2);
      console.log(this.matrixpecas);
      /*
      this.matrixpecas[x2][y2] = this.matrixpecas[x][y];
      console.log(this.matrixpecas[x2][y2]);
      this.matrixpecas[x][y] = null;*/
    }

    logCoords(x,y){
      console.log("\nCoordinate x: " + x + "\nCoordinate y : " +y +"\n");
    }

    /*getPiece(x,y){
      return this.matrixpecas[x][y];
    }*/

    displayLine(z) {

        var x = 0;

        for(var i = 0; i < this.columns ; i++) {
            this.scene.pushMatrix();
                this.scene.translate(x,0,z);
                this.scene.rotate(-90 * DEGREE_TO_RAD, 1,0,0);
                if(this.color == 1)
                    this.white_material.apply();
                else
                    this.black_material.apply();
                this.square.display();
            this.scene.popMatrix();
            this.color = !this.color;
            x += 1;
        }

        if((this.columns % 2) == 0)
            this.color = !this.color;
    }

    display() {
        var z = 1;

        for(var j = 0; j < this.lines ; j++) {
            this.displayLine(z);
            z += 1;
        }

        for(var ii = 0; ii < this.matrixpecas.length ; ii++) {
          for(var jj = 0; jj < this.matrixpecas[i].length ; jj++) {
            if(this.matrixpecas[ii][jj] != null)
            this.matrixpecas[ii][jj].display();
          }
        }

        this.scene.pushMatrix();
            this.scene.translate(-3, 0, this.lines/2 + 3);
            this.scene.scale(2, 1, 6);
            this.scene.rotate(-90 * DEGREE_TO_RAD, 1,0,0);
            this.black_material.apply();
            this.square.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(this.columns + 1, 0, this.lines/2 + 3);
            this.scene.scale(2, 1, 6);
            this.scene.rotate(-90 * DEGREE_TO_RAD, 1,0,0);
            this.white_material.apply();
            this.square.display();
        this.scene.popMatrix();
    }
}
