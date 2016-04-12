import React from "react";
import GLContext from "./GLContext";
import Model from "./Model";
import UniformMap from "./UniformMap";
import Vector from "./Vector";

import ShaderVersion from "../../models/ShaderVersion";
import buildVertexShader from "../../VertexShaderBuilder";
import buildFragmentShader from "../../FragmentShaderBuilder";


export default class GLCanvas extends React.Component {
  constructor(props) {
		super(props);
    this.glContext = new GLContext();

    this.uniformMap = new UniformMap();
    this.mainShader = null;

    this.models = [];
    this.activeModel = 0;

    // Angle for the Turn Table Animation
    this.rotation = 0.0;
    this.rotationRate = 0.001;

    this.timeElapsed = 0.0;
    this.timeStamp = 0.0;
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

      //this.drawFrame();
      this.startAnimating();
    }
  }

  componentWillUnmount() {
    console.log('componentWillUnmount');
    this.stopAnimating();
  }

  componentDidUpdate() {
    console.log('componentDidUpdate');

    this.updateShader();
    this.updateActiveModel();
    //this.drawFrame();
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
    // this.mainShader = this.glContext.loadShader(
    //   "struct Camera {mat4 projection; mat4 view; vec4 origin;}; struct Model {mat4 transform; vec4 rotation;}; attribute vec4 position; attribute vec4 color_0; varying vec4 vcolor; uniform Camera camera; uniform Model model; void main() {gl_Position = camera.projection * camera.view * model.transform * position; vcolor = color_0;}",
    //   "struct Material {mediump vec4 ambiant; mediump vec4 diffuse; mediump vec4 specular; mediump vec4 settings;}; uniform Material material; varying mediump vec4 vcolor; void main() {gl_FragColor = material.ambiant * vcolor;}"
    // );

    const version = new ShaderVersion('OpenGL ES 2.0', '#version 100', 'embeded', 2.0);
    this.mainShader = this.glContext.loadShader(
      buildVertexShader(this.props.shader, version),
      buildFragmentShader(this.props.shader, version)
    )
  }

  initModels() {
    for (var i = 0; i < this.props.meshes.length; ++i) {
      this.models.push(new Model(this.glContext));
      this.models[i].loadMesh(this.props.meshes[i]);
      this.models[i].addTexture('grid');
    }
  }

  initTextures() {
    this.glContext.addTexture('grid', 'images/grid.png');
  }

  initUniforms() {
    // Calculate the Projection Matrix
    var projection = Vector.mat4_frustum(-0.3, 0.3, -0.3, 0.3, 1.0, 10.0);

    // Calculate the View Matrix
    var orig = Vector.vec3(-0.6, 0.8, -1.8);
    var center = Vector.vec3(0.0, 0.0, 0.0);
    var up = Vector.vec3(0.0, 1.0, 0.0);
    var view = Vector.mat4_lookAt(orig, center, up);

    // Set the Camera struct
    this.uniformMap.setStruct('camera', 'projection', projection, 16);
    this.uniformMap.setStruct('camera', 'view', view, 16);
    this.uniformMap.setStruct('camera', 'origin', [orig[0], orig[1], orig[2], 0.0], 4);

    // Set the Model struct
    this.uniformMap.setStruct('model', 'transform', Vector.mat4_identity(), 16);
    this.uniformMap.setStruct('model', 'rotation', [0.0, 0.0, 0.0, 1.0], 4);

    // Set the Material struct
    this.uniformMap.setStruct('material', 'ambiant', [1.0, 1.0, 1.0, 1.0], 4);
    this.uniformMap.setStruct('material', 'diffuse', [0.0, 0.0, 0.0, 1.0], 4);
    this.uniformMap.setStruct('material', 'specular', [0.0, 0.0, 0.0, 1.0], 4);
    this.uniformMap.setStruct('material', 'settings', [0.0, 0.0, 0.0, 0.0], 4);

    // Set the Lights
  }

  updateUniforms() {
    if (this.timeElapsed < 32.0) {
      this.rotation += this.rotationRate * this.timeElapsed;
      var transform = Vector.mat4_rotY(this.rotation);
      this.uniformMap.setStruct('model', 'transform', transform, 16);
    }
  }

  startAnimating() {
    const render = (timestamp) => {
      this.timeElapsed = timestamp - this.timeStamp;
      this.timeStamp = timestamp;
      this.updateUniforms();
      this.drawFrame();
      this.renderID = window.requestAnimationFrame(render);
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
