
export default class ShaderVersion {
  constructor(label, header, platform, number) {
    this.label    = label;
    this.header   = header;
    this.platform = platform;
    this.number   = number;
  }

  static supportedVersions() {
    var versions = [];
    versions.push(new ShaderVersion('OpenGL ES 2.0', '#version 100',    'embeded', 2.0));
    versions.push(new ShaderVersion('OpenGL ES 3.0', '#version 300 es', 'embeded', 3.0));
    versions.push(new ShaderVersion('OpenGL 4.1',    '#version 410',    'desktop', 4.1));
    return versions;
  }
}
