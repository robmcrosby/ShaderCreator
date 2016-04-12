import ShaderProperties from "./models/ShaderProperties";
import ShaderVersion from "./models/ShaderVersion";

export default function buildFragmentShader(properties, version) {
  var src = '';
  src += buildDefines(properties, version);
  src += buildStructs(properties, version);
  src += buildFunctions(properties, version);
  src += buildUniforms(properties, version);
  src += buildTextures(properties, version);
  src += buildInputs(properties, version);
  src += buildOutputs(properties, version);
  src += buildMain(properties, version);
  return src;
}

/**
 *
 */
function buildDefines(properties, version) {
  var src = version.header + '\n\n';

  // Define the number of lights if there is shading.
  if (properties.shadingEnabled())
    src += '#define NUM_LIGHTS 4\n\n';

  return src;
}

/**
 *
 */
function buildStructs(properties, version) {
  var src = '';
  var p = '  ' + version.precisionQuantifier('mediump');

  // Material Struct
  src += 'struct Material {\n';
  src += p + 'vec4 ambiant;\n';
  src += p + 'vec4 diffuse;\n';
  src += p + 'vec4 specular;\n';
  src += p + 'vec4 params;\n';
  src += '};\n\n';

  return src;
}

/**
 *
 */
function buildFunctions(properties, version) {
  var src = '';

  src += properties.diffuseEnabled() ? buildDiffuseFunction(properties, version) : '';
  src += properties.specularEnabled() ? buildSpecularFunction(properties, version) : '';

  return src;
}

/**
 *
 */
function buildDiffuseFunction(properties, version) {
  var p = version.precisionQuantifier('mediump');
  var src = p + 'float diffuseFunc(';

  // Add the function parameters
  src += p + 'vec3 position, ';
  src += p + 'vec3 normal, ';
  src += p + 'vec3 view, ';
  src += p + 'vec2 params, ';
  src += p + 'vec4 light) {\n';

  src += p + 'vec3 lightDir = -light.xyz;';
  src += '  return clamp(dot(normal, lightDir), 0.0, 1.0);\n';

  // const func = properties.diffuseFunction();
  // if (func === 'Lambert') {
  //   src += '  // Lambert\n';
  //   src += '  return 0.0;\n';
  // }
  // else if (func === 'Oren-Nayar') {
  //   src += '  // Oren-Nayar\n';
  //   src += '  return 0.0;\n';
  // }
  // else if (func === 'Toon') {
  //   src += '  // Toon\n';
  //   src += '  return 0.0;\n';
  // }
  // else if (func === 'Minnaert') {
  //   src += '  // Minnaert\n';
  //   src += '  return 0.0;\n';
  // }
  // else if (func === 'Fresnel') {
  //   src += '  // Fresnel\n';
  //   src += '  return 0.0;\n';
  // }
  // else {
  //   src += '  // Shadeless\n';
  //   src += '  return 1.0;\n';
  // }
  return src + '}\n\n';
}

/**
 *
 */
function buildSpecularFunction(properties, version) {
  var p = version.precisionQuantifier('mediump');
  var src = p + 'float specularFunc(';

  // Add the function parameters
  src += p + 'vec3 position, ';
  src += p + 'vec3 normal, ';
  src += p + 'vec3 view, ';
  src += p + 'vec2 params, ';
  src += p + 'vec4 light) {\n';

  src += '  return 0.0;\n';

  // const func = properties.specularFunction();
  // if (func === 'CookTorr') {
  //   src += '  // CookTorr\n';
  //   src += '  return 0.0;\n';
  // }
  // else if (func === 'Phong') {
  //   src += '  // Phong\n';
  //   src += '  return 0.0;\n';
  // }
  // else if (func === 'Blinn') {
  //   src += '  // Blinn\n';
  //   src += '  return 0.0;\n';
  // }
  // else if (func === 'Toon') {
  //   src += '  // Toon\n';
  //   src += '  return 0.0;\n';
  // }
  // else if (func === 'Wardlso') {
  //   src += '  // Wardlso\n';
  //   src += '  return 0.0;\n';
  // }
  // else {
  //   src += '  // Shadeless\n';
  //   src += '  return 1.0;\n';
  // }
  return src + '}\n\n';
}

/**
 *
 */
function buildUniforms(properties, version) {
  var src = 'uniform Material material;\n';
  var p = version.precisionQuantifier('mediump');
  if (properties.shadingEnabled()) {
    src += 'uniform ' + p + 'vec4 lightColors[NUM_LIGHTS];\n';
    src += 'uniform ' + p + 'vec4 lightPositions[NUM_LIGHTS];\n';
  }
  return src + '\n';
}

/**
 *
 */
function buildTextures(properties, version) {
  var src = '';

  // Add a Sampler for each texture.
  var numTextures = properties.numberOfTextures();
  for (var i = 0; i < numTextures; ++i)
    src += 'uniform sampler2D texture' + i + ';\n';

  // Add an extra newline if there was anything built.
  return numTextures > 0 ? src + '\n' : '';
}

/**
 *
 */
function buildInputs(properties, version) {
  var src = '';
  if (properties.shadingEnabled()) {
    src += version.fragmentInput('mediump', 'vec3', 'v_position');
    src += version.fragmentInput('mediump', 'vec3', 'v_normal');
    src += version.fragmentInput('mediump', 'vec3', 'v_view');
  }

  // Add any vertex colors
  var numColors = properties.numberOfVertexColors();
  for (var i = 0; i < numColors; ++i)
    src += version.fragmentInput('mediump', 'vec4', 'v_color'+i);

  // Add any texture coordinates
  var numUVs = properties.numberOfUVs();
  for (var i = 0; i < numUVs; ++i)
    src += version.fragmentInput('mediump', 'vec2', 'v_uv'+i);

  return src.length > 0 ? src + '\n' : '';
}

/**
 *
 */
function buildOutputs(properties, version) {
  if (version.number > 2.0)
    return 'out vec4 gl_FragColor;\n\n';
  return '';
}

/**
 *
 */
function buildMain(properties, version) {
  var src = 'void main() {\n';
  var p = '  ' + version.precisionQuantifier('mediump');

  // Normalize the normal and view vectors
  if (properties.shadingEnabled()) {
    src += p + 'vec3 normal = normalize(v_normal);\n';
    src += p + 'vec3 view = normalize(v_view);\n';
  }

  // Add Varibles for diffuse and specular color
  src += properties.diffuseEnabled() ? p + 'vec4 diffuseColor = ' + buildDiffuseColor(properties, version) : '';
  src += properties.specularEnabled() ? p + 'vec4 specularColor = material.specular;\n' : '';

  // Initalize the output color to the ambiant component.
  src += '  gl_FragColor = ' + buildAmbiantColor(properties, version);

  if (properties.shadingEnabled()) {
    // Calculate and add the diffuse and specular colors for each light.
    src += '  for (int i = 0; i < NUM_LIGHTS; ++i) {\n';
    src += properties.diffuseEnabled()  ? '  ' + p + 'float d = diffuseFunc(v_position, normal, view, material.params.xy, lightPositions[i]);\n' : '';
    src += properties.specularEnabled() ? '  ' + p + 'float s = specularFunc(v_position, normal, view, material.params.zw, lightPositions[i]);\n' : '';

    // Assemble the light equation.
    src += '    gl_FragColor +=';
    src += properties.diffuseEnabled() ? ' d * (diffuseColor * lightColors[i])' : '';
    src += properties.diffuseEnabled() && properties.specularEnabled() ? ' +' : '';
    src += properties.specularEnabled() ? ' s * specularColor' : '';
    src += ';\n  }\n';
  }

  // Always set the alpha component to 1.0.
  src += '  gl_FragColor.w = 1.0;\n';
  src += '}\n';
  return src;
}

/**
 *
 */
function buildAmbiantColor(properties, version) {
  const type = properties.ambiantInputType();
  var src = 'material.ambiant';

  if (type === 'Vertex')
    src += ' * v_color' + properties.ambiantInputIndex();
  else if (type === 'Texture')
    src += ' * ' + version.textureFunction() +'(texture' + properties.ambiantInputIndex() + ', v_uv0)';
  return src + ';\n';
}

/**
 *
 */
function buildDiffuseColor(properties, version) {
  const type = properties.diffuseInputType();
  var src = 'material.diffuse';

  if (type === 'Vertex')
    src += ' * v_color' + properties.diffuseInputIndex();
  else if (type === 'Texture')
    src += ' * ' + version.textureFunction() + '(texture' + properties.diffuseInputIndex() + ', v_uv0)';
  return src + ';\n';
}
