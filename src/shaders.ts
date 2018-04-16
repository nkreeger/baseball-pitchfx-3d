
export const FRAGMENT_SHADER_2D = `
    precision mediump float;
    varying vec4 vColor;

    void main() {
        gl_FragColor = vColor;
    }`;

export const VERTEX_SHADER_2D = `
    attribute vec3 aVertexPosition;
    attribute vec4 aVertexColor;

    uniform mat4 uMVMatrix;
    uniform mat4 uPMatrix;
    uniform float uScale;

    varying vec4 vColor;

    void main(void) {
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition * uScale, 1.0);
    vColor = aVertexColor;
    }`;

export const FRAGMENT_LIGHTING_TEXTURE_SHADER_3D = `
    precision mediump float;
    
    varying float vColorOption;
    varying vec2 vTextureCoord;
    varying vec3 vLightWeighting;
    varying vec4 vColor;
    
    uniform sampler2D uSampler;
    
    void main(void) {
      if (vColorOption > 0.0) {
        vec4 textureColor =
            texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
        gl_FragColor = vec4(textureColor.rgb * vLightWeighting, textureColor.a);
      } else {
        gl_FragColor = vColor;
      }
    }`;

export const VERTEX_LIGHTING_SHADER_3D = `
    attribute vec3 aVertexPosition;
    attribute vec3 aVertexNormal;
    attribute vec2 aTextureCoord;
    attribute vec4 aVertexColor;
  
    uniform mat4 uMVMatrix;
    uniform mat4 uPMatrix;
    uniform mat3 uNMatrix;
    
    uniform vec3 uAmbientColor;
    
    uniform vec3 uLightingDirection;
    uniform vec3 uDirectionalColor;
    
    uniform float uColorOption;
    
    varying float vColorOption;
    varying vec2 vTextureCoord;
    varying vec3 vLightWeighting;
    varying vec4 vColor;
    
    void main(void) {
      gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    
      if (uColorOption > 0.0) {
        vTextureCoord = aTextureCoord;
      } else {
        vColor = aVertexColor;
      }
      vColorOption = uColorOption;
    
      vec3 transformedNormal = uNMatrix * aVertexNormal;
      float directionalLightWeighting =
          max(dot(transformedNormal, uLightingDirection), 0.0);
      vLightWeighting =
          uAmbientColor + uDirectionalColor * directionalLightWeighting;
    }`;