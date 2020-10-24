module.exports = function (app) {
	var Controller = {}
	var Internal = {}

	function numberFormat(numero) {
		numero = numero.toFixed(2).split('.');
		numero[0] = numero[0].split(/(?=(?:...)*$)/).join('.');
		return numero.join(',');
	}

	Controller.chartslulc = function (request, response) {

		var typeRegion = request.query['typeRegion'];
		var textRegion = request.query['textRegion'];

		var region = "O bioma Cerrado, "

		if (typeRegion == 'municipio' || typeRegion == 'estado') {
			region = "O " + typeRegion + " de " + textRegion
		} else if (typeRegion == 'região de fronteira') {
			region = "A região de fronteira do " + textRegion
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

					var text = "De acordo com o projeto Terra Class Cerrado(referente ao ano de 2013), " + region
						+ " possui uma área total de " + numberFormat(parseFloat(areaMun)) + " de hectares, "
						+ "sendo a classe " + label + " a de maior predominância, com " + numberFormat(parseFloat(value))
						+ " de hectares (" + Math.round(percentual_area_ha) + "% da área total). "

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

					var percentual_area_ha = ((value * 100) / areaMun);

					var text = "De acordo com o projeto PROBIO Cerrado(referente ao ano de 2002), a cobertura do solo que mais predomina nesta região "
						+ "é a " + label + " cobrindo cerca de " + numberFormat(parseFloat(value)) + " de hectares (" + Math.round(percentual_area_ha) + "% da área total). "

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

					var percentual_area_ha = ((value * 100) / areaMun);

					var text = "De acordo com o projeto MapBiomas, em " + year + " a cobertura do solo que mais predominou nesta região " +
						"foi a " + label + " cobrindo cerca de " + numberFormat(parseFloat(value)) + " de hectares (" + Math.round(percentual_area_ha) + "% da área total). "

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

		var typeRegion = request.query['typeRegion'];
		var textRegion = request.query['textRegion'];

		var region = "do bioma Cerrado"

		if (typeRegion == 'municipio' || typeRegion == 'estado') {
			region = "do " + typeRegion + " de " + textRegion
		} else if (typeRegion == 'região de fronteira') {
			region = "da região de fronteira do " + textRegion
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
						label: 'Rebanho Bovino',
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
				"title": "Agricultura Agrosatélite",
				"getText": function (chart) {

					var indicatorHigh = chart.indicators[0];

					for (let indicator of chart.indicators) {

						if (Number(indicator.value) > Number(indicatorHigh.value)) {
							indicatorHigh = indicator
						}

					}

					var percentual_area_ha = ((indicatorHigh.value * 100) / indicatorHigh.area_mun);

					//.toLocaleString('pt-BR')
					var text = "De acordo com esta instituição, no ano de " + indicatorHigh.label + " o cultivo de " + indicatorHigh.classe
						+ " predominou nesta região, cobrindo cerca de " + numberFormat(parseFloat(indicatorHigh.value))
						+ " de hectares (" + Math.round(percentual_area_ha) + "% da área total). "

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
				"title": "Áreas de Pastagem - Lapig",
				"getText": function (chart) {

					var indicatorPastureLast = chart.indicators[chart.indicators.length - 1]
					var indicatorRebanhoLast = chart.indicatorsRebanho[chart.indicatorsRebanho.length - 2]

					var percentual_area_ha = ((indicatorPastureLast.value * 100) / indicatorPastureLast.area_mun);

					var text = "De acordo com mapeamento do Lapig, a área de pastagem " + region + " em " + indicatorPastureLast.label
						+ " foi de " + numberFormat(parseFloat(indicatorPastureLast.value)) + "ha "
						+ " (" + Math.round(percentual_area_ha) + "% da área total). Já o Rebanho Bovino contabilizou "
						+ numberFormat(parseFloat(indicatorRebanhoLast.value)) + "UA em " + indicatorRebanhoLast.label + "."

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

	Controller.regionreport = function (request, response) {

		var type = request.param('type')
		var region = request.param('region')

		let sizeSrc = 768;
		let sizeThumb = 400;

		console.log("TESTE")

		var queryBox = request.query['box_region'];

		console.log(queryBox)

		let regionfilter = {
			msfilter: "",
			msregion: ""
		}
		if (type == 'municipio') {
			regionfilter = {
				msfilter: "cd_geocmu",
				msregion: "municipio"
			}
		}
		else if (type = 'estado') {
			regionfilter = {
				msfilter: "uf",
				msregion: "uf"
			}
		}

		let anual_statistic = [];
		for (let y = 1985; y <= 2018; y++) {
			let box = queryBox[0]['bbox'].replace("BOX(", "")
				.replace(")", "")
				.split(" ")
				.join(",");
			let ano = Number(y);
			anual_statistic.push({
				box: box,
				year: ano,
				imgLarge: app.config.ows_host + "/ows?SERVICE=WMS&REQUEST=GetMap&VERSION=1.1.1&layers=uso_solo_mapbiomas,regions_cepf_realce_maior&bbox=" + box + "&TRANSPARENT=TRUE&srs=EPSG:4674&width=" +
					sizeSrc + "&height=" + sizeSrc + "&format=image/png&styles=&ENHANCE=TRUE&MSFILTER=" + regionfilter.msfilter + " ilike '" + region + "' and year = " + ano + "&MSREGION=type='" + regionfilter.msregion + "' and text ilike '" + region + "'",
				imgSmall: app.config.ows_host + "/ows?SERVICE=WMS&REQUEST=GetMap&VERSION=1.1.1&layers=uso_solo_mapbiomas,regions_cepf_realce_maior&bbox=" + box + "&TRANSPARENT=TRUE&srs=EPSG:4674&width=" +
					sizeThumb + "&height=" + sizeThumb + "&format=image/png&styles=&ENHANCE=TRUE&MSFILTER=" + regionfilter.msfilter + " ilike '" + region + "' and year = " + ano + "&MSREGION=type='" + regionfilter.msregion + "' and text ilike '" + region + "'"
			});
		}


		var legendas = {
			legendTerraclass: app.config.ows_host + "/ows?TRANSPARENT=TRUE&VERSION=1.1.1&SERVICE=WMS&REQUEST=GetLegendGraphic&layer=uso_solo_mapbiomas&format=image/png",
			legendRegion: app.config.ows_host + "/ows?TRANSPARENT=TRUE&VERSION=1.1.1&SERVICE=WMS&REQUEST=GetLegendGraphic&layer=regions_cepf_realce_maior&format=image/png"
		}


		response.send({
			anual_statistic: anual_statistic,
			legendas: legendas,
		});
		response.end();

	};

	return Controller;

}