class Plane extends CGFobject {

    constructor(scene, npartsU, npartsV) {
        super(scene);
        this.scene = scene;
        this.npartsU = npartsU;
        this.npartsV = npartsV;
        
        this.createPoints();

        var nurbsSurface = new CGFnurbsSurface(1, 1, this.points);
        this.plane = new CGFnurbsObject(scene, npartsU, npartsV, nurbsSurface);
    }

    createPoints() { 
        this.points = 
            [	// U = 0
                [ // V = 0..1;
                    [-0.5, 0.0, 0.5, 1 ],
                    [-0.5, 0.0, -0.5, 1 ]

                ],
                // U = 1
                [ // V = 0..1
                    [0.5, 0.0,  0.5,1 ],
                    [0.5, 0.0,  -0.5,1 ]							 
                ]
            ];
    }

    display() {
        this.plane.display();
    }
}