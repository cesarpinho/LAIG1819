class Cylinder2 extends CGFobject {
    /**
     * Cylinder2 constuctor
     * @param {any} scene 
     * @param {number} id 
     * @param {number} base 
     * @param {number} top 
     * @param {number} height 
     * @param {number} slices 
     * @param {number} stacks 
     */
	constructor(scene, id, base, top, height, slices, stacks) {
		super(scene);

		this.id = id;

		this.points =
            [  // U = 0
                [ // V = 0..1;
                    [base, 0.0, 0.0, 1.0],
                    [top, 0.0, height, 1.0]
                ],
                // U = 2
                [ // V = 0..1;
                    [base, base * (4.0/3.0), 0.0, 1.0],
                    [top, top * (4.0/3.0), height, 1.0]
                ],
                // U = 3
                [ // V = 0..1;
                    [-base, base * (4.0/3.0), 0.0, 1.0],
                    [-top, top * (4.0/3.0), height, 1.0]
                ],
                // U = 4
                [ // V = 0..1;
                    [-base, 0.0, 0.0, 1.0],
                    [-top, 0.0, height, 1.0]
                ]
            ];

		var nurbsSurface = new CGFnurbsSurface(3, 1, this.points);
        this.cylinder = new CGFnurbsObject(scene, Math.ceil(slices/2) , stacks, nurbsSurface);
    }
    
    /**
     * Cylinder2 display function
     */
    display() {
		this.scene.pushMatrix();
		    this.cylinder.display();
            this.scene.rotate(180*DEGREE_TO_RAD,0,0,1);
            this.cylinder.display();
		this.scene.popMatrix();
    }
}