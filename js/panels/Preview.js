import React from "react";
import GLCanvas from "./viewport/GLCanvas";

export default class Preview extends React.Component {
  constructor(props) {
		super(props);
	}

  render() {
    return(
      <div class="col-md-6">
      <div class="panel panel-default">
        <div class="panel-heading">
          <h4>Shader Preview</h4>
        </div>
        <div class="panel-body">
        <GLCanvas />
        </div>
      </div>
      </div>
    );
  }
}
