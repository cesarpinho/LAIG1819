/**
 * MyRectangle
 * @constructor
 */
class MyRectangle extends CGFobject {
	constructor(scene, id, x1, x2, y1, y2) {
		super(scene);

		this.id = id;
		this.x1 = x1;
		this.x2 = x2;
		this.y1 = y1;
		this.y2 = y2;
		this.s = 1;
		this.t = 1;

		this.initBuffers();
	};

	initBuffers() {
		this.vertices = [
			this.x1, this.y1, 0,
			this.x2, this.y1, 0,
			this.x1, this.y2, 0,
			this.x2, this.y2, 0
		];

		this.indices = [
		 	0, 1, 2,
			3, 2, 1
		];

		this.normals = [
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1
		];

		this.texCoords = [
			0, this.t,
			this.s, this.t,
			0, 0,
			this.s, 0
		];

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};
	
	// Apply the texture scale factors 
	setTexCoords(s, t) {
		var comp = this.x2 - this.x1;
		var larg = this.y2 - this.y1;

		this.s = comp / s;
		this.t = larg / t;

		this.texCoords = [
			0, this.t,
			this.s, this.t,
			0, 0,
			this.s, 0
		];

		this.updateTexCoordsGLBuffers();
	}
};
