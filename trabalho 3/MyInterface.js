/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        // add a group of controls (and open/expand by defult)

        this.initKeys();
        this.initMouse();

        return true;
    }

    /**
     * initMouse
     */
    initMouse() {
        this.processMouse=function(){};
    }

    processMouseDown(event) {       /// Player 1 (172,140) (510,140) (172,480) (510,480)  Aproximado
      console.log("mouse down: " + event.x + " " + event.y);

      ///   x
      var a = (510-172)/8;    // 510-172 -> board visual width
      console.log(a);
      var b = (Math.floor((event.x-172)/a));
      console.log(b);

      /// y
      var c = (480-140)/8;    // 480-140 -> board visual heigth
      console.log(c);
      var d = (Math.floor((event.y-140)/c));
      console.log(d);
    };

    /**
     * initKeys
     */
    initKeys() {
        this.scene.gui=this;
        this.processKeyboard=function(){};
        this.activeKeys={};
    }

    processKeyDown(event) {
        this.activeKeys[event.code]=true;
    };

    processKeyUp(event) {
        this.activeKeys[event.code]=false;
    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }


    /**
     * Adds a list box containing the IDs of the views passed as parameter.
     * @param {array} views
     */
    addViewsGroup(views) {
        this.scene.viewValues = [];

        for (var key in views) {
            if (views.hasOwnProperty(key)) {
                this.scene.viewValues.push(key);
            }
        }

		this.gui.add(this.scene,'View', this.scene.viewValues);
    }

    /**
     * Adds a folder containing the IDs of the lights passed as parameter.
     * @param {array} lights
     */
    addLightsGroup(lights) {

        var group = this.gui.addFolder("Lights");
        group.open();

        for (var key in lights) {
            if (lights.hasOwnProperty(key)) {
                this.scene.lightValues[key] = lights[key][0];
                group.add(this.scene.lightValues, key);
            }
        }
    }
}
