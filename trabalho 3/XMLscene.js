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

        this.angle = 0;

        this.setUpdatePeriod(30);
        this.setPickEnabled(true);
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
        this.axis = new CGFaxis(this, this.graph.referenceLength);

        // Inicialize default view
        this.view = this.graph.views.pop();
        this.camera = this.graph.views[this.view];

        this.gl.clearColor(this.graph.background[0], this.graph.background[1], this.graph.background[2], this.graph.background[3]);
        this.setGlobalAmbientLight(this.graph.ambient[0], this.graph.ambient[1], this.graph.ambient[2], this.graph.ambient[3]);

        this.initLights();

        // Adds lights group.
        this.interface.addLightsGroup(this.graph.lights);
        
        // Adds views group.
        this.interface.addViewsGroup(this.graph.views);

        this.initKeys();

        this.distance = this.distance2points(
            [this.camera.position[0], 0, this.camera.position[2]],
            [this.camera.target[0], 0, this.camera.target[2]]);

        this.sceneInited = true;

        // Game Creation
        this.game = new Game(this);

        console.log(this.graph.views);
    }

    update(currTime) {
        if(this.oldTime == null){
  			this.oldTime = currTime;
        }
        
        var delta = currTime-this.oldTime;
      	var time = delta/1000;             // time in seconds
      	this.oldTime = currTime;
          
        this.updateAnimations(time);
        
        /// update game
        if(this.game!=null)
        this.game.update(time);

        // Verify the keys pressed
        this.checkKeys();
        
        if(this.sceneInited)
            if(this.movecamera)
                this.updateMovingCamera();
        this.cameraAnimation.update(time);
            
        if(this.vehicleId != null)
            this.vehicleId[0].update(time);
    };
        
    /**
     * Updates all animations
     */
    updateAnimations(time){
        this.graph.checkAnimationsEnd();
        for (var key in this.graph.animations) {
            if (this.graph.animations.hasOwnProperty(key)) {
                if(this.graph.animations[key].started){
                    this.graph.animations[key].update(time);
                }
            }
        }
    }

    logPicking() {
        if (this.pickMode == false) {
            if (this.pickResults != null && this.pickResults.length > 0) {
                for (var i=0; i< this.pickResults.length; i++) {
                    var obj = this.pickResults[i][0];
                    if (obj)
                    {
                        var customId = this.pickResults[i][1];				
                        console.log("Picked object: " + obj + ", with pick id " + customId);

                        /// Handle Pick
                        this.game.handlePick(customId);
                    }
                }
                this.pickResults.splice(0,this.pickResults.length);
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

            this.camera = this.graph.views[this.view];
            this.interface.setActiveCamera(this.camera);
            
            if(this.game!=null)
            this.game.display();

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
        this.keysPressed[7] = 0;       // R
        this.keysPressed[8] = 0;       // F
        this.keysPressed[9] = 0;       // L
        this.keysPressed[10] = 0;      // E
        this.keysPressed[11] = 0;      // Q
        
    }
    
    /**
     * Keys handler called on display function
     */
    checkKeys() {
        //      reset keys
        if(!this.sceneInited)
            return;

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

        if (this.gui.isKeyPressed("KeyR")){
            this.keysPressed[7] = 1
            text+=" R ";
            keysPressed=true;
        }

        if (this.gui.isKeyPressed("KeyF")){
            this.keysPressed[8] = 1
            text+=" F ";
            keysPressed=true;
        }

        if (this.gui.isKeyPressed("KeyL")){
            this.keysPressed[9] = 1
            text+=" L ";
            keysPressed=true;
        }

        if (this.gui.isKeyPressed("KeyC")){
            this.keysPressed[6] = 1
            this.movecamera = !this.movecamera;
            text+=" C ";
            keysPressed=true;
        }

        if (this.gui.isKeyPressed("KeyE")){
            this.keysPressed[10] = 1
            text+=" E ";
            keysPressed=true;
        }

        if (this.gui.isKeyPressed("KeyQ")){
            this.keysPressed[11] = 1
            text+=" Q ";
            keysPressed=true;
        }

        if (keysPressed)
        console.log(text);
    }

    changeCamera(){
        this.changingcamera=!true;
    }

    /**
    *   Function that updates de moving camera
    *       Instructions:
    *       C -> enable/disable moving camera
    *
    *       D and A -> change where the camera is facing (target), RIGHT or LEFT
    *       O and L -> change where the camera is facing (target), UP or DOWN
    *       E and Q -> Pan the camera RIGHT or LEFT
    *       R and F -> move camera, UP or DOWN
    *       W and S -> Moves camera forward, FRONT or BACK
    */
    updateMovingCamera(){

        if(this.keysPressed[4])
          this.cameraTranslate(0);
        if(this.keysPressed[5])
          this.cameraTranslate(1);
        if(this.keysPressed[7])
          this.cameraTranslate(2);
        if(this.keysPressed[8])
          this.cameraTranslate(3);
        if(this.keysPressed[3])
          this.cameraRotate(0);
        if(this.keysPressed[2])
          this.cameraRotate(1);
        if(this.keysPressed[1])
          this.cameraRotate(2);
        if(this.keysPressed[9])
          this.cameraRotate(3);
        if(this.keysPressed[10])
          this.cameraPan(1);
        if(this.keysPressed[11])
          this.cameraPan(-1);
    }

    cameraPan(d){
        var speed = 0.5;
        this.camera.pan(vec3.fromValues(d*speed,0,0));
    }

    cameraTranslate(t){
        var speed = 4
        switch(t){
            case 0: //  translate FRONT
                this.camera.zoom(speed);
                this.movetarget(speed);
                break;
            case 1: //  translate BACK
                this.camera.zoom(-speed);
                this.movetarget(-speed);
                break;
            case 2:
                this.camera.setTarget(vec3.fromValues(this.camera.target[0],this.camera.target[1]+speed,this.camera.target[2]));
                this.camera.setPosition(vec3.fromValues(this.camera.position[0],this.camera.position[1]+speed,this.camera.position[2]));
                break;
            case 3:
                this.camera.setTarget(vec3.fromValues(this.camera.target[0],this.camera.target[1]-speed,this.camera.target[2]));
                this.camera.setPosition(vec3.fromValues(this.camera.position[0],this.camera.position[1]-speed,this.camera.position[2]));
                break;
            default:
            break;
        }
    }

    cameraRotate(r){
            var speed = 4;
        switch(r){
            case 0: //  rotate RIGHT
                this.angle+=0.05;
                this.camera.setTarget(vec3.fromValues(
                    this.distance*Math.cos(this.angle + 225*Math.PI/180) + this.camera.position[0], 
                    this.camera.target[1], 
                    this.distance*Math.sin(this.angle + 225*Math.PI/180) + this.camera.position[2]));
                break;
            case 1: //  rotate LEFT
                this.angle-=0.05;
                this.camera.setTarget(vec3.fromValues(
                    this.distance*Math.cos(this.angle + 225*Math.PI/180) + this.camera.position[0],
                    this.camera.target[1], 
                    this.distance*Math.sin(this.angle + 225*Math.PI/180) + this.camera.position[2]));
                break;
            case 2:  /// 1 -> up / -1 -> down
                this.camera.setTarget(vec3.fromValues(this.camera.target[0], this.camera.target[1]+speed, this.camera.target[2]));
                break;
            case 3:
                this.camera.setTarget(vec3.fromValues(this.camera.target[0], this.camera.target[1]-speed, this.camera.target[2]));
                break;
            default:
            break;
        }
    }

    movetarget(d){
        var dir = this.camera.calculateDirection();

        this.camera.setTarget(vec3.fromValues(
            this.camera.target[0] + dir[0] * d,
            this.camera.target[1] + dir[1] * d,
            this.camera.target[2] + dir[2] * d));
    }

    distance2points(a,b){
        return Math.sqrt(Math.pow((a[0]-b[0]),2) + Math.pow((a[1]-b[1]),2) + Math.pow((a[2]-b[2]),2));
    }

    responseParser(data) {
        console.log("Request successful. Reply: " + data.target.response);
        //this.game.board.responseParser(data);
        this.response = data.target.response;
    }

    makeRequest(requestString, onSuccess, onError, port) {
        var requestPort = port || 8081;
        var request = new XMLHttpRequest();
        var scene = this;

        request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);

        request.onload = onSuccess || function(data) {
            console.log("Request successful. Reply: " + data.target.response);
            scene.response = data.target.response;
        };
        request.onerror = onError || function(){console.log("Error waiting for response");};

        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();
    }
}