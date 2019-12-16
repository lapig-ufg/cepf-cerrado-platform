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

	Query.fieldPoints = function (params) {
		var msfilter = params['msfilter'];
		var condition;
		if (msfilter) {
			condition = ' WHERE ' + msfilter;
		}

		var colums = "id, cobertura, obs, data, periodo, horario, altura, homoge, invasoras, gado, qtd_cupins, forrageira, solo_exp";

		return "SELECT ST_AsGeoJSON(geom) geojson," + colums + " FROM pontos_campo_parada " + condition;
	}

	return Query;

}