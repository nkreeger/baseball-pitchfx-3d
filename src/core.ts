
export function create(elementId: string) {
  const element = document.getElementById(elementId) as HTMLCanvasElement;
  if (!element) {
    throw new Error('Could not find root element');
  }

  const rect = (element.parentNode as HTMLElement).getBoundingClientRect();
  element.width = rect.width;
  element.height = rect.height;

  return create3DContext(element);
}

export function createShaderProgram(
    gl: WebGLRenderingContext, vertexShaderSrc: string,
    fragmentShaderSrc: string) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSrc);
  const fragmentShader =
      createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSrc);

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    throw new Error('Could not init shaders!');
  }

  return shaderProgram;
}

export function degToRad(degrees: number): number {
  return degrees * Math.PI / 180;
}

function create3DContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D|
    WebGLRenderingContext {
  const names = ['webgl', 'experimental-webgl', 'webkit-3d', 'moz-webgl'];
  let context = null;
  for (let i = 0; i < names.length; i++) {
    try {
      context = canvas.getContext(names[i]);
    } catch (e) {
    }
    if (context) {
      break;
    }
  }
  return context;
}

export function createShader(
    gl: WebGLRenderingContext, type: number, shaderSrc: string): WebGLShader {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, shaderSrc);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw gl.getShaderInfoLog(shader);
  }
  return shader;
}

export function feetToMeters(feet: number): number {
  return feet * 0.3048;
}

export function convertFeetVal(value: number): number {
  return value * 0.3048;
}