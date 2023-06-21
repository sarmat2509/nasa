const express = require('express');
const helmet = require('helmet');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const cookieSession = require('cookie-session')

const api = require('./routes/api');
const {
	auth,
	passport
} = require('./routes/auth');

const app = express();

app.use(helmet());

app.use(cookieSession({
	name: 'session',
	keys: [
		process.env.COOKIE_KEY_1,
		process.env.COOKIE_KEY_2,
	],
	
	// Cookie Options
	maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
	origin: "http://localhost:3000"
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/v1', api);
app.use('/auth', auth);

app.get('/*', (req, res) => {
	return res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
})

module.exports = app;
