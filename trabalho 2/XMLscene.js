var DEGREE_TO_RAD = Math.PI / 180;

/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface
     */
    constructor(myinterface) {
        super();

        this.interface = myinterface;
        this.lightValues = {};
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;

        this.initCameras();

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);

        this.setUpdatePeriod(20);
    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
    }
    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;
        // Lights index.

        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebGL.

            if (this.graph.lights.hasOwnProperty(key)) {
                var light = this.graph.lights[key];

                switch ( light[1] ) {
                    case "omni":
                        this.lights[i].setPosition(light[2][0], light[2][1], light[2][2], light[2][3]);
                        this.lights[i].setAmbient( light[3][0], light[3][1], light[3][2], light[3][3]);
                        this.lights[i].setDiffuse( light[4][0], light[4][1], light[4][2], light[4][3]);
                        this.lights[i].setSpecular(light[5][0], light[5][1], light[5][2], light[5][3]);
                        break;
                    case "spot":
                        this.lights[i].setSpotCutOff(light[2]);
                        this.lights[i].setSpotExponent(light[3]);
                        this.lights[i].setPosition(light[4][0], light[4][1], light[4][2], light[4][3]);
                        this.lights[i].setSpotDirection(light[5][0], light[5][1], light[5][2]);
                        this.lights[i].setAmbient( light[6][0], light[6][1], light[6][2], light[6][3]);
                        this.lights[i].setDiffuse( light[7][0], light[7][1], light[7][2], light[7][3]);
                        this.lights[i].setSpecular(light[8][0], light[8][1], light[8][2], light[8][3]);
                        break;
                }

                this.lights[i].setVisible(true);
                if (light[0])
                    this.lights[i].enable();
                else
                    this.lights[i].disable();

                this.lights[i].update();

                i++;
            }
        }
    }

    /** Handler called when the graph is finally loaded.
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {
        // Inicialize default view
        this.View = this.graph.views.pop();
        this.camera = this.graph.views[this.View];

        this.axis = new CGFaxis(this, this.graph.referenceLength);

        this.gl.clearColor(this.graph.background[0], this.graph.background[1], this.graph.background[2], this.graph.background[3]);

        this.setGlobalAmbientLight(this.graph.ambient[0], this.graph.ambient[1], this.graph.ambient[2], this.graph.ambient[3]);

        this.initLights();

        // Adds lights group.
        this.interface.addLightsGroup(this.graph.lights);

        this.interface.addViewsGroup(this.graph.views);

        this.sceneInited = true;

        this.initKeys();
    }

    /**
     * Keys handler called on display function
     */
    checkKeys()
	{

        //      reset keys

        for(var i = 0 ; i < this.keysPressed.length ; i++){
            this.keysPressed[i] = 0;
        }

		var text="Keys pressed: ";
		var keysPressed=false;

		if (this.gui.isKeyPressed("KeyM")){
            this.keysPressed[0] = 1
            this.graph.incMaterialsN();
			text+=" M ";
			keysPressed=true;
		}

		if (this.gui.isKeyPressed("KeyO")){
            this.keysPressed[1] = 1
            this.graph.tvon = !this.graph.tvon;
			text+=" O ";
			keysPressed=true;
		}

		if (this.gui.isKeyPressed("KeyA")){
            this.keysPressed[2] = 1
			text+=" A ";
			keysPressed=true;
		}

		if (this.gui.isKeyPressed("KeyD")){
            this.keysPressed[3] = 1
			text+=" D ";
			keysPressed=true;
		}

		if (this.gui.isKeyPressed("KeyW")){
            this.keysPressed[4] = 1
			text+=" W ";
			keysPressed=true;
		}

		if (this.gui.isKeyPressed("KeyS")){
            this.keysPressed[5] = 1
			text+=" S ";
			keysPressed=true;
        }

        if (this.gui.isKeyPressed("KeyC")){
            console.log("d");
            this.keysPressed[6] = 1
            this.movecamera = !this.movecamera;
			text+=" C ";
			keysPressed=true;
		}

		if (keysPressed)
		console.log(text);
	}

    update(currTime) {
  		if(this.oldTime == null){
  			this.oldTime = currTime;
        }
          
      	var delta = currTime-this.oldTime;
      	var time = delta/1000;             // this.time in seconds
      	this.oldTime = currTime;

        this.updateAnimations(time);
        this.graph.checkAnimationsend();

        // Verify the keys pressed
        //this.checkKeys();

        if(this.sceneInited)
            if(this.movecamera)
            this.updateCamera();
        
        if(this.vehicleId != null) {
            this.vehicleId[0].update(time);
            /* for(var i=0; i < this.vehicleId.length ; i++) {
                
            } */
        }
	};

  /**
   * Updates all animations
   */
   updateAnimations(time){
       for (var key in this.graph.animations) {
           if (this.graph.animations.hasOwnProperty(key)) {
             if(this.graph.animations[key].started)
              this.graph.animations[key].update(time);
           }
       }
   }

    /**
     * Displays the scene.
     */
    display() {
        // ---- BEGIN Background, camera and axis setup

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.pushMatrix();

        if (this.sceneInited) {
            // Draw axis
            this.axis.display();

            var i = 0;
            for (var key in this.lightValues) {
                if (this.lightValues.hasOwnProperty(key)) {
                    if (this.lightValues[key]) {

                        this.lights[i].setVisible(true);
                        this.lights[i].enable();
                    }
                    else {
                        this.lights[i].setVisible(false);
                        this.lights[i].disable();
                    }
                    this.lights[i].update();
                    i++;
                }
            }

            this.camera = this.graph.views[this.View];
            this.interface.setActiveCamera(this.camera);

            // Displays the scene (MySceneGraph function).
            this.graph.displayScene();
        }
        else {
            // Draw axis
            this.axis.display();
        }

        this.popMatrix();
        // ---- END Background, camera and axis setup
    }

    initKeys(){
        this.keysPressed = [];
        this.keysPressed[0] = 0;       // M
        this.keysPressed[1] = 0;       // O
        this.keysPressed[2] = 0;       // A
        this.keysPressed[3] = 0;       // D
        this.keysPressed[4] = 0;       // W
        this.keysPressed[5] = 0;       // S
        this.keysPressed[6] = 0;       // C

    }

    updateCamera(){

        if(this.keysPressed[4])
        this.cameraTranslate(0);
        if(this.keysPressed[5])
        this.cameraTranslate(1);
        if(this.keysPressed[3])
        this.cameraRotate(0);
        if(this.keysPressed[2])
        this.cameraRotate(1);
        /*
        this.camera.rotate(vec3.fromValues(1,0,0),-0.01);
        if(this.keysPressed[5])
        this.camera.rotate(vec3.fromValues(1,0,0),0.01);
        */


    }

    cameraTranslate(t){
        switch(t){
            case 0: //  translate FRONT
                this.camera.zoom(1);
                this.movetarget(1);
                break;
            case 1: //  translate BACK
                this.camera.zoom(-1);
                this.movetarget(-1);
                break;
            default:
            break;
        }
    }

    cameraRotate(r){
        switch(r){
            case 0: //  rotate RIGHT
            this.angle+=0.05;
            this.camera.setTarget(vec3.fromValues(this.distance*Math.cos(this.angle + 225*Math.PI/180) + this.camera.position[0], this.camera.target[1], this.distance*Math.sin(this.angle + 225*Math.PI/180) + this.camera.position[2]));
                break;
            case 1: //  rotate LEFT
            this.angle-=0.05;
            this.camera.setTarget(vec3.fromValues(this.distance*Math.cos(this.angle + 225*Math.PI/180) + this.camera.position[0], this.camera.target[1], this.distance*Math.sin(this.angle + 225*Math.PI/180) + this.camera.position[2]));
                break;
            default:
            break;
        }
    }

    movetarget(d){
        var dir = this.camera.calculateDirection();
        console.log(this.camera.target[0]);
        console.log(dir[0]);
        console.log(dir[1]);
        console.log(dir[2]);
        console.log("x: " + this.camera.target[0]);
        console.log("y: " + this.camera.target[1]);
        console.log("z: " + this.camera.target[2]);
        this.camera.setTarget(vec3.fromValues(this.camera.target[0] + dir[0] * d, this.camera.target[1] + dir[1] * d, this.camera.target[2] + dir[2] * d));
        console.log(dir);
    }

    distance2points(a,b){
        return Math.sqrt(Math.pow((a[0]-b[0]),2) + Math.pow((a[1]-b[1]),2) + Math.pow((a[2]-b[2]),2));
    }
}
