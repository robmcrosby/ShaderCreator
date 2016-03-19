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
			<div class="container">
				<h1>Shader Creator</h1>
				<div class="row">
					<Properties shader={this.props.shader} updateShader={this.updateShader.bind(this)} />
					<Source shader={this.props.shader} />
				</div>
			</div>
		);
	}
}
