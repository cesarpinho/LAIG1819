class Pach {

    constructor(scene, npartsU, npartsV, controlPoints) {
        this.scene = scene;
        this.npartsU = npartsU;
        this.npartsV = npartsV;
        
        this.points = controlPoints;

        var nurbsSurface = new CGFnurbsSurface(1, 1, this.points);
        this.plane = new CGFnurbsObject(scene, npartsU, npartsV, nurbsSurface);
    }

    display() {
        this.plane.display();
    }
}