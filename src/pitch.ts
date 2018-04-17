import {mat3, mat4, vec3} from 'gl-matrix';

import {convertFeetVal, createShaderProgram, degToRad} from './core';
import {Baseball, StrikeZone} from './objects';
// tslint:disable-next-line:max-line-length
import {FRAGMENT_LIGHTING_TEXTURE_SHADER_3D, VERTEX_LIGHTING_SHADER_3D} from './shaders';

// TODO(kreeger): define this somewhere else.
export class PitchObj {
  [key: string]: string
}

export class Pitch {
  ballTexture: WebGLTexture;

  shaderProgram: WebGLShader;

  vertexPositionAttr: number;
  vertexNormalAttr: number;
  textureCoordAttr: number;
  vertexColorAttr: number;

  pMatrixUniform: WebGLUniformLocation;
  mvMatrixUniform: WebGLUniformLocation;
  nMatrixUniform: WebGLUniformLocation;
  samplerUniform: WebGLUniformLocation;
  ambientColorUniform: WebGLUniformLocation;
  lightingDirectionUniform: WebGLUniformLocation;
  directionalColorUniform: WebGLUniformLocation;
  colorOptionUniform: WebGLUniformLocation;

  mvMatrix: mat4;
  rotationMatrix: mat4;

  baseball: Baseball;

  ballX: number;
  ballY: number;
  ballZ: number;

  ballDegRot: number;

  elapsedTime: number;
  pitchTime: number;
  lastTime: number;

  pitch: PitchObj;

  vx0: number;
  vy0: number;
  vz0: number;
  ax: number;
  ay: number;
  az: number;
  x0: number;
  y0: number;
  z0: number;

  showStrikeZone: boolean;
  isDone: boolean;
  pathDone: boolean;

  strikeZone: StrikeZone;

  constructor(
      gl: WebGLRenderingContext, pitch: PitchObj, texture: HTMLImageElement) {
    this.shaderProgram = createShaderProgram(
        gl, VERTEX_LIGHTING_SHADER_3D, FRAGMENT_LIGHTING_TEXTURE_SHADER_3D);

    this.vertexPositionAttr =
        gl.getAttribLocation(this.shaderProgram, 'aVertexPosition');
    this.vertexNormalAttr =
        gl.getAttribLocation(this.shaderProgram, 'aVertexNormal');
    this.textureCoordAttr =
        gl.getAttribLocation(this.shaderProgram, 'aTextureCoord');
    this.vertexColorAttr =
        gl.getAttribLocation(this.shaderProgram, 'aVertexColor');

    this.pMatrixUniform = gl.getUniformLocation(this.shaderProgram, 'uPMatrix');
    this.mvMatrixUniform =
        gl.getUniformLocation(this.shaderProgram, 'uMVMatrix');
    this.nMatrixUniform = gl.getUniformLocation(this.shaderProgram, 'uNMatrix');
    this.samplerUniform = gl.getUniformLocation(this.shaderProgram, 'uSampler');
    this.ambientColorUniform =
        gl.getUniformLocation(this.shaderProgram, 'uAmbientColor');
    this.lightingDirectionUniform =
        gl.getUniformLocation(this.shaderProgram, 'uLightingDirection');
    this.directionalColorUniform =
        gl.getUniformLocation(this.shaderProgram, 'uDirectionalColor');
    this.colorOptionUniform =
        gl.getUniformLocation(this.shaderProgram, 'uColorOption');

    this.ballTexture = gl.createTexture();

    this.mvMatrix = mat4.create();
    this.rotationMatrix = mat4.create();
    mat4.identity(this.rotationMatrix);

    this.baseball = new Baseball(gl);

    this.ballX = 0.0;
    this.ballY = 0.0;
    this.ballZ = 0.0;

    this.ballDegRot = 25;

    this.elapsedTime = 0;
    this.pitchTime = 0;
    this.lastTime = 0;

    this.pitch = pitch;

    this.vx0 = convertFeetVal(this.pitch['vx0']);
    this.vy0 = convertFeetVal(this.pitch['vy0']);
    this.vz0 = convertFeetVal(this.pitch['vz0']);
    this.ax = convertFeetVal(this.pitch['ax']);
    this.ay = convertFeetVal(this.pitch['ay']);
    this.az = convertFeetVal(this.pitch['az']);
    this.x0 = convertFeetVal(this.pitch['x0']);
    this.y0 = convertFeetVal(this.pitch['y0']);
    this.z0 = convertFeetVal(this.pitch['z0']);

    this.ballX = this.x0;
    this.ballY = this.y0;
    this.ballZ = this.z0;

    // Calculate total pitch time
    // 1.417 = distance from y=0 to front of home plate in feet.
    const endSpeed = -Math.sqrt(
        Math.pow(this.vy0, 2) + 2 * this.ay * (1.417 * 0.3048 - this.y0));
    this.pitchTime = (endSpeed - this.vy0) / this.ay;

    this.showStrikeZone = false;
    this.isDone = false;
    this.pathDone = false;

    this.strikeZone = new StrikeZone(
        gl, convertFeetVal(this.pitch['sz_bot']),
        convertFeetVal(this.pitch['sz_top']));
    this.setTexture(gl, texture);
  }

  setTexture(gl: WebGLRenderingContext, image: HTMLImageElement) {
    gl.bindTexture(gl.TEXTURE_2D, this.ballTexture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(
        gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);

    gl.bindTexture(gl.TEXTURE_2D, null);
  }

  restart(showStrikeZone: boolean) {
    this.ballX = this.x0;
    this.ballY = this.y0;
    this.ballZ = this.z0;

    this.isDone = false;
    this.pathDone = false;
    this.showStrikeZone = showStrikeZone;

    this.elapsedTime = 0;
    this.lastTime = 0;
  }

  animate() {
    let setLastTime = true;
    const timeNow = new Date().getTime();
    if (this.lastTime !== 0) {
      const elapsedMS = timeNow - this.lastTime;
      this.elapsedTime += elapsedMS / 1000;

      if (this.elapsedTime > this.pitchTime) {
        this.elapsedTime = this.pitchTime;
        setLastTime = false;
        this.pathDone = true;
      }

      this.ballX = this.x0 + this.vx0 * this.elapsedTime +
          0.5 * this.ax * Math.pow(this.elapsedTime, 2);
      this.ballY = this.y0 + this.vy0 * this.elapsedTime +
          0.5 * this.ay * Math.pow(this.elapsedTime, 2);
      this.ballZ = this.z0 + this.vz0 * this.elapsedTime +
          0.5 * this.az * Math.pow(this.elapsedTime, 2);

      if (elapsedMS > 1000 + this.pitchTime) {
        setLastTime = true;
        this.isDone = true;
      }
    }

    if (setLastTime) {
      this.lastTime = timeNow;

      // TODO - do this off of pitch values!
      const axis = vec3.fromValues(1, 2, 1);
      const radians = degToRad(this.ballDegRot);
      mat4.rotate(this.rotationMatrix, this.rotationMatrix, radians, axis);
    }
  }

  draw(gl: WebGLRenderingContext, pMatrix: mat4) {
    gl.useProgram(this.shaderProgram);
    gl.enable(gl.DEPTH_TEST);

    // TODO - unbind texture?
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.ballTexture);
    gl.uniform1i(this.samplerUniform, 0);

    gl.enableVertexAttribArray(this.vertexPositionAttr);

    // Lighting
    const lightingDirection = vec3.fromValues(0.5, 0.5, -0.5);
    const adjustedLD = vec3.create();
    vec3.normalize(adjustedLD, lightingDirection);
    vec3.scale(adjustedLD, adjustedLD, -1);

    gl.uniform3fv(this.lightingDirectionUniform, adjustedLD);
    gl.uniform3f(this.directionalColorUniform, 0.8, 0.8, 0.8);

    if (this.pathDone) {
      const color = 0.5;
      if (this.pitch.type === 'B') {
        gl.uniform3f(this.ambientColorUniform, 0.0, 0.0, color);
      } else if (this.pitch.type === 'S') {
        gl.uniform3f(this.ambientColorUniform, color, 0.0, 0.0);
      } else if (this.pitch.type === 'X') {
        gl.uniform3f(this.ambientColorUniform, 0.0, color, 0.0);
      } else {
        console.log('this.pitch.type is not handled: ', this.pitch.type);
      }
    } else {
      gl.uniform3f(this.ambientColorUniform, 0.2, 0.2, 0.2);
    }

    // StrikeZone
    if (this.showStrikeZone) {
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
      gl.enable(gl.BLEND);
      gl.disable(gl.DEPTH_TEST);
      gl.enableVertexAttribArray(this.vertexColorAttr);
      gl.uniform1f(this.colorOptionUniform, 0.0);

      mat4.identity(this.mvMatrix);
      this.strikeZone.bindVerticesBuffer(gl);
      gl.vertexAttribPointer(
          this.vertexPositionAttr, this.strikeZone.getVerticesSize(), gl.FLOAT,
          false, 0, 0);

      this.strikeZone.bindColorBuffer(gl);
      gl.vertexAttribPointer(
          this.vertexColorAttr, this.strikeZone.getColorSize(), gl.FLOAT, false,
          0, 0);

      gl.uniformMatrix4fv(this.pMatrixUniform, false, pMatrix);
      gl.uniformMatrix4fv(this.mvMatrixUniform, false, this.mvMatrix);
      gl.drawArrays(gl.TRIANGLES, 0, this.strikeZone.getVerticesCount());

      gl.disable(gl.BLEND);
      gl.enable(gl.DEPTH_TEST);
    }

    // Ball
    gl.disableVertexAttribArray(this.vertexColorAttr);
    gl.enableVertexAttribArray(this.textureCoordAttr);
    gl.enableVertexAttribArray(this.vertexNormalAttr);
    gl.uniform1f(this.colorOptionUniform, 1.0);

    mat4.identity(this.mvMatrix);
    const ballMove = vec3.fromValues(this.ballX, this.ballY, this.ballZ);
    mat4.translate(this.mvMatrix, this.mvMatrix, ballMove);
    if (!this.pathDone) {
      mat4.multiply(this.mvMatrix, this.mvMatrix, this.rotationMatrix);
    }

    this.baseball.bindVertexPositionBuffer(gl);
    gl.vertexAttribPointer(
        this.vertexPositionAttr, this.baseball.getVertexPositionSize(),
        gl.FLOAT, false, 0, 0);

    this.baseball.bindVertexTextureCoordBuffer(gl);
    gl.vertexAttribPointer(
        this.textureCoordAttr, this.baseball.getTextureCoordDataSize(),
        gl.FLOAT, false, 0, 0);

    this.baseball.bindVertexNormalBuffer(gl);
    gl.vertexAttribPointer(
        this.vertexNormalAttr, this.baseball.getNormalDataSize(), gl.FLOAT,
        false, 0, 0);

    this.baseball.bindVertexIndexBuffer(gl);

    gl.uniformMatrix4fv(this.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(this.mvMatrixUniform, false, this.mvMatrix);

    const normalMatrix = mat3.create();
    mat3.invert(normalMatrix, mat3.fromMat4(mat3.create(), this.mvMatrix));
    mat3.transpose(normalMatrix, normalMatrix);

    gl.uniformMatrix3fv(this.nMatrixUniform, false, normalMatrix);

    gl.drawElements(
        gl.TRIANGLES, this.baseball.getIndexDataSize(), gl.UNSIGNED_SHORT, 0);

    gl.disable(gl.DEPTH_TEST);
    gl.disableVertexAttribArray(this.vertexPositionAttr);
    gl.disableVertexAttribArray(this.textureCoordAttr);
    gl.disableVertexAttribArray(this.vertexNormalAttr);
  }
}
