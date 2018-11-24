/**
 * MyComponent
 * @constructor
 */
class MyComponent {
        constructor(id, transfMatrix, animationsref, materialsref, textureref, length_s, length_t, childPrimitivesrefs, childComponentsref) {

                this.id = id;
                this.transfMatrix = transfMatrix;
                this.animationsref = animationsref;
                this.currAnimI= 1;
                if(this.animationsref.length > 1)                         /// se houver alguma animaçao pralem da default
                this.currAnimationID = animationsref[this.currAnimI];
                else this.currAnimationID = "default_animation";
                this.materialsref = materialsref;
                this.materialN = 0;
                this.textureref = textureref;
                this.length_s = length_s;
                this.length_t = length_t;
                this.childPrimitives = childPrimitivesrefs;
                this.childComponents = childComponentsref;
        };

        incAnimation(){
        if(this.currAnimI != this.animationsref.length-1)
          this.currAnimI++;
          this.currAnimationID = this.animationsref[this.currAnimI];
        }
};
