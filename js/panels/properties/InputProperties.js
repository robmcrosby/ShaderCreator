import React from "react";

import Selection from "../components/Selection";
import CheckBox from "../components/CheckBox";

export default class InputProperties extends React.Component {
	constructor(props) {
		super(props);
	}

	updateShader(id, value) {
		this.props.updateShader(id, value);
	}

	render() {
		//const {diffuseEnable, diffuseMethod, specularEnable, specularMethod} = this.props.shader;

		return (
			<div class="well">
				<h3>Input Properties</h3>
			</div>
		);
	}
}
