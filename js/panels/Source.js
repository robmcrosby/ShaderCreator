import React from "react";
import {bindAll} from "class-bind";

import Selection from "./components/Selection";

export default class Source extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			view: 'vert',
			version: 0,
		};
	}

	viewChange(e) {
		this.setState({
			view: e.target.id,
			version: this.state.version,
		});
	}

	updateVersion(id, value) {
		this.setState({
			view: this.state.view,
			version: value,
		});
	}

	render() {
		var view = this.state.view;
		var versions = this.props.shader.supportedVersions;

		var versionOptions = [];
		for (var i = 0; i < versions.length; ++i)
			versionOptions.push(versions[i].label);

		var source = '';
		if (view === 'vert')
			source = this.props.shader.createVertexSource(versions[this.state.version]);
		else if (view === 'frag')
			source = this.props.shader.createFragmentSource(versions[this.state.version]);

		return (
			<div class="col-md-6">
			<div class="panel panel-default">
				<div class="panel-heading">
					<h4>Shader Source</h4>
				</div>
				<div class="panel-body">
					<Selection id="versionSelection" label='OpenGL Version' options={versionOptions} value={this.state.version} onChange={this.updateVersion}/>
					<ul class="nav nav-tabs">
	  				<li role="presentation" class={view === 'vert' ? 'active' : ''}>
							<a href="#" id='vert' onClick={this.viewChange}>Vertex</a>
						</li>
	  				<li role="presentation" class={view === 'frag' ? 'active' : ''}>
							<a href="#" id='frag' onClick={this.viewChange}>Fragment</a>
						</li>
					</ul>
					<pre>{source}</pre>
				</div>
			</div>
			</div>
		);
	}
}

bindAll(Source.prototype);
