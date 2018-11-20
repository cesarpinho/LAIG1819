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

		var nurbsSurface = new CGFnurbsSurface(8, 1, this.points);
        this.cylinder = new CGFnurbsObject(scene, slices, stacks, nurbsSurface);
    }
    
    createPoints() {
        this.points = [];

        var delta = 2 * Math.PI / 8;
        var ang = 0;
		var deltaStack = this.height;
		var deltaBase = (this.top - this.base);

		for (var i = 0; i < 9; i++) {
            var Upoints = [];

			var x = Math.cos(ang) * this.base;
			var y = Math.sin(ang) * this.base;
            var z = 0;
            var w = 5 + Math.cos(2*ang);

			Upoints.push([x, y, z, w]);

			for (var j = 0; j < 1; j++) {
				x += Math.cos(ang) * deltaBase;
				y += Math.sin(ang) * deltaBase;
				z += deltaStack;

				Upoints.push([x, y, z, w]);
			}
            
            this.points.push(Upoints);
			ang += delta;
        }
    }

    display() {
        this.cylinder.display();
    }
}