#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform float texScale;
uniform sampler2D uSampler;
uniform sampler2D uSampler2;

void main() {
	vec2 textureCoord = vTextureCoord * texScale;

	gl_FragColor = texture2D(uSampler, textureCoord);
}