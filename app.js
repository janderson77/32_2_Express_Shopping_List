const express = require('express');
const app = express();
const ExpressError = require('./expressError');
const items = require('./fakeDb');
const routes = require('./router');
const morgan = require('morgan');

app.use(express.json());
app.use('/items', routes);
// app.use(items);
app.use(morgan('dev'));

app.get('/favicon.ico', (req, res) => res.sendStatus(204));

app.use((req, res, next) => {
	return new ExpressError('Not Found', 404);
});

// generic error handler
app.use((err, req, res, next) => {
	// the default status is 500 Internal Server Error
	let status = err.status || 500;

	// set the status and alert the user
	return res.status(status).json({
		error: {
			message: err.message,
			status: status
		}
	});
});
// end generic handler
module.exports = app;
//
