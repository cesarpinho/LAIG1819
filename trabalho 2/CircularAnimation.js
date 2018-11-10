/**
 *
 */

class CircularAnimation extends Animation
{
   constructor(scene, center, radius, init_angle, rotate_angle, time, id) {
        super(scene, id, time);

        this.center = center;
        this.radius = radius;
        this.init_angle = init_angle;
        this.rotate_angle = rotate_angle;
   }

}
