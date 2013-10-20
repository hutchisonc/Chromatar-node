var config = require('./config.json')
var mysql = require('mysql')
var connection = mysql.createConnection({
	host: config.mysql.host,
	user: config.mysql.user,
	password: config.mysql.password
})

connection.connect()

connection.query('USE chromatar', function(err) {
})

module.exports.connection = connection