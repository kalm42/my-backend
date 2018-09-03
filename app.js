const express = require('express');
// const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const routes = require('./routes/index');
const errorHandlers = require('./handlers/errorHandlers');

// Create the express app
const app = express();

// Parse form data
// app.use(bodyParser.json());
app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded());

// Exposes a bunch of methods for validating data.
app.use(expressValidator());

// Add our routes
app.use('/', routes);

// If that above routes didnt work, we 404 them and forward to error handler
app.use(errorHandlers.notFound);

// Otherwise this was a really bad error we didn't expect! Shoot eh
if (app.get('env') === 'development') {
  /* Development Error Handler - Prints stack trace */
  app.use(errorHandlers.developmentErrors);
}

// production error handler
app.use(errorHandlers.productionErrors);

// done! we export it so we can start the site in start.js
module.exports = app;
