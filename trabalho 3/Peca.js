class Peca extends CGFobject {
    constructor(scene,x,y,player) {
        super(scene);

        this.peca = new Cylinder2(scene, "", 0.5, 0.5, 1, 15, 15);
        this.player = player;  /// 1 ou 2
        this.x = x;
        this.y = y;
    }

    setCoords(x,y){
      this.x = x;
      this.y = y;
    }

    display() {
        this.scene.pushMatrix();
            this.scene.translate(this.x+0.5,0,this.y+0.5);
            this.scene.rotate(-90 * DEGREE_TO_RAD, 1,0,0);
            this.peca.display();
        this.scene.popMatrix();

    }
}
