import React from "react";

export default class Selection extends React.Component {
	constructor(props) {
		super(props);
	}

	onChange(e) {
		this.props.onChange(this.props.id, e.target.value);
	}

	render() {
		const {label, options, value} = this.props;

		return (
			<div	class="form-group row">
				<label class="col-sm-6 form-control-label">{this.props.label}: </label>
				<div class="col-sm-6">
					<select ref="menu" value={value} onChange={::this.onChange} class="form-control">
						{options.map((o, i) => (<option key={i} value={i}>{o}</option>))}
					</select>
				</div>
			</div>
		);
	}
}
