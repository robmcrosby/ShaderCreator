import React from "react";

export default class Preview extends React.Component {
  constructor(props) {
		super(props);
	}

  render() {
    var canvasStyles = {
      width: '100%',
      height: 'auto'
    };

    return(
      <div class="col-md-6">
      <div class="panel panel-default">
        <div class="panel-heading">
          <h4>Shader Preview</h4>
        </div>
        <div class="panel-body">
        <canvas id="glcanvas" width="300" height="300" style={canvasStyles}>
          Your browser does not appear to support the
          <code>&lt;canvas&gt;</code> element.
        </canvas>
        </div>
      </div>
      </div>
    );
  }
}
