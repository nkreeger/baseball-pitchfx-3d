import {mat4} from 'gl-matrix';

import {createShaderProgram} from './webgl-core';

export class Field {
  mvMatrix: mat4;
  mvMatrix2: mat4;

  shaderProgram: WebGLShader;

  fieldVertexPositionBuffer: WebGLBuffer;
  fieldVertexColorBuffer: WebGLBuffer;
  infieldVertexPositionBuffer: WebGLBuffer;
  infieldVertexColorBuffer: WebGLBuffer;

  vertexPositionAttribute: number;
  vertexColorAttribute: number;

  pMatrixUniform: WebGLUniformLocation;
  mvMatrixUniform: WebGLUniformLocation;
  scaleUniform: WebGLUniformLocation;

  constructor(gl: WebGLRenderingContext) {
    this.mvMatrix = mat4.create();
    mat4.translate(
        this.mvMatrix, this.mvMatrix, [0.0, 0.0, -INFIELD_SCALE_SIZE]);

    this.mvMatrix2 = mat4.create();
    mat4.translate(
        this.mvMatrix2, this.mvMatrix2, [0.0, 0.1, -INFIELD_SCALE_SIZE]);

    this.initShaders(gl);
    this.initBuffers(gl);
  }

  draw(gl: WebGLRenderingContext, pMatrix: mat4) {
    gl.useProgram(this.shaderProgram);

    // Draw Field first.
    gl.bindBuffer(gl.ARRAY_BUFFER, this.fieldVertexPositionBuffer);
    gl.vertexAttribPointer(
        this.vertexPositionAttribute, FIELD_VERTICES_SIZE, gl.FLOAT, false, 0,
        0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.fieldVertexColorBuffer);
    gl.vertexAttribPointer(
        this.vertexColorAttribute, FIELD_COLORS_SIZE, gl.FLOAT, false, 0, 0);

    gl.uniform1f(this.scaleUniform, FIELD_SCALE_SIZE);
    gl.uniformMatrix4fv(this.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(this.mvMatrixUniform, false, this.mvMatrix);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, FIELD_VERTICES_ITEMS);

    // Draw infield after.
    gl.uniform1f(this.scaleUniform, INFIELD_SCALE_SIZE);
    gl.uniformMatrix4fv(this.mvMatrixUniform, false, this.mvMatrix2);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.infieldVertexPositionBuffer);
    gl.vertexAttribPointer(
        this.vertexPositionAttribute, INFIELD_VERTICES_SIZE, gl.FLOAT, false, 0,
        0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.infieldVertexColorBuffer);
    gl.vertexAttribPointer(
        this.vertexColorAttribute, INFIELD_COLORS_SIZE, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, INFIELD_VERTICES_ITEMS);
  }

  private initShaders(gl: WebGLRenderingContext) {
    this.shaderProgram = createShaderProgram(
        gl, FIELD_FRAGMENT_SHADER_SRC, FIELD_VERTEX_SHADER_SRC);

    this.vertexPositionAttribute =
        gl.getAttribLocation(this.shaderProgram, 'aVertexPosition');
    gl.enableVertexAttribArray(this.vertexPositionAttribute);

    this.vertexColorAttribute =
        gl.getAttribLocation(this.shaderProgram, 'aVertexColor');
    gl.enableVertexAttribArray(this.vertexColorAttribute);

    this.pMatrixUniform = gl.getUniformLocation(this.shaderProgram, 'uPMatrix');
    this.mvMatrixUniform =
        gl.getUniformLocation(this.shaderProgram, 'uMVMatrix');
    this.scaleUniform = gl.getUniformLocation(this.shaderProgram, 'uScale');
  }

  private initBuffers(gl: WebGLRenderingContext) {
    this.fieldVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.fieldVertexPositionBuffer);
    gl.bufferData(
        gl.ARRAY_BUFFER, new Float32Array(FIELD_VERTICES), gl.STATIC_DRAW);

    this.fieldVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.fieldVertexColorBuffer);
    gl.bufferData(
        gl.ARRAY_BUFFER, new Float32Array(FIELD_COLORS), gl.STATIC_DRAW);

    this.infieldVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.infieldVertexPositionBuffer);
    gl.bufferData(
        gl.ARRAY_BUFFER, new Float32Array(INFIELD_VERTICES), gl.STATIC_DRAW);

    this.infieldVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.infieldVertexColorBuffer);
    gl.bufferData(
        gl.ARRAY_BUFFER, new Float32Array(INFIELD_COLORS), gl.STATIC_DRAW);
  }
}

// Field Shader sources:
const FIELD_VERTEX_SHADER_SRC = 'attribute vec3 aVertexPosition;' +
    'attribute vec4 aVertexColor;' +

    'uniform mat4 uMVMatrix;' +
    'uniform mat4 uPMatrix;' +
    'uniform float uScale;' +

    'varying vec4 vColor;' +

    'void main(void) {' +
    // tslint:disable-next-line:max-line-length
    'gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition * uScale, 1.0);' +
    'vColor = aVertexColor;' +
    '}';

const FIELD_FRAGMENT_SHADER_SRC = 'precision mediump float;' +

    'varying vec4 vColor;' +

    'void main(void) {' +
    'gl_FragColor = vColor;' +
    '}';

// Field drawing logic:
const FIELD_VERTICES =
    [1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0, -1.0, -1.0, 0.0, -1.0];
const FIELD_VERTICES_SIZE = 3;
const FIELD_VERTICES_ITEMS = 4;

const FIELD_COLORS = [
  0.0, 0.2, 0.0, 1.0, 0.0, 0.5, 0.0, 1.0, 0.0, 0.2, 0.0, 1.0, 0.0, 0.2, 0.0, 1.0
];
const FIELD_COLORS_SIZE = 4;
const FIELD_COLORS_ITEMS = 4;

const INFIELD_VERTICES =
    [1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, -1.0, -1.0, 0.0, 0.0];
const INFIELD_VERTICES_SIZE = 3;
const INFIELD_VERTICES_ITEMS = 4;

const INFIELD_COLORS = [
  0.0, 0.5, 0.0, 1.0, 0.0, 0.7, 0.0, 1.0, 0.0, 0.5, 0.0, 1.0, 0.0, 0.5, 0.0, 1.0
];
const INFIELD_COLORS_SIZE = 4;
const INFIELD_COLORS_ITEMS = 4;

// 27.432m == 90ft.
const INFIELD_SCALE_SIZE = 27.432;

// 121.92m == 400ft.
const FIELD_SCALE_SIZE = 121.92;
