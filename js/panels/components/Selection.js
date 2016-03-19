import React from "react";

export default class Selection extends React.Component {
	constructor(props) {
		super(props);
	}

	onChange(e) {
		this.props.onChange(this.props.id, e.target.value);
	}

	render() {
		const {label, options, value, disabled} = this.props;
		var disable = disabled !== undefined && disabled;

		return (
			<div	class="form-group row">
				<label class="col-xs-4 form-control-label">{label}</label>
				<div class="col-xs-8">
					<select ref="menu" value={value} onChange={this.onChange.bind(this)} disabled={disable} class="form-control">
						{options.map((o, i) => (<option key={i} value={i}>{o}</option>))}
					</select>
				</div>
			</div>
		);
	}
}
