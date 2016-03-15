import React from "react";
import ReactDOM from "react-dom";

import Layout from "./Layout";

class ClientState extends React.Component {
	constructor() {
		super();
		this.state = {
			shader: {
				diffuse: {
					label: 'Diffuse Shading',
					value: 1,
					options: ['Disabled', 'Lambert', 'Oren-Nayar', 'Toon', 'Minnaert', 'Fresnel'],
				},
				specular: {
					label: 'Specular Shading',
					value: 1,
					options: ['Disabled', 'CookTorr', 'Phong', 'Blinn', 'Toon', 'Wardlso'],
				},
			},
		};
	}
	updateShader(id, value) {
		console.log("Change Value of: " + id + " to: " + value);
		const shader = this.state.shader;
		shader[id].value = value;
		this.setState({
			shader,
		});
	}

	render() {
		return (
			<div>
				<Layout shader={this.state.shader} updateShader={::this.updateShader}/>
			</div>
		);
	}
}

const app = document.getElementById('app');
ReactDOM.render(<ClientState />, app);
