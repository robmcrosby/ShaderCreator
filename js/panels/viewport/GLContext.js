
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
    return {shader: null, vertexBuffers: {}, uniforms: {}};
  }

  setUniform(model, name, data, components) {
    model.uniforms[name] = {data: data, components: components};
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
        this.applyVertexBuffer(shader, name, buffer);
        if (buffer)
          count = Math.max(count, buffer.size);
      }

      for (name in model.uniforms) {
        const uniform = model.uniforms[name];
        this.applyUniform(shader, name, uniform);
      }

      gl.drawArrays(gl.TRIANGLES, 0, count);
    }
  }

  applyVertexBuffer(shader, name, buffer) {
    var gl = this.context;
    if (gl && shader && buffer) {
      var index = gl.getAttribLocation(shader.shaderId, name);

      // Get -1 if the input is not defined in the shader
      if (buffer && index >= 0) {
        gl.enableVertexAttribArray(index);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer.bufferId);
        gl.vertexAttribPointer(index, buffer.compoents, gl.FLOAT, gl.FALSE, 0, 0);
      }
    }
  }

  applyUniform(shader, name, uniform) {
    if (uniform) {
      if (Array.isArray(uniform.data))
        this.uploadUniform(shader, name, uniform.data, uniform.components);
    }
  }

  uploadUniform(shader, name, data, components) {
    var gl = this.context;
    if (gl) {
      var loc = gl.getUniformLocation(shader.shaderId, name);

      // loc is null if it is not in the shader.
      if (loc) {
        switch (components) {
          case 1:
            gl.uniform1fv(loc, new Float32Array(data), data.length/components);
            break;
          case 2:
            gl.uniform2fv(loc, new Float32Array(data), data.length/components);
            break;
          case 3:
            gl.uniform3fv(loc, new Float32Array(data), data.length/components);
            break;
          case 4:
            gl.uniform4fv(loc, new Float32Array(data), data.length/components);
            break;
          case 9:
            gl.uniformMatrix3fv(loc, false, new Float32Array(data));
            break;
          case 16:
            gl.uniformMatrix4fv(loc, false, new Float32Array(data));
            break;
        }
      }
    }
  }
}
