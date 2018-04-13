export class Polygon {
  vertices: number[];
  colors: number[];
  vertexPositionBuffer: WebGLBuffer;
  vertexColorBuffer: WebGLBuffer;

  constructor(gl: WebGLRenderingContext) {
    this.vertices = [];
    this.colors = [];
    this.vertexPositionBuffer = gl.createBuffer();
    this.vertexColorBuffer = gl.createBuffer();
  }

  setBuffers(gl: WebGLRenderingContext) {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
    gl.bufferData(
        gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);
    gl.bufferData(
        gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW);
  }

  bindVerticesBuffer(gl: WebGLRenderingContext) {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
  }

  bindColorBuffer(gl: WebGLRenderingContext) {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);
  }

  getScaleSize() { return Math.sin(45 / 180 * Math.PI) * this.getHeight(); }

  getVerticesSize() { return 3; }

  getColorSize() { return 4; }

  getHeight() { return 0; }

  getVerticesCount() { return this.vertices.length / this.getVerticesSize(); }

  getColorCount() { return this.colors.length / this.getColorSize(); }
}

export class Diamond extends Polygon {
  constructor(gl: WebGLRenderingContext) {
    super(gl);

    this.vertices = [
      1.0, 0.0, 0.0, 0.0, 1.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, 0.0, -1.0,
      0.0, 1.0, 0.0, 0.0
    ];
  }
}

export class Infield extends Diamond {
  constructor(gl: WebGLRenderingContext) {
    super(gl);

    this.colors = [
      0.0, 0.5, 0.0, 1.0, 0.0, 0.7, 0.0, 1.0, 0.0, 0.5, 0.0, 1.0,
      0.0, 0.5, 0.0, 1.0, 0.0, 0.7, 0.0, 1.0, 0.0, 0.5, 0.0, 1.0
    ];

    this.setBuffers(gl);
  }

  getHeight() { return 27.5; }
}

export class Outfield extends Polygon {
  constructor(gl: WebGLRenderingContext) {
    super(gl);

    this.vertices = [
      0.0, -0.5, 0.0, -0.575, 0.075, 0.0, -0.347, 0.347, 0.0,
      0.0, -0.5, 0.0, -0.347, 0.347, 0.0, 0.0,    0.5,   0.0,
      0.0, -0.5, 0.0, 0.0,    0.5,   0.0, 0.347,  0.347, 0.0,
      0.0, -0.5, 0.0, 0.347,  0.347, 0.0, 0.575,  0.075, 0.0
    ];

    this.colors = [];
    for (let i = 0; i < this.getVerticesCount(); i++) {
      this.colors.push(0.0);
      this.colors.push(0.3);
      this.colors.push(0.0);
      this.colors.push(1.0);
    }

    this.setBuffers(gl);
  }

  getHeight() { return 121.92; }
}

export class Base extends Diamond {
  constructor(gl: WebGLRenderingContext) {
    super(gl);

    this.colors = [
      1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
      1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0
    ];

    this.setBuffers(gl);
  }

  getHeight() { return 0.38; }
}

export class HomePlate extends Polygon {
  constructor(gl: WebGLRenderingContext) {
    super(gl);

    this.vertices = [
      0.216,  0.216, 0.0, 0.216,  0.0, 0.0, -0.216, 0.216,  0.0,
      -0.216, 0.216, 0.0, -0.216, 0.0, 0.0, 0.216,  0.0,    0.0,
      0.216,  0.0,   0.0, -0.216, 0.0, 0.0, 0.0,    -0.216, 0.0
    ];

    this.colors = [];
    for (let i = 0; i < this.getVerticesCount(); i++) {
      this.colors.push(1.0);
      this.colors.push(1.0);
      this.colors.push(1.0);
      this.colors.push(1.0);
    }

    this.setBuffers(gl);
  }

  getHeight() { return 0.432; }

  getScaleSize() { return 1.0; }
}

export class PitchingRubber extends Polygon {
  constructor(gl: WebGLRenderingContext) {
    super(gl);

    this.vertices = [
      -0.305, 0.076, 0.0, 0.305, 0.076, 0.0, -0.305, -0.076, 0.0, -0.305,
      -0.076, 0.0, 0.305, 0.076, 0.0, 0.305, -0.076, 0.0
    ];

    this.colors = [];
    for (let i = 0; i < this.getVerticesCount(); i++) {
      this.colors.push(1.0);
      this.colors.push(1.0);
      this.colors.push(1.0);
      this.colors.push(1.0);
    }

    this.setBuffers(gl);
  }

  getHeight() { return 0.152; }

  getScaleSize() { return 1.0; }
}

export class StrikeZone extends Polygon {
  constructor(gl: WebGLRenderingContext, bottom: number, top: number) {
    super(gl);

    const x = 0.216;
    const y = 0.432;

    this.vertices = [
      -x, y, top, x, y, top, -x, y, bottom, -x, y, bottom, x, y, bottom, x, y,
      top
    ];

    this.colors = [];
    for (let i = 0; i < this.getVerticesCount(); i++) {
      this.colors.push(1.0);
      this.colors.push(1.0);
      this.colors.push(1.0);
      this.colors.push(0.25);
    }

    this.setBuffers(gl);
  }

  getScaleSize() { return 1.0; }
}

export class Baseball {
  indexDataSize: number;
  vertexPositionBuffer: WebGLBuffer;
  vertexNormalBuffer: WebGLBuffer;
  vertexTextureCoordBuffer: WebGLBuffer;
  vertexIndexBuffer: WebGLBuffer;

  constructor(gl: WebGLRenderingContext) {
    const LATITUDE_BANDS = 30;
    const LONGITUDE_BANDS = 30;

    // 1.43 in
    const RADIUS = 0.0363;

    const vertexPositionData = [];
    const normalData = [];
    const textureCoordData = [];

    // const NORMAL_DATA_SIZE = 3;
    // const TEXTURE_COORD_DATA_SIZE = 2;
    // const VERTEX_POSITION_DATA_SIZE = 3;
    // const INDEX_DATA_SIZE = 1;

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

        normalData.push(x);
        normalData.push(y);
        normalData.push(z);

        textureCoordData.push(u);
        textureCoordData.push(v);

        vertexPositionData.push(RADIUS * x);
        vertexPositionData.push(RADIUS * y);
        vertexPositionData.push(RADIUS * z);
      }
    }

    const indexData = [];
    for (let latNum = 0; latNum < LATITUDE_BANDS; latNum++) {
      for (let longNum = 0; longNum < LONGITUDE_BANDS; longNum++) {
        const first = (latNum * (LONGITUDE_BANDS + 1)) + longNum;
        const second = first + LONGITUDE_BANDS + 1;

        indexData.push(first);
        indexData.push(second);
        indexData.push(first + 1);

        indexData.push(second);
        indexData.push(second + 1);
        indexData.push(first + 1);
      }
    }

    this.indexDataSize = indexData.length;

    // Create and set buffers.
    this.vertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
    gl.bufferData(
        gl.ARRAY_BUFFER, new Float32Array(vertexPositionData), gl.STATIC_DRAW);

    this.vertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer);
    gl.bufferData(
        gl.ARRAY_BUFFER, new Float32Array(normalData), gl.STATIC_DRAW);

    this.vertexTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTextureCoordBuffer);
    gl.bufferData(
        gl.ARRAY_BUFFER, new Float32Array(textureCoordData), gl.STATIC_DRAW);

    this.vertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
    gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STATIC_DRAW);
  }

  bindVertexNormalBuffer(gl: WebGLRenderingContext) {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer);
  }

  bindVertexTextureCoordBuffer(gl: WebGLRenderingContext) {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTextureCoordBuffer);
  }

  bindVertexPositionBuffer(gl: WebGLRenderingContext) {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
  }

  bindVertexIndexBuffer(gl: WebGLRenderingContext) {
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
  }

  getVertexPositionSize() { return 3; }

  getTextureCoordDataSize() { return 2; }

  getNormalDataSize() { return 3; }

  getIndexDataSize() { return this.indexDataSize; }
}
