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

		var fams = _.without(_.uniq(_.flatten(_.map(rows, (row) => {
			return _.keys(row);
		}))), 'key');

		var createFamilyHeader = (fam) => {
			return <th>{fam}</th>
		};

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
				<div className="table-responsive">
					<table className="table table-striped">
						<thead>
							<tr>
								<th>Key</th>
								{fams.map(createFamilyHeader)}
							</tr>
						</thead>
						<tbody>
							{rows.map(this.renderRow(fams))}
						</tbody>
					</table>
				</div>
			</div>
		);
	},

	renderRow(fams) {
		return (row) => {
			var key = row.key;

			var createFamilyRow = (fam) => {
				var values = _.map(row[fam], (v, col) => {
					return <span>{col + " = " + v}</span>;
				})

				return <td>{values}</td>;
			}

			return (
				<tr key={key}>
					<td>
						{key}
					</td>
					{fams.map(createFamilyRow)}
				</tr>
			)
		}
	},

	change(field) {
		return (evt) => {
			var us = {};
			us[field] = evt.target.value;
			this.setState(us);
		};
	}
});
