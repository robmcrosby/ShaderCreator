import React from "react";
import {bindAll} from "class-bind";

import GLCanvas from "./viewport/GLCanvas";

export default class Preview extends React.Component {
  constructor(props) {
		super(props);

    // Load the Meshes
    this.meshes = require('json!./viewport/Meshes.json');

    // Set the active mesh
    this.state = {active: this.meshes[0].name};
	}

  meshChange(e) {
    this.setState({active: e.target.id});
  }

  render() {
    var active = this.state.active;
    var onFunc = this.meshChange;
    var tabs = this.meshes.map(function(mesh) {
      return(<li class={mesh.name === active ? 'active' : ''} key={mesh.name}>
               <a href="#" id={mesh.name} onClick={onFunc}>{mesh.name}</a>
             </li>);
    });

    return(
      <div class="col-xs-6">
      <div class="panel panel-default">
        <div class="panel-heading">
          <h4>Preview</h4>
        </div>
        <div class="panel-body">
          <ul class="nav nav-tabs">
            {tabs}
          </ul>
          <GLCanvas shader={this.props.shader} meshes={this.meshes} active={this.state.active} />
        </div>
      </div>
      </div>
    );
  }
}

bindAll(Preview.prototype);
