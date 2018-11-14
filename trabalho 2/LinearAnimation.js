/**
 *
 */

 class LinearAnimation extends Animation
 {
    constructor(scene, points, span, id) {
        super(scene, id, span);

        this.points = points;
        this.distances = [];
        this.times = [];
        this.percentages = [];
        this.vectors = [];
        this.dxyz = [];
        this.totalDistance = 0;
        this.deltatime=0;
        this.matrix = mat4.create();
        //var point1 = points[0];
        //this.matrix = mat4.create();
        console.log("Points" + this.points);

        this.calculateDistances();
        this.calculateVelocity();
        this.calculateTimes();
        this.calculateVectors();


    }

    calculateDistances(){
      for(var i = 0 ; i < this.points.length - 1 ; i++){
          var dist = Math.sqrt( Math.pow(this.points[i+1][0]-this.points[i][0],2) + Math.pow(this.points[i+1][1]-this.points[i][1],2) + Math.pow(this.points[i+1][2]-this.points[i][2],2) );
          this.distances.push(dist);
          this.totalDistance += dist;
      }
      console.log("Distances: " + this.distances);
      console.log("Total Distance: " + this.totalDistance);
    }

    calculateVectors(){
      for(var i = 0 ; i < this.points.length - 1 ; i++){
          var vect = [this.points[i+1][0]-this.points[i][0],this.points[i+1][1]-this.points[i][1],this.points[i+1][2]-this.points[i][2]];
          this.vectors.push(vect);
      }
      console.log("Vectors: " + this.vectors);
    }

    calculateVelocity(){
      this.velocity = this.totalDistance / this.span;
      console.log("Velocity: " + this.velocity);
    }

    calculatePercentages(){
      for(var i = 0 ; i < this.distances.length ; i++){
          var perc = this.deltatime / this.times[i];
          this.percentages[i] = perc;
      }
      console.log("Percentages: " + this.percentages);
    }

    calculateTimes(){
      for(var i = 0 ; i < this.distances.length ; i++){
          var time = this.distances[i] / this.velocity;
          this.times.push(time);
      }
      console.log("Times: " + this.times);
    }

    calculatedxyz(){
      for(var i = 0 ; i < this.distances.length ; i++){
      console.log("vectors: " + this.vectors[i]);
        this.dxyz[i] =  this.vectors[i].slice();
        console.log("dxyz: " + this.dxyz);
        this.dxyz[i][0] = this.vectors[i][0] * this.percentages[i];
        this.dxyz[i][1] = this.vectors[i][1] * this.percentages[i];
        this.dxyz[i][2] = this.vectors[i][2] * this.percentages[i];
      }
      console.log("dxyz: " + this.dxyz);
    }

    getMatrix(){
      var M = mat4.create();
      console.log("test: " + this.dxyz[0]);
      mat4.translate(M,M, vec3.fromValues(this.dxyz[0][0],this.dxyz[0][1],this.dxyz[0][2]));
      mat4.multiply(this.matrix,this.matrix,M);
      console.log("matrix: " + M);
      return this.matrix;
    }

/*
    getEq(point1, point2){
        var m = (point2[2]-point1[2])/(point2[0]-point1[0]);
        var b = point2[2]-(m*point2[0]);

        if(isNaN(b))
        b=0;

        console.log("m : " + m + " b : " + b);

        return [m,b];
    }

    getTransf(){

        //console.log("Ceq " + this.currEq + " point " + this.points[this.currEq+1]);
        if(this.x>=this.points[this.currEq+1][0]){
            this.x=0;
            if(this.currEq<this.equations.length-1)
            this.currEq++;
        }

        //console.log("Ceq 2 " + this.currEq + " point " + this.points[this.currEq+1]);
        mat4.translate(this.matrix,this.matrix, vec3.fromValues(this.x,0,this.equations[this.currEq][0]*this.x+this.equations[this.currEq][1]));

        return this.matrix;
    }
*/
    update(time){
      this.deltatime=time;
      console.log("test");
      this.calculatePercentages();
      this.calculatedxyz();
    }

 }
