var fs = require('fs')
var path = require('path')
var connection = require('./connection.js').connection
var imageHelper = require('./lib/imageHelper.js');

module.exports.postFile = function(req, res) {
	if (req.files.file.type === 'image/png' && req.files.file.size < 500000) {
		imageHelper.checkAlpha(__dirname + '/' + req.files.file.path, function(err, result) {
			console.log(result)
			if (!err && result['Channel Depths'].Opacity) {
				var imagePath = __dirname + '/images/' + req.user.username + '.png'
				fs.rename(__dirname + '/' + req.files.file.path, imagePath, function(err) {
					connection.query("UPDATE users SET path='" + imagePath + "' WHERE id=" + req.user.id, function(err) {
						res.send('Uploaded.')
					})
				})
			}
			else {
				res.send('Image must be a png less than 500 kb with an alpha channel.')
			}
	})
	}
	else {
		res.send('Image must be a png less than 500 kb with an alpha channel.')
	}
}