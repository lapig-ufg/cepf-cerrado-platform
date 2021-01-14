module.exports = function (app) {

	var Internal = {}
	var Query = {};

	Query.defaultParams = {
		'type': 'bioma',
		'region': 'Cerrado'
	}

	Query.extent = function (params) {
		return "SELECT * FROM regions_geom_cerrado WHERE text=${region}";
	}

	Query.search = function () {
		return "SELECT text as text, value, type, uf, bioma FROM search WHERE unaccent(TEXT) LIKE unaccent(${key}%) AND bioma='CERRADO' LIMIT 10";
	}

	Query.searchregion = function () {
		return "SELECT text, value, type FROM search WHERE unaccent(value) ILIKE unaccent(${key}) LIMIT 10";
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

	Query.downloadCSV = function (params) {
		var layer = params['layer'];
		var filterRegion = params['filterRegion'];
		var year = params['year'];
		var columnsCSV = "cd_geouf,cd_geocmu,regiao,uf,estado,municipio,bioma, " + params['columnsCSV']
		var filter = ' WHERE ' + filterRegion;

		if (year != undefined && year != '')
			filter = ' WHERE ' + filterRegion + ' AND year=' + year;

		if (layer == 'pontos_campo_parada' || layer == 'pontos_campo_sem_parada' || layer == 'pontos_tvi_treinamento' || layer == 'pontos_tvi_validacao') {
			columnsCSV = '*'
			filter = ' WHERE ' + filterRegion;
		}

		if (params['columnsCSV'] == '') {
			columnsCSV = '*'
			filter='';
		}
		
		console.log('_____query______: ', "SELECT " + columnsCSV + " FROM " + layer + filter)
		return "SELECT " + columnsCSV + " FROM " + layer + filter;

	}

	// Query.downloadCSV = function(params) {
	// 	var layer = params.layer;
	//   var filterRegion = params.filterRegion;
	// 	var year = params.year;
	// 	var columnsCSV= "cd_geouf,cd_geocmu,regiao,uf,estado,municipio,bioma,arcodesmat,matopiba,mun_ha,pol_ha,pct_areapo, "+params.columnsCSV;
	//   var filter = filterRegion;
	// 	var sqlquery;
	// 	console.log('paramsss::',params)

	//   if(year != undefined && year != '') 
	//     filter = filterRegion +' AND '+ year;

	// 	if (layer == 'pontos_campo_parada' || layer=='pontos_campo_sem_parada' || layer=='pontos_tvi_treinamento' || layer=='pontos_tvi_validacao'){
	// 		columnsCSV = '*'
	// 		filter = filterRegion;
	// 	}
	// 	console.log("SELECT "+columnsCSV+" FROM "+layer+" WHERE "+filter)
	// 	return "SELECT "+columnsCSV+" FROM "+layer+" WHERE "+filter;
	// }

	return Query;

}