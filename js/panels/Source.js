import React from "react";

export default class Source extends React.Component {
	constructor(props) {
		super(props);
		this.state = {view: 'vert'};
	}

	viewChange(e) {
		this.setState({view: e.target.id});
	}

	render() {
		var view = this.state.view;

		var source = '';
		if (view === 'vert')
			source = this.props.shader.createVertexSource();
		else if (view === 'frag')
			source = this.props.shader.createFragmentSource();

		return (
			<div class="col-md-6">
			<div class="panel panel-default">
				<div class="panel-heading">
					<h4>Shader Source</h4>
				</div>
				<div class="panel-body">
					<ul class="nav nav-tabs">
	  				<li role="presentation" class={view === 'vert' ? 'active' : ''}>
							<a href="#" id='vert' onClick={this.viewChange.bind(this)}>Vertex</a>
						</li>
	  				<li role="presentation" class={view === 'frag' ? 'active' : ''}>
							<a href="#" id='frag' onClick={this.viewChange.bind(this)}>Fragment</a>
						</li>
					</ul>
					<pre>{source}</pre>
				</div>
			</div>
			</div>
		);
	}
}
