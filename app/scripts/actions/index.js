var Reflux = require("reflux");

module.exports = Reflux.createActions({
	"loadTables": {asyncResult: true},
	"loadTable": {asyncResult: true}
});
