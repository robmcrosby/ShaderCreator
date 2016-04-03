
export default class GLContext {
  constructor() {
    this.canvas = null;
    this.context = null;
  }

  load(canvas) {
    try {
      // Try to grab the standard context. If it fails, fallback to experimental.
      this.context = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    }
    catch(e) {}

    // If we don't have a GL context, give up now
    if (!this.context) {
      console.error("Unable to initialize WebGL. Your browser may not support it.");
      this.context = null;
      this.canvas = null;
      return false;
    }

    this.canvas = canvas;
    return true;
  }

  unload() {
    this.context = null;
    this.canvas = null;
  }

  loaded() {return this.canvas !== null && this.context !== null;}

  static createModel() {
    return {shader: null, vertexBuffers: {}};
  }


  setShader(model, vertexSrc, fragmentSrc) {
    model.shader = this.loadShader(vertexSrc, fragmentSrc);
  }

  loadShader(vertexSrc, fragmentSrc) {
    var gl = this.context;
    if (gl) {
      var vertex = this.compileShader(vertexSrc, gl.VERTEX_SHADER);
      var fragment = this.compileShader(fragmentSrc, gl.FRAGMENT_SHADER);

      var shader = gl.createProgram();
      gl.attachShader(shader, vertex);
      gl.attachShader(shader, fragment);
      gl.linkProgram(shader);

      if (gl.getProgramParameter(shader, gl.LINK_STATUS))
        return {shaderId: shader};
    }
    console.error("Could not initialise shader");
    return null;
  }

  compileShader(src, type) {
    var gl = this.context;
    var shader = null;

    if (gl) {
      shader = gl.createShader(type);
      gl.shaderSource(shader, src);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log(gl.getShaderInfoLog(shader));
        shader = null;
      }
    }
    return shader;
  }



  unloadShader(shader) {

  }


  setVertexBuffer(model, name, data, components) {
    model.vertexBuffers[name] = this.loadVertexBuffer(data, components);
  }

  loadVertexBuffer(data, components) {
    var gl = this.context;
    if (gl) {
      var buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
      return {bufferId: buffer, compoents: components, size: data.length/components};
    }
    return null;
  }

  unloadVertexBuffer(buffer) {

  }


  clear(color) {
    var canvas = this.canvas;
    var gl = this.context;

    if (canvas && gl) {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.enable(gl.DEPTH_TEST);

      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
  }

  draw(model) {
    var gl = this.context;
    if (gl && model && model.shader) {
      const shader = model.shader;
      gl.useProgram(shader.shaderId);

      var count = 0;
      for (name in model.vertexBuffers) {
        const buffer = model.vertexBuffers[name];
        var index = gl.getAttribLocation(shader.shaderId, name);

        // Get -1 if the input is not defined in the shader
        if (buffer && index >= 0) {
          gl.enableVertexAttribArray(index);
          gl.bindBuffer(gl.ARRAY_BUFFER, buffer.bufferId);
          gl.vertexAttribPointer(index, buffer.compoents, gl.FLOAT, gl.FALSE, 0, 0);
          count = Math.max(count, buffer.size);
        }
      }

      gl.drawArrays(gl.TRIANGLES, 0, count);
    }
  }
}
