import React from "react";
import ReactDOM from "react-dom";

import Layout from "./Layout";
import Shader from "./Shader";

class ClientState extends React.Component {
	constructor() {
		super();
		this.state = {shader: new Shader()};
	}
	updateShader(id, value) {
		const shader = this.state.shader;
		shader[id].value = value;
		this.setState({
			shader,
		});
	}

	render() {
		return (
			<div>
				<Layout shader={this.state.shader} updateShader={this.updateShader.bind(this)}/>
			</div>
		);
	}
}

const app = document.getElementById('app');
ReactDOM.render(<ClientState />, app);
