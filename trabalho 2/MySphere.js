/**
 * MySphere
 * @constructor
 */

class MySphere extends CGFobject {
	constructor(scene, id, radius, slices, stacks) {
		super(scene);

		this.id = id;
		this.radius = radius;
		this.slices = slices;
		this.stacks = stacks;
		this.s = 1;
		this.t = 1;

		this.initBuffers();
	}

	initBuffers() {
		this.vertices = [];
		this.normals = [];
		this.indices = [];
		this.texCoords = [];

		var teta = 0;
		var deltaTeta = 2 * Math.PI / this.slices;

		var fi = 0;
		var deltaFi = 1 * Math.PI / this.stacks;

		var s = 0;
		var t = 0;
		var deltaS = this.s / this.slices;
		var deltaT = this.t / this.stacks;

		for (var i = 0; i <= this.slices; i++) {
			var x = Math.sin(fi) * Math.cos(teta) * this.radius;
			var y = Math.sin(fi) * Math.sin(teta) * this.radius;
			var z = Math.cos(fi) * this.radius;

			this.vertices.push(x, y, z);
			this.normals.push(x, y, z);
			this.texCoords.push(s, t);

			for (var j = 0; j < this.stacks; j++) {
				fi += deltaFi;
				t += deltaT;
				x = Math.sin(fi) * Math.cos(teta) * this.radius;
				y = Math.sin(fi) * Math.sin(teta) * this.radius;
				z = Math.cos(fi) * this.radius;

				this.vertices.push(x, y, z);
				this.normals.push(x, y, z);
				this.texCoords.push(s, t);
			}

			teta += deltaTeta;
			fi = 0;
			s += deltaS;
			t = 0;
		}

		var x1 = 0;
		var x2 = 1;
		var x3 = this.stacks + 1;
		var x4 = this.stacks + 2;

		for (var i = 0; i < this.slices; i++) {
			for (var j = 0; j < this.stacks; j++) {
				this.indices.push(x1, x2, x3);
				this.indices.push(x4, x3, x2);
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

};