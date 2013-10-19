var fs = require('fs')
var path = require('path')


module.exports.postFile = function(req, res) {
	fs.rename(__dirname + '/' + req.files.file.path, __dirname + '/images/' + req.user.username + '.png', function(err) {
		if (err) console.log(err)
		res.send('Uploaded.')
	})
}