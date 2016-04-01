import ShaderVersion from "../../js/models/ShaderVersion";
import {expect} from "chai";

describe('ShaderVersion', function() {
  it('should have expected properties', function() {
    var version = new ShaderVersion('OpenGL 4.1', '#version 410', 'desktop', 4.1);

    expect(version.label).to.equal('OpenGL 4.1');
    expect(version.header).to.equal('#version 410');
    expect(version.platform).to.equal('desktop');
    expect(version.number).to.equal(4.1);
  });

  it('should have expected methods', function() {
    var version = new ShaderVersion('OpenGL 4.1', '#version 410', 'desktop', 4.1);

    expect(version.vertexInput).to.be.a('function');
    expect(version.vertexOutput).to.be.a('function');
    expect(version.fragmentInput).to.be.a('function');
    expect(version.textureFunction).to.be.a('function');
  });

  it('should have supportedVersions return values', function() {
    expect(ShaderVersion.supportedVersions).to.be.a('function');
    var versions = ShaderVersion.supportedVersions();

    var expected = [
      {label:'OpenGL ES 2.0', header:'#version 100', platform:'embeded', number:2.0},
      {label:'OpenGL ES 3.0', header:'#version 300 es', platform:'embeded', number:3.0},
      {label:'OpenGL 4.1', header:'#version 410', platform:'desktop', number:4.1}
    ];
    expect(versions).to.have.length(expected.length);

    for (var i = 0; i < versions.legth; ++i) {
      expect(versions[i].label).is.equal(expected[i].label);
      expect(versions[i].header).is.equal(expected[i].header);
      expect(versions[i].platform).is.equal(expected[i].platform);
      expect(versions[i].number).is.equal(expected[i].number);
    }
  });

  it('should have vertexInput return values', function() {
    var versions = ShaderVersion.supportedVersions();
    var expected = [
      'attribute vec4 test;\n',
      'in vec4 test;\n',
      'in vec4 test;\n'
    ];
    for (var i = 0; i < versions.length; ++i)
      expect(versions[i].vertexInput('vec4', 'test')).to.be.equal(expected[i]);
  });

  it('should have vertexOutput return values', function() {
    var versions = ShaderVersion.supportedVersions();
    var expected = [
      'varying vec4 test;\n',
      'out vec4 test;\n',
      'out vec4 test;\n'
    ];
    for (var i = 0; i < versions.length; ++i)
      expect(versions[i].vertexOutput('vec4', 'test')).to.be.equal(expected[i]);
  });

  it('should have fragmentInput return values', function() {
    var versions = ShaderVersion.supportedVersions();
    var expected = [
      'varying mediump vec4 test;\n',
      'in mediump vec4 test;\n',
      'in vec4 test;\n'
    ];
    for (var i = 0; i < versions.length; ++i)
      expect(versions[i].fragmentInput('mediump', 'vec4', 'test')).to.be.equal(expected[i]);
  });

  it('should have textureFunction return values', function() {
    var versions = ShaderVersion.supportedVersions();
    var expected = [
      'texture2D',
      'texture',
      'texture'
    ];
    for (var i = 0; i < versions.length; ++i)
      expect(versions[i].textureFunction()).to.be.equal(expected[i]);
  });
});
