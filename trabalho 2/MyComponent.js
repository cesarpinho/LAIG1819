/**
 * MyComponent
 * @constructor
 */
class MyComponent {
        constructor(id, transfMatrix, animationsref, materialsref, textureref, length_s, length_t, childPrimitivesrefs, childComponentsref) {

                this.id = id;
                this.transfMatrix = transfMatrix;
                this.animationsref = animationsref;
                this.currAnimI= 0;
                if(this.animationsref != null){
                this.currAnimationID = animationsref[this.currAnimI];
              }
                this.materialsref = materialsref;
                this.materialN = 0;
                this.textureref = textureref;
                this.length_s = length_s;
                this.length_t = length_t;
                this.childPrimitives = childPrimitivesrefs;
                this.childComponents = childComponentsref;
        };

        incAnimation(){
          this.currAnimI++;
          this.currAnimationID = this.animationsref[this.currAnimI];
          console.log("id inside component: " + this.currAnimationID);
          console.log(this.animationsref);
        }
};
