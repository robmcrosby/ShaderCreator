import ShaderVersion from "../../js/models/ShaderVersion";
import {expect} from "chai";

// Constructor
var version = new ShaderVersion('OpenGL 4.1', '#version 410', 'desktop', 4.1);

// Properties of ShaderVersion
expect(version).to.have.property('label').to.be.a('string').to.be.equal('OpenGL 4.1');
expect(version).to.have.property('header').to.be.a('string').to.be.equal('#version 410');
expect(version).to.have.property('platform').to.be.a('string').to.be.equal('desktop');
expect(version).to.have.property('number').to.be.a('number').to.be.equal(4.1);

// Methods of ShaderVersion
expect(version).to.have.property('vertexInput').to.be.a('function');
expect(version).to.have.property('vertexOutput').to.be.a('function');
expect(version).to.have.property('fragmentInput').to.be.a('function');
expect(version).to.have.property('textureFunction').to.be.a('function');

// Static Methods of ShaderVersion
expect(ShaderVersion.supportedVersions).to.be.a('function');

// supportedVersions return value
var tests = [
  {label:'OpenGL ES 2.0', header:'#version 100', platform:'embeded', number:2.0},
  {label:'OpenGL ES 3.0', header:'#version 300 es', platform:'embeded', number:3.0},
  {label:'OpenGL 4.1', header:'#version 410', platform:'desktop', number:4.1}
];
var versions = ShaderVersion.supportedVersions();
expect(versions).to.have.length(tests.length);
for (var i = 0; i < tests.legth; ++i) {
  expect(versions[i].label).is.equal(tests[i].label);
  expect(versions[i].header).is.equal(tests[i].header);
  expect(versions[i].platform).is.equal(tests[i].platform);
  expect(versions[i].number).is.equal(tests[i].number);
}

// vertexInput return values
var tests = [
  {value:'attribute vec4 test;\n'},
  {value:'in vec4 test;\n'},
  {value:'in vec4 test;\n'}
];
for (var i = 0; i < tests.length; ++i) {
  var value = versions[i].vertexInput('vec4', 'test');
  expect(value).to.be.a('string').to.be.equal(tests[i].value);
}

// vertexOutput return values
var tests = [
  {value:'varying vec4 test;\n'},
  {value:'out vec4 test;\n'},
  {value:'out vec4 test;\n'}
];
for (var i = 0; i < tests.length; ++i) {
  var value = versions[i].vertexOutput('vec4', 'test');
  expect(value).to.be.a('string').to.be.equal(tests[i].value);
}

//fragmentInput(precision, type, name)
var tests = [
  {value:'varying mediump vec4 test;\n'},
  {value:'in mediump vec4 test;\n'},
  {value:'in vec4 test;\n'}
];
for (var i = 0; i < tests.length; ++i) {
  var value = versions[i].fragmentInput('mediump', 'vec4', 'test');
  expect(value).to.be.a('string').to.be.equal(tests[i].value);
}

// textureFunction return values
var tests = [
  {value:'texture2D'},
  {value:'texture'},
  {value:'texture'}
];
for (var i = 0; i < tests.length; ++i) {
  var value = versions[i].textureFunction();
  expect(value).to.be.a('string').to.be.equal(tests[i].value);
}
