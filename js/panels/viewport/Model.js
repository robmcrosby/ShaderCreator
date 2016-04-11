import GLContext from "./GLContext";
import UniformMap from "./UniformMap";

export default class Model {
  constructor(glContext) {
    this.glContext = glContext;
    this.uniformMap = new UniformMap();
    this.shader = null;
    this.mesh = null;
    this.textures = [];
	}

  loadMesh(data) {
    this.mesh = this.glContext.createMesh(data);
  }

  addTexture(name) {
    this.textures.push(this.glContext.getTexture(name));
  }

  clearTextures() {
    this.textures = [];
  }

  draw() {
    this.glContext.draw(this.shader, this.mesh, this.uniformMap, this.textures);
  }
}
