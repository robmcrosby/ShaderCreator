import React from "react";

import ShadingProperties from "./properties/ShadingProperties";
import InputProperties from "./properties/InputProperties";

export default class Properties extends React.Component {
	constructor(props) {
		super(props);
		this.state = {view: 'shading'};
	}

	updateShader(id, value) {
		this.props.updateShader(id, value);
	}

	viewChange(e) {
		this.setState({view: e.target.id});
	}

	render() {
		var view = this.state.view;
		var viewTag;

		if (view === 'shading')
		 	viewTag = <ShadingProperties shader={this.props.shader} updateShader={this.updateShader.bind(this)} />;
		else
			viewTag = <InputProperties shader={this.props.shader} updateShader={this.updateShader.bind(this)} />

		return (
			<div class="col-md-6">
			<div class="panel panel-default">
				<div class="panel-heading">
					<h4>Shader Properties</h4>
				</div>
				<div class="panel-body">
					<ul class="nav nav-tabs">
						<li role="presentation" class={view === 'shading' ? 'active' : ''}>
							<a href="#" id='shading' onClick={this.viewChange.bind(this)}>Shading</a>
						</li>
						<li role="presentation" class={view === 'input' ? 'active' : ''}>
							<a href="#" id='input' onClick={this.viewChange.bind(this)}>Input</a>
						</li>
					</ul>
					{viewTag}
				</div>
			</div>
			</div>
		);
	}
}
