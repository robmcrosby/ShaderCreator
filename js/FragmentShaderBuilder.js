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

  // // Define the number of lights if there is shading.
  // if (properties.shadingEnabled())
  //   src += '#define NUM_LIGHTS 8\n\n';

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

  // src += properties.diffuseEnabled() ? buildDiffuseFunction(properties, version) : '';
  // src += properties.specularEnabled() ? buildSpecularFunction(properties, version) : '';

  return src;
}

/**
 *
 */
function buildDiffuseFunction(properties, version) {
  var src = 'float diffuse(vec3 position, vec3 normal, vec3 view, vec2 params, mat4 light) {\n';

  const func = properties.diffuseFunction();
  if (func === 'Lambert') {
    src += '  // Lambert\n';
    src += '  return 0.0;\n';
  }
  else if (func === 'Oren-Nayar') {
    src += '  // Oren-Nayar\n';
    src += '  return 0.0;\n';
  }
  else if (func === 'Toon') {
    src += '  // Toon\n';
    src += '  return 0.0;\n';
  }
  else if (func === 'Minnaert') {
    src += '  // Minnaert\n';
    src += '  return 0.0;\n';
  }
  else if (func === 'Fresnel') {
    src += '  // Fresnel\n';
    src += '  return 0.0;\n';
  }
  else {
    src += '  // Shadeless\n';
    src += '  return 1.0;\n';
  }
  return src + '}\n\n';
}

/**
 *
 */
function buildSpecularFunction(properties, version) {
  var src = 'float specular(vec3 position, vec3 normal, vec3 view, vec2 params, mat4 light) {\n';

  const func = properties.specularFunction();
  if (func === 'CookTorr') {
    src += '  // CookTorr\n';
    src += '  return 0.0;\n';
  }
  else if (func === 'Phong') {
    src += '  // Phong\n';
    src += '  return 0.0;\n';
  }
  else if (func === 'Blinn') {
    src += '  // Blinn\n';
    src += '  return 0.0;\n';
  }
  else if (func === 'Toon') {
    src += '  // Toon\n';
    src += '  return 0.0;\n';
  }
  else if (func === 'Wardlso') {
    src += '  // Wardlso\n';
    src += '  return 0.0;\n';
  }
  else {
    src += '  // Shadeless\n';
    src += '  return 1.0;\n';
  }
  return src + '}\n\n';
}

/**
 *
 */
function buildUniforms(properties, version) {
  var src = 'uniform Material material;\n';
  // if (properties.shadingEnabled())
  //   src += 'uniform mat4 lights[NUM_LIGHTS];\n';
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

  // Normalize the normal and view vectors.
  // if (properties.shadingEnabled()) {
  //   src += '  vec3 normal = normalize(v_normal);\n';
  //   src += '  vec3 view = normalize(v_view);\n';
  // }

  // if (properties.diffuseEnabled())
  //   src += '  vec4 diffuseColor = ' + buildDiffuseColor(properties, version);
  // src += properties.specularEnabled() ? '  vec4 specularColor = material.specular;\n' : '';

  // Initalize the output color to the ambiant component.
  src += '  gl_FragColor = ' + buildAmbiantColor(properties, version);

  // if (properties.shadingEnabled()) {
  //   // Calculate and add the diffuse and specular colors for each light.
  //   src += '  for (int i = 0; i < NUM_LIGHTS; ++i) {\n';
  //   src += properties.diffuseEnabled()  ? '    float d = diffuse(v_position, normal, view, material.shadingParams.xy, lights[i]);\n' : '';
  //   src += properties.specularEnabled() ? '    float s = specular(v_position, normal, view, material.shadingParams.zw, lights[i]);\n' : '';
  //
  //   // Assemble the light equation.
  //   src += '    gl_FragColor +=';
  //   src += properties.diffuseEnabled() ? ' d * (diffuseColor * lights[i].x)' : '';
  //   src += properties.diffuseEnabled() && properties.specularEnabled() ? ' +' : '';
  //   src += properties.specularEnabled() ? ' s * (specularColor * lights[i].y)' : '';
  //   src += ';\n';
  //   src += '  }\n';
  // }

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
