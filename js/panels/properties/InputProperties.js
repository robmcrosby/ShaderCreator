import React from "react";
import {bindAll} from "class-bind";

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
		const {ambiantInput, diffuseInput} = this.props.shader;

		return (
			<div class="well">
				<Selection id="ambiantInput" label={ambiantInput.label} options={ambiantInput.options} value={ambiantInput.value} onChange={this.updateShader}/>
				<Selection id="diffuseInput" label={diffuseInput.label} options={diffuseInput.options} value={diffuseInput.value} onChange={this.updateShader}/>
			</div>
		);
	}
}

bindAll(InputProperties.prototype);
