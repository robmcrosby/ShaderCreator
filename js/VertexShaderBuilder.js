import Shader from "./Shader";

/**
 *
 */
export default function buildVertexShader(properties, version) {
  var src = '';
  src += buildDefines(properties, version);
  src += buildStructs(properties, version);
  src += buildFunctions(properties, version);
  src += buildInputs(properties, version);
  src += buildUniforms(properties, version);
  src += buildOutputs(properties, version);
  src += buildMain(properties, version);
  return src;
}

/**
 *
 */
function buildDefines(properties, version) {
  return version.header + '\n\n';
}

/**
 *
 */
function buildStructs(properties, version) {
  var src = '';

  // Camera Struct
  src += 'struct Camera {\n';
  src += '  mat4 projection;\n';
  src += '  mat4 view;\n';
  src += '  vec4 position;\n';
  src += '};\n\n';

  // Model Struct
  src += 'struct Model {\n';
  src += '  mat4 transform;\n';
  src += '  vec4 rotation;\n';
  src += '};\n\n';

  return src;
}

/**
 *
 */
function buildFunctions(properties, version) {
  var src = '';

  // Transform To World Space
  src += 'vec4 transform(Model m, vec4 v) {\n';
  src += '  return m.transform * v;\n';
  src += '}\n\n';

  // Transform from World To Screen Space
  src += 'vec4 transform(Camera c, vec4 v) {\n';
  src += '  return c.projection * c.view * v;\n';
  src += '}\n\n';

  if (properties.shadingEnabled()) {
    // Quaternion Rotate Function
    src += 'vec3 rotate(vec4 q, vec3 v) {\n';
    src += '  return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);\n';
    src += '}\n\n';
  }

  return src;
}

/**
 *
 */
function buildInputs(properties, version) {
  // Always add position
  var src = buildInput('vec4', 'position', version);

  // Add normal if there will be shading
  if (properties.shadingEnabled())
    src += buildInput('vec4', 'normal', version);

  // Add any vertex colors
  var numColors = properties.numberOfVertexColors();
  for (var i = 0; i < numColors; ++i)
    src += buildInput('vec4', 'color'+i, version);

  // Add any texture coordinates
  var numUVs = properties.numberOfUVs();
  for (var i = 0; i < numUVs; ++i)
    src += buildInput('vec2', 'uv'+i, version);

  return src + '\n';
}

/**
 *
 */
function buildInput(type, name, version) {
  var src = version.version > 2.0 ? 'in' : 'attribute';
  return src + ' ' + type + ' ' + name + ';\n';
}

/**
 *
 */
function buildUniforms(properties, version) {
  var src = '';
  src += 'uniform Camera camera;\n';
  src += 'uniform Model  model;\n';
  return src + '\n';
}

/**
 *
 */
function buildOutputs(properties, version) {
  var src = '';

  // Pass position and normal if there is shading
  if (properties.shadingEnabled()) {
    src += buildOutput('vec3', 'v_position', version);
    src += buildOutput('vec3', 'v_normal', version);
  }

  // Pass any vertex colors
  var numColors = properties.numberOfVertexColors();
  for (var i = 0; i < numColors; ++i)
    src += buildOutput('vec4', 'v_color'+i, version);

  // Pass any texture coordinates
  var numUVs = properties.numberOfUVs();
  for (var i = 0; i < numUVs; ++i)
    src += buildOutput('vec2', 'v_uv'+i, version);

  // Add an extra newline if there was anything built.
  return src.length > 0 ? src + '\n' : '';
}

/**
 *
 */
function buildOutput(type, name, version) {
  var src = version.version > 2.0 ? 'out ' : 'varying ';
  return src + type + ' ' + name + ';\n';
}

/**
 *
 */
function buildMain(properties, version) {
  var src = 'void main() {\n';
  src += '  vec4 pos = transform(model, position);\n';
  src += '  gl_Position = transform(camera, pos);\n';

  // Assign the position and the rotated normal
  if (properties.shadingEnabled()) {
    src += '  v_position = pos.xyz;\n';
    src += '  v_normal = rotate(model.rotation, normal.xyz);\n';
  }

  // Assign any vertex colors
  var numColors = properties.numberOfVertexColors();
  for (var i = 0; i < numColors; ++i)
    src += '  v_color'+i + ' = color'+i + ';\n';

  // Assign any texture coordinates
  var numUVs = properties.numberOfUVs();
  for (var i = 0; i < numUVs; ++i)
    src += '  v_uv'+i + ' = uv'+i + ';\n';

  return src + '}\n';
}
