/**
 *
 */

class CircularAnimation extends Animation
{
   constructor(scene, center, radius, init_angle, rotate_angle, time, id) {
        super(scene, id, time);

        this.time=time;
        this.center = center;
        this.radius = radius;
        this.angle = init_angle;
        console.log("this.angle: " +this.angle);
        this.rotate_angle = rotate_angle;
        this.velocity=this.rotate_angle/this.time;
        this.pos = vec3.fromValues(this.radius * Math.cos(this.angle),0,this.radius * Math.sin(this.angle));
        this.matrixR = mat4.create();
        this.matrixT = mat4.create();
   }

   updateAngle(){
     this.angle += this.time*this.detlatime/this.rotate_angle;
     console.log(this.time + " " + this.deltatime + " " + this.rotate_angle);
     console.log(this.angle);
   }

   calculatePosition(){
     this.pos = vec3.fromValues(this.radius * Math.cos(this.angle),0,this.radius * Math.sin(this.angle));
   }

   updateMatrix(){

     this.matrixT = mat4.create();
     mat4.translate(this.matrixT,this.matrixT, this.pos); ///translate para a circunferencia antes de fazer o rotate
     mat4.rotate(this.matrixR,this.matrixR,this.angle,vec3.fromValues(0,1,0) );

   }

   getMatrix(){
     var M = mat4.create();
     mat4.translate(M,M, this.center);
     mat4.multiply(M,M,this.matrixR);
     mat4.multiply(M,M,this.matrixT);
     return M;
   }

   update(time){

     this.deltatime=time;

     this.updateAngle();
     this.calculatePosition();

     ///this.calculatePercentages();
     this.updateMatrix();
     this.olddeltatime = this.deltatime;
   }

}
