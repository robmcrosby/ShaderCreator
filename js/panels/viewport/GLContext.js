
export default class GLContext {
  constructor() {
    this.canvas = null;
    this.context = null;
    this.textures = {};
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
    return {shader: null, vertexBuffers: {}, uniforms: {}, textures: []};
  }

  modelFromMesh(mesh) {
    var model = GLContext.createModel();
    for (name in mesh.buffers)
      this.setVertexBuffer(model, name, mesh.buffers[name].buffer, mesh.buffers[name].components);
    return model;
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
        return shader;
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

  addTexture(name, file) {
    var gl = this.context;
    if (gl) {
      // Create the texture and add to the model
      var texture = gl.createTexture();
      this.textures[name] = texture;

      // Create an image that loads the texture
      var image = new Image();
      image.onload = () => this.handleTextureLoaded(image, texture);
      image.src = file;
    }
  }

  setTexture(model, name) {
    if (name in this.textures)
      model.textures.push(this.textures[name]);
  }

  handleTextureLoaded(image, texture) {
    var gl = this.context;
    if (gl) {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.bindTexture(gl.TEXTURE_2D, null);
    }
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
    if (gl && model) {
      gl.useProgram(model.shader);

      // Apply the vertex buffers to the shader and get the number of vertices to draw.
      var vertexCount = this.applyVertexBuffers(model.shader, model.vertexBuffers);

      // Apply the uniforms and texturest to the shader.
      this.applyUniforms(model.shader, model.uniforms);
      this.applyTextures(model.shader, model.textures);

      // Draw the mesh.
      gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
    }
  }

  applyVertexBuffers(shader, buffers) {
    var count = 0;
    for (name in buffers)
      count = Math.max(count, this.applyVertexBuffer(shader, name, buffers[name]));
    return count;
  }

  applyVertexBuffer(shader, name, buffer) {
    var gl = this.context;
    if (gl && shader && buffer) {
      var index = gl.getAttribLocation(shader, name);

      // Get -1 if the input is not defined in the shader
      if (buffer && index >= 0) {
        gl.enableVertexAttribArray(index);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer.bufferId);
        gl.vertexAttribPointer(index, buffer.compoents, gl.FLOAT, gl.FALSE, 0, 0);
        return buffer.size;
      }
    }
    return 0;
  }

  applyTextures(shader, textures) {
    var gl = this.context;
    if (gl) {
      for (var i = 0; i < textures.length; ++i) {
        gl.activeTexture(gl.TEXTURE0+i);
        gl.bindTexture(gl.TEXTURE_2D, textures[i]);

        // loc is null if the sampler is not present in the shader.
        var loc = gl.getUniformLocation(shader, ("texture"+i));
        if (loc)
          gl.uniform1i(loc, i);
      }
    }
  }

  applyUniforms(shader, uniforms) {
    for (name in uniforms) {
      const uniform = uniforms[name];
      this.applyUniform(shader, name, uniform);
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
      // loc is null if it is present in the shader.
      var loc = gl.getUniformLocation(shader, name);
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
