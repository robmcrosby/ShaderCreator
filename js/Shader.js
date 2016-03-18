
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
			options: ['Lambert', 'Oren-Nayar', 'Toon', 'Minnaert', 'Fresnel', 'Shadeless'],
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
		return str;
	}

	fragmentFunctions() {
		var str = '';
		return str;
	}

	fragmentAttributes() {
		var str = '';
		return str;
	}

	fragmentUniforms() {
		var str = '';
		str += 'uniform mediump vec4 color;\n';
		return str;
	}

	fragmentInput() {
		var str = '';
		str += 'varying vec3 v_normal;\n';
		str += '\n';
		return str;
	}

	fragmentMain() {
		var str = 'void main() {\n';
		str += '  gl_FragColor = vec4(color.xyz * dot(v_normal, vec3(0.0, 1.0, 0.0)), color.w);\n';
		str += '}\n';
		return str;
	}
}
