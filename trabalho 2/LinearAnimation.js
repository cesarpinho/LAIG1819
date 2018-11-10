/**
 *
 */

 class LinearAnimation extends Animation
 {
    constructor(scene, points, time, id) {
        super(scene, id, time);

        this.points = points;
        this.equations = [];
        this.currEq=0;
        this.x=0;
        this.deltatime=0;
        var point1 = points[0];
        this.matrix = mat4.create();

        for(var i = 1 ; i < points.length ; i++){
            this.equations.push(this.getEq(point1,points[i]));
        }

        console.log("equations : " + this.equations);

    }

    getEq(point1, point2){
        var m = (point2[2]-point1[2])/(point2[0]-point1[0]);
        var b = point2[2]/(m*point2[0]);

        if(isNaN(b))
        b=0;

        console.log("m : " + m + " b : " + b);

        return [m,b];
    }

    getTransf(){
        this.x+=this.deltatime;

        console.log("Ceq " + this.currEq + " point " + this.points[this.currEq+1]);
        if(this.x>=this.points[this.currEq+1][0]){
            this.x=0;
            if(this.currEq<this.equations.length-1)
            this.currEq++;
        }

        console.log("Ceq 2 " + this.currEq + " point " + this.points[this.currEq+1]);
        mat4.translate(this.matrix,this.matrix, vec3.fromValues(this.x,0,this.equations[this.currEq][0]*this.x+this.equations[this.currEq][1]));

        return this.matrix;
    }

    update(time){
        this.deltatime=time;
    }



 }
