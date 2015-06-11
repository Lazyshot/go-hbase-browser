var React = require('react'),
	{ RouteHandler } = require('react-router'),
	{ Navbar, Nav, NavItem } = require('react-bootstrap');

module.exports = App = React.createClass({
	render() {
		return (
			<div>
				<Navbar brand='HBase Browser' toggleNavKey={0} />
				<div className="container">
					<RouteHandler {...this.props} />
				</div>
			</div>
		);
	}
});
