var express = require('express')
var hbs = require('express3-handlebars')
var passport = require('passport')
var TwitterStrategy = require('passport-twitter').Strategy
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
		done(null, results[0])
	})
})

app.engine('handlebars', hbs({ defaultLayout: 'main'}))
app.set('view engine', 'handlebars')
app.use(express.cookieParser())
app.use(express.cookieSession({ secret: 'kittens'}))
app.use(passport.initialize())
app.use(passport.session())
app.use(app.router)


app.get('/', function(req, res) {
	res.render('home', {user: req.user.username})
})
app.get('/auth/twitter', passport.authenticate('twitter'))
app.get('/auth/twitter/callback', 
  passport.authenticate('twitter', { successRedirect: '/',
                                     failureRedirect: '/' }))




app.listen(3000)