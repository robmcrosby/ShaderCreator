
export default class Shader {
	constructor() {
		this.diffuse = {
			label: 'Diffuse Shading Method',
			value: 1,
			options: ['Disabled', 'Lambert', 'Oren-Nayar', 'Toon', 'Minnaert', 'Fresnel'],
		}
		this.specular = {
			label: 'Specular Shading Method',
			value: 1,
			options: ['Disabled', 'CookTorr', 'Phong', 'Blinn', 'Toon', 'Wardlso'],
		}
	}

	vertexSrc() {
		return "Vertex Source";
	}

	fragmentSrc() {
		return "Fragment Source";
	}
}
