import {mat4, vec3} from 'gl-matrix';

import {create, degToRad} from './core';
import {Field} from './field';
import {Pitch, PitchObj} from './pitch';

export class Matchup {
  gl: WebGLRenderingContext;

  pMatrix: mat4;
  cMatrix: mat4;

  ballImage: HTMLImageElement;

  field: Field;

  // tslint:disable-next-line:no-any
  data: any;
  pitches: Pitch[];

  pitchIndex: number;
  animate: boolean;

  loop: boolean;

  constructor() {
    this.pMatrix = mat4.create();
    this.cMatrix = mat4.create();

    this.pitches = [];
    this.pitchIndex = -1;

    this.animate = true;
    this.loop = true;
  }

  initialize(canvasId: string, baseballImageId: string, loop = true) {
    this.gl = create(canvasId) as WebGLRenderingContext;

    // Catchers perspective to start with.
    this.displayCatcher();

    this.field = new Field(this.gl);

    // Mild hack - make sure that baseball image is rendered in page somewhere.
    const image = document.getElementById(baseballImageId) as HTMLImageElement;
    this.ballImage = image;

    this.loop = loop;
  }

  // tslint:disable-next-line:no-any
  setData(data: any) {
    this.data = data;
    this.pitchIndex = 0;
    this.pitches = [];
    if (Array.isArray(data.pitch)) {
      data.pitch.forEach((pitch: PitchObj) => {
        this.pitches.push(new Pitch(this.gl, pitch, this.ballImage));
      });
    } else {
      this.pitches.push(new Pitch(this.gl, data.pitch, this.ballImage));
    }
  }

  restart() {
    this.animate = false;
    this.pitchIndex = 0;
    for (let i = 0; i < this.pitches.length; i++) {
      this.pitches[i].restart(this.pitches.length === 1);
    }
    this.animate = true;
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

  timeoutTick(ms: number) {
    setTimeout(() => {
      this.animate = true;
    }, ms);
    this.tick();
  }

  tick() {
    window.requestAnimationFrame(() => {
      this.tick();
    });

    if (this.animate) {
      if (this.pitchIndex < this.pitches.length) {
        // Display pitch at index.
        this.pitches[this.pitchIndex].animate();
        this.pitches[this.pitchIndex].showStrikeZone = true;

        if (this.pitches[this.pitchIndex].isDone) {
          this.pitches[this.pitchIndex].showStrikeZone = false;
          this.pitchIndex++;
          if (this.pitchIndex < this.pitches.length) {
            this.pitches[this.pitchIndex].showStrikeZone = true;
          } else if (this.pitchIndex === this.pitches.length) {
            if (this.loop) {
              this.restart();
            } else {
              this.pitches[this.pitchIndex - 1].showStrikeZone = true;
            }
          }
        }
      }
    }

    this.drawScene();
  }

  drawScene() {
    const gl = this.gl;
    this.gl.clearColor(0.25, 0.25, 0.25, 1.0);

    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.perspective(
        this.pMatrix, degToRad(45),
        gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 500.0);
    mat4.multiply(this.pMatrix, this.pMatrix, this.cMatrix);

    this.field.draw(gl, this.pMatrix);
    for (let i = 0; i < this.pitches.length; i++) {
      this.pitches[i].draw(gl, this.pMatrix);
    }
  }
}