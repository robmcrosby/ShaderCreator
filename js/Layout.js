import React from "react";

import Properties from "./panels/Properties";
import Source from "./panels/Source";

export default class Layout extends React.Component {
	constructor(props) {
		super(props);
	}

	updateShader(id, value) {
		this.props.updateShader(id, value);
	}

	render() {
		return (
			<div>
				<h1>Shader Creator</h1>
				<Properties shader={this.props.shader} updateShader={::this.updateShader} />
				<Source />
			</div>
		);
	}
}
