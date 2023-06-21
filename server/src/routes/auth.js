const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();

const GOOGLE_AUTH_OPTIONS = {
	callbackURL: '/auth/google/callback',
	clientID: process.env.GOOGLE_CLIENT_ID,
	clientSecret: process.env.GOOGLE_CLIENT_SECRET
};

function verifyCallback(accessToken, refreshToken, profile, cb){
	return cb(null, profile);
}

const GOOGLE_AUTH_STRATEGY = new GoogleStrategy(GOOGLE_AUTH_OPTIONS, verifyCallback);

passport.use(GOOGLE_AUTH_STRATEGY);

passport.serializeUser(function(user, cb) {
	process.nextTick(function() {
		return cb(null, { id: user.id, name: user.displayName, email: user.emails[0].value });
	});
});

passport.deserializeUser(function(user, cb) {
	process.nextTick(function() {
		return cb(null, user);
	});
});

const auth = express.Router();

function isLoggedIn(req, res, next){
	const isLoggedIn = req.isAuthenticated && req.user;
	if(!isLoggedIn){
		return res.status(409).json({
			error: 'No access'
		})
	}
	next();
}

auth.get('/google', passport.authenticate('google', {
	scope:['profile','email']
}));
auth.get('/google/callback', passport.authenticate('google', {
	failureRedirect: '/auth/failure'
}), (req, res) => {
	res.redirect('/');
});
auth.get('/logout', (req, res) => {
	req.logout();
});
auth.get('/secret', isLoggedIn, (req, res) => {
	res.send('You are logged in');
});
auth.get('/failure', (req, res) => {
	return res.send('Failed to log in!')
});

module.exports = {
	auth,
	passport
};
