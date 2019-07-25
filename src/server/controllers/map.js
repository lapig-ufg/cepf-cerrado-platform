var pg = require('pg')

module.exports = function(app) {

	var Map = {};

	var config = app.config;
	/*var conString = "postgres://postgres@localhost:5433/atlas_pastagem";*/
	var conString = "postgres://"+config.postgres.host+":"+config.postgres.port+"/"+config.postgres.dbname;
	
	var client = new pg.Client(conString);
			client.connect();

	Map.extent = function(request, response) {

		var region = request.param('region', '');
		var sqlQuery = "SELECT * from regions_geom WHERE "+region;
		
		client.query(sqlQuery, (err, queryResult) => {
			if (err) {
				console.log(err)
				response.end()
			} else {
				
				var result = {
		          'type': 'Feature',
		          'geometry': JSON.parse(queryResult.rows[0]['geom'])
		        }

				response.send(result)
		    	response.end();
			}
		});
	}


	Map.search = function(request, response) {

		var keysearch = request.param('key', 'CERRADO').toUpperCase();
		var regiao;
		var result = [];

		client.query("SELECT INITCAP(text) as text, value, type, uf FROM search WHERE TEXT LIKE '%"+keysearch+"%'", (err, res) => {
		  if (err) {
		    console.log(err.stack)
		    response.send(err)
				response.end()
		  } else {
		  	res.rows.forEach(function(row){

		  		if(row.uf === null) {
		  			regiao = row.text
		  		}else {
		  			regiao = row.text + " (" + row.uf + ")"
		  		}

		  		result.push({
		  			text: regiao,
		  			value: row.value,
		  			type: row.type,
		  			name: row.text
		  		})
		  	})

				response.send(result)
				response.end()
		  }
		})
	}

	return Map;

}
