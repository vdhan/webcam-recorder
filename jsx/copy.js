import React from 'react';

export default class Copy extends React.Component {
	getYear() {
		var year = 2016;
		return year + (new Date().getFullYear() > year && '-' + new Date().getFullYear());
	}

	render() {
		return (
			<div className="text-center text-primary m-t-sm">
				<p><strong>Copyright &copy; {this.getYear()}, Hoàng Ân</strong></p>
			</div>
		);
	}
}