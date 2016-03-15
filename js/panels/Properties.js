import React from "react";

import Selection from "./components/Selection"

export default class Properties extends React.Component {
	render() {
		return (
			<div>
				<h2>Properties</h2>
				<Selection label="Diffuse Shading" />
				<Selection label="Specular Shading" />
			</div>
		);
	}
}