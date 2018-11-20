class Patch {

    constructor(scene, npointsU, npointsV, npartsU, npartsV, controlPoints) {
        this.scene = scene;
        this.degreeU = npointsU - 1;
        this.degreeV = npointsV - 1;
        this.npartsU = npartsU;
        this.npartsV = npartsV;

        this.createPoints(controlPoints);

        var nurbsSurface = new CGFnurbsSurface(this.degreeU, this.degreeV, this.points);
        this.surface = new CGFnurbsObject(scene, npartsU, npartsV, nurbsSurface);
    }

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

    display() {
        this.surface.display();
    }
}
