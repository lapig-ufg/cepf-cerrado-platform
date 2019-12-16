var fs = require('fs');

module.exports = function(app) {
  var Controller = {}
  var config = app.config;

	Controller.extent = function(request, response) {
    var queryResult = request.queryResult
		var result = {
      'type': 'Feature',
      'geometry': JSON.parse(queryResult[0]['geom'])
    }

		response.send(result)
    response.end();

  }
  
  Controller.search = function(request, response) {
		var regiao;
    var result = [];
    var queryResult = request.queryResult

    queryResult.forEach(function(row){

      if(row.uf === null) {
        regiao = row.text
      }else {
        regiao = row.text + " (" + row.uf + ")"
      }

      result.push({
        text: regiao,
        value: row.value,
        type: row.type
      })
    })

    response.send(result)
    response.end()
  }
  
  Controller.fieldPoints = function (request, response) {

        var result = []
        var diretorioFotos = config.fotoDir;
        var queryResult = request.queryResult
        
        queryResult.forEach(function (row) {

          result.push({
            'type': 'Feature',
            'geometry': JSON.parse(row['geojson']),
            'properties': {
              'id': row['id'],
              'foto': fs.readdirSync(diretorioFotos + row['id']),
              'cobertura': row['cobertura'],
              'obs': row['obs'],
              'data': row['data'],
              'periodo': row['periodo'],
              'horario': row['horario'],
              'altura': row['altura'],
              'homoge': row['homoge'],
              'invasoras': row['invasoras'],
              'gado': row['gado'],
              'qtd_cupins': row['qtd_cupins'],
              'forrageira': row['forrageira'],
              'solo_exp': row['solo_exp']
            }
          })
        })

        response.send({
          "type": "FeatureCollection",
          "features": result
        })
        response.end();
  }

	Controller.descriptor = function(request, response) {

		var result = {
      "regionFilterDefault": "bioma='CERRADO'",
			"groups": [
        {
          "id": "mapeamento_uso_solo",
          "label": "Uso do Solo",
          "group_expanded": true,
          "layers":[
            {
							"id": "mapa_uso_solo",
							"label": "Uso e Cobertura do Solo",
							"visible": true,
              "selectedType": 'uso_solo_terraclass',
              "types": [
								{
                  "value": "uso_solo_mapbiomas", 
                  "Viewvalue": "Mapbiomas", 
                  "visible": false, 
                  "opacity": 1,
                  "regionFilter": true,
                  "order": 1,
                  "typeLabel": "Tipo",
                  "timeLabel": "Ano",
                  "timeSelected": "year=1985",
                  "timeHandler": "msfilter",
                  "times": [
                    {"value": "year=1985", "Viewvalue": 1985}/* ,
                    {"value": "year=1986", "Viewvalue": 1986},
                    {"value": "year=1987", "Viewvalue": 1987},
                    {"value": "year=1988", "Viewvalue": 1988},
                    {"value": "year=1989", "Viewvalue": 1989},
                    {"value": "year=1990", "Viewvalue": 1990},
                    {"value": "year=1991", "Viewvalue": 1991},
                    {"value": "year=1992", "Viewvalue": 1992},
                    {"value": "year=1993", "Viewvalue": 1993},
                    {"value": "year=1994", "Viewvalue": 1994},
                    {"value": "year=1995", "Viewvalue": 1995},
                    {"value": "year=1996", "Viewvalue": 1996},
                    {"value": "year=1997", "Viewvalue": 1997},
                    {"value": "year=1998", "Viewvalue": 1998},
                    {"value": "year=1999", "Viewvalue": 1999},
                    {"value": "year=2000", "Viewvalue": 2000},
                    {"value": "year=2001", "Viewvalue": 2001},
                    {"value": "year=2002", "Viewvalue": 2002},
                    {"value": "year=2003", "Viewvalue": 2003},
                    {"value": "year=2004", "Viewvalue": 2004},
                    {"value": "year=2005", "Viewvalue": 2005},
                    {"value": "year=2006", "Viewvalue": 2006},
                    {"value": "year=2007", "Viewvalue": 2007},
                    {"value": "year=2008", "Viewvalue": 2008},
                    {"value": "year=2009", "Viewvalue": 2009},
                    {"value": "year=2010", "Viewvalue": 2010},
                    {"value": "year=2011", "Viewvalue": 2011},
                    {"value": "year=2012", "Viewvalue": 2012},
                    {"value": "year=2013", "Viewvalue": 2013},
                    {"value": "year=2014", "Viewvalue": 2014},
                    {"value": "year=2015", "Viewvalue": 2015},
                    {"value": "year=2016", "Viewvalue": 2016},
                    {"value": "year=2017", "Viewvalue": 2017} */
                  ]
                },
                {
                  "value": "uso_solo_terraclass", 
                  "Viewvalue": "Terraclass",
                  "typeLabel": "Tipo",
                  "visible": true, 
                  "opacity": 1,
                  "regionFilter": true,
                  "order": 1
                },
                {
                  "value": "uso_solo_probio", 
                  "Viewvalue": "PROBIO",
                  "typeLabel": "Tipo",
                  "visible": false, 
                  "opacity": 1,
                  "regionFilter": true,
                  "order": 1
                }
              ]
						}
          ],
          "dataService": "/service/charts/lulc"
        },
				{
          "id": "agropecuaria",
          "label": "Agropecuária", 
          "group_expanded": false,
					"layers": [
            {
							"id": "mapa_agricultura_agrosatelite",
							"label": "Agricultura - Agrosatélite",
							"visible": false,
              "selectedType": 'agricultura_agrosatelite',
              "value": "agricultura_agrosatelite",
              "opacity": 1,
              "regionFilter": true,
              "order": 2,
              "typeLabel": "Tipo",
              "timeLabel": "Ano",
              "timeSelected": "year=2014",
              "timeHandler": "msfilter",
              "times": [
                {"value": "year=2001", "Viewvalue": 2001},
                {"value": "year=2007", "Viewvalue": 2007},
                {"value": "year=2014", "Viewvalue": 2014}
              ]
						},
						{
							"id": "mapa_pastagem",
							"label": "Pastagem - Lapig",
							"visible": false,
              "selectedType": 'pasture', 
							"types": [
								{
                  "value": "pasture", 
                  "Viewvalue": "Regular", 
                  "visible": false, 
                  "opacity": 1,
                  "regionFilter": true,
                  "order": 1,
                  "typeLabel": "Tipo",
                  "timeLabel": "Ano",
                  "timeSelected": "year=2018",
                  "timeHandler": "msfilter",
                  "times": [
                    {"value": "year=1985", "Viewvalue": 1985},
                    {"value": "year=1986", "Viewvalue": 1986},
                    {"value": "year=1987", "Viewvalue": 1987},
                    {"value": "year=1988", "Viewvalue": 1988},
                    {"value": "year=1989", "Viewvalue": 1989},
                    {"value": "year=1990", "Viewvalue": 1990},
                    {"value": "year=1991", "Viewvalue": 1991},
                    {"value": "year=1992", "Viewvalue": 1992},
                    {"value": "year=1993", "Viewvalue": 1993},
                    {"value": "year=1994", "Viewvalue": 1994},
                    {"value": "year=1995", "Viewvalue": 1995},
                    {"value": "year=1996", "Viewvalue": 1996},
                    {"value": "year=1997", "Viewvalue": 1997},
                    {"value": "year=1998", "Viewvalue": 1998},
                    {"value": "year=1999", "Viewvalue": 1999},
                    {"value": "year=2000", "Viewvalue": 2000},
                    {"value": "year=2001", "Viewvalue": 2001},
                    {"value": "year=2002", "Viewvalue": 2002},
                    {"value": "year=2003", "Viewvalue": 2003},
                    {"value": "year=2004", "Viewvalue": 2004},
                    {"value": "year=2005", "Viewvalue": 2005},
                    {"value": "year=2006", "Viewvalue": 2006},
                    {"value": "year=2007", "Viewvalue": 2007},
                    {"value": "year=2008", "Viewvalue": 2008},
                    {"value": "year=2009", "Viewvalue": 2009},
                    {"value": "year=2010", "Viewvalue": 2010},
                    {"value": "year=2011", "Viewvalue": 2011},
                    {"value": "year=2012", "Viewvalue": 2012},
                    {"value": "year=2013", "Viewvalue": 2013},
                    {"value": "year=2014", "Viewvalue": 2014},
                    {"value": "year=2015", "Viewvalue": 2015},
                    {"value": "year=2016", "Viewvalue": 2016},
                    {"value": "year=2017", "Viewvalue": 2017},
                    {"value": "year=2018", "Viewvalue": 2018}
                  ]
                 },
								 {
                   "value": "pasture_degraded", 
                   "Viewvalue": "Degradada",
                   "typeLabel": "Tipo", 
                   "visible": false, 
                   "opacity": 1,
                   "regionFilter": true,
                   "order": 10,
                   "layerfilter": "category='1'"
                 }
							]
						},
						{
							"id": "mapa_pecuaria_censitaria",
							"label": "Pecuária Censitária - IBGE",
							"visible": false,
              "selectedType": 'lotacao_bovina_regions',
							"types": [
                {
                  "value": "lotacao_bovina_regions", 
                  "Viewvalue": "Rebanho Bovino", 
                  "visible": false, 
                  "opacity": 1,
                  "regionFilter": true,
                  "order": 4,
                  "typeLabel": "Quantidade",
                  "timeLabel": "Ano",
                  "timeSelected": "year=2018",
                  "timeHandler": "msfilter",
                  "times": [
                    {"value": "year=1985", "Viewvalue": 1985},
                    {"value": "year=1986", "Viewvalue": 1986},
                    {"value": "year=1987", "Viewvalue": 1987},
                    {"value": "year=1988", "Viewvalue": 1988},
                    {"value": "year=1989", "Viewvalue": 1989},
                    {"value": "year=1990", "Viewvalue": 1990},
                    {"value": "year=1991", "Viewvalue": 1991},
                    {"value": "year=1992", "Viewvalue": 1992},
                    {"value": "year=1993", "Viewvalue": 1993},
                    {"value": "year=1994", "Viewvalue": 1994},
                    {"value": "year=1995", "Viewvalue": 1995},
                    {"value": "year=1996", "Viewvalue": 1996},
                    {"value": "year=1997", "Viewvalue": 1997},
                    {"value": "year=1998", "Viewvalue": 1998},
                    {"value": "year=1999", "Viewvalue": 1999},
                    {"value": "year=2000", "Viewvalue": 2000},
                    {"value": "year=2001", "Viewvalue": 2001},
                    {"value": "year=2002", "Viewvalue": 2002},
                    {"value": "year=2003", "Viewvalue": 2003},
                    {"value": "year=2004", "Viewvalue": 2004},
                    {"value": "year=2005", "Viewvalue": 2005},
                    {"value": "year=2006", "Viewvalue": 2006},
                    {"value": "year=2007", "Viewvalue": 2007},
                    {"value": "year=2008", "Viewvalue": 2008},
                    {"value": "year=2009", "Viewvalue": 2009},
                    {"value": "year=2010", "Viewvalue": 2010},
                    {"value": "year=2011", "Viewvalue": 2011},
                    {"value": "year=2012", "Viewvalue": 2012},
                    {"value": "year=2013", "Viewvalue": 2013},
                    {"value": "year=2014", "Viewvalue": 2014},
                    {"value": "year=2015", "Viewvalue": 2015},
                    {"value": "year=2016", "Viewvalue": 2016},
                    {"value": "year=2017", "Viewvalue": 2017},
                    {"value": "year=2018", "Viewvalue": 2018}
                  ]
                },
                {
                  "value": "producao_leite", 
                  "Viewvalue": "Produção de Leite", 
                  "visible": false, 
                  "opacity": 1,
                  "regionFilter": true,
                  "order": 4,
                  "typeLabel": "Quantidade",
                  "timeLabel": "Ano",
                  "timeSelected": "year=2018",
                  "timeHandler": "msfilter",
                  "times": [
                    {"value": "year=1985", "Viewvalue": 1985},
                    {"value": "year=1986", "Viewvalue": 1986},
                    {"value": "year=1987", "Viewvalue": 1987},
                    {"value": "year=1988", "Viewvalue": 1988},
                    {"value": "year=1989", "Viewvalue": 1989},
                    {"value": "year=1990", "Viewvalue": 1990},
                    {"value": "year=1991", "Viewvalue": 1991},
                    {"value": "year=1992", "Viewvalue": 1992},
                    {"value": "year=1993", "Viewvalue": 1993},
                    {"value": "year=1994", "Viewvalue": 1994},
                    {"value": "year=1995", "Viewvalue": 1995},
                    {"value": "year=1996", "Viewvalue": 1996},
                    {"value": "year=1997", "Viewvalue": 1997},
                    {"value": "year=1998", "Viewvalue": 1998},
                    {"value": "year=1999", "Viewvalue": 1999},
                    {"value": "year=2000", "Viewvalue": 2000},
                    {"value": "year=2001", "Viewvalue": 2001},
                    {"value": "year=2002", "Viewvalue": 2002},
                    {"value": "year=2003", "Viewvalue": 2003},
                    {"value": "year=2004", "Viewvalue": 2004},
                    {"value": "year=2005", "Viewvalue": 2005},
                    {"value": "year=2006", "Viewvalue": 2006},
                    {"value": "year=2007", "Viewvalue": 2007},
                    {"value": "year=2008", "Viewvalue": 2008},
                    {"value": "year=2009", "Viewvalue": 2009},
                    {"value": "year=2010", "Viewvalue": 2010},
                    {"value": "year=2011", "Viewvalue": 2011},
                    {"value": "year=2012", "Viewvalue": 2012},
                    {"value": "year=2013", "Viewvalue": 2013},
                    {"value": "year=2014", "Viewvalue": 2014},
                    {"value": "year=2015", "Viewvalue": 2015},
                    {"value": "year=2016", "Viewvalue": 2016},
                    {"value": "year=2017", "Viewvalue": 2017},
                    {"value": "year=2018", "Viewvalue": 2018}
                  ]
                }
							]
            },
            {
							"id": "mapa_agricultura_censitaria",
							"label": "Agricultura Censitária - IBGE",
							"visible": false,
              "selectedType": 'area_plantada_algodao_censo',
							"types": [
                {
                  "value": "area_plantada_algodao_censo", 
                  "Viewvalue": "Algodão", 
                  "visible": false, 
                  "opacity": 1,
                  "regionFilter": true,
                  "order": 3,
                  "typeLabel": "Área Plantada",
                  "timeLabel": "Ano",
                  "timeSelected": "year=2018",
                  "timeHandler": "msfilter",
                  "times": [
                    {"value": "year=2000", "Viewvalue": 2000},
                    {"value": "year=2001", "Viewvalue": 2001},
                    {"value": "year=2002", "Viewvalue": 2002},
                    {"value": "year=2003", "Viewvalue": 2003},
                    {"value": "year=2004", "Viewvalue": 2004},
                    {"value": "year=2005", "Viewvalue": 2005},
                    {"value": "year=2006", "Viewvalue": 2006},
                    {"value": "year=2007", "Viewvalue": 2007},
                    {"value": "year=2008", "Viewvalue": 2008},
                    {"value": "year=2009", "Viewvalue": 2009},
                    {"value": "year=2010", "Viewvalue": 2010},
                    {"value": "year=2011", "Viewvalue": 2011},
                    {"value": "year=2012", "Viewvalue": 2012},
                    {"value": "year=2013", "Viewvalue": 2013},
                    {"value": "year=2014", "Viewvalue": 2014},
                    {"value": "year=2015", "Viewvalue": 2015},
                    {"value": "year=2016", "Viewvalue": 2016},
                    {"value": "year=2017", "Viewvalue": 2017},
                    {"value": "year=2018", "Viewvalue": 2018}
                  ]
                },
                {
                  "value": "area_plantada_cana_censo", 
                  "Viewvalue": "Cana", 
                  "visible": false, 
                  "opacity": 1,
                  "regionFilter": true,
                  "order": 3,
                  "typeLabel": "Área Plantada",
                  "timeLabel": "Ano",
                  "timeSelected": "year=2018",
                  "timeHandler": "msfilter",
                  "times": [
                    {"value": "year=2000", "Viewvalue": 2000},
                    {"value": "year=2001", "Viewvalue": 2001},
                    {"value": "year=2002", "Viewvalue": 2002},
                    {"value": "year=2003", "Viewvalue": 2003},
                    {"value": "year=2004", "Viewvalue": 2004},
                    {"value": "year=2005", "Viewvalue": 2005},
                    {"value": "year=2006", "Viewvalue": 2006},
                    {"value": "year=2007", "Viewvalue": 2007},
                    {"value": "year=2008", "Viewvalue": 2008},
                    {"value": "year=2009", "Viewvalue": 2009},
                    {"value": "year=2010", "Viewvalue": 2010},
                    {"value": "year=2011", "Viewvalue": 2011},
                    {"value": "year=2012", "Viewvalue": 2012},
                    {"value": "year=2013", "Viewvalue": 2013},
                    {"value": "year=2014", "Viewvalue": 2014},
                    {"value": "year=2015", "Viewvalue": 2015},
                    {"value": "year=2016", "Viewvalue": 2016},
                    {"value": "year=2017", "Viewvalue": 2017},
                    {"value": "year=2018", "Viewvalue": 2018}
                  ]
                },
                {
                  "value": "area_plantada_milho_censo", 
                  "Viewvalue": "Milho", 
                  "visible": false, 
                  "opacity": 1,
                  "regionFilter": true,
                  "order": 3,
                  "typeLabel": "Área Plantada",
                  "timeLabel": "Ano",
                  "timeSelected": "year=2018",
                  "timeHandler": "msfilter",
                  "times": [
                    {"value": "year=2000", "Viewvalue": 2000},
                    {"value": "year=2001", "Viewvalue": 2001},
                    {"value": "year=2002", "Viewvalue": 2002},
                    {"value": "year=2003", "Viewvalue": 2003},
                    {"value": "year=2004", "Viewvalue": 2004},
                    {"value": "year=2005", "Viewvalue": 2005},
                    {"value": "year=2006", "Viewvalue": 2006},
                    {"value": "year=2007", "Viewvalue": 2007},
                    {"value": "year=2008", "Viewvalue": 2008},
                    {"value": "year=2009", "Viewvalue": 2009},
                    {"value": "year=2010", "Viewvalue": 2010},
                    {"value": "year=2011", "Viewvalue": 2011},
                    {"value": "year=2012", "Viewvalue": 2012},
                    {"value": "year=2013", "Viewvalue": 2013},
                    {"value": "year=2014", "Viewvalue": 2014},
                    {"value": "year=2015", "Viewvalue": 2015},
                    {"value": "year=2016", "Viewvalue": 2016},
                    {"value": "year=2017", "Viewvalue": 2017},
                    {"value": "year=2018", "Viewvalue": 2018}
                  ]
                },
                {
                  "value": "area_plantada_soja_censo", 
                  "Viewvalue": "Soja", 
                  "visible": false, 
                  "opacity": 1,
                  "regionFilter": true,
                  "order": 3,
                  "typeLabel": "Área Plantada",
                  "timeLabel": "Ano",
                  "timeSelected": "year=2018",
                  "timeHandler": "msfilter",
                  "times": [
                    {"value": "year=2000", "Viewvalue": 2000},
                    {"value": "year=2001", "Viewvalue": 2001},
                    {"value": "year=2002", "Viewvalue": 2002},
                    {"value": "year=2003", "Viewvalue": 2003},
                    {"value": "year=2004", "Viewvalue": 2004},
                    {"value": "year=2005", "Viewvalue": 2005},
                    {"value": "year=2006", "Viewvalue": 2006},
                    {"value": "year=2007", "Viewvalue": 2007},
                    {"value": "year=2008", "Viewvalue": 2008},
                    {"value": "year=2009", "Viewvalue": 2009},
                    {"value": "year=2010", "Viewvalue": 2010},
                    {"value": "year=2011", "Viewvalue": 2011},
                    {"value": "year=2012", "Viewvalue": 2012},
                    {"value": "year=2013", "Viewvalue": 2013},
                    {"value": "year=2014", "Viewvalue": 2014},
                    {"value": "year=2015", "Viewvalue": 2015},
                    {"value": "year=2016", "Viewvalue": 2016},
                    {"value": "year=2017", "Viewvalue": 2017},
                    {"value": "year=2018", "Viewvalue": 2018}
                  ]
                },
                {
                  "value": "quantidade_produzida_carvao_censo",
                  "Viewvalue": "Carvão", 
                  "visible": false, 
                  "opacity": 1,
                  "regionFilter": true,
                  "order": 3,
                  "typeLabel": "Produção",
                  "timeLabel": "Ano",
                  "timeSelected": "year=2018",
                  "timeHandler": "msfilter",
                  "times": [
                    {"value": "year=2000", "Viewvalue": 2000},
                    {"value": "year=2001", "Viewvalue": 2001},
                    {"value": "year=2002", "Viewvalue": 2002},
                    {"value": "year=2003", "Viewvalue": 2003},
                    {"value": "year=2004", "Viewvalue": 2004},
                    {"value": "year=2005", "Viewvalue": 2005},
                    {"value": "year=2006", "Viewvalue": 2006},
                    {"value": "year=2007", "Viewvalue": 2007},
                    {"value": "year=2008", "Viewvalue": 2008},
                    {"value": "year=2009", "Viewvalue": 2009},
                    {"value": "year=2010", "Viewvalue": 2010},
                    {"value": "year=2011", "Viewvalue": 2011},
                    {"value": "year=2012", "Viewvalue": 2012},
                    {"value": "year=2013", "Viewvalue": 2013},
                    {"value": "year=2014", "Viewvalue": 2014},
                    {"value": "year=2015", "Viewvalue": 2015},
                    {"value": "year=2016", "Viewvalue": 2016},
                    {"value": "year=2017", "Viewvalue": 2017}, 
                    {"value": "year=2018", "Viewvalue": 2018}
                  ]
                },
                {
                  "value": "quantidade_produzida_lenha_censo",
                  "Viewvalue": "Lenha", 
                  "visible": false, 
                  "opacity": 1,
                  "regionFilter": true,
                  "order": 3,
                  "typeLabel": "Produção",
                  "timeLabel": "Ano",
                  "timeSelected": "year=2018",
                  "timeHandler": "msfilter",
                  "times": [
                    {"value": "year=2000", "Viewvalue": 2000},
                    {"value": "year=2001", "Viewvalue": 2001},
                    {"value": "year=2002", "Viewvalue": 2002},
                    {"value": "year=2003", "Viewvalue": 2003},
                    {"value": "year=2004", "Viewvalue": 2004},
                    {"value": "year=2005", "Viewvalue": 2005},
                    {"value": "year=2006", "Viewvalue": 2006},
                    {"value": "year=2007", "Viewvalue": 2007},
                    {"value": "year=2008", "Viewvalue": 2008},
                    {"value": "year=2009", "Viewvalue": 2009},
                    {"value": "year=2010", "Viewvalue": 2010},
                    {"value": "year=2011", "Viewvalue": 2011},
                    {"value": "year=2012", "Viewvalue": 2012},
                    {"value": "year=2013", "Viewvalue": 2013},
                    {"value": "year=2014", "Viewvalue": 2014},
                    {"value": "year=2015", "Viewvalue": 2015},
                    {"value": "year=2016", "Viewvalue": 2016},
                    {"value": "year=2017", "Viewvalue": 2017}, 
                    {"value": "year=2018", "Viewvalue": 2018}
                  ]
                },
                {
                  "value": "quantidade_produzida_madeira_censo",
                  "Viewvalue": "Madeira", 
                  "visible": false, 
                  "opacity": 1,
                  "regionFilter": true,
                  "order": 3,
                  "typeLabel": "Produção",
                  "timeLabel": "Ano",
                  "timeSelected": "year=2018",
                  "timeHandler": "msfilter",
                  "times": [
                    {"value": "year=2000", "Viewvalue": 2000},
                    {"value": "year=2001", "Viewvalue": 2001},
                    {"value": "year=2002", "Viewvalue": 2002},
                    {"value": "year=2003", "Viewvalue": 2003},
                    {"value": "year=2004", "Viewvalue": 2004},
                    {"value": "year=2005", "Viewvalue": 2005},
                    {"value": "year=2006", "Viewvalue": 2006},
                    {"value": "year=2007", "Viewvalue": 2007},
                    {"value": "year=2008", "Viewvalue": 2008},
                    {"value": "year=2009", "Viewvalue": 2009},
                    {"value": "year=2010", "Viewvalue": 2010},
                    {"value": "year=2011", "Viewvalue": 2011},
                    {"value": "year=2012", "Viewvalue": 2012},
                    {"value": "year=2013", "Viewvalue": 2013},
                    {"value": "year=2014", "Viewvalue": 2014},
                    {"value": "year=2015", "Viewvalue": 2015},
                    {"value": "year=2016", "Viewvalue": 2016},
                    {"value": "year=2017", "Viewvalue": 2017}, 
                    {"value": "year=2018", "Viewvalue": 2018}
                  ]
                }
							]
						}
          ],
          "dataService": "/service/charts/farming"
        },
        {
          "id": "desmatamento_queimadas",
          "label": "Desmatamentos/Queimadas",
          "group_expanded": false,
          "layers":[
            {
							"id": "mapa_desmatamento",
							"label": "Áreas Desmatamento",
							"visible": false,
              "selectedType": 'desmatamento_prodes', 
							"types": [
								{
                  "value": "desmatamento_prodes", 
                  "Viewvalue": "PRODES", 
                  "visible": false, 
                  "opacity": 1,
                  "regionFilter": true,
                  "order": 1,
                  "typeLabel": "Fonte",
                  "timeLabel": "Ano",
                  "timeSelected": "year=2018",
                  "timeHandler": "msfilter",
                  "times": [
                    {"value": "year=2002", "Viewvalue": 2002},
                    {"value": "year=2004", "Viewvalue": 2004},
                    {"value": "year=2006", "Viewvalue": 2006},
                    {"value": "year=2008", "Viewvalue": 2008},
                    {"value": "year=2010", "Viewvalue": 2010},
                    {"value": "year=2012", "Viewvalue": 2012},
                    {"value": "year=2013", "Viewvalue": 2013},
                    {"value": "year=2015", "Viewvalue": 2015},
                    {"value": "year=2016", "Viewvalue": 2016},
                    {"value": "year=2017", "Viewvalue": 2017},
                    {"value": "year=2018", "Viewvalue": 2018}
                  ]
                 },
                 {
                  "value": "desmatamento_siad", 
                  "Viewvalue": "SIAD", 
                  "visible": false, 
                  "opacity": 1,
                  "regionFilter": true,
                  "order": 2,
                  "typeLabel": "Fonte",
                  "timeLabel": "Ano",
                  "timeSelected": "year=2017",
                  "timeHandler": "msfilter",
                  "times": [
                    {"value": "year=2003", "Viewvalue": 2003},
                    {"value": "year=2004", "Viewvalue": 2004},
                    {"value": "year=2005", "Viewvalue": 2005},
                    {"value": "year=2006", "Viewvalue": 2006},
                    {"value": "year=2007", "Viewvalue": 2007},
                    {"value": "year=2008", "Viewvalue": 2008},
                    {"value": "year=2009", "Viewvalue": 2009},
                    {"value": "year=2010", "Viewvalue": 2010},
                    {"value": "year=2011", "Viewvalue": 2011},
                    {"value": "year=2012", "Viewvalue": 2012},
                    {"value": "year=2013", "Viewvalue": 2013},
                    {"value": "year=2014", "Viewvalue": 2014},
                    {"value": "year=2015", "Viewvalue": 2015},
                    {"value": "year=2016", "Viewvalue": 2016},
                    {"value": "year=2017", "Viewvalue": 2017}
                  ]
                 },
                 {
                  "value": "desmatamento_glad", 
                  "Viewvalue": "GLAD", 
                  "visible": false, 
                  "opacity": 1,
                  "regionFilter": true,
                  "order": 3,
                  "typeLabel": "Fonte",
                  "timeLabel": "Ano",
                  "timeSelected": "year=2018",
                  "timeHandler": "msfilter",
                  "times": [
                    {"value": "year=2001", "Viewvalue": 2001},
                    {"value": "year=2002", "Viewvalue": 2002},
                    {"value": "year=2003", "Viewvalue": 2003},
                    {"value": "year=2004", "Viewvalue": 2004},
                    {"value": "year=2005", "Viewvalue": 2005},
                    {"value": "year=2006", "Viewvalue": 2006},
                    {"value": "year=2007", "Viewvalue": 2007},
                    {"value": "year=2008", "Viewvalue": 2008},
                    {"value": "year=2009", "Viewvalue": 2009},
                    {"value": "year=2010", "Viewvalue": 2010},
                    {"value": "year=2011", "Viewvalue": 2011},
                    {"value": "year=2012", "Viewvalue": 2012},
                    {"value": "year=2013", "Viewvalue": 2013},
                    {"value": "year=2014", "Viewvalue": 2014},
                    {"value": "year=2015", "Viewvalue": 2015},
                    {"value": "year=2016", "Viewvalue": 2016},
                    {"value": "year=2017", "Viewvalue": 2017},
                    {"value": "year=2018", "Viewvalue": 2018}
                  ]
                 }
							]
            },
            {
							"id": "mapa_alertas_desmatamento",
							"label": "Alertas Desmatamento",
							"visible": false,
              "selectedType": 'alertas_desmatamento_deter', 
							"types": [
								{
                  "value": "alertas_desmatamento_deter", 
                  "Viewvalue": "DETER", 
                  "visible": false, 
                  "opacity": 1,
                  "regionFilter": true,
                  "order": 1,
                  "typeLabel": "Fonte"
                }
							]
            },
            {
							"id": "mapa_queimadas",
							"label": "Áreas de Queimadas",
							"visible": false,
              "selectedType": 'queimadas_lapig', 
							"types": [
                 {
                  "value": "queimadas_lapig", 
                  "Viewvalue": "LAPIG", 
                  "visible": false, 
                  "opacity": 1,
                  "regionFilter": true,
                  "order": 5,
                  "typeLabel": "Fonte",
                  "timeLabel": "Ano",
                  "timeSelected": "year=2018",
                  "timeHandler": "msfilter",
                  "times": [
                    {"value": "year=2000", "Viewvalue": 2000},
                    {"value": "year=2001", "Viewvalue": 2001},
                    {"value": "year=2002", "Viewvalue": 2002},
                    {"value": "year=2003", "Viewvalue": 2003},
                    {"value": "year=2004", "Viewvalue": 2004},
                    {"value": "year=2005", "Viewvalue": 2005},
                    {"value": "year=2006", "Viewvalue": 2006},
                    {"value": "year=2007", "Viewvalue": 2007},
                    {"value": "year=2008", "Viewvalue": 2008},
                    {"value": "year=2009", "Viewvalue": 2009},
                    {"value": "year=2010", "Viewvalue": 2010},
                    {"value": "year=2011", "Viewvalue": 2011},
                    {"value": "year=2012", "Viewvalue": 2012},
                    {"value": "year=2013", "Viewvalue": 2013},
                    {"value": "year=2014", "Viewvalue": 2014},
                    {"value": "year=2015", "Viewvalue": 2015},
                    {"value": "year=2016", "Viewvalue": 2016},
                    {"value": "year=2017", "Viewvalue": 2017},
                    {"value": "year=2018", "Viewvalue": 2018}
                  ]
                 }
							]
            }
          ]
        },
        {
          "id": "pontos_validacao",
          "label": "Pontos de Validação",
          "group_expanded": false,
          "layers":[
            {
							"id": "pontos_coletados_campo",
							"label": "Pontos Coletados em Campo",
							"visible": false,
              "selectedType": 'pontos_campo_sem_parada', 
							"types": [
								{
                  "value": "pontos_campo_parada", 
                  "Viewvalue": "Parada", 
                  "visible": false, 
                  "opacity": 1,
                  "regionFilter": true,
                  "order": 1,
                  "typeLabel": "Tipo",
                  /* "timeLabel": "Ano",
                  "timeSelected": "year=2018",
                  "timeHandler": "msfilter",
                  "times": [
                    {"value": "year=2002", "Viewvalue": 2002},
                    {"value": "year=2004", "Viewvalue": 2004},
                    {"value": "year=2006", "Viewvalue": 2006},
                    {"value": "year=2008", "Viewvalue": 2008},
                    {"value": "year=2010", "Viewvalue": 2010},
                    {"value": "year=2012", "Viewvalue": 2012},
                    {"value": "year=2013", "Viewvalue": 2013},
                    {"value": "year=2015", "Viewvalue": 2015},
                    {"value": "year=2016", "Viewvalue": 2016},
                    {"value": "year=2017", "Viewvalue": 2017},
                    {"value": "year=2018", "Viewvalue": 2018}
                  ] */
                 },
                 {
                  "value": "pontos_campo_sem_parada", 
                  "Viewvalue": "Sem parada", 
                  "visible": false, 
                  "opacity": 1,
                  "regionFilter": true,
                  "order": 2,
                  "typeLabel": "Tipo",
                  /* "timeLabel": "Ano",
                  "timeSelected": "year=2017",
                  "timeHandler": "msfilter",
                  "times": [
                    {"value": "year=2003", "Viewvalue": 2003},
                    {"value": "year=2004", "Viewvalue": 2004},
                    {"value": "year=2005", "Viewvalue": 2005},
                    {"value": "year=2006", "Viewvalue": 2006},
                    {"value": "year=2007", "Viewvalue": 2007},
                    {"value": "year=2008", "Viewvalue": 2008},
                    {"value": "year=2009", "Viewvalue": 2009},
                    {"value": "year=2010", "Viewvalue": 2010},
                    {"value": "year=2011", "Viewvalue": 2011},
                    {"value": "year=2012", "Viewvalue": 2012},
                    {"value": "year=2013", "Viewvalue": 2013},
                    {"value": "year=2014", "Viewvalue": 2014},
                    {"value": "year=2015", "Viewvalue": 2015},
                    {"value": "year=2016", "Viewvalue": 2016},
                    {"value": "year=2017", "Viewvalue": 2017}
                  ] */
                 }
							]
            },
            {
							"id": "pontos_inspecionados_visualmente",
							"label": "Pontos Inpecionados Visualmente",
							"visible": false,
              "selectedType": 'pontos_tvi_treinamento', 
							"types": [
								{
                  "value": "pontos_tvi_treinamento", 
                  "Viewvalue": "Treinamento", 
                  "visible": false, 
                  "opacity": 1,
                  "regionFilter": true,
                  "order": 1,
                  "typeLabel": "Tipo"
                },
                {
                  "value": "pontos_tvi_validacao", 
                  "Viewvalue": "Validação", 
                  "visible": false, 
                  "opacity": 1,
                  "regionFilter": true,
                  "order": 1,
                  "typeLabel": "Tipo"
                }
							]
            }
          ]
        }
      ],
      "basemaps": [
        {
          "id": "basemaps",
          "defaultBaseMap": 'mapbox',
          "types": [
            {
              "value":"mapbox",
              "viewValue": "Geopolítico",
              "visible": true
            },
            {
              "value":"satelite",
              "viewValue": "Satélite",
              "visible": false
            },
            {
              "value":"estradas",
              "viewValue": "Estradas",
              "visible": false
            },
            {
              "value":"relevo",
              "viewValue": "Relevo",
              "visible": false
            },
            {
              "value":"landsat",
              "viewValue": "Landsat - 2018",
              "visible": false
            }
          ]

        }
      ],
			"limits": [
				{
					"id": "limits_bioma",
					"types": [
						{
              "value": "biomas", 
              "Viewvalue": "Cerrado", 
              "visible": true, 
              "layer_limits": true,
              "opacity": 1
            },
            {
              "value": "estados", 
              "Viewvalue": "Estados", 
              "visible": false, 
              "layer_limits": true,
              "opacity": 1
            },
						{
              "value": "municipios",  
              "Viewvalue": "Municípios", 
              "visible": false, 
              "layer_limits": true,
              "opacity": 1
            },
            {
              "value": "limites_terras_indigenas",
              "Viewvalue": "Terras Indígenas",
              "visible": false,
              "layer_limits": true,
              "opacity": 1
            },
            {
              "value": "geo_car_imovel",
              "Viewvalue": "Terras Privadas CAR",
              "visible": false,
              "layer_limits": true,
              "opacity": 1
            },
            {
              "value": "limites_unidades_protecao_integral",
              "Viewvalue": "Unidades de Conservação Integral ",
              "visible": false,
              "layer_limits": true,
              "opacity": 1
            }
					],
					"selectedType": 'biomas',
				}
			]
		}

		response.send(result)
		response.end()

	}

	return Controller;

}
