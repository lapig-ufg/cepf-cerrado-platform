var appRoot = require('app-root-path');

module.exports = function(app) {
	
	var config = {
		"appRoot": appRoot, 
		"clientDir": appRoot + "/../client/dist/lapig-cepf-cerrado/",
		"langDir": appRoot + "/lang",
		"logDir": appRoot + "/log/",
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
		config["pg"] = {
			"host": "172.18.0.4",
			"port": 5432,
			"dbname": "lapig",
			"user": "lapig",
			"password": "lapig123",
			"debug": true
		}
	}

	return config;

}
