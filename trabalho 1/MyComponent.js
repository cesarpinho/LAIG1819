/**
 * MyComponent
 * @constructor
 */
class MyComponent {
        constructor(id, transfMatrix, materialsref, textureref, length_s, length_t, childPrimitivesrefs, childComponentsref) {

                this.id = id;
                this.transfMatrix = transfMatrix;
                this.materialsref = materialsref;
                this.materialN = 0;
                this.textureref = textureref;
                this.length_s = length_s;
                this.length_t = length_t;
                this.childPrimitives = childPrimitivesrefs;
                this.childComponents = childComponentsref;
        };
};