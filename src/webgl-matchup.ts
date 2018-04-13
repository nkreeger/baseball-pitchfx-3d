
export class AtBat {
  // gl: WebGLRenderingContext;

  // pitch: Pitch;
  // field: Field;
  // strikezone: StrikeZone;

  // pMatrix: mat4;
  // cMatrix: mat4;

  // constructor() {
  //   this.gl = create('webgl-canvas') as WebGLRenderingContext;

  //   this.pitch = new Pitch(this.gl);
  //   this.field = new Field(this.gl);
  //   this.strikezone = new StrikeZone(this.gl);

  //   const ballImage = new Image();
  //   ballImage.onload = () => {
  //     this.pitch.setTexture(this.gl, ballImage);

  //     this.gl.clearColor(0.25, 0.25, 0.25, 1.0);
  //     this.gl.enable(this.gl.DEPTH_TEST);

  //     this.pMatrix = mat4.create();
  //     this.cMatrix = mat4.create();

  //     // 6ft == 1.8288m
  //     mat4.identity(this.cMatrix);
  //     mat4.translate(this.cMatrix, this.cMatrix, [0.0, -1.8288, -4.0]);

  //     this.tick();
  //   };
  //   ballImage.src = '/images/baseball2.png';
  // }

  // tick() {
  //   // requestAnimFrame(() => { this.tick(); });
  //   this.drawScene();
  //   this.animate();
  // }

  // drawScene() {
  //   const gl = this.gl;

  //   // TODO(kreeger): Fix this:
  //   // gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  //   // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  //   // mat4.perspective(
  //   //     this.pMatrix, 45, gl.viewportWidth / gl.viewportHeight, 0.1,
  //   500.0);

  //   mat4.multiply(this.pMatrix, this.pMatrix, this.cMatrix);

  //   // this.field.draw(gl, this.pMatrix);
  //   this.strikezone.draw(gl, this.pMatrix);
  //   // this.pitch.draw(gl, this.pMatrix);
  // }

  // animate() { this.pitch.animate(); }
}
