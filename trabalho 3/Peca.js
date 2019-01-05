class Peca extends CGFobject {
    constructor(scene,numPeca,x,y,player) {
        super(scene);

        this.peca = new MyCylinder(scene, null, 0.4, 0.4, 1, 15, 15);
        this.num = numPeca;     /// 1 a 12
        this.player = player;   /// 1 ou 2
        this.captured = false;
        this.x = x;
        this.y = y;

        this.animationRun = false;

        this.texture = this.scene.graph.textures[numPeca.toString()];

        this.black_material = new CGFappearance(scene);
        this.black_material.setDiffuse(0.2,0.2,0.2,1);
        
        this.white_material = new CGFappearance(scene);
        this.white_material.setDiffuse(1,1,1,1);
    }
    
    setCoords(x,y){
        this.x = x;
        this.y = y;
    }

    display() {
        this.scene.pushMatrix();
            if(!this.captured && !this.animationRun)
                this.scene.translate(this.x + 0.5, 0 , this.y + 0.5);
            
            if(this.player == 1) {
                this.black_material.setTexture(this.texture);
                this.black_material.apply();
            } else {
                this.white_material.setTexture(this.texture);
                this.white_material.apply();
            }
            this.scene.rotate(-90 * DEGREE_TO_RAD, 1,0,0);
            this.peca.display();
        this.scene.popMatrix();

        this.white_material.setTexture(null);
        this.black_material.setTexture(null);
    }
}
