import {Pitch} from 'baseball-pitchfx-types';
import {mat4, vec3} from 'gl-matrix';

import {create, degToRad} from './core';
import {Field} from './field';
import {PitchDisplay} from './pitch_display';

export class Matchup {
  gl: WebGLRenderingContext;

  pMatrix: mat4;
  cMatrix: mat4;

  ballImage: HTMLImageElement;

  field: Field;

  pitcheDisplays: PitchDisplay[];

  pitchIndex: number;
  animate: boolean;
  tickStarted = false;

  loop: boolean;

  renderClear: boolean;
  clearRed = 0.75;
  clearGreen = 0.75;
  clearBlue = 0.75;

  constructor() {
    this.pMatrix = mat4.create();
    this.cMatrix = mat4.create();

    this.pitchIndex = -1;

    this.animate = true;
    this.loop = true;
  }

  initialize(
      canvasId: string, baseballImageId: string, renderClear = false,
      loop = true) {
    this.gl = create(canvasId) as WebGLRenderingContext;

    // Catchers perspective to start with.
    this.displayCatcher();

    this.field = new Field(this.gl);

    // Mild hack - make sure that baseball image is rendered in page somewhere.
    const image = document.getElementById(baseballImageId) as HTMLImageElement;
    this.ballImage = image;

    this.loop = loop;
    this.renderClear = renderClear;
  }

  setPitches(pitches: Pitch[]) {
    this.pitchIndex = 0;
    this.pitcheDisplays = [];

    pitches.forEach((pitch) => {
      this.pitcheDisplays.push(
          new PitchDisplay(this.gl, pitch, this.ballImage));
    });
  }

  setClearColor(red: number, green: number, blue: number) {
    this.clearRed = red;
    this.clearGreen = green;
    this.clearBlue = blue;
  }

  //
  // TODO -- need another method here.
  //

  restart() {
    this.restartTimeout();
  }

  restartTimeout(ms?: number) {
    this.animate = false;
    this.pitchIndex = 0;
    for (let i = 0; i < this.pitcheDisplays.length; i++) {
      this.pitcheDisplays[i].restart(this.pitcheDisplays.length === 1);
    }

    if (ms === undefined) {
      this.animate = true;
    } else {
      setTimeout(() => {
        this.animate = true;
      }, ms);
    }

    if (!this.tickStarted) {
      this.tickStarted = true;
      this.tick();
    }
  }

  setDrawOutfield(draw: boolean) {
    this.field.setDrawOutfield(draw);
  }

  displayCatcher(height = -0.6, yAxis = -1.5, camRotate = -82) {
    mat4.identity(this.cMatrix);
    mat4.translate(this.cMatrix, this.cMatrix, [0.0, height, yAxis]);
    const axis = vec3.fromValues(1, 0, 0);
    const radians = degToRad(camRotate);
    mat4.rotate(this.cMatrix, this.cMatrix, radians, axis);
  }

  displayPitcher() {
    mat4.identity(this.cMatrix);
    mat4.translate(this.cMatrix, this.cMatrix, [0.0, -1.0, -21.0]);

    const axis = vec3.fromValues(0, 1, 1);
    const radians = degToRad(180);
    mat4.rotate(this.cMatrix, this.cMatrix, radians, axis);
  }

  displayBirdsEye() {
    mat4.identity(this.cMatrix);
    mat4.translate(this.cMatrix, this.cMatrix, [0.0, -7.4, -18.0]);

    // Adjust angle to look a little better
    const axis = vec3.fromValues(1, 0, 0);
    const radians = degToRad(-20);
    mat4.rotate(this.cMatrix, this.cMatrix, radians, axis);
  }

  private tick() {
    window.requestAnimationFrame(() => {
      this.tick();
    });

    if (this.animate) {
      if (this.pitchIndex < this.pitcheDisplays.length) {
        // Display pitch at index.
        this.pitcheDisplays[this.pitchIndex].animate();
        this.pitcheDisplays[this.pitchIndex].showStrikeZone = true;

        if (this.pitcheDisplays[this.pitchIndex].isDone) {
          this.pitcheDisplays[this.pitchIndex].showStrikeZone = false;
          this.pitchIndex++;
          if (this.pitchIndex < this.pitcheDisplays.length) {
            this.pitcheDisplays[this.pitchIndex].showStrikeZone = true;
          } else if (this.pitchIndex === this.pitcheDisplays.length) {
            if (this.loop) {
              this.restart();
            } else {
              this.pitcheDisplays[this.pitchIndex - 1].showStrikeZone = true;
            }
          }
        }
      }
    }

    this.drawScene();
  }

  drawScene() {
    const gl = this.gl;

    if (this.renderClear) {
      gl.clearColor(this.clearRed, this.clearGreen, this.clearBlue, 1.0);
    }
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.perspective(
        this.pMatrix, degToRad(45),
        gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 500.0);
    mat4.multiply(this.pMatrix, this.pMatrix, this.cMatrix);

    this.field.draw(gl, this.pMatrix);
    for (let i = 0; i < this.pitcheDisplays.length; i++) {
      this.pitcheDisplays[i].draw(gl, this.pMatrix);
    }
  }
}