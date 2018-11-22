class Cylinder2 extends CGFobject {
	constructor(scene, id, base, top, height, slices, stacks) {
		super(scene);

		this.id = id;

		this.base = base;
		this.top = top;
		this.height = height;
		this.slices = slices;
		this.stacks = stacks;

        this.createPoints();
		this.cover = new MyCircle(scene, slices);
		var nurbsSurface = new CGFnurbsSurface(4, 1, this.points);
        this.cylinder = new CGFnurbsObject(scene, slices, stacks, nurbsSurface);
    }
    
    createPoints() {
        this.points = [];

        /* var delta = Math.PI / 4;
        var ang = 0;
		var deltaStack = this.height;
		var deltaBase = (this.top - this.base); */

		this.points =
            [	// U = 0
                [ // V = 0..1;
                    [this.base, 0.0, 0.0, 1],
                    [this.top, 0.0, this.height, 1]

                ],
                // U = 1
                [ // V = 0..1
                    [this.base, this.base, 0, 0.7],
                    [this.top, this.top, this.height, 0.7]
				],
				// U = 2
                [ // V = 0..1
                    [0, this.base * 1.5, 0, 0.65],
                    [0, this.top * 1.5, this.height, 0.65]
				],
				// U = 3
                [ // V = 0..1
                    [-this.base, this.base, 0, 0.7],
                    [-this.top, this.top, this.height, 0.7]
				],
				// U = 4
                [ // V = 0..1
                    [-this.base, 0, 0, 1],
                    [-this.top, 0, this.height, 1]
                ]
            ];
		
		
		
/* 		for (var i = 0; i < 5; i++) {
            var Upoints = [];

			var x = Math.cos(ang) * this.base;
			var y = Math.tan(ang) * this.base;
            var z = 0;
            var w = 0.1 + Math.sin(ang) * 1;

			Upoints.push([x, y, z, w]);

			x += Math.cos(ang) * deltaBase;
			y += Math.sin(ang) * deltaBase;
			z += deltaStack;

			Upoints.push([x, y, z, w]);
            
            this.points.push(Upoints);
			ang += delta;
        } */
    }

    display() {
      
		this.scene.pushMatrix();
		this.cylinder.display();

		this.cover.display();

		this.scene.rotate(180*DEGREE_TO_RAD,0,0,1);
		this.cylinder.display();
		this.scene.popMatrix();

    }
}