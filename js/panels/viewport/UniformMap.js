
export default class UniformMap {

  setUniform(name, data, components) {
    this[name] = {data: data, components: components};
  }

  setStruct(name, part, data, components) {
    if (!(name in this))
      this[name] = {struct:{}};
    this[name].struct[part] = {data: data, components: components};
  }
}
