import React from "react";

import Selection from "./components/Selection"

export default class Properties extends React.Component {
	constructor(props) {
		super(props);
	}

	updateShader(id, value) {
		this.props.updateShader(id, value);
	}

	render() {
		const diffuse = this.props.shader.diffuse;
		const specular = this.props.shader.specular;

		return (
			<div>
				<h2>Properties</h2>
				<Selection id="diffuse" label={diffuse.label} options={diffuse.options} value={diffuse.value} onChange={::this.updateShader} />
				<Selection id="specular" label={specular.label} options={specular.options} value={specular.value} onChange={::this.updateShader} />
			</div>
		);
	}
}