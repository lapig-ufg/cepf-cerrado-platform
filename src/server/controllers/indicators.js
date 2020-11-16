var languageJson = require('../assets/lang/language.json');
module.exports = function (app) {
	var Controller = {}
	var Internal = {}

	function numberFormat(numero) {
		numero = numero.toFixed(2).split('.');
		numero[0] = numero[0].split(/(?=(?:...)*$)/).join('.');
		return numero.join(',');
	}

	Controller.chartslulc = function (request, response) {
		var language = request.param('lang')
		var typeRegion = request.query['typeRegion'];
		var textRegion = request.query['textRegion'];

		var region = languageJson["charts_regions"]["biome"][language]

		if (typeRegion == 'municipio' || typeRegion == 'estado') {
			if (typeRegion == 'municipio')
				typeRegionTranslate = language == 'pt-br' ? 'municipio' : 'municipality';
			else if (typeRegion == 'estado')
				typeRegionTranslate = language == 'pt-br' ? 'estado' : 'state';

			region = languageJson["charts_regions"]["o_municipio_estado"][language] + typeRegionTranslate + languageJson["charts_regions"]["de_municipio_estado"][language] + textRegion
		} else if (typeRegion == 'região de fronteira') {
			region = languageJson["charts_regions"]["region_fronteira"][language] + textRegion
		}

		var chartResult = [
			{
				"id": "uso_solo_terraclass",
				"title": "Terraclas",
				"getText": function (chart) {

					var label = chart['indicators'][0]["label"]
					var value = chart['indicators'][0]["value"]
					var areaMun = chart['indicators'][0]["area_mun"]

					var percentual_area_ha = ((value * 100) / areaMun);
					var parttext = languageJson["charts_text"]["uso_solo_terraclass"];
					var text = parttext["part1"][language] + region
						+ parttext["part2"][language] + numberFormat(parseFloat(areaMun)) + parttext["part3"][language]
						+ parttext["part4"][language] + label + parttext["part5"][language] + numberFormat(parseFloat(value))
						+ parttext["part6"][language] + Math.round(percentual_area_ha) + parttext["part7"][language]

					return text
				},
				"type": 'pie',
				"options": {
					legend: {
						display: false
					}
				}
			},
			{
				"id": "uso_solo_probio",
				"title": "PROBIO",
				"getText": function (chart) {
					var label = chart['indicators'][0]["label"]
					var value = chart['indicators'][0]["value"]
					var areaMun = chart['indicators'][0]["area_mun"]
					var parttext = languageJson["charts_text"]["uso_solo_probio"];
					var percentual_area_ha = ((value * 100) / areaMun);

					var text = parttext["part1"][language]
						+ parttext["part2"][language] + label + parttext["part3"][language]
						+ numberFormat(parseFloat(value)) + parttext["part4"][language]
						+ Math.round(percentual_area_ha) + parttext["part5"][language]

					return text
				},
				"type": 'pie',
				"options": {
					legend: {
						display: false
					}
				}
			},
			{
				"id": "uso_solo_mapbiomas",
				"title": "MapBiomas",
				"getText": function (chart) {
					var label = chart['indicators'][0]["label"]
					var value = chart['indicators'][0]["value"]
					var areaMun = chart['indicators'][0]["area_mun"]
					var year = chart['indicators'][0]["year"]
					var parttext = languageJson["charts_text"]["uso_solo_mapbiomas"];
					var percentual_area_ha = ((value * 100) / areaMun);

					var text = parttext["part1"][language] + year
						+ parttext["part2"][language] + parttext["part3"][language]
						+ label + parttext["part4"][language] + numberFormat(parseFloat(value))
						+ parttext["part5"][language] + Math.round(percentual_area_ha) + parttext["part6"][language]

					return text
				},
				"type": 'pie',
				"options": {
					legend: {
						display: false
					}
				}
			}
		]

		for (let chart of chartResult) {

			chart['indicators'] = request.queryResult[chart.id]
			chart['text'] = chart.getText(chart)

		}

		response.send(chartResult)
		response.end();

	}

	Controller.chartsFarming = function (request, response) {
		var language = request.param('lang')
		var typeRegion = request.query['typeRegion'];
		var textRegion = request.query['textRegion'];

		var region = languageJson["charts_regions"]["do_bioma"][language]

		if (typeRegion == 'municipio' || typeRegion == 'estado') {
			if (typeRegion == 'municipio')
				typeRegionTranslate = language == 'pt-br' ? 'municipio' : 'municipality';
			else if (typeRegion == 'estado')
				typeRegionTranslate = language == 'pt-br' ? 'estado' : 'state';

			region = languageJson["charts_regions"]["do_municipio_estado"][language] + typeRegionTranslate + languageJson["charts_regions"]["de_municipio_estado"][language] + textRegion
		} else if (typeRegion == 'região de fronteira') {
			region = languageJson["charts_regions"]["da_region_fronteira"][language] + textRegion
		}

		getDataSets = function (indicator) {
			var arrayLabels = []
			var arrayClass = []
			var color;
			var arrayValues = []

			for (let result of request.queryResult[indicator]) {
				arrayLabels.push(result.label)

				if (result.classe) {
					arrayClass.push(result.classe)
				}

			}

			var labels = new Set(arrayLabels)
			var classes = new Set(arrayClass)

			var dataInfo = {
				labels: [...labels],
				datasets: []
			}

			getValues = function (classe, indicatorValue) {
				arrayValues = []
				for (let result of request.queryResult[indicatorValue]) {

					if (result.classe == classe) {

						if (result.label != null) {
							arrayValues.push(result.value)
						}
						color = result.color
					}
				}
				return arrayValues
			}

			for (let classe of [...classes]) {

				if (classe == 'Pastagem') {

					dataInfo.datasets.push({
						label: languageJson["charts_title_layer"]["rebanho_bovino"][language],
						data: getValues('Rebanho Bovino', 'lotacao_bovina_regions'),
						fill: false,
						backgroundColor: color,
						borderColor: color
					})
				}

				dataInfo.datasets.push({
					label: classe,
					data: getValues(classe, indicator),
					fill: false,
					backgroundColor: color,
					borderColor: color
				})
			}

			return dataInfo

		}

		var chartResult = [
			{
				"id": "agricultura_agrosatelite",
				"title": languageJson["charts_title_layer"]["agrosatelite"][language],
				"getText": function (chart) {

					var indicatorHigh = chart.indicators[0];

					for (let indicator of chart.indicators) {

						if (Number(indicator.value) > Number(indicatorHigh.value)) {
							indicatorHigh = indicator
						}

					}
					var parttext = languageJson["charts_text"]["agrosatelite"];
					var percentual_area_ha = ((indicatorHigh.value * 100) / indicatorHigh.area_mun);

					var text = parttext["part1"][language] + indicatorHigh.label + parttext["part2"][language] + indicatorHigh.classe
						+ parttext["part3"][language] + numberFormat(parseFloat(indicatorHigh.value))
						+ parttext["part4"][language] + Math.round(percentual_area_ha) + parttext["part5"][language]

					return text
				},
				"data": getDataSets('agricultura_agrosatelite'),
				"type": 'line',
				"options": {
					legend: {
						display: false
					}
				}
			},
			{
				"id": "pasture",
				"title": languageJson["charts_title_layer"]["pasture"][language],
				"getText": function (chart) {

					var indicatorPastureLast = chart.indicators[chart.indicators.length - 1]
					var indicatorRebanhoLast = chart.indicatorsRebanho[chart.indicatorsRebanho.length - 2]
					var parttext = languageJson["charts_text"]["pasture"];
					var percentual_area_ha = ((indicatorPastureLast.value * 100) / indicatorPastureLast.area_mun);

					var text = parttext["part1"][language] + region + parttext["part2"][language]
						+ indicatorPastureLast.label + parttext["part3"][language]
						+ numberFormat(parseFloat(indicatorPastureLast.value)) + parttext["part4"][language]
						+ Math.round(percentual_area_ha) + parttext["part5"][language]
						+ numberFormat(parseFloat(indicatorRebanhoLast.value))
						+ parttext["part6"][language] + indicatorRebanhoLast.label + "."

					return text
				},
				"data": getDataSets('pasture'),
				"type": 'line',
				"options": {
					legend: {
						display: false
					}
				}
			}
		]

		for (let chart of chartResult) {
			chart['indicators'] = request.queryResult[chart.id]

			if (chart.id == 'pasture') {
				chart['indicatorsRebanho'] = (request.queryResult['lotacao_bovina_regions'])
			}

			chart['text'] = chart.getText(chart)
		}

		response.send(chartResult)
		response.end();

	}

	Controller.chartsDeforestation = function (request, response) {

		var chartResult = [
			{
				"id": "desmatamento",
				"title": "Em desenvolvimento"
			}
		]

		response.send(chartResult)
		response.end();
	}

	return Controller;

}