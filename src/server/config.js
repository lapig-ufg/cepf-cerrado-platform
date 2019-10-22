var appRoot = require('app-root-path');

module.exports = function(app) {
	
	var config = {
		"appRoot": appRoot, 
		"clientDir": appRoot + "/../client/dist/",
		"langDir": appRoot + "/lang",
		"logDir": appRoot + "/log/",
		"postgres": {
			"host": "postgres@localhost",
			"port": "5433",
			"dbname": "lapig"
		},
		"pg": {
			"user": 'postgres',
		  "host": '10.0.0.14',
		// "host": 'localhost',
		  "database": 'lapig',
		  "password": 'postgres',
		  "port": 5432,
		//   "port": 5433,
		  "debug": true
		},
		"port": 3000,
	};

	if(process.env.NODE_ENV == 'prod') {
		config["port"] = "4004",
		config["postgres"] = {
			"host": "postgres@200.137.217.158",
			"port": "5432",
			"dbname": "lapig"
		},
		config["pg"] = {
			"user": 'postgres',
		  "host": '200.137.217.158',
		  "database": 'lapig',
		  "password": 'postgres',
		  "port": 5432,
		  "debug": true
		}
	}

	return config;

}
