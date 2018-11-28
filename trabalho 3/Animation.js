/**
 * Animation
 * @constructor
 */

class Animation
{
    constructor(scene, id, span) {
        this.matrixdefault = mat4.create();    ///for default animation
        this.started = false;
        this.ended = false;
        this.scene = scene;
        this.id = id;
        this.span = span;
    };

    update(time){
    };

    getMatrix(){
      return this.matrixdefault;
    };

    apply(){
    };
};
