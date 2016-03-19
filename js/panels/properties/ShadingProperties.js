import React from "react";

import Selection from "../components/Selection";
import CheckBox from "../components/CheckBox";

export default class ShadingProperties extends React.Component {
	constructor(props) {
		super(props);
	}

	updateShader(id, value) {
		this.props.updateShader(id, value);
	}

	render() {
		const {diffuseEnable, diffuseMethod, specularEnable, specularMethod} = this.props.shader;

		return (
			<div class="well">
				<CheckBox id="diffuseEnable" label={diffuseEnable.label} option={diffuseEnable.option} value={diffuseEnable.value} onChange={this.updateShader.bind(this)}/>
				<Selection id="diffuseMethod" label={diffuseMethod.label} options={diffuseMethod.options} value={diffuseMethod.value} disabled={!diffuseEnable.value} onChange={this.updateShader.bind(this)}/>
				<CheckBox id="specularEnable" label={specularEnable.label} option={specularEnable.option} value={specularEnable.value} onChange={this.updateShader.bind(this)}/>
				<Selection id="specularMethod" label={specularMethod.label} options={specularMethod.options} value={specularMethod.value} disabled={!specularEnable.value} onChange={this.updateShader.bind(this)}/>
			</div>
		);
	}
}
