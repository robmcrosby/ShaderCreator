
export default class Shader {
	constructor() {
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
	}

	createVertexSource() {
		var src = '';
		src += this.versionHeader();
		src += this.vertexDefines();
		src += this.vertexStructs();
		src += this.vertexFunctions();
		src += this.vertexAttributes();
		src += this.vertexUniforms();
		src += this.vertexOutput();
		src += this.vertexMain();
		return src;
	}

	createFragmentSource() {
		var src = '';
		src += this.versionHeader();
		src += this.fragmentDefines();
		src += this.fragmentStructs();
		src += this.fragmentFunctions();
		src += this.fragmentAttributes();
		src += this.fragmentUniforms();
		src += this.fragmentInput();
		src += this.fragmentMain();
		return src;
	}

	versionHeader() {
		return '#version 100\n\n';
	}


	/*
		Vertex Shader Parts
	*/
	vertexDefines() {
		return '';
	}

	vertexStructs() {
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

	vertexFunctions() {
		var str = '';

		// Transform To World Space
		str += 'vec4 transform(Model m, vec4 v) {\n';
		str += '  return m.transform * v;\n';
		str += '}\n\n';

		// Transform from World To Screen Space
		str += 'vec4 transform(Camera c, vec4 v) {\n';
		str += '  return c.projection * c.view * v;\n';
		str += '}\n\n';

		// Quaternion Rotate Function
		str += 'vec3 rotate(vec4 q, vec3 v) {\n';
		str += '  return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);\n';
		str += '}\n\n';

		return str;
	}

	vertexAttributes() {
		var str = '';
		str += 'attribute vec4 position;\n';
    str += 'attribute vec4 normal;\n';
		str += '\n';
		return str;
	}

	vertexUniforms() {
		var str = '';
		str += 'uniform Camera camera;\n';
		str += 'uniform Model  model;\n';
		str += '\n';
		return str;
	}

	vertexOutput() {
		var str = '';
		str += 'varying vec3 v_position;\n';
		str += 'varying vec3 v_normal;\n';
		str += '\n';
		return str;
	}

	vertexMain() {
		var str = 'void main() {\n';
		str += '  vec4 pos = transform(model, position);\n';
		str += '  gl_Position = transform(camera, pos);\n';
		str += '  v_position = pos.xyz;\n';
		str += '  v_normal = rotate(model.rotation, normal.xyz);\n';
		str += '}\n';
		return str;
	}


	/*
		Fragment Shader Parts
	*/
	fragmentDefines() {
		var str = '';
		str += '#define NUM_LIGHTS 8\n';
		str += '\n';
		return str;
	}

	fragmentStructs() {
		var str = '';

		// Camera Struct
		str += 'struct Camera {\n';
		str += '  mat4 projection;\n';
		str += '  mat4 view;\n';
		str += '  vec4 position;\n';
	  str += '};\n\n';

		// Material Struct
		str += 'struct Material {\n';
		str += '  vec4 ambiantColor;\n';
		str += '  vec4 diffuseColor;\n';
		str += '  vec4 specularColor;\n';
		str += '  vec4 shadingParams;\n';
		str += '};\n\n';

		return str;
	}

	diffuseFunction() {
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

	specularFunction() {
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

	fragmentFunctions() {
		var str = '';
		str += this.diffuseFunction();
		str += this.specularFunction();
		return str;
	}

	fragmentAttributes() {
		var str = '';
		return str;
	}

	fragmentUniforms() {
		var str = '';
		str += 'uniform Material material;\n';
		str += 'uniform Camera camera;\n';
		str += 'uniform mat4 lights[NUM_LIGHTS];\n';
		str += '\n';
		return str;
	}

	fragmentInput() {
		var str = '';
		str += 'varying vec3 v_position;\n';
		str += 'varying vec3 v_normal;\n';
		str += '\n';
		return str;
	}

	fragmentMain() {
		var str = 'void main() {\n';

		// Normalize the surface normal.
		str += '  vec3 normal = normalize(v_normal);\n'
		str += '  vec4 diffuseColor = material.diffuseColor;\n';
		str += '  vec4 specularColor = material.specularColor;\n';

		// Initalize the output color to the ambiant component.
		str += '  gl_FragColor = material.ambiantColor;\n';

		// Calculate and add the diffuse and specular colors for each light.
		str += '  for (int i = 0; i < NUM_LIGHTS; ++i) {\n';
		str += '    float d = diffuse(v_position, normal, material.shadingParams.xy, lights[i]);\n';
		str += '    float s = specular(v_position, normal, camera.position.xyz, material.shadingParams.zw, lights[i]);\n';
		str += '    gl_FragColor += d * (diffuseColor * lights[i].x) + s * (specularColor * lights[i].y);\n';
		str += '  }\n';

		// Always set the alpha component to 1.0.
		str += '  gl_FragColor.w = 1.0;\n';
		str += '}\n';
		return str;
	}
}
