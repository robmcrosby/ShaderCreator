import React from "react";
import GLContext from "./GLContext";
import Model from "./Model";
import UniformMap from "./UniformMap";
import Vector from "./Vector";


export default class GLCanvas extends React.Component {
  constructor(props) {
		super(props);
    this.glContext = new GLContext();

    this.uniformMap = new UniformMap();
    this.mainShader = null;

    this.models = [];
    this.activeModel = 0;

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

      this.initModels();
      this.initTextures();
      this.initUniforms();
      this.updateShader();

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
    this.updateActiveModel();
    this.drawFrame();
  }

  updateActiveModel() {
    this.activeModel = 0;
    for (var i = 0; i < this.props.meshes.length; ++i) {
      if (this.props.active === this.props.meshes[i].name) {
        this.activeModel = i;
        break;
      }
    }
  }

  updateShader() {
    this.mainShader = this.glContext.loadShader(
      "struct Camera {mat4 projection; mat4 view; vec4 origin;}; struct Model {mat4 transform; vec4 rotation;}; attribute vec4 position; attribute vec4 color_0; varying vec4 vcolor; uniform Model model; void main() {gl_Position = model.transform * position; vcolor = color_0;}",
      "varying mediump vec4 vcolor; void main() {gl_FragColor = vcolor;}"
    );
  }

  // setModelShader() {
  //   // mat4 projection;
  //   //   mat4 view;
  //
  //   // Shader for displaying Vertex Colors.
  //   var shader = this.glContext.loadShader(
  //     "struct Camera {mat4 projection; mat4 view; vec4 origin;}; struct Model {mat4 transform; vec4 rotation;}; attribute vec4 position; attribute vec4 color_0; varying vec4 vcolor; uniform Model model; void main() {gl_Position = model.transform * position; vcolor = color_0;}",
  //     "varying mediump vec4 vcolor; void main() {gl_FragColor = vcolor;}"
  //   );
  //
  //
  //   // Shader for displaying Normals.
  //   // var shader = this.glContext.loadShader(
  //   //   "attribute vec4 position; attribute vec4 normal; varying vec3 vnormal; void main() {gl_Position = position; vnormal = normal.xyz;}",
  //   //   "varying mediump vec3 vnormal; void main() {gl_FragColor = vec4(normalize(vnormal)/2.0+vec3(0.5, 0.5, 0.5), 1.0);}"
  //   // );
  //
  //   // Shader for displaying Normals.
  //   // var shader = this.glContext.loadShader(
  //   //   "attribute vec4 position; attribute vec4 normal; varying vec3 vnormal; void main() {gl_Position = position; vnormal = normal.xyz;}",
  //   //   "varying mediump vec3 vnormal; void main() {gl_FragColor = vec4(normalize(vnormal), 1.0);}"
  //   // );
  //
  //   // Shader for displaying Vertex Colors.
  //   // var shader = this.glContext.loadShader(
  //   //   "attribute vec4 position; attribute vec4 color_0; varying vec4 vcolor; void main() {gl_Position = position; vcolor = color_0;}",
  //   //   "varying mediump vec4 vcolor; void main() {gl_FragColor = vcolor;}"
  //   // );
  //
  //   // Shader for displaying Texture Coordinates(UVs).
  //   // var shader = this.glContext.loadShader(
  //   //   "attribute vec4 position; attribute vec2 uv_0; varying vec2 uv; void main() {gl_Position = position; uv = uv_0;}",
  //   //   "varying mediump vec2 uv; void main() {gl_FragColor = vec4(uv, 0.0, 1.0);}"
  //   // );
  //
  //   // Shader for displaying Textured geomentry using a texture and UVs.
  //   // var shader = this.glContext.loadShader(
  //   //   "attribute vec4 position; attribute vec2 uv_0; varying vec2 uv; void main() {gl_Position = position; uv = uv_0;}",
  //   //   "varying mediump vec2 uv; uniform sampler2D texture0; void main() {gl_FragColor = texture2D(texture0, uv);}"
  //   // );
  //
  //   // Shader for displaying geomentry in a solid color.
  //   // var shader = this.glContext.loadShader(
  //   //   "attribute vec4 position; void main() {gl_Position = position;}",
  //   //   "uniform mediump vec4 color; void main() {gl_FragColor = color;}"
  //   // );
  //
  //   // Assign the shader to all the models
  //   // for (var i = 0; i < this.oldModels.length; ++i)
  //   //   this.oldModels[i].shader = shader;
  // }

  initModels() {
    for (var i = 0; i < this.props.meshes.length; ++i) {
      this.models.push(new Model(this.glContext));
      this.models[i].loadMesh(this.props.meshes[i]);
    }
  }

  initTextures() {
    this.glContext.addTexture('grid', 'images/grid.png');
  }

  initUniforms() {
    var color = Vector.vec4(0.2, 0.2, 1.0, 1.0);
    var transform = Vector.mat4_identity();

    this.uniformMap.setUniform('color', color, 4);
    this.uniformMap.setStruct('model', 'transform', transform, 16);
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

    // Clear the canvas
    this.glContext.clear();

    // Draw the activeModel
    var activeModel = this.models[this.activeModel];
    activeModel.shader = this.mainShader;
    activeModel.uniformMap = this.uniformMap;
    activeModel.draw();
  }
}
