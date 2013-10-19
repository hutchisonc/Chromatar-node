var express = require('express')
var passport = require('passport')
var TwitterStrategy = require('passport-twitter').Strategy
var config = require('./config.json')

var app = express()


passport.use(new TwitterStrategy({
	consumerKey: config.twitter.oauth_token,
	consumerSecret: config.twitter.oauth_secret,
	callbackURL: 'http://localhost:3000/auth/twitter/callback'
}, function(token, secret, profile, done) {
	console.log(token, secret)
	return done(null, profile)
}))

passport.serializeUser(function(user, done) {
	done(null, user.id)
})

passport.deserializeUser(function(id, done) {
	done(null, id)
})

app.use(express.cookieParser())
app.use(express.cookieSession({ secret: 'kittens'}))
app.use(passport.initialize())
app.use(passport.session())
app.use(app.router)


app.get('/', function(req, res) {
	res.send('Ohai')
})
app.get('/auth/twitter', passport.authenticate('twitter'))
app.get('/auth/twitter/callback', 
  passport.authenticate('twitter', { successRedirect: '/',
                                     failureRedirect: '/' }))




app.listen(3000)