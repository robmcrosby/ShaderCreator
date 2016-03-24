import React from "react";
import ReactDOM from "react-dom";
import {bindAll} from "class-bind";

import Layout from "./Layout";
import ShaderProperties from "./models/ShaderProperties";

class ClientState extends React.Component {
	constructor() {
		super();
		this.state = {shader: new ShaderProperties()};
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
				<Layout shader={this.state.shader} updateShader={this.updateShader}/>
			</div>
		);
	}
}

bindAll(ClientState.prototype);

const app = document.getElementById('app');
ReactDOM.render(<ClientState />, app);
