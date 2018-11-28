class Patch extends CGFobject {

    /**
     * @constructor Patch class
     * @param {any} scene 
     * @param {number} npointsU 
     * @param {number} npointsV 
     * @param {number} npartsU 
     * @param {number} npartsV 
     * @param {number[]} controlPoints 
     */
    constructor(scene, npointsU, npointsV, npartsU, npartsV, controlPoints) {
        super(scene);

        this.scene = scene;
        this.degreeU = npointsU - 1;
        this.degreeV = npointsV - 1;
        this.npartsU = npartsU;
        this.npartsV = npartsV;

        this.createPoints(controlPoints);

        var nurbsSurface = new CGFnurbsSurface(this.degreeU, this.degreeV, this.points);
        this.surface = new CGFnurbsObject(scene, npartsU, npartsV, nurbsSurface);
    }

    /**
     * Organize the control points array
     * @param {number[]} controlPoints 
     */
    createPoints(controlPoints) {
        this.points = [];
        var count = 0;

        for (var i = 0; i <= this.degreeU; i++) {
            var Upoints = [];

            for (var j = this.degreeV; j >= 0 ; j--) {
                controlPoints[count].push(1);
                Upoints.push(controlPoints[count]);
                count ++;
            }

            this.points.push(Upoints);
        }
    }

    /**
     * Display the surface
     */
    display() {
        this.surface.display();
    }
}
