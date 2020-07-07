var appRoot = require('app-root-path');

module.exports = function(app) {
	
	var config = {
		"appRoot": appRoot, 
		"clientDir": appRoot + "/../client/dist/lapig-cepf-cerrado/",
		"downloadDir": "/Users/ferstefani/Documents/download_atlas/",
		"langDir": appRoot + "/lang",
		"logDir": appRoot + "/log/",
		// "fotoDir": "/data/dados-lapig/fotos_campo/",
		"pg": {
			"user": 'lapig',
		  // "host": '10.0.0.14',
			"host": 'localhost',
		  "database": 'lapig',
		  "password": 'lapig123',
			"port": 5433,
		  "debug": true
		},
		"port": 3000,
	};

	if(process.env.NODE_ENV == 'prod') {
		config["downloadDir"] = "/STORAGE/download_atlas/",
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
