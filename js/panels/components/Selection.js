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
			<div>
			<label>{this.props.label}: </label>
			<select ref="menu" value={value} onChange={::this.onChange}>
				{options.map((o, i) => (<option key={i} value={i}>{o}</option>))}
			</select>
			</div>
		);
	}
}