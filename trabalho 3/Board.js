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
    }

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