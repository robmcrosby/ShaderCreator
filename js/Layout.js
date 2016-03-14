import React from "react";

import Properties from "./panels/Properties";
import Source from "./panels/Source";

export default class Layout extends React.Component {
	render() {
		return (
			<div>
				<h1>Shader Creator</h1>
				<Properties />
				<Source />
			</div>
		);
	}
}
