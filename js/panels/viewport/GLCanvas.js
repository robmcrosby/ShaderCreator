import React from "react";

export default class Preview extends React.Component {
  constructor(props) {
		super(props);
    this.canvas = null;
    this.glContext = null;
    this.shaderProgram = null;
    this.positionBuffer = null;
	}

  render() {
    var inlineStyles = {
      width: '100%',
      height: 'auto'
    };

    return(
      <canvas ref={(c) => this.canvas = c} width="300" height="300" style={inlineStyles}>
        Your browser does not appear to support the
        <code>&lt;canvas&gt;</code> element.
      </canvas>
    );
  }

  componentDidMount() {
    if (this.canvas !== null && this.initWebGL()) {
      this.buildProgram();
      this.uploadBuffers();
      this.drawFrame();
    }
  }

  initWebGL() {
    try {
      // Try to grab the standard context. If it fails, fallback to experimental.
      this.glContext = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl");
    }
    catch(e) {}

    // If we don't have a GL context, give up now
    if (!this.glContext) {
      console.error("Unable to initialize WebGL. Your browser may not support it.");
      this.glContext = null;
      return false;
    }
    return true;
  }

  compileShader(src, type) {
    var gl = this.glContext;
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

  buildProgram() {
    var gl = this.glContext;

    if (gl) {
      var fragmentShader = this.compileShader("void main() {gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);}", gl.FRAGMENT_SHADER);
      var vertexShader = this.compileShader("attribute vec4 position; void main() {gl_Position = position;}", gl.VERTEX_SHADER);

      this.shaderProgram = gl.createProgram();
      gl.attachShader(this.shaderProgram, vertexShader);
      gl.attachShader(this.shaderProgram, fragmentShader);
      gl.linkProgram(this.shaderProgram);

      if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
        console.error("Could not initialise shaders");
      }
    }
  }

  uploadBuffers() {
    var gl = this.glContext;

    if (gl) {
      this.positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);

      var positions = [
         0.0,  0.8,  0.0, 1.0,
        -0.8, -0.8,  0.0, 1.0,
         0.8, -0.8,  0.0, 1.0
       ];
       gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    }
  }

  drawFrame() {
    var canvas = this.canvas;
    var gl = this.glContext;

    if (gl && canvas) {
      console.log('size: ' + canvas.width + ', ' + canvas.height);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.enable(gl.DEPTH_TEST);

      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      gl.useProgram(this.shaderProgram);
      var positionIndex = gl.getAttribLocation(this.shaderProgram, "position");

      gl.enableVertexAttribArray(positionIndex);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
      gl.vertexAttribPointer(positionIndex, 4, gl.FLOAT, gl.FALSE, 0, 0);

      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
  }
}
