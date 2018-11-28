class Vehicle extends CGFobject {
    /**
     * @constructor Vehicle class
     * @param {*} scene 
     */
    constructor(scene) {
        super(scene);

        this.scene = scene;
        this.propeller_angle = 0;
        this.lastTime;
        this.speed = 500; 

        this.surfaceRight  = new Patch(scene, 4, 4, 30, 30, [
            [0, 0, 0],
            [0, -0.5, 0.2],
            [0, -0.8, 2],
            [0, 1, 3],
            [0,0,0],
            [2, 0, 0.2],
            [2.2, 0.2, 1.5],
            [0.4,1,3],
            [0,0,0],
            [2, 2, 0.2],
            [2, 1, 1.5],
            [0.4,1,3],
            [0,0,0],
            [0, 2, 0.2],
            [0, 1.9, 2],
            [0,1,3] ]);
        this.surfaceLeft  = new Patch(scene, 4, 4, 30, 30, [
            [0,0,0],
            [0, 2, 0.2],
            [0, 1.9, 2],
            [0,1,3],
            [0,0,0],
            [-2, 2, 0.2],
            [-2, 1, 1.5],
            [-0.4,1,3],
            [0,0,0],
            [-2, 0, 0.2],
            [-2.2, 0.2, 1.5],
            [-0.4,1,3],
            [0, 0, 0],
            [0, -0.5, 0.2],
            [0, -0.8, 2],
            [0, 1, 3] ]);
        this.tail = new Cylinder2(scene, null, 0.8, 0.1, 4, 30, 10);
        this.tail_cover = new MySphere(scene, null, 0.1, 30, 30);
        this.propeller_bearing = new MyCylinder(scene, null, 0.2,0.1,0.5, 4, 5);
        this.propeller = new Patch(scene, 3, 3, 20, 20, [
            [0, 0, 0],
            [0, 0.5, 3],
            [0, 0, 6],
            [0.4, 0, 0],
            [0.4, 0.5, 3],
            [0.4, 0, 6],
            [0, 0, 0],
            [0, 0.5, 3],
            [0, 0, 6]
        ])
        this.support = new Cylinder2(scene, null, 0.05, 0.05, 3, 20, 10);
        this.support_cover = new MySphere(scene, null, 0.05, 30, 30);
        this.tail_wing1 = new MyTriangle(scene,null,0,0,0,0,0,0.8,0.5,0,0.5);
        this.tail_wing2 = new MyTriangle(scene,null,0,0,0,0,0,0.8,0,0.5,0.5);

        this.black_material = new CGFappearance(scene);
        this.black_material.setDiffuse(0,0,0,1);

        this.grey_material = new CGFappearance(scene);
        this.grey_material.setDiffuse(0.3,0.3,0.3,1);   
    }

    /**
     * Vehicle display function
     */
    display() {
        this.scene.translate(0,0,6);
        this.scene.rotate(180*DEGREE_TO_RAD,0,1,0);
        this.surfaceRight.display();
        this.surfaceLeft.display();

        // Tail display
        this.scene.pushMatrix();
            this.scene.scale(1,0.8,1);
            this.scene.rotate(-10 * DEGREE_TO_RAD , 1,0,0);
            this.scene.translate(0,0.65,2.2);
            this.tail.display();
            this.scene.translate(0,0,4);
            this.tail_cover.display();
        this.scene.popMatrix(); 
        
        // Big propeller display
        this.scene.pushMatrix();
            this.scene.translate(0,1.5,1.4);
            this.scene.rotate(this.propeller_angle, 0 ,1,0);
            this.scene.translate(0,0,-1.4);
            this.scene.pushMatrix();
                this.scene.translate(0,0,1.4);
                this.scene.rotate(-90 * DEGREE_TO_RAD,1,0,0);
                this.grey_material.apply();
                this.propeller_bearing.display();
            this.scene.popMatrix();
            this.scene.translate(-0.1,0.2,-1.6);
            this.black_material.apply();        
            this.propeller.display();
        this.scene.popMatrix();

        // Small Propeller
        this.scene.pushMatrix();
            this.scene.translate(0.1,1.35,5.9);
            this.scene.rotate(this.propeller_angle, 1 ,0,0);
            this.scene.scale(0.4, 0.3, 0.3);
            this.scene.rotate(90 * DEGREE_TO_RAD,0,1,0);
            this.black_material.apply();
            this.propeller_bearing.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
            this.scene.translate(0.25,1.39,5.85);
            this.scene.rotate(this.propeller_angle, 1 ,0,0);
            this.scene.translate(0,0.08,-0.45);
            this.scene.scale(0.1,0.4,0.15);
            this.scene.rotate(-90 * DEGREE_TO_RAD,0,0,1);
            this.black_material.apply();
            this.propeller.display();
        this.scene.popMatrix();

        // Right suport bar
        this.scene.pushMatrix();
            this.scene.translate(0.44,-0.03,0.5);
            this.scene.rotate(-60*DEGREE_TO_RAD,0,0,1);
            this.scene.rotate(90*DEGREE_TO_RAD,0,1,0);
            this.scene.scale(1,1,0.37);
            this.black_material.apply();
            this.support.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
            this.scene.translate(0.44,-0.03,1.5);
            this.scene.rotate(-60*DEGREE_TO_RAD,0,0,1);
            this.scene.rotate(55*DEGREE_TO_RAD,0,1,0);
            this.scene.scale(1,1,0.45);
            this.black_material.apply();
            this.support.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
            this.scene.translate(1,-1,0);
            this.black_material.apply();
            this.support.display();
            this.support_cover.display();
            this.scene.translate(0,0,3);
            this.support_cover.display();
        this.scene.popMatrix();

        // Left support bar
        this.scene.pushMatrix();
            this.scene.translate(-0.44,-0.03,0.5);
            this.scene.rotate(60*DEGREE_TO_RAD,0,0,1);
            this.scene.rotate(-90*DEGREE_TO_RAD,0,1,0);
            this.scene.scale(1,1,0.37);
            this.support.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
            this.scene.translate(-0.44,-0.03,1.5);
            this.scene.rotate(60*DEGREE_TO_RAD,0,0,1);
            this.scene.rotate(-55*DEGREE_TO_RAD,0,1,0);
            this.scene.scale(1,1,0.45);
            this.support.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
            this.scene.translate(-1,-1,0);
            this.support.display();
            this.support_cover.display();
            this.scene.translate(0,0,3);
            this.support_cover.display();
        this.scene.popMatrix();

        // Tail wings
        this.scene.pushMatrix();
            this.scene.translate(0,0,5.5);
            this.scene.pushMatrix();
                this.scene.translate(0,1.4,0);
                this.tail_wing1.display();
                this.tail_wing2.display();
            this.scene.popMatrix();
            this.scene.translate(0,1.3,0);
            this.scene.rotate(180*DEGREE_TO_RAD,0,0,1);
            this.tail_wing1.display();
            this.tail_wing2.display();
        this.scene.popMatrix();
    }

    update(time) {
        if(this.propeller_angle > (360*DEGREE_TO_RAD))
            this.propeller_angle -= (360*DEGREE_TO_RAD);
            
        this.propeller_angle += (this.speed * time) * DEGREE_TO_RAD;
    
    }
}