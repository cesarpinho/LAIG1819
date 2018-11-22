#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform float time;
uniform sampler2D uSampler;
uniform sampler2D uSampler2;

void main() {

	gl_FragColor = texture2D(uSampler, vTextureCoord);
}