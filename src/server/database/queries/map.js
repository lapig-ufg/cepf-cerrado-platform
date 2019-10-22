module.exports = function(app) {

	var Internal = {}
	var Query = {};

	Query.defaultParams = {
		'type': 'biome',
		'region': 'Cerrado'
	}

	Query.extent = function() {
		return "SELECT * FROM regions_geom WHERE text=${region}";
	}

	Query.search = function() {
		return "SELECT INITCAP(text) as text, value, type, uf FROM search WHERE TEXT LIKE ${key}% LIMIT 10";
	}

	return Query;

}