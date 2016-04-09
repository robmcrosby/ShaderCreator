import React from "react";
import {bindAll} from "class-bind";

import Properties from "./panels/Properties";
import Preview from "./panels/Preview";
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
					<Properties shader={this.props.shader} updateShader={this.updateShader} />
					<Preview shader={this.props.shader} />
				</div>
				<div class="row">
					<Source shader={this.props.shader} />
				</div>
			</div>
		);
	}
}

bindAll(Layout.prototype);
