import React from "react";
import {bindAll} from "class-bind";

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
		var propertiesView;

		if (view === 'shading')
		 	propertiesView = <ShadingProperties shader={this.props.shader} updateShader={this.updateShader} />;
		else
			propertiesView = <InputProperties shader={this.props.shader} updateShader={this.updateShader} />

		return (
			<div class="col-xs-6">
			<div class="panel panel-default">
				<div class="panel-heading">
					<h4>Shader Properties</h4>
				</div>
				<div class="panel-body">
					<ul class="nav nav-tabs">
						<li role="presentation" class={view === 'shading' ? 'active' : ''}>
							<a href="#" id='shading' onClick={this.viewChange}>Shading</a>
						</li>
						<li role="presentation" class={view === 'input' ? 'active' : ''}>
							<a href="#" id='input' onClick={this.viewChange}>Input</a>
						</li>
					</ul>
					{propertiesView}
				</div>
			</div>
			</div>
		);
	}
}

bindAll(Properties.prototype);
