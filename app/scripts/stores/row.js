var Reflux = require('reflux'),
	_ = require('lodash'),
	request = require('superagent'),
	actions = require('../actions');

module.exports = tableStore = Reflux.createStore({
	listenables: actions,
	init() {
		this.rows = {};
	},

	onLoadTable(name, payload) {
		var key = payload.key || "",
			keyParts = key.split("-"),
			startKey, endKey;

		if (keyParts.length == 1) {
			startKey = endKey = keyParts[0];
		} else {
			startKey = keyParts[0];
			endKey = keyParts[1];
		}

		payload.startKey = startKey;
		payload.endKey = endKey;

		request.get('/api/tables/' + name, payload)
			.end(function(err, res){
				if (err) {
					actions.loadTable.failed(err);
				} else {
					actions.loadTable.completed(res.body);
				}
			})
	},

	onLoadTableCompleted(payload) {
		this.trigger(payload);
	}
});
