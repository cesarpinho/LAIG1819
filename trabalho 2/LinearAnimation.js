/**
 *
 */

 class LinearAnimation extends Animation
 {
    constructor(scene, points, span, id) {
        super(scene, id, span);

        this.points = points;
        this.end=false;
        this.changed=false;
        this.distances = [];
        this.times = [];
        this.percentages = [];
        this.vectors = [];
        this.progresses = [];
        this.dxyz = [0,0,0];
        this.totalDistance = 0;
        this.deltatime = 0;
        this.olddeltatime = 0;
        this.missedtime = 0;
        this.missedtime2 = 0;
        this.matrix = mat4.create();
        //var point1 = points[0];
        //this.matrix = mat4.create();

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
    }

    calculateVectors(){
      for(var i = 0 ; i < this.points.length - 1 ; i++){
          var vect = [this.points[i+1][0]-this.points[i][0],this.points[i+1][1]-this.points[i][1],this.points[i+1][2]-this.points[i][2]];
          this.vectors.push(vect);
      }
      this.currentVector = 0;
    }

    calculateVelocity(){
      this.velocity = this.totalDistance / this.span;
    }

    calculatePercentages(){
      for(var i = 0 ; i < this.distances.length ; i++){
          var perc = this.deltatime / this.times[i];
          this.percentages[i] = perc;
      }
    }

    calculateTimes(){
      var i=0;
      for(0 ; i < this.distances.length ; i++){
          var time = this.distances[i] / this.velocity;
          this.times.push(time);
      }
      console.log(this.times);
      this.progresses = Array.from(Array(i), () => 0);
    }

    calculatedxyz(){

      if(this.changed)
      this.dxyz = [this.vectors[this.currentVector][0] * this.missedtime2 / this.times[this.currentVector]+ ((this.currentVector > 0) ? this.vectors[this.currentVector-1][0] * this.missedtime / this.times[this.currentVector] : 0),
                   this.vectors[this.currentVector][1] * this.missedtime2 / this.times[this.currentVector] + ((this.currentVector > 0) ? this.vectors[this.currentVector-1][1] * this.missedtime / this.times[this.currentVector] : 0),
                   this.vectors[this.currentVector][2] * this.missedtime2 / this.times[this.currentVector] + ((this.currentVector > 0) ? this.vectors[this.currentVector-1][2] * this.missedtime / this.times[this.currentVector] : 0)];
      else
      this.dxyz = [this.vectors[this.currentVector][0] * this.percentages[this.currentVector],
                   this.vectors[this.currentVector][1] * this.percentages[this.currentVector],
                   this.vectors[this.currentVector][2] * this.percentages[this.currentVector]
    ];
      this.changed=false;
      this.missedtime2 = 0;
      this.missedtime = 0;
      /*for(var i = 0 ; i < this.distances.length ; i++){
      console.log("vectors: " + this.vectors[i]);
        this.dxyz[i] =  this.vectors[i].slice();
        console.log("dxyz: " + this.dxyz);
        this.dxyz[i][0] = this.vectors[i][0] * this.percentages[i];
        this.dxyz[i][1] = this.vectors[i][1] * this.percentages[i];
        this.dxyz[i][2] = this.vectors[i][2] * this.percentages[i];
      }*/
    }

    updateMatrix(){

      var M = mat4.create();

          mat4.translate(M,M, vec3.fromValues(this.dxyz[0],this.dxyz[1],this.dxyz[2]));
          mat4.multiply(this.matrix,this.matrix,M);
    }

    checkVector(){
      if(this.progresses[this.currentVector] >= this.times[this.currentVector]){
        this.changed=true;
        console.log("in");
        this.missedtime =  this.times[this.currentVector] - this.olddeltatime;
        this.currentVector+=1;
        this.missedtime2 = ((this.currentVector > 0) ? this.progresses[this.currentVector-1] - this.times[this.currentVector-1] : 0);    //o tempo que andou mais no vetor anterior

        this.progresses[this.currentVector] += this.missedtime2;
        console.log(this.progresses[this.currentVector-1] - this.times[this.currentVector-1]);
      }
    }

    getMatrix(){
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

      console.log(time + "   " + this.currentVector);
      this.deltatime=time;
      this.progresses[this.currentVector]+=time;
      console.log("progresses: " + this.progresses);
      this.checkVector();

      console.log("missedtime: " + this.missedtime);

      //    CHECK END
      if(this.currentVector >= this.points.length - 1){
        console.log("ended");
          this.end = true;
        }

      this.calculatePercentages();

      if(!this.end)
      this.calculatedxyz();
      console.log("dxyz: " + this.dxyz);

      if(!this.end)
      this.updateMatrix();

      this.olddeltatime = this.deltatime;
    }


 }

 function noop() {
 };
