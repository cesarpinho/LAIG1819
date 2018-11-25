/**
 *
 */

class CircularAnimation extends Animation
{
   constructor(scene, center, radius, init_angle, rotate_angle, time, id) {
        super(scene, id, time);

        this.time=time;
        this.progress=0;
        this.flag=false;
        this.center = center;
        this.radius = radius;
        this.angle = init_angle*Math.PI/180;

        this.rotate_angle = rotate_angle*Math.PI/180;
        this.pos = vec3.fromValues(this.radius * Math.cos(this.angle),0,-this.radius * Math.sin(this.angle));    /// posiçao em relaçao ao centro

        this.startMatrix();

   }

   startMatrix(){
       this.matrixR = mat4.create();
       this.matrixT = mat4.create();
       mat4.translate(this.matrixT,this.matrixT, this.pos);
       mat4.rotate(this.matrixR,this.matrixR,this.angle,vec3.fromValues(0,1,0) );
   }

   updateAngle(){
     this.angle += this.rotate_angle*this.deltatime/this.time;
   }

   calculatePosition(){
     this.pos = vec3.fromValues(this.radius * Math.cos(this.angle),0,-this.radius * Math.sin(this.angle));
   }

   updateMatrix(){
     console.log("inside update");
     if(!this.ended || this.flag){
       if(this.ended)
           this.flag =false;

       this.matrixT = mat4.create();
       this.matrixR = mat4.create();
       mat4.translate(this.matrixT,this.matrixT, this.pos); ///translate para a circunferencia
       mat4.rotate(this.matrixR,this.matrixR,this.angle,vec3.fromValues(0,1,0) );
       console.log("updated : "+ this.pos);
     }
   }

   getMatrix(){
     var M = mat4.create();
     mat4.translate(M,M, this.center);
     mat4.multiply(M,M,this.matrixT);
     mat4.multiply(M,M,this.matrixR);
     return M;
   }

   checkFinal(){
     if(this.progress > this.time && !this.ended){
       this.flag=true;
       this.ended=true;
       var temp = this.time-(this.progress-this.deltatime);   ///quanto faltou andar
       this.angle = this.rotate_angle*temp/this.time;
     }
   }

   update(time){
     console.log("updated");

     this.deltatime=time;
     this.progress+=time;
     this.checkFinal();
     if(!this.ended)
     this.updateAngle();
     this.calculatePosition();

     ///this.calculatePercentages();
     this.updateMatrix();
     this.olddeltatime = this.deltatime;
   }

}
