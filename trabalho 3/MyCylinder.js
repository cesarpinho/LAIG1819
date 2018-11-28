/**
 * MyCylinder
 * @constructor
 */

class MyCylinder extends CGFobject {
	constructor(scene, id, base, top, height, slices, stacks) {
		super(scene);

		this.id = id;

		this.base = base;
		this.top = top;
		this.height = height;
		this.slices = slices;
		this.stacks = stacks;
		this.s = 1;
		this.t = 1;

		this.cover = new MyCircle(scene, slices);

		this.initBuffers();
	}

	initBuffers() {
		this.vertices = [];
		this.normals = [];
		this.indices = [];
		this.texCoords = [];

		var delta = 2 * Math.PI / this.slices;
		var ang = 0;
		var deltaStack = this.height / this.stacks;
		var deltaBase = (this.top - this.base) / this.stacks;

		var s = 0;
		var t = this.t;
		var deltaT = this.t / this.stacks;

		var nz = 0; 
		if (deltaBase != 0) {
			var tg = this.height / (this.base - this.top);
			var normalAng = (Math.PI / 2) - Math.atan(tg);
			nz = Math.sin(normalAng);
		} 

		for (var i = 0; i <= this.slices; i++) {
			var x = Math.cos(ang) * this.base;
			var y = Math.sin(ang) * this.base;
			var z = 0;
			t = this.t;

			this.vertices.push(x, y, z);
			this.texCoords.push(s, t);

			for (var j = 0; j < this.stacks; j++) {
				x += Math.cos(ang) * deltaBase;
				y += Math.sin(ang) * deltaBase;
				z += deltaStack;
				t -= deltaT;

				this.vertices.push(x, y, z);
				this.texCoords.push(s, t);
			}

			for (var j = 0; j <= (this.stacks); j++) {
				this.normals.push(x, y, nz);
			}

			ang += delta;
			s += this.s / this.slices;
		}

		var x1 = 0;
		var x2 = 1;
		var x3 = this.stacks + 1;
		var x4 = this.stacks + 2;

		for (var i = 0; i < this.slices; i++) {
			for (var j = 0; j < this.stacks; j++) {
				this.indices.push(x3, x2, x1);
				this.indices.push(x2, x3, x4);

				x1++;
				x2++;
				x3++;
				x4++;
			}
			x1++;
			x2++;
			x3++;
			x4++;
		}

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};

	display() {
		this.scene.pushMatrix();
		super.display();

		this.scene.pushMatrix();
		this.scene.rotate(180 * DEGREE_TO_RAD, 0, 1, 0);
		this.scene.rotate(180 * DEGREE_TO_RAD, 0, 0, 1);
		this.scene.scale(this.base, this.base, 1);
		this.cover.display();
		this.scene.popMatrix();

		this.scene.scale(this.top, this.top, 1);
		this.scene.translate(0, 0, this.height);
		this.cover.display();

		this.scene.popMatrix();
	}
};