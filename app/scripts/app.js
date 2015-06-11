var React = require('react'),
	Router = require('react-router'),
	{ Route, DefaultRoute } = Router;

var App = require('./pages/app'),
	Table = require('./pages/table'),
	TablesList = require('./pages/tables');

var routes = (
	<Route handler={App} path="/">
		<Route handler={Table} name="table" path="/table/:name" />
		<DefaultRoute handler={TablesList} />
	</Route>
);

Router.run(routes, Router.HistoryLocation, function (Handler, state) {
	React.render(<Handler params={state.params}/>, document.body);
});
