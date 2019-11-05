module.exports = function(app) {
	var Controller = {}
	var Internal = {}

	Controller.teste = function(request, response) {

		var teste = 'Fernanda está aqui!'

		response.send(teste)
    response.end();

	};
	
	Controller.chartslulc = function(request, response) {

		var typeRegion = request.query['typeRegion'];
		var textRegion = request.query['textRegion'];

		var region = "O bioma Cerrado, "

		if(typeRegion == 'municipio' || typeRegion == 'estado') {
			region = "O "+typeRegion+" de "+ textRegion
		} else if (typeRegion == 'região de fronteira')  {
			region = "A região de fronteira do "+ textRegion
		}

		

		var chartResult = [
				{
					"id": "terraclass",
					"title": "Terraclas",
					"getText": function(chart) {

						var label = chart['indicators'][0]["label"]
						var value = chart['indicators'][0]["value"]
						var areaMun = chart['indicators'][0]["area_mun"]

						var percentual_area_ha = ((value * 100) / areaMun);

						var text =	region+" possui uma área total de "+ areaMun +" de hectares. "
						+ "A cobertura do solo que mais predomina nesta região no ano de 2013 "
						+ "é a " + label + " cobrindo cerca de " + value + " de hectares ("+ Math.round(percentual_area_ha) +"% da área total), "

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
					"id": "probio",
					"title": "PROBIO",
					"getText": function(chart) {
						var label = chart['indicators'][0]["label"]
						var value = chart['indicators'][0]["value"].toLocaleString('pt-BR')
						var areaMun = chart['indicators'][0]["area_mun"]

						var percentual_area_ha = ((value * 100) / areaMun);

						var text =	region+" possui uma área total de "+ areaMun +" de hectares. "
						+ "A cobertura do solo que mais predomina nesta região no ano de 2002 "
						+ "é a " + label + " cobrindo cerca de " + value + " de hectares ("+ Math.round(percentual_area_ha) +"% da área total), "

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

		for(let chart of chartResult) {

			chart['indicators'] = request.queryResult[chart.id]
			chart['text'] = chart.getText(chart)

		}

		response.send(chartResult)
    response.end();

	}
	
	Controller.chartsFarming = function(request, response) {

		var typeRegion = request.query['typeRegion'];
		var textRegion = request.query['textRegion'];

		var region = "do bioma Cerrado"

		if(typeRegion == 'municipio' || typeRegion == 'estado') {
			region = "do "+typeRegion+" de "+ textRegion
		} else if (typeRegion == 'região de fronteira')  {
			region = "da região de fronteira do "+ textRegion
		}
		
		getDataSets =  function(indicator) {
			var arrayLabels = []
			var arrayClass = []
			var color;
			var arrayValues = []
			
			for(let result of request.queryResult[indicator]) {
				arrayLabels.push(result.label)

				if(result.classe) {
					arrayClass.push(result.classe)
				} 

			}
			
			var labels = new Set(arrayLabels)
			var classes = new Set(arrayClass)
	
			var dataInfo = {
				labels: [...labels],
				datasets: []
			}
	
			getValues = function(classe, indicatorValue) {
				arrayValues = []
				for(let result of request.queryResult[indicatorValue]) {

					if(result.classe == classe){

						if(result.label != null) {
							arrayValues.push(result.value)
						}
						 color = result.color
					}
				}
				return arrayValues
			}

			for(let classe of [...classes]) {

				if (classe == 'Pastagem') {

					dataInfo.datasets.push({
						label: 'Rebanho Bovino',
						data: getValues('Rebanho Bovino', 'rebanho_bovino'),
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
				"id": "agrosatelite",
				"title": "Agricultura Agrosatélite",
				"getText": function(chart) {

					var indicatorHigh = chart.indicators[0];

					for(let indicator of chart.indicators) {

						if(Number(indicator.value) > Number(indicatorHigh.value)) {
							indicatorHigh = indicator
						}

					}

					var percentual_area_ha = ((indicatorHigh.value * 100) / indicatorHigh.area_mun);

					//.toLocaleString('pt-BR')
					var text = "No ano de "+ indicatorHigh.label + " o cultivo de "+ indicatorHigh.classe 
										+" predominou nesta região cobrindo cerca de "+ indicatorHigh.value 
										+" de hectares ("+ Math.round(percentual_area_ha) +"% da área total). "

					return text
				},
				"data": getDataSets('agrosatelite'),
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
				"getText": function(chart) {

					var indicatorPastureLast = chart.indicators[chart.indicators.length - 1]
					var indicatorRebanhoLast = chart.indicatorsRebanho[0]
					
					/* var indicatorHigh = chart.indicators[0];

					for(let indicator of chart.indicators) {

						if(Number(indicator.value) > Number(indicatorHigh.value)) {
							indicatorHigh = indicator
						}

					} */

					//var percentual_area_ha = ((indicatorHigh.value * 100) / indicatorHigh.area_mun);

					//.toLocaleString('pt-BR')
					var text = "A área de pastagem "+ region +" é "+ indicatorPastureLast.value +" ha em "+ indicatorPastureLast.label +". "
											+"O ano que atingiu sua maior marca em áreas de pastagem foi em 2009 onde alcançou 64.751.995 ha. "

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

		for(let chart of chartResult) {
			chart['indicators'] = request.queryResult[chart.id]

			if(chart.id == 'pasture') {
				chart['indicatorsRebanho'] = (request.queryResult['rebanho_bovino'])
			}

			chart['text'] = chart.getText(chart)
		}

		response.send(chartResult)
    response.end();

	}
	
	Controller.chartsDeforestation = function(request, response) {

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