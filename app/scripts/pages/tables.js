var React = require('react'),
	Reflux = require('reflux'),
	actions = require('../actions'),
	tableStore = require('../stores/table'),
	{ Link } = require('react-router');

module.exports = TablesList = React.createClass({
	mixins: [Reflux.connect(tableStore,"tables")],

	componentDidMount() {
		actions.loadTables();
	},

	render() {
		var tables = this.state.tables || [];

		return (
			<table className="table table-striped">
				<thead>
					<tr>
						<th>Name</th>
						<th>Families</th>
					</tr>
				</thead>
				<tbody>
					{tables.map(this.renderTable)}
				</tbody>
			</table>
		);
	},

	renderTable(table) {
		return (
			<tr key={table.TableName}>
				<td>
					<Link to="table" params={{name: table.TableName}}>{table.TableName}</Link>
				</td>
				<td>
					{table.Families.join(", ")}
				</td>
			</tr>
		)
	}
});
