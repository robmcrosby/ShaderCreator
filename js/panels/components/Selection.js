import React from "react";

export default class Selection extends React.Component {
	render() {
		return (
			<div>
			<span>{this.props.label}: </span>
			<select>
				<option>Option 1</option>
				<option>Option 2</option>
				<option>Option 3</option>
			</select>
			</div>
		);
	}
}