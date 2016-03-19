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
		const {ambiantColorInput, diffuseColorInput} = this.props.shader;

		return (
			<div class="well">
			<Selection id="ambiantColorInput" label={ambiantColorInput.label} options={ambiantColorInput.options} value={ambiantColorInput.value} onChange={this.updateShader.bind(this)}/>
				<Selection id="diffuseColorInput" label={diffuseColorInput.label} options={diffuseColorInput.options} value={diffuseColorInput.value} onChange={this.updateShader.bind(this)}/>
			</div>
		);
	}
}
