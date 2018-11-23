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

        console.log(init_angle);
        this.rotate_angle = rotate_angle*Math.PI/180;
        console.log("this.rotate_angle: " +this.rotate_angle);
        this.pos = vec3.fromValues(this.radius * Math.cos(this.angle),0,-this.radius * Math.sin(this.angle));    /// posiçao em relaçao ao centro
        console.log("this.pos: " +this.pos);

        this.startMatrix();

   }

   startMatrix(){
       this.matrixR = mat4.create();
       this.matrixT = mat4.create();
       mat4.translate(this.matrixT,this.matrixT, this.pos);
       mat4.rotate(this.matrixR,this.matrixR,this.angle,vec3.fromValues(0,1,0) );
   }

   updateAngle(){
     console.log("this.time: " +this.time + "this.deltatime: " + this.deltatime + "this.rotate_angle: " + this.rotate_angle);
     this.angle += this.rotate_angle*this.deltatime/this.time;
       console.log("this.angle2: " +this.angle);
   }

   calculatePosition(){
     this.pos = vec3.fromValues(this.radius * Math.cos(this.angle),0,-this.radius * Math.sin(this.angle));
       console.log("this.pos2: " +this.pos);
   }

   updateMatrix(){
     if(!this.ended || this.flag){
       if(this.ended)
           this.flag =false;

       this.matrixT = mat4.create();
       this.matrixR = mat4.create();
       console.log("\n\nupdate matrix:  pos : " + this.pos + " angle : " + this.angle + "\n\n");
       mat4.translate(this.matrixT,this.matrixT, this.pos); ///translate para a circunferencia
       mat4.rotate(this.matrixR,this.matrixR,this.angle,vec3.fromValues(0,1,0) );
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
       console.log("ended");
       this.flag=true;
       this.ended=true;
       var temp = this.time-(this.progress-this.deltatime);   ///quanto faltou andar
       this.angle = this.rotate_angle*temp/this.time;
     }
   }

   update(time){

     this.deltatime=time;
     console.log("time::::" + time);
     this.progress+=time;
     console.log(this.progress);
     this.checkFinal();
     if(!this.ended)
     this.updateAngle();
     this.calculatePosition();

     ///this.calculatePercentages();
     this.updateMatrix();
     this.olddeltatime = this.deltatime;
   }

}
