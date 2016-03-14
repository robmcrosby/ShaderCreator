import React from "react";
import ReactDOM from "react-dom";

import Layout from "./Layout";

class ClientState extends React.Component {
	render() {
		return (
			<div>
				<Layout />
			</div>
		);
	}
}

const app = document.getElementById('app');
ReactDOM.render(<ClientState />, app);
