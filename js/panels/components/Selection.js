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
			<div	class="form-group">
			<label>{this.props.label}: </label>
			<select ref="menu" value={value} onChange={::this.onChange} class="form-control">
				{options.map((o, i) => (<option key={i} value={i}>{o}</option>))}
			</select>
			</div>
		);
	}
}
