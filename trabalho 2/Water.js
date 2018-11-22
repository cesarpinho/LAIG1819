class Water {
    constructor(scene, idtexture, idheightmap, parts, heightscale, texscale) {
        this.scene = scene;
        this.idTexture = idtexture;
        this.idHieghtMap = idheightmap;
        this.parts = parts;
        this.heightScale = heightscale;
        this.texScale = texscale;
        this.move = 0;

        this.plane = new Plane(scene, parts, parts);

        this.shader = new CGFshader(this.scene.gl, "scenes/shaders/water.vert", "scenes/shaders/water.frag");
        this.shader.setUniformsValues({uSampler2: 1, heightScale: this.heightScale, texScale: this.texScale});
    }

    display() {
        this.move += 0.001;

        this.shader.setUniformsValues({time: this.move});

        this.scene.setActiveShader(this.shader);

        this.scene.pushMatrix();
            this.scene.graph.textures[this.idHieghtMap].bind(1);

            this.plane.display();
        this.scene.popMatrix();

        this.scene.setActiveShader(this.scene.defaultShader);
    }
}