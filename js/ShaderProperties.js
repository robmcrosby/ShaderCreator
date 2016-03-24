
export default class ShaderProperties {
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

	diffuseFunction() {return this.diffuseMethod.options[this.diffuseMethod.value];}
	specularFunction() {return this.specularMethod.options[this.specularMethod.value];}
}
