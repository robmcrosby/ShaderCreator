import React from "react";
import GLContext from "./GLContext";


export default class GLCanvas extends React.Component {
  constructor(props) {
		super(props);
    this.glContext = new GLContext();
    this.model = GLContext.createModel();
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

    if (this.canvas !== null && this.glContext.load(this.canvas)) {
      console.log('Init WebGL Canvas');

      this.setModelShader();
      this.setModelBuffers();

      this.drawFrame();
      //this.startAnimating();
    }
  }

  componentWillUnmount() {
    console.log('componentWillUnmount');
    //this.stopAnimating();
  }

  componentDidUpdate() {
    console.log('componentDidUpdate');

    // TODO update the shader and re-draw if not animated
    //this.drawFrame();
  }

  setModelShader() {
    this.glContext.setShader(
      this.model,
      "attribute vec4 position; uniform mat4 transform; void main() {gl_Position = transform * position;}",
      "uniform mediump vec4 color; void main() {gl_FragColor = color;}"
    );
  }

  setModelBuffers() {
    var positions = [
       0.0,  0.8,  0.0, 1.0,
      -0.8, -0.8,  0.0, 1.0,
       0.8, -0.8,  0.0, 1.0
     ];
     var color = [
       0.2, 0.2, 1.0, 1.0
     ];
     var transform = [
       1.0, 0.0, 0.0, 0.0,
       0.0, 1.0, 0.0, 0.0,
       0.0, 0.0, 1.0, 0.0,
       0.0, 0.0, 0.0, 1.0
     ];

    this.glContext.setVertexBuffer(this.model, 'position', positions, 4);
    this.glContext.setUniform(this.model, 'color', color, 4);
    this.glContext.setUniform(this.model, 'transform', transform, 16);
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


  drawFrame() {
    //console.log('Draw Frame: ' + this.timestamp);

    // Update the width and height of the canvas
    if (this.canvas.width !== this.canvas.offsetWidth)
      this.canvas.width = this.canvas.height = this.canvas.offsetWidth;

    this.glContext.clear();
    this.glContext.draw(this.model);
  }
}
