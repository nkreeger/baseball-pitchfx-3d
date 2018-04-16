import {mat4} from 'gl-matrix';

import {createShaderProgram} from './core';
// tslint:disable-next-line:max-line-length
import {Base, HomePlate, Infield, Outfield, PitchingRubber, Polygon} from './objects';
import {FRAGMENT_SHADER_2D, VERTEX_SHADER_2D} from './shaders';

export class Field {
  shaderProgram: WebGLShader;

  vertexPositionAttr: number;
  vertexColorAttr: number;
  mvMatrix: mat4;

  pMatrixUniform: WebGLUniformLocation;
  mvMatrixUniform: WebGLUniformLocation;
  scaleUniform: WebGLUniformLocation;

  outfield: Outfield;
  infield: Infield;
  homePlate: HomePlate;
  base: Base;
  pitchingRubber: PitchingRubber;

  constructor(gl: WebGLRenderingContext) {
    this.shaderProgram =
        createShaderProgram(gl, VERTEX_SHADER_2D, FRAGMENT_SHADER_2D);

    this.vertexPositionAttr =
        gl.getAttribLocation(this.shaderProgram, 'aVertexPosition');
    this.vertexColorAttr =
        gl.getAttribLocation(this.shaderProgram, 'aVertexColor');

    this.mvMatrixUniform =
        gl.getUniformLocation(this.shaderProgram, 'uMVMatrix');
    this.pMatrixUniform = gl.getUniformLocation(this.shaderProgram, 'uPMatrix');
    this.scaleUniform = gl.getUniformLocation(this.shaderProgram, 'uScale');

    this.outfield = new Outfield(gl);
    this.infield = new Infield(gl);
    this.homePlate = new HomePlate(gl);
    this.base = new Base(gl);
    this.pitchingRubber = new PitchingRubber(gl);

    this.mvMatrix = mat4.create();
  }

  draw(gl: WebGLRenderingContext, pMatrix: mat4) {
    gl.useProgram(this.shaderProgram);

    gl.enableVertexAttribArray(this.vertexPositionAttr);
    gl.enableVertexAttribArray(this.vertexColorAttr);

    let x, y, z;

    // Outfield
    x = 0.0;
    y = this.outfield.getScaleSize() / 2;
    z = 0.0;
    this.setModelViewMatrix(x, y, z);
    this.drawPolygon(gl, this.outfield, pMatrix);

    // Infield
    x = 0.0;
    y = this.infield.getScaleSize();
    z = 0.0;
    this.setModelViewMatrix(x, y, z);
    this.drawPolygon(gl, this.infield, pMatrix);

    // Home Plate
    x = 0.0;
    y = this.homePlate.getHeight() / 2;
    z = 0.0;
    this.setModelViewMatrix(x, y, z);
    this.drawPolygon(gl, this.homePlate, pMatrix);

    // First Base
    x = this.infield.getScaleSize() - this.base.getScaleSize();
    y = this.infield.getScaleSize();
    z = 0.0;
    this.setModelViewMatrix(x, y, z);
    this.drawPolygon(gl, this.base, pMatrix);

    // Second Base
    x = 0.0;
    y = (this.infield.getScaleSize() * 2) - this.base.getScaleSize();
    z = 0.0;
    this.setModelViewMatrix(x, y, z);
    this.drawPolygon(gl, this.base, pMatrix);

    // Third Base
    x = -(this.infield.getScaleSize() - this.base.getScaleSize());
    y = this.infield.getScaleSize();
    z = 0.0;
    this.setModelViewMatrix(x, y, z);
    this.drawPolygon(gl, this.base, pMatrix);

    // Pitching rubber
    x = 0.0;
    y = 18.44 - this.pitchingRubber.getHeight() / 2;
    z = 0.0;
    this.setModelViewMatrix(x, y, z);
    this.drawPolygon(gl, this.pitchingRubber, pMatrix);

    gl.disableVertexAttribArray(this.vertexPositionAttr);
    gl.disableVertexAttribArray(this.vertexColorAttr);
  }

  private setModelViewMatrix(x: number, y: number, z: number) {
    this.mvMatrix = mat4.identity(this.mvMatrix);
    mat4.translate(this.mvMatrix, this.mvMatrix, [x, y, z]);
  }

  private drawPolygon(
      gl: WebGLRenderingContext, polygon: Polygon, pMatrix: mat4) {
    polygon.bindVerticesBuffer(gl);
    gl.vertexAttribPointer(
        this.vertexPositionAttr, polygon.getVerticesSize(), gl.FLOAT, false, 0,
        0);

    polygon.bindColorBuffer(gl);
    gl.vertexAttribPointer(
        this.vertexColorAttr, polygon.getColorSize(), gl.FLOAT, false, 0, 0);

    this.setUniforms(gl, pMatrix, this.mvMatrix, polygon.getScaleSize());
    gl.drawArrays(gl.TRIANGLES, 0, polygon.getVerticesCount());
  }

  private setUniforms(
      gl: WebGLRenderingContext, pMatrix: mat4, mvMatrix: mat4, scale: number) {
    gl.uniformMatrix4fv(this.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(this.mvMatrixUniform, false, mvMatrix);
    gl.uniform1f(this.scaleUniform, scale);
  }
}