import {mat4} from 'gl-matrix';
import {createShaderProgram} from './core';

export class StrikeZone {
  mvMatrix: mat4;

  shaderProgram: WebGLShader;

  vertexPositionBuffer: WebGLBuffer;
  vertexColorBuffer: WebGLBuffer;

  pMatrixUniform: WebGLUniformLocation;
  mvMatrixUniform: WebGLUniformLocation;

  vertexPositionAttribute: number;
  vertexColorAttribute: number;

  constructor(gl: WebGLRenderingContext) {
    this.mvMatrix = mat4.create();
    mat4.translate(this.mvMatrix, this.mvMatrix, [0.0, 3.0, -1.0]);

    this.initShaders(gl);
    this.initBuffers(gl);
  }

  draw(gl: WebGLRenderingContext, pMatrix: mat4) {
    gl.useProgram(this.shaderProgram);

    // Clear the canvas.
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.enable(gl.BLEND);
    gl.disable(gl.DEPTH_TEST);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
    gl.vertexAttribPointer(
        this.vertexPositionAttribute, STRIKEZONE_VERTICES_SIZE, gl.FLOAT, false,
        0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);
    gl.vertexAttribPointer(
        this.vertexColorAttribute, STRIKEZONE_COLORS_SIZE, gl.FLOAT, false, 0,
        0);

    gl.uniformMatrix4fv(this.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(this.mvMatrixUniform, false, this.mvMatrix);

    gl.drawArrays(gl.TRIANGLES, 0, STRIKEZONE_VERTICES_ITEMS);

    gl.disable(gl.BLEND);
    gl.enable(gl.DEPTH_TEST);
  }

  private initShaders(gl: WebGLRenderingContext) {
    this.shaderProgram = createShaderProgram(
        gl, STRIKEZONE_FRAGMENT_SHADER_SRC, STRIKEZONE_VERTEX_SHADER_SRC);
    gl.useProgram(this.shaderProgram);

    this.vertexPositionAttribute =
        gl.getAttribLocation(this.shaderProgram, 'aVertexPosition');
    this.vertexColorAttribute =
        gl.getAttribLocation(this.shaderProgram, 'aVertexColor');

    this.pMatrixUniform = gl.getUniformLocation(this.shaderProgram, 'uPMatrix');
    this.mvMatrixUniform =
        gl.getUniformLocation(this.shaderProgram, 'uMVMatrix');
  }

  private initBuffers(gl: WebGLRenderingContext) {
    this.vertexPositionBuffer = gl.createBuffer();
    gl.enableVertexAttribArray(this.vertexPositionAttribute);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
    gl.bufferData(
        gl.ARRAY_BUFFER, new Float32Array(STRIKEZONE_VERTICES), gl.STATIC_DRAW);

    this.vertexColorBuffer = gl.createBuffer();
    gl.enableVertexAttribArray(this.vertexColorAttribute);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);
    gl.bufferData(
        gl.ARRAY_BUFFER, new Float32Array(STRIKEZONE_COLORS), gl.STATIC_DRAW);
  }
}

// Field Shader sources:
const STRIKEZONE_VERTEX_SHADER_SRC = 'attribute vec3 aVertexPosition;' +
    'attribute vec4 aVertexColor;' +

    'uniform mat4 uMVMatrix;' +
    'uniform mat4 uPMatrix;' +

    'varying vec4 vColor;' +

    'void main(void) {' +
    'gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);' +
    'vColor = aVertexColor;' +
    '}';

const STRIKEZONE_FRAGMENT_SHADER_SRC = 'precision mediump float;' +

    'varying vec4 vColor;' +

    'void main(void) {' +
    'gl_FragColor = vColor;' +
    '}';

const STRIKEZONE_VERTICES = [
  0.216,  0.295, 0.0, 0.216,  0.079, 0.0, -0.216, 0.295,  0.0,

  -0.216, 0.295, 0.0, -0.216, 0.079, 0.0, 0.216,  0.079,  0.0,

  0.216,  0.079, 0.0, -0.216, 0.079, 0.0, 0.0,    -0.294, 0.0
];
const STRIKEZONE_VERTICES_SIZE = 3;
const STRIKEZONE_VERTICES_ITEMS = 9;

const STRIKEZONE_COLORS = [
  1.0, 0.0, 0.0, 0.5, 1.0, 0.0, 0.0, 0.5, 1.0, 0.0, 0.0, 0.5,

  1.0, 0.0, 0.0, 0.5, 1.0, 0.0, 0.0, 0.5, 1.0, 0.0, 0.0, 0.5,

  1.0, 0.0, 0.0, 0.5, 1.0, 0.0, 0.0, 0.5, 1.0, 0.0, 0.0, 0.5
];
const STRIKEZONE_COLORS_SIZE = 9;