import React from "react";
import {bindAll} from "class-bind";

export default class CheckBox extends React.Component {
	constructor(props) {
		super(props);
	}

	onChange(e) {
		this.props.onChange(this.props.id, e.target.checked);
	}

	render() {
		const {label, option, value} = this.props;

		return (
			<div	class="form-group row">
				<label class="col-xs-4 form-control-label">{label}</label>
				<div class="col-xs-8">
					<div class="checkbox">
						<label><input type="checkbox" checked={value} onChange={this.onChange}/> {option}</label>
					</div>
				</div>
			</div>
		);
	}
}

bindAll(CheckBox.prototype);
