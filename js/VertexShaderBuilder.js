import ShaderProperties from "./models/ShaderProperties";
import ShaderVersion from "./models/ShaderVersion";

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
  src += '  vec4 origin;\n';
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

  // // Transform To World Space
  // src += 'vec4 transform(Model m, vec4 v) {\n';
  // src += '  return m.transform * v;\n';
  // src += '}\n\n';
  //
  // // Transform from World To Screen Space
  // src += 'vec4 transform(Camera c, vec4 v) {\n';
  // src += '  return c.projection * c.view * v;\n';
  // src += '}\n\n';

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
  var src = version.vertexInput('vec4', 'position');

  // Add normal if there will be shading
  if (properties.shadingEnabled())
    src += version.vertexInput('vec4', 'normal');

  // Add any vertex colors
  var numColors = properties.numberOfVertexColors();
  for (var i = 0; i < numColors; ++i)
    src += version.vertexInput('vec4', 'color_'+i);

  // Add any texture coordinates
  var numUVs = properties.numberOfUVs();
  for (var i = 0; i < numUVs; ++i)
    src += version.vertexInput('vec2', 'uv_'+i);

  return src + '\n';
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
    src += version.vertexOutput('vec3', 'v_position');
    src += version.vertexOutput('vec3', 'v_normal');
    src += version.vertexOutput('vec3', 'v_view');
  }

  // Pass any vertex colors
  var numColors = properties.numberOfVertexColors();
  for (var i = 0; i < numColors; ++i)
    src += version.vertexOutput('vec4', 'v_color'+i);

  // Pass any texture coordinates
  var numUVs = properties.numberOfUVs();
  for (var i = 0; i < numUVs; ++i)
    src += version.vertexOutput('vec2', 'v_uv'+i);

  // Add an extra newline if there was anything built.
  return src.length > 0 ? src + '\n' : '';
}

/**
 *
 */
function buildMain(properties, version) {
  var src = 'void main() {\n';
  // Transform to world coordinates
  src += '  vec4 world = model.transform * position;\n';

  // Assign the position, normal and view vectors
  if (properties.shadingEnabled()) {
    src += '  v_position = world.xyz;\n';
    src += '  v_normal = rotate(model.rotation, normal.xyz);\n';
    src += '  v_view = camera.origin.xyz - world.xyz;\n';
  }

  // Assign any vertex colors
  var numColors = properties.numberOfVertexColors();
  for (var i = 0; i < numColors; ++i)
    src += '  v_color'+i + ' = color_'+i + ';\n';

  // Assign any texture coordinates
  var numUVs = properties.numberOfUVs();
  for (var i = 0; i < numUVs; ++i)
    src += '  v_uv'+i + ' = uv_'+i + ';\n';

  // Assign the projected position
  src += '  gl_Position = camera.projection * camera.view * world;\n';

  // Close the function
  return src + '}\n';
}
