var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var PRIMITIVES_INDEX = 7;
var COMPONENTS_INDEX = 8;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * @constructor
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];

        this.idRoot = null;                    // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);
    }

    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "yas")
            return "root tag <yas> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

        // <scene>
        var index;
        if ((index = nodeNames.indexOf("scene")) == -1)
            return "tag <scene> missing";
        else {
            if (index != SCENE_INDEX)
                this.onXMLMinorError("tag <scene> out of order " + index);

            //Parse scene block
            if ((error = this.parseScene(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseView(nodes[index])) != null)
                return error;
        }

        // <ambient>
        if ((index = nodeNames.indexOf("ambient")) == -1)
            return "tag <ambient> missing";
        else {
            if (index != AMBIENT_INDEX)
                this.onXMLMinorError("tag <ambient> out of order");

            //Parse ambient block
            if ((error = this.parseAmbient(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }
        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <transformations>
        if ((index = nodeNames.indexOf("transformations")) == -1)
            return "tag <transformations> missing";
        else {
            if (index != TRANSFORMATIONS_INDEX)
                this.onXMLMinorError("tag <transformations> out of order");

            //Parse transformations block
            if ((error = this.parseTransformations(nodes[index])) != null)
                return error;
        }

        // <primitives>
        if ((index = nodeNames.indexOf("primitives")) == -1)
            return "tag <primitives> missing";
        else {
            if (index != PRIMITIVES_INDEX)
                this.onXMLMinorError("tag <primitives> out of order");

            //Parse primitives block
            if ((error = this.parsePrimitives(nodes[index])) != null)
                return error;
        }

        // <components>
        if ((index = nodeNames.indexOf("components")) == -1)
            return "tag <components> missing";
        else {
            if (index != COMPONENTS_INDEX)
                this.onXMLMinorError("tag <components> out of order");

            //Parse components block
            if ((error = this.parseComponents(nodes[index])) != null)
                return error;
        }
        this.log("all parsed");
    }

    /**
     * Parses the <scene> block. 
     * @param {scene block element} sceneNode
     */
    parseScene(sceneNode) {

        // Get root of the scene.
        var root = this.reader.getString(sceneNode, 'root')
        if (root == null)
            return "no ROOT defined for scene";

        this.idRoot = root;

        // Get axis length        
        var axis_length = this.reader.getFloat(sceneNode, 'axis_length');
        if (axis_length == null)
            this.onXMLMinorError("no AXIS_LENGTH defined for scene; assuming 'lenght = 1'");

        this.referenceLength = axis_length;

        this.log("Parsed scene");

        return null;
    }

    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseView(viewsNode) {
        var children = viewsNode.children;

        this.views = [];

        var grandChildren = [];
        var nodeNames = [];

        // Get default view.
        var defaultView = this.reader.getString(viewsNode, 'default');
        if (defaultView == null)
            return "no DEFAULT view defined";

        // Any number of views.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "perspective" && children[i].nodeName != "ortho") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current view.
            var viewId = this.reader.getString(children[i], 'id');
            if (viewId == null)
                return "no ID defined for view";

            // Checks for repeated IDs.
            if (this.views[viewId] != null)
                return "ID must be unique for each view (conflict: ID = " + viewId + ")";

            // Get near of the current view.
            var near = this.reader.getFloat(children[i], 'near');
            if (near == null)
                return "no NEAR defined for view with ID = " + viewId;

            // Get far of the current view.
            var far = this.reader.getFloat(children[i], 'far');
            if (far == null)
                return "no FAR defined for view with ID = " + viewId;
            
            grandChildren = children[i].children;
            // Specifications for the current view.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++)
                nodeNames.push(grandChildren[j].nodeName);
            
            // Gets indices of each element.
            var fromIndex = nodeNames.indexOf("from");
            var toIndex = nodeNames.indexOf("to");

            if (fromIndex != -1) {
                var position = this.parseCoordinates(grandChildren[fromIndex], "'FROM' position view", viewId);
                if (!Array.isArray(position))
                    return position;
            }
            else
                return "'FROM' position view undefined for ID = " + viewId;

            if (toIndex != -1) {
                var direction = this.parseCoordinates(grandChildren[toIndex], "'TO' position view", viewId);
                if (!Array.isArray(direction))
                    return direction;
            }
            else
                return "'TO' position view undefined for ID = " + viewId;

            switch ( children[i].nodeName ) {
                case "perspective":
                    // Get angle of the current view.
                    var fov = this.reader.getFloat(children[i], 'angle');
                    if (fov == null)
                        return "no ANGLE defined for view with ID = " + viewId;
                    
                    fov = fov * DEGREE_TO_RAD;

                    var view = new CGFcamera(fov, near, far, position, direction);
                    break;

                case "ortho":
                    // Get left bound of the current view.
                    var left = this.reader.getFloat(children[i], 'left');
                    if (left == null)
                        return "no LEFT bound defined for view with ID = " + viewId;
                    
                    // Get right bound of the current view.
                    var right = this.reader.getFloat(children[i], 'right');
                    if (right == null)
                        return "no RIGHT bound defined for view with ID = " + viewId;

                    // Get bottom bound of the current view.
                    var bottom = this.reader.getFloat(children[i], 'bottom');
                    if (bottom == null)
                        return "no BOTTOM bound defined for view with ID = " + viewId;

                    // Get left bound of the current view.
                    var top = this.reader.getFloat(children[i], 'top');
                    if (top == null)
                        return "no TOP bound defined for view with ID = " + viewId;                   
                    
                    var up = [0,1,0];
                    var view = new CGFcameraOrtho(left, right, bottom, top, near, far, position, direction, up);
                    break;
            }
            this.views[viewId] = view;
        }

        if (this.views[defaultView] == null)
            return "DEFAULT view don't exist";
        
        this.views.push(defaultView);

        this.log("Parsed views");

        return null;
    }

    /**
     * Parses the <ambient> node.
     * @param {ambient block element} ambientsNode
     */
    parseAmbient(ambientsNode) {

        var children = ambientsNode.children;

        this.ambient = [];
        this.background = [];

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var ambientIndex = nodeNames.indexOf("ambient");
        var backgroundIndex = nodeNames.indexOf("background");

        var aux = this.parseColor(children[ambientIndex], "AMBIENT");
        if (!Array.isArray(aux))
            return aux;
        else
            this.ambient = aux;

        aux = this.parseColor(children[backgroundIndex], "BACKGROUND");
        if (!Array.isArray(aux))
            return aux;
        else
            this.background = aux;

        this.log("Parsed ambient");

        return null;
    }

    /**
     * Parses the <light> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {
        var children = lightsNode.children;

        this.lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "omni" && children[i].nodeName != "spot") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            // Light enable/disable
            var enableLight = true;
            var aux = this.reader.getBoolean(children[i], 'enabled');
            if (!(aux != null && !isNaN(aux) && (aux == true || aux == false)))
                this.onXMLMinorError("unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'");
            else
                enableLight = aux ;

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            // Gets indices of each element.
            var locationIndex = nodeNames.indexOf("location");
            var ambientIndex = nodeNames.indexOf("ambient");
            var diffuseIndex = nodeNames.indexOf("diffuse");
            var specularIndex = nodeNames.indexOf("specular");

            // Gets the attributes of the spot light
            if ( children[i].nodeName == "spot" ) {
                var angle = this.reader.getFloat(children[i], 'angle');
                if (!(angle != null && !isNaN(angle)))
                    return "unable to parse angle of the light for ID = " + lightId;

                var exponent = this.reader.getFloat(children[i], 'exponent');
                if (!(exponent != null && !isNaN(exponent)))
                    return "unable to parse exponent of the light for ID = " + lightId;

                var targetIndex = nodeNames.indexOf("target");

                // Retrieves the light target.
                var targetlight = [];
                if (targetIndex != -1) {
                    var aux = this.parseCoordinates(grandChildren[targetIndex], "target light", lightId);
                    if (!Array.isArray(aux))
                        return aux;

                        targetlight = aux;
                }
                else
                    return "light target undefined for ID = " + lightId;   
            }

            // Retrieves the light location.
            var locationlight = [];
            if (locationIndex != -1) {
                var aux = this.parseCoordinates(grandChildren[locationIndex], "light position", lightId);
                if (!Array.isArray(aux))
                    return aux;

                locationlight = aux;

                // w
                var w = this.reader.getFloat(grandChildren[locationIndex], 'w');
                if (!(w != null && !isNaN(w) && w >= 0 && w <= 1))
                    return "unable to parse W-coordinate of the light position for ID = " + lightId;

                locationlight.push(w);
            }
            else
                return "light location undefined for ID = " + lightId;

            // Retrieves the ambient component.
            var ambientIllumination = [];
            if (ambientIndex != -1) {
                var aux = this.parseColor(grandChildren[ambientIndex], "ambient illumination", lightId);
                if (!Array.isArray(aux))
                    return aux;

                ambientIllumination = aux;
            }
            else
                return "ambient component undefined for ID = " + lightId;

            // Retrieves the diffuse component.
            var diffuseIllumination = [];
            if (diffuseIndex != -1) {
                var aux = this.parseColor(grandChildren[diffuseIndex], "diffuse illumination", lightId);
                if (!Array.isArray(aux))
                    return aux;

                diffuseIllumination = aux;
            }
            else
                return "diffuse component undefined for ID = " + lightId;

            // Retrieves the specular component.
            var specularIllumination = [];
            if (specularIndex != -1) {
                var aux = this.parseColor(grandChildren[specularIndex], "specular illumination", lightId);
                if (!Array.isArray(aux))
                    return aux;

                specularIllumination = aux;
            }
            else
                return "specular component undefined for ID = " + lightId;
            
            // Store Light global information.
            var global = [];
            global.push(enableLight);

            switch ( children[i].nodeName ) {
                case "omni":
                    global.push("omni");                    
                    global.push(locationlight);
                    global.push(ambientIllumination);
                    global.push(diffuseIllumination);
                    global.push(specularIllumination);
                    break;
                case "spot":                   
                    global.push("spot");
                    global.push(angle);
                    global.push(exponent);
                    global.push(locationlight);
                    global.push(targetlight);
                    global.push(ambientIllumination);
                    global.push(diffuseIllumination);
                    global.push(specularIllumination);
                    break;
            }

            this.lights[lightId] = global;

            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");
        return null;
    }

    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {

        var children = texturesNode.children;

        this.textures = [];

        // Any number of textures.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "texture") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current texture.
            var textureId = this.reader.getString(children[i], 'id');
            if (textureId == null)
                return "no ID defined for texture";

            // Checks for repeated IDs.
            if (this.textures[textureId] != null)
                return "ID must be unique for each texture (conflict: ID = " + textureId + ")";

            var texturePath = this.reader.getString(children[i], 'file');
            if (texturePath == null)
                return "no file path defined for texture with ID = " + textureId + ")";

            var texture = new CGFtexture(this.scene, texturePath);

            this.textures[textureId] = texture;
        }
        this.log("Parsed textures");

        return null;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        var children = materialsNode.children;

        this.materials = [];

        var grandChildren = [];
        var nodeNames = [];

        // Any number of materials.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current material.
            var materialID = this.reader.getString(children[i], 'id');
            if (materialID == null)
                return "no ID defined for material";

            // Checks for repeated IDs.
            if (this.materials[materialID] != null)
                return "ID must be unique for each light (conflict: ID = " + materialID + ")";

            // Material shininess
            var shininess = this.reader.getFloat(children[i], 'shininess');
            if (!(shininess != null && !isNaN(shininess)))
                return "unable to parse value component of the 'shininess' field for ID = " + materialID;

            grandChildren = children[i].children;
            // Specifications for the current material.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            // Gets indices of each element.
            var emissionIndex = nodeNames.indexOf("emission");
            var ambientIndex = nodeNames.indexOf("ambient");
            var diffuseIndex = nodeNames.indexOf("diffuse");
            var specularIndex = nodeNames.indexOf("specular");


            // Retrieves the material emission.
            var emissionMaterial = [];
            if (emissionIndex != -1) {
                var aux = this.parseColor(grandChildren[emissionIndex], "material emission", materialID);
                if (!Array.isArray(aux))
                    return aux;

                emissionMaterial = aux;
            }
            else
                return "material emission undefined for ID = " + materialID;

            // Retrieves the ambient component.
            var ambientIllumination = [];
            if (ambientIndex != -1) {
                var aux = this.parseColor(grandChildren[ambientIndex], "ambient material illumination", materialID);
                if (!Array.isArray(aux))
                    return aux;

                ambientIllumination = aux;
            }
            else
                return "ambient component undefined for ID = " + materialID;

            // Retrieves the diffuse component.
            var diffuseIllumination = [];
            if (diffuseIndex != -1) {
                var aux = this.parseColor(grandChildren[diffuseIndex], "diffuse material illumination", materialID);
                if (!Array.isArray(aux))
                    return aux;

                diffuseIllumination = aux;
            }
            else
                return "diffuse component undefined for ID = " + materialID;

            // Retrieves the specular component.
            var specularIllumination = [];
            if (specularIndex != -1) {
                var aux = this.parseColor(grandChildren[specularIndex], "specular material illumination", materialID);
                if (!Array.isArray(aux))
                    return aux;

                specularIllumination = aux;
            }
            else
                return "specular component undefined for ID = " + materialID;

            // Store material global information.
            var material = new CGFappearance(this.scene);
            material.setShininess(shininess);
            material.setEmission(emissionMaterial[0], emissionMaterial[1], emissionMaterial[2], emissionMaterial[3]);
            material.setAmbient(ambientIllumination[0], ambientIllumination[1], ambientIllumination[2], ambientIllumination[3]);
            material.setDiffuse(diffuseIllumination[0], diffuseIllumination[1], diffuseIllumination[2], diffuseIllumination[3]);
            material.setSpecular(specularIllumination[0], specularIllumination[1], specularIllumination[2], specularIllumination[3]);

            this.materials[materialID] = material;
        }
        var material = new CGFappearance(this.scene);
        this.materials['default'] = material;

        this.log("Parsed materials");
        return null;
    }

    /**
     * Parses the <transformations> block.
     * @param {transformations block element} transformationsNode
     */
    parseTransformations(transformationsNode) {
        var children = transformationsNode.children;

        this.transformations = [];

        var grandChildren = [];

        // Any number of transformations.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "transformation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current transformation.
            var transformationID = this.reader.getString(children[i], 'id');
            if (transformationID == null)
                return "no ID defined for transformation";

            // Checks for repeated IDs.
            if (this.transformations[transformationID] != null)
                return "ID must be unique for each transformation (conflict: ID = " + transformationID + ")";

            grandChildren = children[i].children;
            // Specifications for the current transformation.

            var transfMatrix = mat4.create();
            for (var j = 0; j < grandChildren.length; j++) {
                switch ( grandChildren[j].nodeName ) {
                    case 'translate':
                        var coordinates = this.parseCoordinates(grandChildren[j], "translate transformation", transformationID);
                        if (!Array.isArray(coordinates))
                            return coordinates;

                        transfMatrix = mat4.translate(transfMatrix, transfMatrix, coordinates);
                        break;
                    case 'scale':
                        var coordinates = this.parseCoordinates(grandChildren[j], "scale transformation", transformationID);
                        if (!Array.isArray(coordinates))
                            return coordinates;

                        if (coordinates[0] == 0)
                            this.onXMLMinorError("Invalid x coordinate of the scale transformation for ID = " + transformationID + "; assuming 'x = 1'");
                        if (coordinates[1] == 0)
                            this.onXMLMinorError("Invalid y coordinate of the scale transformation for ID = " + transformationID + "; assuming 'y = 1'");
                        if (coordinates[2] == 0)
                            this.onXMLMinorError("Invalid z coordinate of the scale transformation for ID = " + transformationID + "; assuming 'z = 1'");
            
                        transfMatrix = mat4.scale(transfMatrix, transfMatrix, coordinates);
                        break;
                    case 'rotate':
                        // angle
                        var angle = this.reader.getFloat(grandChildren[j], 'angle');
                        if (!(angle != null && !isNaN(angle)))
                            return "unable to parse angle of the rotate transformation for ID = " + transformationID;

                        // axis
                        var axis = this.reader.getString(grandChildren[j], 'axis');
                        if (!(axis != null && (axis == 'x' || axis == 'y' || axis == 'z')))
                            return "unable to parse axis of the rotate transformation for ID = " + transformationID;

                        var axisVec = [0, 0, 0];

                        if (axis == 'x')
                            axisVec[0] = 1;
                        else if (axis == 'y')
                            axisVec[1] = 1;
                        else if (axis == 'z')
                            axisVec[2] = 1;

                        transfMatrix = mat4.rotate(transfMatrix, transfMatrix, angle * DEGREE_TO_RAD, axisVec);
                        break;
                }
            }
            this.transformations[transformationID] = transfMatrix;
        }

        this.log("Parsed transformations");
        return null;
    }

    /**
     * Parses the <primitives> block.
     * @param {primitives block element} primitivesNode
     */
    parsePrimitives(primitivesNode) {
        var children = primitivesNode.children;

        this.primitives = [];

        var grandChildren = [];

        // Any number of primitives.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "primitive") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current primitive.
            var primitiveId = this.reader.getString(children[i], 'id');
            if (primitiveId == null)
                return "no ID defined for texture";

            // Checks for repeated IDs.
            if (this.primitives[primitiveId] != null)
                return "ID must be unique for each primitive (conflict: ID = " + primitiveId + ")";

            grandChildren = children[i].children;

            // Validate the primitive type
            if (grandChildren.length != 1 ||
                (grandChildren[0].nodeName != 'rectangle' && grandChildren[0].nodeName != 'triangle' &&
                    grandChildren[0].nodeName != 'cylinder' && grandChildren[0].nodeName != 'sphere' &&
                    grandChildren[0].nodeName != 'torus' && grandChildren[0].nodeName != 'spiral')) {
                return "There must be exactly 1 primitive type (rectangle, triangle, cylinder, sphere or torus)"
            }

            // Specifications for the current primitive.
            var primitiveType = grandChildren[0].nodeName;

            // Retrieves the primitive coordinates.
            if (primitiveType == 'rectangle') {
                // x1
                var x1 = this.reader.getFloat(grandChildren[0], 'x1');
                if (!(x1 != null && !isNaN(x1)))
                    return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

                // y1
                var y1 = this.reader.getFloat(grandChildren[0], 'y1');
                if (!(y1 != null && !isNaN(y1)))
                    return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

                // x2
                var x2 = this.reader.getFloat(grandChildren[0], 'x2');
                if (!(x2 != null && !isNaN(x2) && x2 > x1))
                    return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

                // y2
                var y2 = this.reader.getFloat(grandChildren[0], 'y2');
                if (!(y2 != null && !isNaN(y2) && y2 > y1))
                    return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

                var rect = new MyRectangle(this.scene, primitiveId, x1, x2, y1, y2);

                this.primitives[primitiveId] = rect;
            }
            else if (primitiveType == 'triangle') {
                // x1                                                    
                var x1 = this.reader.getFloat(grandChildren[0], 'x1');
                if (!(x1 != null && !isNaN(x1)))
                    return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

                // y1
                var y1 = this.reader.getFloat(grandChildren[0], 'y1');
                if (!(y1 != null && !isNaN(y1)))
                    return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

                // z1
                var z1 = this.reader.getFloat(grandChildren[0], 'z1');
                if (!(z1 != null && !isNaN(z1)))
                    return "unable to parse z1 of the primitive coordinates for ID = " + primitiveId;

                // x2
                var x2 = this.reader.getFloat(grandChildren[0], 'x2');
                if (!(x2 != null && !isNaN(x2)))
                    return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

                // y2
                var y2 = this.reader.getFloat(grandChildren[0], 'y2');
                if (!(y2 != null && !isNaN(y2)))
                    return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

                // z2
                var z2 = this.reader.getFloat(grandChildren[0], 'z2');
                if (!(z2 != null && !isNaN(z2)))
                    return "unable to parse z2 of the primitive coordinates for ID = " + primitiveId;

                // x3
                var x3 = this.reader.getFloat(grandChildren[0], 'x3');
                if (!(x3 != null && !isNaN(x3)))
                    return "unable to parse x3 of the primitive coordinates for ID = " + primitiveId;

                // y3
                var y3 = this.reader.getFloat(grandChildren[0], 'y3');
                if (!(y3 != null && !isNaN(y3)))
                    return "unable to parse y3 of the primitive coordinates for ID = " + primitiveId;

                // z3
                var z3 = this.reader.getFloat(grandChildren[0], 'z3');
                if (!(z3 != null && !isNaN(z3)))
                    return "unable to parse z3 of the primitive coordinates for ID = " + primitiveId;

                var triangle = new MyTriangle(this.scene, primitiveId, x1, x2, x3, y1, y2, y3, z1, z2, z3);

                this.primitives[primitiveId] = triangle;
            }
            else if (primitiveType == 'cylinder') {
                // Base
                var base = this.reader.getFloat(grandChildren[0], 'base');
                if (!(base != null && !isNaN(base)))
                    return "unable to parse base size of the primitive for ID = " + primitiveId;

                // Top
                var top = this.reader.getFloat(grandChildren[0], 'top');
                if (!(top != null && !isNaN(top)))
                    return "unable to parse top size of the primitive for ID = " + primitiveId;

                // Height
                var height = this.reader.getFloat(grandChildren[0], 'height');
                if (!(height != null && !isNaN(height)))
                    return "unable to parse height size of the primitive for ID = " + primitiveId;

                // Slices
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse slices number of the primitive for ID = " + primitiveId;

                // Stacks
                var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
                if (!(stacks != null && !isNaN(stacks)))
                    return "unable to parse stacks number of the primitive for ID = " + primitiveId;

                var cylinder = new MyCylinder(this.scene, primitiveId, base, top, height, slices, stacks);

                this.primitives[primitiveId] = cylinder;
            }
            else if (primitiveType == 'sphere') {
                // Radius
                var radius = this.reader.getFloat(grandChildren[0], 'radius');
                if (!(radius != null && !isNaN(radius)))
                    return "unable to parse radius size of the primitive for ID = " + primitiveId;

                // Slices
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse slices number of the primitive for ID = " + primitiveId;

                // Stacks
                var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
                if (!(stacks != null && !isNaN(stacks)))
                    return "unable to parse stacks number of the primitive for ID = " + primitiveId;

                var sphere = new MySphere(this.scene, primitiveId, radius, slices, stacks);

                this.primitives[primitiveId] = sphere;
            }
            else if (primitiveType == 'torus') {
                // Inner radius
                var inner = this.reader.getFloat(grandChildren[0], 'inner');
                if (!(inner != null && !isNaN(inner)))
                    return "unable to parse inner radius size of the primitive for ID = " + primitiveId;

                // Outer radius
                var outer = this.reader.getFloat(grandChildren[0], 'outer');
                if (!(outer != null && !isNaN(outer)))
                    return "unable to parse outer radius size of the primitive for ID = " + primitiveId;

                // Slices
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse slices number of the primitive for ID = " + primitiveId;

                // Loops
                var loops = this.reader.getFloat(grandChildren[0], 'loops');
                if (!(loops != null && !isNaN(loops)))
                    return "unable to parse loops number of the primitive for ID = " + primitiveId;

                var torus = new MyTorus(this.scene, primitiveId, inner, outer, slices, loops);

                this.primitives[primitiveId] = torus;
            }
        }

        this.log("Parsed primitives");
        return null;
    }

    /**
   * Parses the <components> block.
   * @param {components block element} componentsNode
   */
    parseComponents(componentsNode) {
        var children = componentsNode.children;

        this.components = [];

        var grandChildren = [];
        var grandgrandChildren = [];
        var nodeNames = [];

        // Any number of components.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "component") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current component.
            var componentID = this.reader.getString(children[i], 'id');
            if (componentID == null)
                return "no ID defined for componentID";

            // Checks for repeated IDs.
            if (this.components[componentID] != null)
                return "ID must be unique for each component (conflict: ID = " + componentID + ")";

            grandChildren = children[i].children;

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            var transformationIndex = nodeNames.indexOf("transformation");
            var materialsIndex = nodeNames.indexOf("materials");
            var textureIndex = nodeNames.indexOf("texture");
            var childrenIndex = nodeNames.indexOf("children");

            // Transformations
            var matrixID;

            if (transformationIndex != -1) {
                grandgrandChildren = grandChildren[transformationIndex].children;

                nodeNames = [];
                for (var j = 0; j < grandgrandChildren.length; j++) {
                    nodeNames.push(grandgrandChildren[j].nodeName);
                }

                var transformationrefIndex = nodeNames.indexOf("transformationref");

                if (transformationrefIndex != -1) {
                    // Get id of the current transformationref.
                    var transformationref = this.reader.getString(grandgrandChildren[transformationrefIndex], 'id');

                    if (transformationref == null)
                        return "no ID defined for transformationref";

                    // Check if the transformationref ID is valid
                    if (this.transformations[transformationref] == null)
                        return "no transformation with ID: " + transformationref;

                    matrixID = transformationref;
                }
                else {
                    matrixID = componentID + 'transformation';

                    var transfMatrix = mat4.create();
                    for (var j = 0; j < grandgrandChildren.length; j++) {
                        switch (grandgrandChildren[j].nodeName){
                            case 'translate':
                                var coordinates = this.parseCoordinates(grandgrandChildren[j], "translate transformation", componentID);
                                if (!Array.isArray(coordinates))
                                    return coordinates;

                                transfMatrix = mat4.translate(transfMatrix, transfMatrix, coordinates);
                                break;
                            case 'scale':
                                var coordinates = this.parseCoordinates(grandgrandChildren[j], "scale transformation", componentID);
                                if (!Array.isArray(coordinates))
                                    return coordinates;
                                
                                if (coordinates[0] == 0)
                                    this.onXMLMinorError("Invalid x coordinate of the scale transformation for ID = " + componentID + "; assuming 'x = 1'");
                                if (coordinates[1] == 0)
                                    this.onXMLMinorError("Invalid y coordinate of the scale transformation for ID = " + componentID + "; assuming 'y = 1'");
                                if (coordinates[2] == 0)
                                    this.onXMLMinorError("Invalid z coordinate of the scale transformation for ID = " + componentID + "; assuming 'z = 1'");

                                transfMatrix = mat4.scale(transfMatrix, transfMatrix, coordinates);
                                break;
                            case 'rotate':
                                // angle
                                var angle = this.reader.getFloat(grandgrandChildren[j], 'angle');
                                if (!(angle != null && !isNaN(angle)))
                                    return "unable to parse angle of the rotate transformation for ID = " + componentID;

                                // axis
                                var axis = this.reader.getString(grandgrandChildren[j], 'axis');
                                if (!(axis != null && (axis == 'x' || axis == 'y' || axis == 'z')))
                                    return "unable to parse axis of the rotate transformation for ID = " + componentID;

                                var axisVec = [0, 0, 0];

                                if (axis == 'x')
                                    axisVec[0] = 1;
                                else if (axis == 'y')
                                    axisVec[1] = 1;
                                else if (axis == 'z')
                                    axisVec[2] = 1;

                                transfMatrix = mat4.rotate(transfMatrix, transfMatrix, angle * DEGREE_TO_RAD, axisVec);
                                break;
                        }
                    }
                    this.transformations[matrixID] = transfMatrix;
                }
            }
            else return "transformation tag undefined for ID = " + componentID;


            // Materials
            var materialsID = [];

            if (materialsIndex != -1) {
                grandgrandChildren = grandChildren[materialsIndex].children;

                for (var j = 0; j < grandgrandChildren.length; j++) {

                    if (grandgrandChildren[j].nodeName != 'material') {
                        return "unknown tag <" + grandgrandChildren[j].nodeName + "> - Expected <material> tag";
                    }

                    // Get id of the material.
                    var materialID = this.reader.getString(grandgrandChildren[j], 'id');
                    if (materialID == null)
                        return "undefined textureID for ID = " + componentID;

                    // Check if the material ID is valid
                    if (this.materials[materialID] == null && materialID != "inherit")
                        return "no material with ID: " + materialID;

                    materialsID.push(materialID);
                }
            }
            else return "materials tag undefined for ID = " + componentID;


            // Texture
            if (textureIndex != -1) {
                // Get id of the texture.
                var textureID = this.reader.getString(grandChildren[textureIndex], 'id');
                if (textureID == null)
                    return "undefined textureID for ID = " + componentID;

                // Check if the texture ID is valid
                if (this.textures[textureID] == null && textureID != "none" && textureID != "inherit")
                    return "no texture with ID: " + textureID;

                // Get length_s
                if (this.reader.hasAttribute(grandChildren[textureIndex], 'length_s'))
                    var length_s = this.reader.getFloat(grandChildren[textureIndex], 'length_s');
                else {
                    if (textureID != "none" && textureID != "inherit")
                        return "undefined texture length_s for ID = " + componentID;
                    else length_s = null;
                }
                // Get length_t
                if (this.reader.hasAttribute(grandChildren[textureIndex], 'length_t'))
                    var length_t = this.reader.getFloat(grandChildren[textureIndex], 'length_t');
                else {
                    if (textureID != "none" && textureID != "inherit")
                        return "undefined texture length_t for ID = " + componentID;
                    else length_t = null;
                }
            }
            else return "texture tag undefined for ID = " + componentID;


            // Children
            if (childrenIndex != -1) {
                grandgrandChildren = grandChildren[childrenIndex].children;

                if (grandgrandChildren.length < 1)
                    return "There must be at least one children (componentref or primitiveref)";

                var childComponent = [];
                var childPrimitive = [];

                for (var z = 0; z < grandgrandChildren.length; z++) {

                    if (grandgrandChildren[z].nodeName != 'componentref' && grandgrandChildren[z].nodeName != 'primitiveref')
                        return "unknown tag <" + grandgrandChildren[z].nodeName + "> - Expected <primitiveref> or <componentref> tag";

                    // Get id of the current children.
                    var childID = this.reader.getString(grandgrandChildren[z], 'id');
                    if (childID == null)
                        return "no ID defined for childID";

                    if (grandgrandChildren[z].nodeName == 'primitiveref') {
                        // Check if IDs exist
                        if (this.primitives[childID] == null)
                            return "There is no primitive with this ID (conflict: ID = " + childID + ")";
                        else
                            childPrimitive.push(childID);
                    }
                    else if (grandgrandChildren[z].nodeName == 'componentref')
                        childComponent.push(childID);
                }
            }
            else return "children tag undefined for ID = " + componentID;

            this.components[componentID] = new MyComponent(componentID, matrixID, materialsID,
                textureID, length_s, length_t, childPrimitive, childComponent);
        }

        // Check children component
        for (var key in this.components) {

            if (this.components.hasOwnProperty(key)) {
                var ID = this.components[key].id;
                var child = this.components[key].childComponents;

                for (var i = 0; i < child.length; i++) {
                    if (this.components[child[i]] == null)
                        return "There is no component with this ID (ID = " + child[i] + ") child of \"" + ID + "\"";
                }
            }
        }
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     * @param {node id} id
     */
    parseCoordinates(node, messageError, id) {
        var position = [];

        // x
        var x = this.reader.getFloat(node, 'x');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x-coordinate of the " + messageError + " for ID = " + id;

        // y
        var y = this.reader.getFloat(node, 'y');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y-coordinate of the " + messageError + " for ID = " + id;

        // z
        var z = this.reader.getFloat(node, 'z');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z-coordinate of the " + messageError + " for ID = " + id;

        position.push(x);
        position.push(y);
        position.push(z);

        return position;
    }

    /**
     * Parse the color components from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     * @param {node id} id
     */
    parseColor(node, messageError, id) {
        var color = [];

        // R
        var r = this.reader.getFloat(node, 'r');
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return "unable to parse R component of the " + messageError + " for ID = " + id;

        // G
        var g = this.reader.getFloat(node, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "unable to parse G component of the " + messageError + " for ID = " + id;

        // B
        var b = this.reader.getFloat(node, 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            return "unable to parse B component of the " + messageError + " for ID = " + id;

        // A
        var a = this.reader.getFloat(node, 'a');
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
            return "unable to parse A component of the " + messageError + " for ID = " + id;

        color.push(r);
        color.push(g);
        color.push(b);
        color.push(a);

        return color;
    }

    /**
     * Parse the color components from a node
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseColor(node, messageError) {
        var color = [];

        // R
        var r = this.reader.getFloat(node, 'r');
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return "unable to parse R component of the " + messageError;

        // G
        var g = this.reader.getFloat(node, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "unable to parse G component of the " + messageError;

        // B
        var b = this.reader.getFloat(node, 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            return "unable to parse B component of the " + messageError;

        // A
        var a = this.reader.getFloat(node, 'a');
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
            return "unable to parse A component of the " + messageError;

        color.push(r);
        color.push(g);
        color.push(b);
        color.push(a);

        return color;
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
        this.stack = [];

        this.processNode(this.idRoot, mat4.create(), 'default', null, null, null, false);
    }

    /**
     * Process each node of the graph
     * @param {node id} id 
     * @param {transformation matrix} tgMatrix 
     * @param {material id} material 
     * @param {texture id} texture 
     * @param {length s} ls 
     * @param {length t} lt 
     * @param {boolean to indicate if is primitive} isPrimitive 
     */
    processNode(id, tgMatrix, material, texture, ls, lt, isPrimitive) {
        if (this.primitives[id] != null && isPrimitive) {
            this.drawPrimitive(id, tgMatrix, material, texture);
        }
        else if (this.components[id] != null && !isPrimitive) {
            var component = this.components[id];

            var mat = component.materialsref[component.materialN];
            var tex = component.textureref;
            var s = component.length_s;
            var t = component.length_t;

            if (mat == 'inherit')
                mat = material;

            if (tex == 'inherit') {
                tex = texture;

                if (s == null)
                    s = ls;

                if (t == null)
                    t = lt;
            }

            var transformation = [];

            mat4.multiply(transformation,
                tgMatrix, this.transformations[component.transfMatrix]);

            var child = component.childComponents;
            for (var i = 0; i < child.length; i++) {
                this.stack.push(mat, tex, s, t);

                this.processNode(child[i], transformation, mat, tex, s, t, false);

                t = this.stack.pop();
                s = this.stack.pop();
                tex = this.stack.pop();
                mat = this.stack.pop();
            }

            child = component.childPrimitives;
            for (var i = 0; i < child.length; i++) {
                this.stack.push(mat, tex, s, t);

                if (this.primitives[child[i]] instanceof MyRectangle || this.primitives[child[i]] instanceof MyTriangle)
                    this.primitives[child[i]].setTexCoords(s, t);

                this.processNode(child[i], transformation, mat, tex, s, t, true);

                t = this.stack.pop();
                s = this.stack.pop();
                tex = this.stack.pop();
                mat = this.stack.pop();
            }
        }
    }

    /**
     * Change the material to be displayed
     */
    incMaterialsN(){
        for (var key in this.components) {
            if (this.components.hasOwnProperty(key)) {
                if(this.components[key].materialsref[this.components[key].materialN + 1] != null)
                    this.components[key].materialN++;
                else 
                    this.components[key].materialN = 0;
            }
        }
    }

    /**
     * Display the primitive element
     * @param {primitive id} id 
     * @param {transformation matrix} tgMatrix 
     * @param {material id} material 
     * @param {texture id} texture 
     */
    drawPrimitive(id, tgMatrix, material, texture) {
        this.scene.pushMatrix();
        this.scene.multMatrix(tgMatrix);

        var mat = this.materials[material];
        switch(texture){
            case 'none':
                mat.setTexture(null);
                break;
            default:
                mat.setTexture(this.textures[texture]);
                mat.setTextureWrap('REPEAT', 'REPEAT');
        }
        mat.apply();

        this.primitives[id].display();
        this.scene.popMatrix();
    }
}