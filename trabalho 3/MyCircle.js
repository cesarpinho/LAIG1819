/**
 * MyCircle Class
 */

class MyCircle extends CGFobject
{
	constructor(scene, slices)
    {
        super(scene);
        this.slices = slices;

        this.initBuffers();
    }

	initBuffers() 
	{      
	    this.vertices = [];
	    this.normals = [];
	    this.indices = [];
	    this.texCoords = [];

        var delta = 2*Math.PI/this.slices;
        var ang = 0;
        var s = 1;
        var t = 0.5; 
	
		this.vertices.push(0,0,0); 
		this.texCoords.push(0.5,0.5);
		this.normals.push(0,0,1);

		for(var i = 0; i < this.slices; i++) {
	
            var x = Math.cos(ang);
            var y = Math.sin(ang);

            this.vertices.push(x,y,0);
            this.texCoords.push(s,t);
           	this.normals.push(0,0,1);

            ang += delta;
            s = 0.5 + 0.5*Math.cos(ang);
            t = 0.5 - 0.5*Math.sin(ang);
		}
	    
 		var x1 = 1;
 		var x2 = 2;

		for(var i = 0; i < (this.slices-1); i++) {
			this.indices.push(0,x1,x2);

			x1 = x2; 
          	x2++;
		}

		this.indices.push(0,x1,1);
		
		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};
};