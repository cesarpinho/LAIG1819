class Terrain {
    constructor(scene, idtexture, idheightmap, parts, heightscale) {
        this.scene = scene;
        this.idTexture = idtexture;
        this.idHieghtMap = idheightmap;
        this.parts = parts;
        this.heightScale = heightscale;

        this.plane = new Plane(scene, parts, parts);

        this.shader = new CGFshader(this.scene.gl, "scenes/shaders/terrain.vert", "scenes/shaders/terrain.frag");
        this.shader.setUniformsValues({uSampler2: 1});
        this.shader.setUniformsValues({heightScale: this.heightScale});
    }

    display() {
        this.scene.setActiveShader(this.shader);

        this.scene.pushMatrix();
            this.scene.graph.textures[this.idHieghtMap].bind(1);

            this.plane.display();
        this.scene.popMatrix();

        this.scene.setActiveShader(this.scene.defaultShader);
    
    }
}