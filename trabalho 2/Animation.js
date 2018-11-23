/**
 * Animation
 * @constructor
 */

class Animation
{
    constructor(scene, id, span) {
        this.started = false;
        this.ended = false;
        this.scene = scene;
        this.id = id;
        this.span = span;
    };

    update(time){
    };

    apply(){
    };
};
