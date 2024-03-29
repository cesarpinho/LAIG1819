class LinearAnimation extends Animation {

  /**
  * @constructor LinearAnimation class
  * @param {any} scene
  * @param {number[]} points
  * @param {number} span
  * @param {number} id
  */
  constructor(scene, points, span, id) {
    super(scene, id, span);

    this.points = points;
    this.end=false;
    this.changed=false;
    this.firstit = true;  // para que faça a rotação inicial
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
    this.matrixT = mat4.create();
    this.matrixR = mat4.create();

    mat4.translate(this.matrixT,this.matrixT, vec3.fromValues(this.points[0][0],this.points[0][1],this.points[0][2]));
    this.angle = 0;   // eixo ZZ

    this.calculateDistances();
    this.calculateVelocity();
    this.calculateTimes();
    this.calculateVectors();

    this.updateAngle();
    ///mat4.rotate(this.matrixR,mat4.create(),this.angle,vec3.fromValues(0,1,0) );
  }

  /**
   * Calculate distance of each segment
   */
  calculateDistances(){
    for(var i = 0 ; i < this.points.length - 1 ; i++){
        var dist = Math.sqrt( Math.pow(this.points[i+1][0]-this.points[i][0],2) + Math.pow(this.points[i+1][1]-this.points[i][1],2) + Math.pow(this.points[i+1][2]-this.points[i][2],2) );
        this.distances.push(dist);
        this.totalDistance += dist;
    }
  }

  /**
   * Calculate vectors of each segment
   */
  calculateVectors(){
    for(var i = 0 ; i < this.points.length - 1 ; i++){
        var vect = [this.points[i+1][0]-this.points[i][0],this.points[i+1][1]-this.points[i][1],this.points[i+1][2]-this.points[i][2]];
        this.vectors.push(vect);
    }
    this.currentVector = 0;
  }

  /**
   * Calculate velocity of the animation
   */
  calculateVelocity(){
    this.velocity = this.totalDistance / this.span;
  }

  /**
   * Calculate percentage of time in this iteration
   */
  calculatePercentages(){
    for(var i = 0 ; i < this.distances.length ; i++){
        var perc = this.deltatime / this.times[i];
        this.percentages[i] = perc;
    }
  }

  /**
   * Calculate the time of each segment
   */
  calculateTimes(){
    var i=0;
    for(0 ; i < this.distances.length ; i++){
        var time = this.distances[i] / this.velocity;
        this.times.push(time);
    }
    this.progresses = Array.from(Array(i), () => 0);
  }

  /**
   * Calculate the vector to translate in this iteration
   */
  calculatedxyz(){

    if(this.currentVector>= this.points.length-1){
      this.dxyz = [this.vectors[this.currentVector-1][0] * this.missedtime / this.times[this.currentVector-1],
                    this.vectors[this.currentVector-1][1] * this.missedtime / this.times[this.currentVector-1],
                    this.vectors[this.currentVector-1][2] * this.missedtime / this.times[this.currentVector-1]];

    }else
    if(this.changed){
    this.dxyz = [this.vectors[this.currentVector][0] * this.missedtime2 / this.times[this.currentVector]+ ((this.currentVector > 0) ? this.vectors[this.currentVector-1][0] * this.missedtime / this.times[this.currentVector-1] : 0),
                  this.vectors[this.currentVector][1] * this.missedtime2 / this.times[this.currentVector] + ((this.currentVector > 0) ? this.vectors[this.currentVector-1][1] * this.missedtime / this.times[this.currentVector-1] : 0),
                  this.vectors[this.currentVector][2] * this.missedtime2 / this.times[this.currentVector] + ((this.currentVector > 0) ? this.vectors[this.currentVector-1][2] * this.missedtime / this.times[this.currentVector-1] : 0)];
    }
    else
    this.dxyz = [this.vectors[this.currentVector][0] * this.percentages[this.currentVector],
                  this.vectors[this.currentVector][1] * this.percentages[this.currentVector],
                  this.vectors[this.currentVector][2] * this.percentages[this.currentVector]
  ];
    this.missedtime2 = 0;
    this.missedtime = 0;
  }

  /**
   * Update the angle to rotate
   */
  updateAngle(){
    if(this.vectors[this.currentVector]!=null){
      if( !isNaN( Math.atan(this.vectors[this.currentVector][0]/this.vectors[this.currentVector][2]) ) )
      this.angle = Math.atan(this.vectors[this.currentVector][0]/this.vectors[this.currentVector][2]);
    if(this.vectors[this.currentVector][2] < 0) // quando o angulo é maior que 90ª ou menor que -90ª
      this.angle = this.angle + Math.PI;
    }
  }

  /**
   * Update transformation matrixT and matrixR
   */
  updateMatrix(){

    var M = mat4.create();

    if(this.changed || this.firstit){
      ///mat4.rotate(this.matrixR,mat4.create(),this.angle,vec3.fromValues(0,1,0) );
    }
    this.firstit=false;

    mat4.translate(M,M, vec3.fromValues(this.dxyz[0],this.dxyz[1],this.dxyz[2]));
    mat4.multiply(this.matrixT,this.matrixT,M);
  }


  /**
   * Check if the current segment has ended
   */
  checkVector(){
    if(this.progresses[this.currentVector] >= this.times[this.currentVector]){
      this.changed=true;
      this.missedtime =  this.times[this.currentVector] - (this.progresses[this.currentVector] -this.deltatime);  //o tempo que faltou "andar" no vetor anterior
      this.currentVector+=1;
      this.missedtime2 = ((this.currentVector > 0) ? this.progresses[this.currentVector-1] - this.times[this.currentVector-1] : 0);    //o tempo que "andou" a mais no vetor anterior

      this.progresses[this.currentVector] += this.missedtime2;
    }
  }

  /**
   * Returns the transformation matrix
   */
  getMatrix(){
    var M = mat4.create();
    mat4.multiply(M,this.matrixT,this.matrixR);
    return M;
  }

  /**
   * Update animation
   */
  update(time){

    this.deltatime=time;
    this.progresses[this.currentVector]+=time;
    this.checkVector();

    if(!this.end)
      this.updateAngle();

    //    CHECK END
    this.calculatePercentages();
    this.calculatedxyz();

    if(!this.end)
      this.updateMatrix();

    this.changed=false;

    if(this.currentVector >= this.points.length-1){
        this.end = true;
        this.ended = true;
      }
    this.olddeltatime = this.deltatime;
  }


}
