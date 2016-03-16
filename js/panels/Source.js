import React from "react";

export default class Source extends React.Component {
	constructor(props) {
		super(props);
		this.state = {view: 'vert'};
	}

	viewChange(e) {
		console.log("View Change");
		this.setState({view: e.target.id});
	}

	render() {
		var view = this.state.view;
		var source = '';
		if (view === 'vert')
			source = this.props.shader.vertexSrc();
		else if (view === 'frag')
			source = this.props.shader.fragmentSrc();

		return (
			<div class="col-md-6">
			<div class="panel panel-default">
				<div class="panel-heading">
				<ul class="nav nav-pills">
  				<li role="presentation" class={view === 'vert' ? 'active' : ''}>
						<a href="#" id='vert' onClick={::this.viewChange}>Vertex</a>
					</li>
  				<li role="presentation" class={view === 'frag' ? 'active' : ''}>
						<a href="#" id='frag' onClick={::this.viewChange}>Fragment</a>
					</li>
				</ul>
				</div>
				<div class="panel-body">
					<div class="well">{source}</div>
				</div>
			</div>
			</div>
		);
	}
}
