import React from "react";

export default class Source extends React.Component {
	render() {
		var source = this.props.shader.vertexSrc();

		return (
			<div>
				<h2>Source</h2>
				<button>Vertex</button>
				<button>Fragment</button>
				<br/>
				<textarea value={source} readOnly />
			</div>
		);
	}
}