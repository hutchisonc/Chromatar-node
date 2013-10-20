var express = require('express')
var hbs = require('express3-handlebars')
var passport = require('passport')
var fileUpload = require('./fileUpload')
var TwitterStrategy = require('passport-twitter').Strategy
var config = require('./config.json')
var connection = require('./connection.js').connection
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn

var app = express()


passport.use(new TwitterStrategy({
	consumerKey: config.twitter.oauth_token,
	consumerSecret: config.twitter.oauth_secret,
	callbackURL: 'http://localhost:3000/auth/twitter/callback'
}, function(token, secret, profile, done) {
	connection.query("INSERT INTO users SET username = '" + profile._json.screen_name + "', id = " + profile.id + ",  token = '" + token + "', secret = '" + secret + "' ON DUPLICATE KEY UPDATE username = VALUES(username), token = VALUES(token), secret = VALUES(secret)", function(err, rows) {
	})
	return done(null, profile)
}))

passport.serializeUser(function(user, done) {
	done(null, user.id)
})

passport.deserializeUser(function(id, done) {
	connection.query("SELECT * FROM users WHERE id = " + id, function(err, results) {
		if(results[0]) {
			done(null, results[0])
		}
		else {
			done(null, "destroy")
		}
	})
})

app.use(express.bodyParser({ uploadDir: './images'}))
app.engine('handlebars', hbs({ defaultLayout: 'main'}))
app.set('view engine', 'handlebars')
app.use(express.cookieParser())
app.use(express.cookieSession({ secret: 'kittens'}))
app.use(passport.initialize())
app.use(passport.session())
app.use(function(req, res, next) {
	if(req.user === "destroy") {
		req.logout()
	}
	next()
})
app.use(app.router)


app.get('/', function(req, res) {
	if(req.user) res.redirect('/configure')
	res.render('home')
})
app.get('/configure', ensureLoggedIn('/'), function(req, res) {
	res.render('configure')
})
app.post('/configure', fileUpload.postFile)
app.get('/auth/twitter', passport.authenticate('twitter'))
app.get('/auth/twitter/callback', 
  passport.authenticate('twitter', { successRedirect: '/configure',
                                     failureRedirect: '/' }))




app.listen(3000)