/**
 * 
 */

class CircularAnimation extends Animation 
{
   constructor(scene, center, radius, init_angle, rotate_angle, time) {
        super(scene);

        this.scene = scene;
        this.center = center;
        this.radius = radius;
        this.init_angle = init_angle;
        this.rotate_angle = rotate_angle;
        this.time = time;
   }

}