var connection = require('./connection.js').connection
var Twit = require('twit')
var config = require('./config.json')
var imageHelper = require('./lib/imageHelper.js')
var randomColor = require('./lib/randomColor.js')
var fs = require('fs')

connection.query("SELECT * FROM users WHERE path IS NOT NULL", function(err, rows) {
	rows.forEach(changeBackgroundColor)
})

function changeBackgroundColor(user) {
	var twitterAPI = new Twit({
		consumer_key: config.twitter.oauth_token,
		consumer_secret: config.twitter.oauth_secret,
		access_token: user.token,
		access_token_secret: user.secret
	})
		randomColor(function(err, color) {
			imageHelper.genImage(user.path, color, function(err, coloredImage) {
				twitterAPI.post('account/update_profile_image', { image: coloredImage.toString('base64')}, function(err, reply) {
				})
			})
		})
}