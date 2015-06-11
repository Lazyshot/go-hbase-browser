var Reflux = require('reflux'),
	_ = require('lodash'),
	request = require('superagent'),
	actions = require('../actions');

module.exports = tableStore = Reflux.createStore({
	listenables: actions,
	init() {
		this.tables = {};
	},

	onLoadTables() {
		request.get('/api/tables')
			.end(function(err, res){
				if (err) {
					actions.loadTables.failed(err);
				} else {
					actions.loadTables.completed(res.body);
				}
			})
	},

	onLoadTablesCompleted(payload) {
		this.trigger(payload);
	}
});
