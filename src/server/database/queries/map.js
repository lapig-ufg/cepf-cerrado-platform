module.exports = function(app) {

	var Internal = {}
	var Query = {};

	Query.defaultParams = {
		'type': 'biome',
		'region': 'Cerrado'
	}

	Query.extent = function(params) {
		return "SELECT * FROM regions_geom_cerrado WHERE text=${region}";
	}

	Query.search = function() {
		return "SELECT INITCAP(text) as text, value, type, uf, bioma FROM search WHERE TEXT LIKE ${key}% AND bioma='CERRADO' LIMIT 10";
	}

	return Query;

}