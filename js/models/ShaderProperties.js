
export default class ShaderProperties {
	constructor() {
		this.ambiantInput = {
			label: 'Ambiant Color',
			value: 0,
			options: ['Material Ambiant Color', 'Vertex Color', 'Texture 1', 'Texture 2'],
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
			options: ['Material Diffuse Color', 'Vertex Color', 'Texture 1', 'Texture 2'],
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

	diffuseEnabled() {return this.diffuseEnable.value;}
	specularEnabled() {return this.specularEnable.value;}
	shadingEnabled() {return this.diffuseEnabled() || this.specularEnabled();}

	inputType(value) {
		if (value > 0 && value <= 1)
			return 'Vertex';
		if (value > 1)
			return 'Texture';
		return 'Material';
	}

	inputIndex(value) {
		if (value > 0 && value <= 1)
			return value-1;
		if (value > 1)
			return value-2;
		return 0;
	}

	ambiantInputType() {return this.inputType(this.ambiantInput.value);}
	ambiantInputIndex() {return this.inputIndex(this.ambiantInput.value);}

	diffuseInputType() {return this.inputType(this.diffuseInput.value);}
	diffuseInputIndex() {return this.inputIndex(this.diffuseInput.value);}

	numberOfVertexColors() {
		var count = 0;

		var value = this.ambiantInput.value;
		if (value <= 1)
			count = Math.max(count, value);

		value = this.diffuseInput.value;
		if (value <= 1)
			count = Math.max(count, value);

		return count;
	}

	numberOfTextures() {
		var count = 0;

		var value = this.ambiantInput.value - 1;
		count = Math.max(count, value);

		value = this.diffuseInput.value - 1;
		count = Math.max(count, value);

		return count;
	}

	numberOfUVs() {
		return this.numberOfTextures() > 0 ? 1 : 0;
	}

	diffuseFunction() {return this.diffuseMethod.options[this.diffuseMethod.value];}
	specularFunction() {return this.specularMethod.options[this.specularMethod.value];}
}
