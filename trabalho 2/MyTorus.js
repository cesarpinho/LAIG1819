/**
 * MyTorus
 * @constructor
 */

class MyTorus extends CGFobject {
	constructor(scene, id, inner, outers, slices, loops) {
		super(scene);

		this.id = id;
		this.inner = inner;
		this.outer = outers;
		this.slices = slices;
		this.loops = loops;
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
        var deltaTeta = 2*Math.PI / this.loops;

        var fi = 0;
		var deltaFi = 2* Math.PI / this.slices;
		
		var s = 0;
		var t = this.t;
		var deltaS = this.s / this.loops;
		var deltaT = this.t / this.slices;

        for(var i = 0; i <= this.loops; i++) {
            var x = (this.outer + this.inner * Math.cos(fi)) * Math.cos(teta);
            var y = (this.outer + this.inner * Math.cos(fi)) * Math.sin(teta);
            var z = this.inner * Math.sin(fi);
            var nx = this.inner * Math.cos(fi) * Math.cos(teta);
            var ny = this.inner * Math.cos(fi) * Math.sin(teta);
            var nz = z;

            this.vertices.push(x, y, z);
			this.normals.push(nx,ny,nz);
			this.texCoords.push(s,t);

            for (var j = 0 ; j < this.slices; j++) {
				fi += deltaFi;
				t -= deltaT;

                var x = (this.outer + this.inner * Math.cos(fi)) * Math.cos(teta);
            	var y = (this.outer + this.inner * Math.cos(fi)) * Math.sin(teta);
				var z = this.inner * Math.sin(fi);
				var nx = this.inner * Math.cos(fi) * Math.cos(teta);
                var ny = this.inner * Math.cos(fi) * Math.sin(teta);
                var nz = z;

                this.vertices.push(x, y, z);
				this.normals.push(nx,ny,nz);
				this.texCoords.push(s,t);
            }
            fi = 0;
			teta += deltaTeta;
			t = this.t;
			s += deltaS;
        }

        var x1 = 0;
        var x2 = 1;
        var x3 = this.slices + 1;
        var x4 = this.slices + 2; 

        for(var i=0 ; i < this.loops; i++) {
            for (var j = 0; j < this.slices; j++) {
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
};