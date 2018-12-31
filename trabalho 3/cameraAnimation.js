/**
*     class responsible for the animation of the camera when witching players
*/

class CameraAnimation{

    /**
    * @constructor CameraAnimation class
    * @param {any} scene
    * @param {CGFCamera} camera
    */
    constructor(scene, camera) {
      this.timer=0;
      this.scene=scene;
      this.camera=camera;
      this.span=3;
      this.running;
      this.x=0;
    }

    startAnimation(){
      this.timer = 0;
      this.x=0;
      this.running = true;
    }

    stopAnimation(){
      this.running=false;
      if(this.camera.position[2]<4) /// its player 2
        this.camera.setPosition(vec3.fromValues(4,20,-2));
      else this.camera.setPosition(vec3.fromValues(4,20,10));

    }

    funcao(){
      return 4-Math.pow((this.x-2),2); 
    }

    update(time){
      this.x+=4/(3/time);
      this.timer+=time;
      console.log("x :" +this.x);
      console.log(this.timer);
      if(this.running && this.timer < this.span){
        this.camera.orbit(vec3.fromValues(0,1,0),this.funcao()/74.5);
      } else this.stopAnimation();
    }
  }