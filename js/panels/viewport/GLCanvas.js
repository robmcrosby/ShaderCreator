import React from "react";
import GLContext from "./GLContext";


export default class GLCanvas extends React.Component {
  constructor(props) {
		super(props);
    this.glContext = new GLContext();
    this.meshes = require('json!./Meshes.json');
    this.models = [];
    this.activeModel = 1;
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

      this.setModelBuffers();
      this.setModelShader();

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
    this.drawFrame();
  }

  setModelShader() {
    var shader = this.glContext.loadShader(
      "attribute vec4 position; attribute vec4 color_0; varying vec4 vcolor; void main() {gl_Position = position; vcolor = color_0;}",
      "varying mediump vec4 vcolor; void main() {gl_FragColor = vcolor;}"
    );

    // var shader = this.glContext.loadShader(
    //   "attribute vec4 position; attribute vec2 uv_0; varying vec2 uv; void main() {gl_Position = position; uv = uv_0;}",
    //   "varying mediump vec2 uv; void main() {gl_FragColor = vec4(uv, 0.0, 1.0);}"
    // );

    // var shader = this.glContext.loadShader(
    //   "attribute vec4 position; void main() {gl_Position = position;}",
    //   "uniform mediump vec4 color; void main() {gl_FragColor = color;}"
    // );

    // var shader = this.glContext.loadShader(
    //   "attribute vec4 position; attribute vec2 uv_0; varying vec2 uv; void main() {gl_Position = position; uv = uv_0;}",
    //   "varying mediump vec2 uv; uniform sampler2D texture0; void main() {gl_FragColor = texture2D(texture0, uv);}"
    // );

    // Assign the shader to all the models
    for (var i = 0; i < this.models.length; ++i)
      this.models[i].shader = shader;
  }

  setModelBuffers() {
    this.glContext.addTexture('grid', 'images/grid.png');

    for (var i = 0; i < this.meshes.length; ++i)
      this.models.push(this.glContext.modelFromMesh(this.meshes[i]));

    var color = [
      0.2, 0.2, 1.0, 1.0
    ];
    var transform = [
      1.0, 0.0, 0.0, 0.0,
      0.0, 1.0, 0.0, 0.0,
      0.0, 0.0, 1.0, 0.0,
      0.0, 0.0, 0.0, 1.0
    ];

    for (var i = 0; i < this.models.length; ++i) {
      this.glContext.setUniform(this.models[i], 'color', color, 4);
      this.glContext.setUniform(this.models[i], 'transform', transform, 16);
      this.glContext.setTexture(this.models[i], 'grid');
    }
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
    this.glContext.draw(this.models[this.activeModel]);
  }
}
