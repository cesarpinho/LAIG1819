attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;
uniform sampler2D uSampler2;

uniform float time;
uniform float heightScale;

void main() {
	vec3 offset=vec3(0.0,0.0,0.0);
	vec2 desl = vec2(time, time);

	vTextureCoord = aTextureCoord + desl;

    offset = aVertexNormal * heightScale * (texture2D(uSampler2, vTextureCoord).r - 0.3);

	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition+offset, 1.0);
}