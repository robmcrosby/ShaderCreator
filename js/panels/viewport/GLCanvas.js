import React from "react";

export default class Preview extends React.Component {
  constructor(props) {
		super(props);
    this.canvas = null;
    this.glContext = null;
    this.shaderProgram = null;
    this.positionBuffer = null;
    this.timestamp = 0.0;
	}

  render() {
    var styles = {
      width: '100%',
    };

    return(
      <canvas ref={(c) => this.canvas = c} style={styles}>
        Your browser does not appear to support the
        <code>&lt;canvas&gt;</code> element.
      </canvas>
    );
  }

  componentDidMount() {
    console.log('componentDidMount');

    if (this.canvas !== null && this.initWebGL()) {
      console.log('Init WebGL Canvas');

      this.buildProgram();
      this.uploadBuffers();

      this.drawFrame();

      //this.startAnimating();
    }
  }

  componentWillUnmount() {
    console.log('componentWillUnmount');
    this.stopAnimating();
  }

  componentDidUpdate() {
    console.log('componentDidUpdate');

    // TODO update the shader and re-draw if not animated
    //this.drawFrame();
  }

  startAnimating() {
    const render = (timestamp) => {
      this.timestamp = timestamp;
      this.renderID = window.requestAnimationFrame(render);
      this.drawFrame();
    }
    this.renderID = window.requestAnimationFrame(render);
  }

  stopAnimating() {
    if (typeof this.renderID !== 'undefined') {
      window.cancelAnimationFrame(this.renderID);
      this.renderID = undefined;
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
      // TODO add shader building functions here.
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

    console.log('Draw Frame: ' + this.timestamp);

    if (gl && canvas) {
      // Update the width and height of the canvas
      if (this.canvas.width !== this.canvas.offsetWidth)
        this.canvas.width = this.canvas.height = this.canvas.offsetWidth;

      //canvas.height = canvas.width = canvas.offsetWidth;
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
