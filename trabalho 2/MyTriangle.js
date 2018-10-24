/**
 * MyTriangle
 * @constructor
 */
class MyTriangle extends CGFobject {
	constructor(scene, id, x1, x2, x3, y1, y2, y3, z1, z2, z3) {
		super(scene);

		this.id = id;
		this.x1 = x1; this.y1 = y1; this.z1 = z1;
		this.x2 = x2; this.y2 = y2; this.z2 = z2;
		this.x3 = x3; this.y3 = y3; this.z3 = z3;
		this.s = 1;
		this.t = 1;
		
		this.initBuffers();
	};

	initBuffers() {
		this.vertices = [
			this.x1, this.y1, this.z1,
			this.x2, this.y2, this.z2,
			this.x3, this.y3, this.z3,
		];

		this.indices = [
			0, 1, 2
		];

		//       A
		//      / \
		//     /   \
		//    /     \
		//   B-------C

		// AB = B-A and AC = C-A
		var AB = [(this.x2-this.x1), (this.y2-this.y1), (this.z2-this.z1)];
		var AC = [(this.x3-this.x1), (this.y3-this.y1), (this.z3-this.z1)];
		// normal in A is AB x AC
		var normA = [AB[1] * AC[2] - AB[2] * AC[1], AB[2] * AC[0] - AB[0] * AC[2], AB[0] * AC[1] - AB[1] * AC[0]];

		// BA = -AB and BC = C-B
		var BA = [-AB[0], -AB[1], -AB[2]];
		var BC = [(this.x3-this.x2), (this.y3-this.y2), (this.z3-this.z2)];
		// normal in B is BC x BA
		var normB = [BC[1] * BA[2] - BC[2] * BA[1], BC[2] * BA[0] - BC[0] * BA[2], BC[0] * BA[1] - BC[1] * BA[0]];

		// CA = -AC and CB = -BC
		var CA = [-AC[0], -AC[1], -AC[2]];
		var CB = [-BC[0], -BC[1], -BC[2]];
		// normal in C is CA x CB
		var normC = [CA[1] * CB[2] - CA[2] * CB[1], CA[2] * CB[0] - CA[0] * CB[2], CA[0] * CB[1] - CA[1] * CB[0]];

		this.normals = [
			normA[0], normA[1], normA[2],
			normB[0], normB[1], normB[2],
			normC[0], normC[1], normC[2]
		];

		this.a = Math.sqrt((this.x1-this.x3)*(this.x1-this.x3) + (this.y1-this.y3)*(this.y1-this.y3) + (this.z1-this.z3)*(this.z1-this.z3));
		this.b = Math.sqrt((this.x2-this.x1)*(this.x2-this.x1) + (this.y2-this.y1)*(this.y2-this.y1) + (this.z2-this.z1)*(this.z2-this.z1));
		this.c = Math.sqrt((this.x3-this.x2)*(this.x3-this.x2) + (this.y3-this.y2)*(this.y3-this.y2) + (this.z3-this.z2)*(this.z3-this.z2));
		
		this.cosA = (- this.a*this.a + this.b*this.b + this.c*this.c) / (2*this.b*this.c);
		this.sinA = Math.sqrt(1 - this.cosA*this.cosA);

		var s1 = this.b*this.cosA;
		var t1 = this.t - this.b*this.sinA;

		this.texCoords = [
			s1, t1,
			0, this.t,
			this.c, this.t
		];

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};

	// Apply the texture scale factors 
	setTexCoords(s, t) {
 		var comp = this.c;
		var larg = this.b*this.sinA;

		this.s = comp / s;
		this.t = 1 / t;

		var s1 = (this.b*this.cosA) / s; 
		var t1 = (1 - larg) * this.t;

		this.texCoords = [
			s1, t1,
			0, this.t,
			this.s, this.t
		];

		this.updateTexCoordsGLBuffers();
	};

};
