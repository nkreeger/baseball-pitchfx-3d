import {mat3, mat4, vec3} from 'gl-matrix';

import {createShaderProgram, degToRad} from './webgl-core';

export class Pitch {
  mvMatrix: mat4;
  ballRotationMatrix: mat4;

  origBallX: number;
  origBallY: number;
  origBallZ: number;

  ballX: number;
  ballY: number;
  ballZ: number;

  ballDegRot: number;
  ballSpeed: number;
  lastTime: number;

  ballTexture: WebGLTexture;

  shaderProgram: WebGLShader;

  useLightingUniform: WebGLUniformLocation;
  ambientColorUniform: WebGLUniformLocation;
  lightingDirectionUniform: WebGLUniformLocation;
  directionalColorUniform: WebGLUniformLocation;
  samplerUniform: WebGLUniformLocation;
  pMatrixUniform: WebGLUniformLocation;
  mvMatrixUniform: WebGLUniformLocation;
  nMatrixUniform: WebGLUniformLocation;

  vertexPositionAttribute: number;
  textureCoordAttribute: number;
  vertexNormalAttribute: number;

  ballVertexPositionBuffer: WebGLBuffer;
  ballVertexTextureCoordBuffer: WebGLBuffer;
  ballVertexNormalBuffer: WebGLBuffer;
  ballVertexIndexBuffer: WebGLBuffer;

  constructor(gl: WebGLRenderingContext) {
    this.mvMatrix = mat4.create();

    this.ballRotationMatrix = mat4.create();
    mat4.identity(this.ballRotationMatrix);

    this.origBallX = 0;
    this.origBallY = 2;
    this.origBallZ = -15.24;

    this.ballX = this.origBallX;
    this.ballY = this.origBallY;
    this.ballZ = this.origBallZ;
    this.ballDegRot = 25;

    // Default to 90MPH (40.2336 m/s)
    this.ballSpeed = 40.2336;

    this.lastTime = 0;

    this._initShaders(gl);
    this._initBuffers(gl);
  }

  setTexture(gl: WebGLRenderingContext, image: HTMLImageElement) {
    this.ballTexture = gl.createTexture();
    // this.ballTexture.image = image;

    gl.bindTexture(gl.TEXTURE_2D, this.ballTexture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(
        gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);

    gl.bindTexture(gl.TEXTURE_2D, null);
  }

  setBallCoords(x: number, y: number, z: number) {
    this.ballX = x;
    this.ballY = y;
    this.ballZ = z;

    this.origBallX = x;
    this.origBallY = y;
    this.origBallZ = z;
  }

  setBallSpeed(ballSpeed: number) { this.ballSpeed = ballSpeed; }

  setBallRotation(rotation: number) { this.ballDegRot = rotation; }

  animate() {
    const timeNow = new Date().getTime();
    let setLastTime = true;
    if (this.lastTime !== 0) {
      const elapsed = timeNow - this.lastTime;

      if (this.ballZ < 0) {
        this.ballZ += (this.ballSpeed * elapsed) / 1000.0;
        this.ballY -= 0.07;
        this.ballX += 0.01;
      } else {
        if (elapsed < 1000) {
          setLastTime = false;
          console.log(this.ballX, this.ballY, this.ballZ);
        } else {
          this.ballX = this.origBallX;
          this.ballY = this.origBallY;
          this.ballZ = this.origBallZ;
          console.log(this.ballX, this.ballY, this.ballZ);
        }
      }
    }
    if (setLastTime) {
      this.lastTime = timeNow;
      // TODO - do this off of time too!
      const axis = vec3.fromValues(1, 2, 1);
      const radians = degToRad(this.ballDegRot);
      mat4.rotate(
          this.ballRotationMatrix, this.ballRotationMatrix, radians, axis);
    }
  }

  draw(gl: WebGLRenderingContext, pMatrix: mat4) {
    gl.useProgram(this.shaderProgram);

    // TODO - put lighting in it's own drawing file.
    const useLighting = true;
    gl.uniform1i(this.useLightingUniform, useLighting ? 1 : 0);
    if (useLighting) {
      gl.uniform3f(this.ambientColorUniform, 0.2, 0.2, 0.2);

      const lightingDirection = vec3.fromValues(-1.0, -1.0, -1.0);
      const adjustedLD = vec3.create();
      vec3.normalize(adjustedLD, lightingDirection);
      vec3.scale(adjustedLD, adjustedLD, -1);

      gl.uniform3fv(this.lightingDirectionUniform, adjustedLD);

      gl.uniform3f(this.directionalColorUniform, 0.8, 0.8, 0.8);
    }

    mat4.identity(this.mvMatrix);
    const ballMove = vec3.fromValues(this.ballX, this.ballY, this.ballZ);
    mat4.translate(this.mvMatrix, this.mvMatrix, ballMove);

    mat4.multiply(this.mvMatrix, this.mvMatrix, this.ballRotationMatrix);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.ballTexture);
    gl.uniform1i(this.samplerUniform, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.ballVertexPositionBuffer);
    gl.vertexAttribPointer(
        this.vertexPositionAttribute, VERTEX_POSITION_DATA_SIZE, gl.FLOAT,
        false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.ballVertexTextureCoordBuffer);
    gl.vertexAttribPointer(
        this.textureCoordAttribute, TEXTURE_COORD_DATA_SIZE, gl.FLOAT, false, 0,
        0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.ballVertexNormalBuffer);
    gl.vertexAttribPointer(
        this.vertexNormalAttribute, NORMAL_DATA_SIZE, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ballVertexIndexBuffer);
    gl.uniformMatrix4fv(this.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(this.mvMatrixUniform, false, this.mvMatrix);

    const normalMatrix = mat3.create();
    mat3.invert(normalMatrix, mat3.fromMat4(mat3.create(), this.mvMatrix));
    mat3.transpose(normalMatrix, normalMatrix);

    gl.uniformMatrix3fv(this.nMatrixUniform, false, normalMatrix);

    gl.drawElements(gl.TRIANGLES, INDEX_DATA.length, gl.UNSIGNED_SHORT, 0);
  }

  _initShaders(gl: WebGLRenderingContext) {
    this.shaderProgram =
        createShaderProgram(gl, FRAGMENT_SHADER_SRC, VERTEX_SHADER_SRC);

    this.vertexPositionAttribute =
        gl.getAttribLocation(this.shaderProgram, 'aVertexPosition');
    gl.enableVertexAttribArray(this.vertexPositionAttribute);

    this.textureCoordAttribute =
        gl.getAttribLocation(this.shaderProgram, 'aTextureCoord');
    gl.enableVertexAttribArray(this.textureCoordAttribute);

    this.vertexNormalAttribute =
        gl.getAttribLocation(this.shaderProgram, 'aVertexNormal');
    gl.enableVertexAttribArray(this.vertexNormalAttribute);

    this.pMatrixUniform = gl.getUniformLocation(this.shaderProgram, 'uPMatrix');
    this.mvMatrixUniform =
        gl.getUniformLocation(this.shaderProgram, 'uMVMatrix');
    this.nMatrixUniform = gl.getUniformLocation(this.shaderProgram, 'uNMatrix');
    this.samplerUniform = gl.getUniformLocation(this.shaderProgram, 'uSampler');
    this.useLightingUniform =
        gl.getUniformLocation(this.shaderProgram, 'uUseLighting');
    this.ambientColorUniform =
        gl.getUniformLocation(this.shaderProgram, 'uAmbientColor');
    this.lightingDirectionUniform =
        gl.getUniformLocation(this.shaderProgram, 'uLightingDirection');
    this.directionalColorUniform =
        gl.getUniformLocation(this.shaderProgram, 'uDirectionalColor');
  }

  _initBuffers(gl: WebGLRenderingContext) {
    this.ballVertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.ballVertexNormalBuffer);
    gl.bufferData(
        gl.ARRAY_BUFFER, new Float32Array(NORMAL_DATA), gl.STATIC_DRAW);

    this.ballVertexTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.ballVertexTextureCoordBuffer);
    gl.bufferData(
        gl.ARRAY_BUFFER, new Float32Array(TEXTURE_COORD_DATA), gl.STATIC_DRAW);

    this.ballVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.ballVertexPositionBuffer);
    gl.bufferData(
        gl.ARRAY_BUFFER, new Float32Array(VERTEX_POSITION_DATA),
        gl.STATIC_DRAW);

    this.ballVertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ballVertexIndexBuffer);
    gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(INDEX_DATA), gl.STATIC_DRAW);
  }
}

const VERTEX_SHADER_SRC = 'attribute vec3 aVertexPosition;' +
    'attribute vec3 aVertexNormal;' +
    'attribute vec2 aTextureCoord;' +

    'uniform mat4 uMVMatrix;' +
    'uniform mat4 uPMatrix;' +
    'uniform mat3 uNMatrix;' +

    'uniform vec3 uAmbientColor;' +

    'uniform vec3 uLightingDirection;' +
    'uniform vec3 uDirectionalColor;' +

    'uniform bool uUseLighting;' +

    'varying vec2 vTextureCoord;' +
    'varying vec3 vLightWeighting;' +

    'void main(void) {' +
    'gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);' +
    'vTextureCoord = aTextureCoord;' +

    'if (!uUseLighting) {' +
    'vLightWeighting = vec3(1.0, 1.0, 1.0);' +
    '} else {' +
    'vec3 transformedNormal = uNMatrix * aVertexNormal;' +
    // tslint:disable-next-line:max-line-length
    'float directionalLightWeighting = max(dot(transformedNormal, uLightingDirection), 0.0);' +
    // tslint:disable-next-line:max-line-length
    'vLightWeighting = uAmbientColor + uDirectionalColor * directionalLightWeighting;' +
    '}' +
    '}';

const FRAGMENT_SHADER_SRC = 'precision mediump float;' +

    'varying vec2 vTextureCoord;' +
    'varying vec3 vLightWeighting;' +

    'uniform sampler2D uSampler;' +

    'void main(void) {' +
    // tslint:disable-next-line:max-line-length
    'vec4 textureColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));' +
    'gl_FragColor = vec4(textureColor.rgb * vLightWeighting, textureColor.a);' +
    '}';

// Circle drawing logic:
const LATITUDE_BANDS = 60;
const LONGITUDE_BANDS = 60;
const RADIUS = 0.23495;

const VERTEX_POSITION_DATA = [] as number[];
const NORMAL_DATA = [] as number[];
const TEXTURE_COORD_DATA = [] as number[];
const INDEX_DATA = [] as number[];

const NORMAL_DATA_SIZE = 3;
const TEXTURE_COORD_DATA_SIZE = 2;
const VERTEX_POSITION_DATA_SIZE = 3;

for (let latNum = 0; latNum <= LATITUDE_BANDS; latNum++) {
  const theta = latNum * Math.PI / LATITUDE_BANDS;
  const sinTheta = Math.sin(theta);
  const cosTheta = Math.cos(theta);

  for (let longNum = 0; longNum <= LONGITUDE_BANDS; longNum++) {
    const phi = longNum * 2 * Math.PI / LONGITUDE_BANDS;
    const sinPhi = Math.sin(phi);
    const cosPhi = Math.cos(phi);

    const x = cosPhi * sinTheta;
    const y = cosTheta;
    const z = sinPhi * sinTheta;
    const u = 1 - (longNum / LONGITUDE_BANDS);
    const v = 1 - (latNum / LATITUDE_BANDS);

    NORMAL_DATA.push(x);
    NORMAL_DATA.push(y);
    NORMAL_DATA.push(z);

    TEXTURE_COORD_DATA.push(u);
    TEXTURE_COORD_DATA.push(v);

    VERTEX_POSITION_DATA.push(RADIUS * x);
    VERTEX_POSITION_DATA.push(RADIUS * y);
    VERTEX_POSITION_DATA.push(RADIUS * z);
  }
}

for (let latNum = 0; latNum < LATITUDE_BANDS; latNum++) {
  for (let longNum = 0; longNum < LONGITUDE_BANDS; longNum++) {
    const first = (latNum * (LONGITUDE_BANDS + 1)) + longNum;
    const second = first + LONGITUDE_BANDS + 1;

    INDEX_DATA.push(first);
    INDEX_DATA.push(second);
    INDEX_DATA.push(first + 1);

    INDEX_DATA.push(second);
    INDEX_DATA.push(second + 1);
    INDEX_DATA.push(first + 1);
  }
}
