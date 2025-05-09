var express = require('express')
	, cluster = require('cluster')
	, load = require('express-load')
	, path = require('path')
	, util = require('util')
	, compression = require('compression')
	, requestTimeout = require('express-timeout')
	, responseTime = require('response-time')
	, timeout = require('connect-timeout')
	, bodyParser = require('body-parser')
	, multer = require('multer')
	, session = require('express-session')
	, parseCookie = require('cookie-parser');

var app = express();
var http = require('http').Server(app);
var cookie = parseCookie('LAPIG')

load('config.js', { 'verbose': false })
	.then('database')
	.then('middleware')
	.into(app);

app.database.client.init(function () {
	app.use(cookie);

	app.use(compression());
	app.use(express.static(app.config.clientDir));
	app.set('views', __dirname + '/templates');
	app.set('view engine', 'ejs');

	var publicDir = path.join(__dirname, '');

	app.use(requestTimeout({
		'timeout': 2000 * 60 * 30,
		'callback': function (err, options) {
			var response = options.res;
			if (err) {
				util.log('Timeout: ' + err);
			}
			response.end();
		}
	}));

	app.use(responseTime());
	app.use(bodyParser.json({ limit: '1gb' }));
	app.use(bodyParser({ limit: '1gb' }));
	app.use(bodyParser.urlencoded({ extended: true }));
	// app.use(multer());

	app.use(function (error, request, response, next) {
		console.log('ServerError: ', error.stack);
		next();
	});

	load('models', { 'verbose': false })
		.then('controllers')
		.then('routes')
		.into(app);

	http.listen(app.config.port, function () {
		console.log('CEPF - Cerrado Server @ [port %s] [pid %s]', app.config.port, process.pid.toString());
	});

	process.on('uncaughtException', function (err) {
		console.error(err.stack);
	});

})
