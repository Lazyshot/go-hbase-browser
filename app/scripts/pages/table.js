var React = require('react'),
	Reflux = require('reflux'),
	_ = require('lodash'),
	actions = require('../actions'),
	rowStore = require('../stores/row'),
	{Button, Input} = require('react-bootstrap');

module.exports = Table = React.createClass({
	mixins: [Reflux.connect(rowStore,"rows")],

	componentDidMount() {
		this.apply();
	},

	shouldComponentUpdate(nextProps, nextState) {
		return (nextState.key == this.state.key &&
				nextState.column == this.state.column &&
				nextState.limit == this.state.limit);
	},

	getInitialState() {
		return {
			key: null,
			column: null,
			limit: null
		};
	},

	apply() {
		actions.loadTable(this.props.params.name, this.state);
	},

	render() {
		var rows = this.state.rows || [],
			{key, column, limit} = this.state;

		console.clear();
		console.log("Access to the row data is available via the variable rows. Lodash on _.");
		window.rows = rows;
		window._ = _;

		return (
			<div className="table-container">
				<div className="form-inline">
					<Input
						type="text"
						value={key}
						placeholder="Keys (start-stop)"
						onChange={this.change('key')} />

					<Input
						type="text"
						placeholder="Columns (family:qual,)"
						value={column}
						onChange={this.change('column')} />

					<Input
						type="text"
						value={limit}
						placeholder="Limit (default: 25)"
						onChange={this.change('limit')} />

					<Button onClick={this.apply}>Apply</Button>
				</div>
				<table className="table table-striped">
					<thead>
						<tr>
							<th>Key</th>
						</tr>
					</thead>
					<tbody>
						{rows.map(this.renderRow)}
					</tbody>
				</table>
			</div>
		);
	},

	renderRow(row) {
		var key = row.key;

		var values = _.flatten(_.map(_.omit(row, 'key'), (fam, k) => {
			return _.map(fam, (v, col) => {
				return k + ":" + col + " = " + v;
			})
		}));

		return (
			<tr key={key}>
				<td>
					{key}
				</td>
				<td>
					{values.join("\t")}
				</td>
			</tr>
		)
	},

	change(field) {
		return (evt) => {
			var us = {};
			us[field] = evt.target.value;
			this.setState(us);
		};
	}
});
