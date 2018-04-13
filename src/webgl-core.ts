
export function create(elementId: string) {
  const element = document.getElementById(elementId) as HTMLCanvasElement;
  if (!element) {
    throw new Error('Could not find root element');
  }

  const rect = (element.parentNode as HTMLElement).getBoundingClientRect();
  element.width = rect.width;
  element.height = rect.width * 0.75;

  const gl = create3DContext(element);

  // TODO(kreeger)
  //   gl.viewportWidth = element.width;
  //   gl.viewportHeight = element.width;

  return gl;
}

export function createShaderProgramFromScripts(
    gl: WebGLRenderingContext, shaderScriptIds: string[]): WebGLProgram {
  const shaders = [];
  for (let i = 0; i < shaderScriptIds.length; i++) {
    shaders.push(createShaderFromScript(gl, shaderScriptIds[i]));
  }

  const shaderProgram = gl.createProgram();
  for (let i = 0; i < shaders.length; i++) {
    gl.attachShader(shaderProgram, shaders[i]);
  }

  gl.linkProgram(shaderProgram);
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    throw new Error('Could not init shaders!');
  }

  return shaderProgram;
}

export function createShaderProgram(
    gl: WebGLRenderingContext, fragmentShaderSrc: string,
    vertexShaderSrc: string) {
  const fragmentShader =
      createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSrc);
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSrc);

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, fragmentShader);
  gl.attachShader(shaderProgram, vertexShader);
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

export function createShaderFromScript(
    gl: WebGLRenderingContext, scriptId: string): WebGLShader {
  let shaderSource = '';
  let shaderType;
  const shaderScript = document.getElementById(scriptId) as HTMLScriptElement;
  if (!shaderScript) {
    throw new Error('*** Error: unknown script element' + scriptId);
  }
  shaderSource = shaderScript.text;

  if (shaderScript.type === 'x-shader/x-vertex') {
    shaderType = gl.VERTEX_SHADER;
  } else if (shaderScript.type === 'x-shader/x-fragment') {
    shaderType = gl.FRAGMENT_SHADER;
  } else if (
      shaderType !== gl.VERTEX_SHADER && shaderType !== gl.FRAGMENT_SHADER) {
    throw new Error('*** Error: unknown shader type');
  }

  return createShader(gl, shaderType, shaderSource);
}

export function feetToMeters(feet: number): number {
  return feet * 0.3048;
}

export function convertFeetVal(strVal: string): number {
  return parseFloat(strVal) * 0.3048;
}