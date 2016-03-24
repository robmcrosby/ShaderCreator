import ShaderProperties from "./ShaderProperties";

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
    src += '#define NUM_LIGHTS 8\n\n';

  return src;
}

/**
 *
 */
function buildStructs(properties, version) {
  var src = '';

  if (properties.specularEnabled()) {
    // Camera Struct
    src += 'struct Camera {\n';
    src += '  mat4 projection;\n';
    src += '  mat4 view;\n';
    src += '  vec4 position;\n';
    src += '};\n\n';
  }

  // Material Struct
  src += 'struct Material {\n';
  src += '  vec4 ambiantColor;\n';
  src += '  vec4 diffuseColor;\n';
  src += '  vec4 specularColor;\n';
  src += '  vec4 shadingParams;\n';
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
  var src = 'float diffuse(vec3 position, vec3 normal, vec2 params, mat4 light) {\n';

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
  var src = 'float specular(vec3 position, vec3 normal, vec3 camera, vec4 params, mat4 light) {\n';

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
  if (properties.shadingEnabled()) {
    src += properties.specularEnabled() ? 'uniform Camera camera;\n' : '';
    src += 'uniform mat4 lights[NUM_LIGHTS];\n';
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
    src += buildInput('mediump', 'vec3', 'v_position', version);
    src += buildInput('mediump', 'vec3', 'v_normal', version);
  }

  // Add any vertex colors
  var numColors = properties.numberOfVertexColors();
  for (var i = 0; i < numColors; ++i)
    src += buildInput('mediump', 'vec4', 'v_color'+i, version);

  // Add any texture coordinates
  var numUVs = properties.numberOfUVs();
  for (var i = 0; i < numUVs; ++i)
    src += buildInput('mediump', 'vec2', 'v_uv'+i, version);

  return src.length > 0 ? src + '\n' : '';
}

/**
 *
 */
 function buildInput(precision, type, name, version) {
   var src = version.version > 2.0 ? 'in ' : 'varying ';
   src += version.platform === 'embeded' ? precision+' ' : '';
   return src + type + ' ' + name + ';\n';
 }

/**
 *
 */
function buildOutputs(properties, version) {
  if (version.version > 2.0)
    return 'out vec4 gl_FragColor;\n\n';
  return '';
}

/**
 *
 */
function buildMain(properties, version) {
  var src = 'void main() {\n';

  // Normalize the surface normal.
  src += properties.shadingEnabled()  ? '  vec3 normal = normalize(v_normal);\n' : '';
  src += properties.diffuseEnabled()  ? '  vec4 diffuseColor = material.diffuseColor;\n' : '';
  src += properties.specularEnabled() ? '  vec4 specularColor = material.specularColor;\n' : '';

  // Initalize the output color to the ambiant component.
  src += '  gl_FragColor = material.ambiantColor'
  if (properties.ambiantInput.value > 0 && properties.ambiantInput.value <= 2)
    src += ' * v_color' + (properties.ambiantInput.value-1) + ';\n';
  else if (properties.ambiantInput.value > 2) {
    src += version.version > 2.0 ? ' * texture' : ' * texture2D';
    src += '(texture' + (properties.ambiantInput.value-3) + ', v_uv0);\n';
  }
  else
    src += ';\n';

  if (properties.shadingEnabled()) {
    // Calculate and add the diffuse and specular colors for each light.
    src += '  for (int i = 0; i < NUM_LIGHTS; ++i) {\n';
    src += properties.diffuseEnabled()  ? '    float d = diffuse(v_position, normal, material.shadingParams.xy, lights[i]);\n' : '';
    src += properties.specularEnabled() ? '    float s = specular(v_position, normal, camera.position.xyz, material.shadingParams.zw, lights[i]);\n' : '';

    // Assemble the light equation.
    src += '    gl_FragColor +=';
    src += properties.diffuseEnabled() ? ' d * (diffuseColor * lights[i].x)' : '';
    src += properties.diffuseEnabled() && properties.specularEnabled() ? ' +' : '';
    src += properties.specularEnabled() ? ' s * (specularColor * lights[i].y)' : '';
    src += ';\n';
    src += '  }\n';
  }

  // Always set the alpha component to 1.0.
  src += '  gl_FragColor.w = 1.0;\n';
  src += '}\n';
  return src;
}
