import React from "react";

export default class Source extends React.Component {
	constructor(props) {
		super(props);
		this.state = {view: 'vertex'};
	}

	viewChange(e) {
		console.log("View Change");
		this.setState({view: e.target.id});
	}

	render() {
		var view = this.state.view;
		var source = '';
		if (view === 'vertex')
			source = this.props.shader.vertexSrc();
		else if (view === 'fragment')
			source = this.props.shader.fragmentSrc();

		return (
			<div>
				<h2>Source</h2>
				<div>
					<button id='vertex' onClick={::this.viewChange}>Vertex</button>
					<button id='fragment' onClick={::this.viewChange}>Fragment</button>
				</div>
				<div>
					<textarea value={source} readOnly />
				</div>
			</div>
		);
	}
}
