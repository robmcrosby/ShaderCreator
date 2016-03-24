
export default class Shader {
	constructor() {
		this.ambiantInput = {
			label: 'Ambiant Color',
			value: 0,
			options: ['Material Ambiant Color', 'Vertex Color 1', 'Vertex Color 2', 'Texture 1', 'Texture 2'],
		}
		this.diffuseEnable = {
			label: 'Diffuse Shading',
			value: true,
			option: 'Enable',
		}
		this.diffuseMethod = {
			label: 'Diffuse Method',
			value: 0,
			options: ['Lambert', 'Oren-Nayar', 'Toon', 'Minnaert', 'Fresnel'],
		}
		this.diffuseInput = {
			label: 'Diffuse Color',
			value: 0,
			options: ['Material Diffuse Color', 'Vertex Color 1', 'Vertex Color 2', 'Texture 1', 'Texture 2'],
		}
		this.specularEnable = {
			label: 'Specular Shading',
			value: true,
			option: 'Enable',
		}
		this.specularMethod = {
			label: 'Specular Method',
			value: 0,
			options: ['CookTorr', 'Phong', 'Blinn', 'Toon', 'Wardlso'],
		}
		this.supportedVersions = [
			{label: 'OpenGL ES 2.0', header: '#version 100',    platform:'embeded', version: 2.0},
			{label: 'OpenGL ES 3.0', header: '#version 300 es', platform:'embeded', version: 3.0},
			{label: 'OpenGL 4.1',    header: '#version 410',    platform:'desktop', version: 4.1},
		];
	}

	diffuseEnabled() {return this.diffuseEnable.value;}
	specularEnabled() {return this.specularEnable.value;}
	shadingEnabled() {return this.diffuseEnabled() || this.specularEnabled();}

	ambiantInputType() {return this.ambiantInput.options[this.ambiantInput.value];}
	diffuseInputType() {return this.diffuseInput.options[this.diffuseInput.value];}

	numberOfVertexColors() {
		var count = 0;

		var value = this.ambiantInput.value;
		if (value <= 2)
			count = Math.max(count, value);

		value = this.diffuseInput.value;
		if (value <= 2)
			count = Math.max(count, value);

		return count;
	}
	numberOfTextures() {
		var count = 0;

		var value = this.ambiantInput.value - 2;
		count = Math.max(count, value);

		value = this.diffuseInput.value - 2;
		count = Math.max(count, value);

		return count;
	}
	numberOfUVs() {
		// TODO: Update this to handle more than one UV.
		return this.numberOfTextures() > 0 ? 1 : 0;
	}

	createVertexSource(version) {
		var src = '';
		src += this.vertexDefines(version);
		src += this.vertexStructs(version);
		src += this.vertexFunctions(version);
		src += this.vertexInputs(version);
		src += this.vertexUniforms(version);
		src += this.vertexOutputs(version);
		src += this.vertexMain(version);
		return src;
	}

	createFragmentSource(version) {
		var src = '';
		src += this.fragmentDefines(version);
		src += this.fragmentStructs(version);
		src += this.fragmentFunctions(version);
		src += this.fragmentUniforms(version);
		src += this.fragmentTextures(version);
		src += this.fragmentInputs(version);
		src += this.fragmentOutputs(version);
		src += this.fragmentMain(version);
		return src;
	}


	/*
		Vertex Shader Parts
	*/
	vertexDefines(version) {
		var str = version.header + '\n\n';
		return str;
	}

	vertexStructs(version) {
		var str = '';

		// Camera Struct
		str += 'struct Camera {\n';
		str += '  mat4 projection;\n';
		str += '  mat4 view;\n';
		str += '  vec4 position;\n';
	  str += '};\n\n';

		// Model Struct
		str += 'struct Model {\n';
		str += '  mat4 transform;\n';
		str += '  vec4 rotation;\n';
		str += '};\n\n';

		return str;
	}

	vertexFunctions(version) {
		var str = '';

		// Transform To World Space
		str += 'vec4 transform(Model m, vec4 v) {\n';
		str += '  return m.transform * v;\n';
		str += '}\n\n';

		// Transform from World To Screen Space
		str += 'vec4 transform(Camera c, vec4 v) {\n';
		str += '  return c.projection * c.view * v;\n';
		str += '}\n\n';

		if (this.shadingEnabled()) {
			// Quaternion Rotate Function
			str += 'vec3 rotate(vec4 q, vec3 v) {\n';
			str += '  return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);\n';
			str += '}\n\n';
		}

		return str;
	}

	vertexInput(type, name, version) {
		var str = version.version > 2.0 ? 'in' : 'attribute';
		return str + ' ' + type + ' ' + name + ';\n';
	}

	vertexInputs(version) {
		var str = '';
		// Always add position
		str += this.vertexInput('vec4', 'position', version);

		// Add normal if there will be shading
		if (this.shadingEnabled())
			str += this.vertexInput('vec4', 'normal', version);

		// Add any vertex colors
		var numColors = this.numberOfVertexColors();
		for (var i = 0; i < numColors; ++i)
			str += this.vertexInput('vec4', 'color'+i, version);

		// Add any texture coordinates
		var numUVs = this.numberOfUVs();
		for (var i = 0; i < numUVs; ++i)
			str += this.vertexInput('vec2', 'uv'+i, version);

		return str + '\n';
	}

	vertexUniforms(version) {
		var str = '';
		str += 'uniform Camera camera;\n';
		str += 'uniform Model  model;\n';
		str += '\n';
		return str;
	}

	vertexOutput(type, name, version) {
		var str = version.version > 2.0 ? 'out ' : 'varying ';
		return str + type + ' ' + name + ';\n';
	}

	vertexOutputs(version) {
		var str = '';

		// Pass position and normal if there is shading
		if (this.shadingEnabled()) {
			str += this.vertexOutput('vec3', 'v_position', version);
			str += this.vertexOutput('vec3', 'v_normal', version);
		}

		// Pass any vertex colors
		var numColors = this.numberOfVertexColors();
		for (var i = 0; i < numColors; ++i)
			str += this.vertexOutput('vec4', 'v_color'+i, version);

		// Pass any texture coordinates
		var numUVs = this.numberOfUVs();
		for (var i = 0; i < numUVs; ++i)
			str += this.vertexOutput('vec2', 'v_uv'+i, version);

		return str + '\n';
	}

	vertexMain(version) {
		var str = 'void main() {\n';
		str += '  vec4 pos = transform(model, position);\n';
		str += '  gl_Position = transform(camera, pos);\n';

		// Assign the position and the rotated normal
		if (this.shadingEnabled()) {
			str += '  v_position = pos.xyz;\n';
			str += '  v_normal = rotate(model.rotation, normal.xyz);\n';
		}

		// Assign any vertex colors
		var numColors = this.numberOfVertexColors();
		for (var i = 0; i < numColors; ++i)
			str += '  v_color'+i + ' = color'+i + ';\n';

		// Assign any texture coordinates
		var numUVs = this.numberOfUVs();
		for (var i = 0; i < numUVs; ++i)
			str += '  v_uv'+i + ' = uv'+i + ';\n';

		return str + '}\n';
	}


	/*
		Fragment Shader Parts
	*/
	fragmentDefines(version) {
		var str = version.header + '\n\n';

		if (this.shadingEnabled()) {
			str += '#define NUM_LIGHTS 8\n';
			str += '\n';
		}
		return str;
	}

	fragmentStructs(version) {
		var str = '';

		if (this.specularEnabled()) {
			// Camera Struct
			str += 'struct Camera {\n';
			str += '  mat4 projection;\n';
			str += '  mat4 view;\n';
			str += '  vec4 position;\n';
	  	str += '};\n\n';
		}

		// Material Struct
		str += 'struct Material {\n';
		str += '  vec4 ambiantColor;\n';
		str += '  vec4 diffuseColor;\n';
		str += '  vec4 specularColor;\n';
		str += '  vec4 shadingParams;\n';
		str += '};\n\n';

		return str;
	}

	diffuseFunction(version) {
		var str = 'vec4 diffuse(vec3 position, vec3 normal, vec2 params, mat4 light) {\n';
		if (this.diffuseMethod.value == 0) {
			// Lambert
			str += '  // Lambert\n';
			str += '  return 0.0;\n';
		}
		else if (this.diffuseMethod.value == 1) {
			// Oren-Nayar
			str += '  // Oren-Nayar\n';
			str += '  return 0.0;\n';
		}
		else if (this.diffuseMethod.value == 2) {
			// Toon
			str += '  // Toon\n';
			str += '  return 0.0;\n';
		}
		else if (this.diffuseMethod.value == 3) {
			// Minnaert
			str += '  // Minnaert\n';
			str += '  return 0.0;\n';
		}
		else if (this.diffuseMethod.value == 4) {
			// Fresnel
			str += '  // Fresnel\n';
			str += '  return 0.0;\n';
		}
		else {
			// Shadeless
			str += '  // Shadeless\n';
			str += '  return 0.0;\n';
		}
		return str + '}\n\n';
	}

	specularFunction(version) {
		var str = 'vec4 specular(vec3 position, vec3 normal, vec3 camera, vec4 params, mat4 light) {\n';
		if (this.specularMethod.value == 0) {
			// Lambert
			str += '  // CookTorr\n';
			str += '  return 0.0;\n';
		}
		else if (this.specularMethod.value == 1) {
			// Phong
			str += '  // Phong\n';
			str += '  return 0.0;\n';
		}
		else if (this.specularMethod.value == 2) {
			// Blinn
			str += '  // Blinn\n';
			str += '  return 0.0;\n';
		}
		else if (this.specularMethod.value == 3) {
			// Toon
			str += '  // Toon\n';
			str += '  return 0.0;\n';
		}
		else if (this.specularMethod.value == 4) {
			// Wardlso
			str += '  // Wardlso\n';
			str += '  return 0.0;\n';
		}
		else {
			// Shadeless
			str += '  // Shadeless\n';
			str += '  return 0.0;\n';
		}
		return str + '}\n\n';
	}

	fragmentFunctions(version) {
		var str = '';
		str += this.diffuseEnabled() ? this.diffuseFunction(version) : '';
		str += this.specularEnabled() ? this.specularFunction(version) : '';
		return str;
	}

	fragmentUniforms(version) {
		var str = 'uniform Material material;\n';
		if (this.shadingEnabled()) {
			str += this.specularEnabled() ? 'uniform Camera camera;\n' : '';
			str += 'uniform mat4 lights[NUM_LIGHTS];\n';
		}
		str += '\n';
		return str;
	}

	fragmentTextures(version) {
		var str = '';
		var numTextures = this.numberOfTextures();
		if (numTextures > 0) {
			for (var i = 0; i < numTextures; ++i)
				str += 'uniform sampler2D texture' + i + ';\n';
			str += '\n';
		}
		return str;
	}

	fragmentInput(precision, type, name, version) {
		var str = version.version > 2.0 ? 'in ' : 'varying ';
		str += version.platform === 'embeded' ? precision+' ' : '';
		return str + type + ' ' + name + ';\n';
	}

	fragmentInputs(version) {
		var str = '';
		if (this.shadingEnabled()) {
			str += this.fragmentInput('mediump', 'vec3', 'v_position', version);
			str += this.fragmentInput('mediump', 'vec3', 'v_normal', version);
		}

		// Add any vertex colors
		var numColors = this.numberOfVertexColors();
		for (var i = 0; i < numColors; ++i)
			str += this.fragmentInput('mediump', 'vec4', 'v_color'+i, version);

		// Add any texture coordinates
		var numUVs = this.numberOfUVs();
		for (var i = 0; i < numUVs; ++i)
			str += this.fragmentInput('mediump', 'vec2', 'v_uv'+i, version);

		return str + '\n';
	}

	fragmentOutputs(version) {
		var str = '';
		if (version.version > 2.0)
			str += 'out vec4 gl_FragColor;\n\n';
		return str;
	}

	fragmentMain(version) {
		var str = 'void main() {\n';

		// Normalize the surface normal.
		str += this.shadingEnabled() ? '  vec3 normal = normalize(v_normal);\n' : '';
		str += this.diffuseEnabled() ? '  vec4 diffuseColor = material.diffuseColor;\n' : '';
		str += this.specularEnabled() ? '  vec4 specularColor = material.specularColor;\n' : '';

		// Initalize the output color to the ambiant component.
		str += '  gl_FragColor = material.ambiantColor'
		if (this.ambiantInput.value > 0 && this.ambiantInput.value <= 2)
			str += ' * v_color' + (this.ambiantInput.value-1) + ';\n';
		else if (this.ambiantInput.value > 2) {
			str += version.version > 2.0 ? ' * texture' : ' * texture2D';
			str += '(texture' + (this.ambiantInput.value-3) + ', v_uv0);\n';
		}
		else
			str += ';\n';

		if (this.shadingEnabled()) {
			// Calculate and add the diffuse and specular colors for each light.
			str += '  for (int i = 0; i < NUM_LIGHTS; ++i) {\n';
			str += this.diffuseEnabled() ? '    float d = diffuse(v_position, normal, material.shadingParams.xy, lights[i]);\n' : '';
			str += this.specularEnabled() ? '    float s = specular(v_position, normal, camera.position.xyz, material.shadingParams.zw, lights[i]);\n' : '';

			// Assemble the light equation.
			str += '    gl_FragColor +=';
			str += this.diffuseEnabled() ? ' d * (diffuseColor * lights[i].x)' : '';
			str += this.diffuseEnabled() && this.specularEnabled() ? ' +' : '';
			str += this.specularEnabled() ? ' s * (specularColor * lights[i].y)' : '';
			str += ';\n';
			str += '  }\n';
		}

		// Always set the alpha component to 1.0.
		str += '  gl_FragColor.w = 1.0;\n';
		str += '}\n';
		return str;
	}
}
