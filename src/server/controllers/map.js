var fs = require('fs')
    , archiver = require('archiver')
    , json2csv = require('json2csv').parse
    , languageJson = require('../assets/lang/language.json');

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
        // var diretorioFotos = config.fotoDir;
        var queryResult = request.queryResult
        
        queryResult.forEach(function (row) {

          result.push({
            'type': 'Feature',
            'geometry': JSON.parse(row['geojson']),
            'properties': {
              'id': row['id'],
              // 'foto': fs.readdirSync(diretorioFotos + row['id']),
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
    var language = request.param('lang')

		var result = {
      "regionFilterDefault": "bioma='CERRADO'",
			"groups": [
        {
          "id": "mapeamento_uso_solo",
          "label": languageJson["title_group_label"]["usodosolo"][language],
          "group_expanded": true,
          "layers":[
            {
							"id": "mapa_uso_solo",
							"label": languageJson["title_layer_label"]["usodosolo"][language],
							"visible": true,
              "selectedType": 'uso_solo_mapbiomas',
              "downloadSHP": false,
              "downloadCSV": true,
              "types": [
								{
                  "value": "uso_solo_mapbiomas", 
                  "Viewvalue": languageJson["type_layer_viewvalue"]["usodosolo_mapbiomas"][language],
                  "visible": true, 
                  "opacity": 1,
                  "regionFilter": true,
                  "order": 1,
                  "typeLabel": languageJson["typelabel_layer"]["type"][language],
                  "timeLabel": languageJson["typelabel_layer"]["year"][language],
                  "timeSelected": "year=2019",
                  "timeHandler": "msfilter",
                  "times": [
                    {"value": "year=1985", "Viewvalue": 1985} ,
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
                    {"value": "year=2018", "Viewvalue": 2018},
                    {"value": "year=2019", "Viewvalue": 2019}
                  ],
                  "metadados": {
                    "title": languageJson["metadata"]["usodosolo_mapbiomas"]["title"][language],
                    "description": languageJson["metadata"]["usodosolo_mapbiomas"]["description"][language],
                    "link_description": "https://mapbiomas-br-site.s3.amazonaws.com/ATBD_Collection_4_v2_Dez2019.pdf",
                    "format": languageJson["metadata"]["usodosolo_mapbiomas"]["format"][language],
                    "region": languageJson["metadata"]["usodosolo_mapbiomas"]["region"][language],
                    "period": languageJson["metadata"]["usodosolo_mapbiomas"]["period"][language],
                    "scale": languageJson["metadata"]["usodosolo_mapbiomas"]["scale"][language],
                    "system_coordinator": languageJson["metadata"]["usodosolo_mapbiomas"]["system_coordinator"][language],
                    "cartographic_projection": languageJson["metadata"]["usodosolo_mapbiomas"]["cartographic_projection"][language],
                    "cod_caracter": languageJson["metadata"]["usodosolo_mapbiomas"]["cod_caracter"][language],
                    "fonte": languageJson["metadata"]["usodosolo_mapbiomas"]["fonte"][language],
                    "contato":"lapig.cepf@gmail.com"
                  },
                  "columnsCSV": "area_ha, classe, year"
                },
                {
                  "value": "uso_solo_terraclass", 
                  "Viewvalue": languageJson["type_layer_viewvalue"]["usodosolo_terraclass"][language],
                  "typeLabel": languageJson["typelabel_layer"]["type"][language],
                  "visible": false, 
                  "opacity": 1,
                  "regionFilter": true,
                  "order": 1,
                  "metadados": {
                    "title": languageJson["metadata"]["usodosolo_terraclass"]["title"][language],
                    "description": languageJson["metadata"]["usodosolo_terraclass"]["description"][language],
                    "format": languageJson["metadata"]["usodosolo_terraclass"]["format"][language],
                    "region": languageJson["metadata"]["usodosolo_terraclass"]["region"][language],
                    "period": languageJson["metadata"]["usodosolo_terraclass"]["period"][language],
                    "scale": languageJson["metadata"]["usodosolo_terraclass"]["scale"][language],
                    "system_coordinator": languageJson["metadata"]["usodosolo_terraclass"]["system_coordinator"][language],
                    "cartographic_projection": languageJson["metadata"]["usodosolo_terraclass"]["cartographic_projection"][language],
                    "cod_caracter": languageJson["metadata"]["usodosolo_terraclass"]["cod_caracter"][language],
                    "fonte": languageJson["metadata"]["usodosolo_terraclass"]["fonte"][language],
                    "link_fonte": "https://www.mma.gov.br/images/arquivo/80049/Cerrado/publicacoes/Livro%20EMBRAPA-WEB-1-TerraClass%20Cerrado.pdf",
                    "contato":"lapig.cepf@gmail.com"
                  },
                  "columnsCSV": "area_ha, classe"
                },
                {
                  "value": "uso_solo_probio", 
                  "Viewvalue": languageJson["type_layer_viewvalue"]["usodosolo_probio"][language],
                  "typeLabel": languageJson["typelabel_layer"]["type"][language],
                  "visible": false, 
                  "opacity": 1,
                  "regionFilter": true,
                  "order": 1,
                  "metadados": {
                    "title": languageJson["metadata"]["usodosolo_probio"]["title"][language],
                    "description": languageJson["metadata"]["usodosolo_probio"]["description"][language],
                    "format": languageJson["metadata"]["usodosolo_probio"]["format"][language],
                    "region": languageJson["metadata"]["usodosolo_probio"]["region"][language],
                    "period": languageJson["metadata"]["usodosolo_probio"]["period"][language],
                    "scale": languageJson["metadata"]["usodosolo_probio"]["scale"][language],
                    "system_coordinator": languageJson["metadata"]["usodosolo_probio"]["system_coordinator"][language],
                    "cartographic_projection": languageJson["metadata"]["usodosolo_probio"]["cartographic_projection"][language],
                    "cod_caracter": languageJson["metadata"]["usodosolo_probio"]["cod_caracter"][language],
                    "fonte": languageJson["metadata"]["usodosolo_probio"]["fonte"][language],
                    "contato":"lapig.cepf@gmail.com"
                  },
                  "columnsCSV": "area_ha, classe"
                }
              ]
            },
            {
							"id": "bi_ce_ecorregioes_2019_5000_diversas",
							"label": "Ecorregiões do Cerrado",
							"visible": false,
              "selectedType": 'bi_ce_ecorregioes_2019_5000_diversas',
              "value": "bi_ce_ecorregioes_2019_5000_diversas",
              "opacity": 1,
              "regionFilter": true,
              "order": 2,
              // "typeLabel": languageJson["typelabel_layer"]["type"][language],
              // "timeLabel": languageJson["typelabel_layer"]["year"][language],
              // "timeSelected": "year=2014",
              "timeHandler": "msfilter",
              // "times": [
              //   {"value": "year=2001", "Viewvalue": 2001},
              //   {"value": "year=2007", "Viewvalue": 2007},
              //   {"value": "year=2014", "Viewvalue": 2014}
              // ],
              "metadados": {
                "title": "Ecorregiões do Cerrado",
                "description": "Divisão do bioma Cerrado em regiões ecológicas distintas.",
                "format": "",
                "region": "Cerrado",
                "period": "2019",
                "scale": "",
                "system_coordinator": "",
                "cartographic_projection": "",
                "cod_caracter": "",
                "fonte": "",
                "contato":"lapig.cepf@gmail.com"
              },
              "columnsCSV": "area_ha, sequencia, nome",
              "downloadSHP": true,
              "downloadCSV": true
						}
          ],
          "dataService": "/service/charts/lulc"
        },
				{
          "id": "agropecuaria",
          "label": languageJson["title_group_label"]["agropecuaria"][language],
          "group_expanded": false,
					"layers": [
            {
							"id": "mapa_agricultura_agrosatelite",
							"label": languageJson["title_layer_label"]["agrosatelite"][language],
							"visible": false,
              "selectedType": 'agricultura_agrosatelite',
              "value": "agricultura_agrosatelite",
              "opacity": 1,
              "regionFilter": true,
              "order": 2,
              "typeLabel": languageJson["typelabel_layer"]["type"][language],
              "timeLabel": languageJson["typelabel_layer"]["year"][language],
              "timeSelected": "year=2014",
              "timeHandler": "msfilter",
              "times": [
                {"value": "year=2001", "Viewvalue": 2001},
                {"value": "year=2007", "Viewvalue": 2007},
                {"value": "year=2014", "Viewvalue": 2014}
              ],
              "metadados": {
                "title": languageJson["metadata"]["agricultura_agrosatelite"]["title"][language],
                "description": languageJson["metadata"]["agricultura_agrosatelite"]["description"][language],
                "format": languageJson["metadata"]["agricultura_agrosatelite"]["format"][language],
                "region": languageJson["metadata"]["agricultura_agrosatelite"]["region"][language],
                "period": languageJson["metadata"]["agricultura_agrosatelite"]["period"][language],
                "scale": languageJson["metadata"]["agricultura_agrosatelite"]["scale"][language],
                "system_coordinator": languageJson["metadata"]["agricultura_agrosatelite"]["system_coordinator"][language],
                "cartographic_projection": languageJson["metadata"]["agricultura_agrosatelite"]["cartographic_projection"][language],
                "cod_caracter": languageJson["metadata"]["agricultura_agrosatelite"]["cod_caracter"][language],
                "fonte": languageJson["metadata"]["agricultura_agrosatelite"]["fonte"][language],
                "contato":"lapig.cepf@gmail.com"
              },
              "columnsCSV": "area_ha, classe, year",
              "downloadSHP": true,
              "downloadCSV": true
						},
						{
							"id": "mapa_pastagem",
							"label": languageJson["title_layer_label"]["pasture"][language],
							"visible": false,
              "selectedType": 'pasture',
              "downloadSHP": true,
              "downloadCSV": true,
							"types": [
								{
                  "value": "pasture", 
                  "Viewvalue": languageJson["type_layer_viewvalue"]["pasture_regular"][language],
                  "visible": false, 
                  "opacity": 1,
                  "regionFilter": true,
                  "order": 1,
                  "typeLabel": languageJson["typelabel_layer"]["type"][language],
                  "timeLabel": languageJson["typelabel_layer"]["year"][language],
                  "timeSelected": "year=2019",
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
                    {"value": "year=2018", "Viewvalue": 2018},
                    {"value": "year=2019", "Viewvalue": 2019}
                  ],
                  "metadados": {
                    "title": languageJson["metadata"]["pasture_regular"]["title"][language],
                    "description": languageJson["metadata"]["pasture_regular"]["description"][language],
                    "link_description": "https://mapbiomas-br-site.s3.amazonaws.com/ATBD_Collection_4_v2_Dez2019.pdf",
                    "format": languageJson["metadata"]["pasture_regular"]["format"][language],
                    "region": languageJson["metadata"]["pasture_regular"]["region"][language],
                    "period": languageJson["metadata"]["pasture_regular"]["period"][language],
                    "scale": languageJson["metadata"]["pasture_regular"]["scale"][language],
                    "system_coordinator": languageJson["metadata"]["pasture_regular"]["system_coordinator"][language],
                    "cartographic_projection": languageJson["metadata"]["pasture_regular"]["cartographic_projection"][language],
                    "update": languageJson["metadata"]["pasture_regular"]["regular_update"][language],
                    "cod_caracter": languageJson["metadata"]["pasture_regular"]["cod_caracter"][language],
                    "fonte": languageJson["metadata"]["pasture_regular"]["fonte"][language],
                    "contato":"lapig.cepf@gmail.com"
                  },
                  "columnsCSV": "area_ha, year"
                 },
								 {
                   "value": "classes_degradacao_pastagem", 
                   "Viewvalue": languageJson["type_layer_viewvalue"]["pasture_degraded"][language],
                   "typeLabel": languageJson["typelabel_layer"]["type"][language],
                   "visible": false, 
                   "opacity": 1,
                   "regionFilter": true,
                   "order": 10,
                   //"layerfilter": "category='1'",
                   "metadados": {
                      "title": languageJson["metadata"]["pasture_degraded"]["title"][language],
                      "description": languageJson["metadata"]["pasture_degraded"]["description"][language],
                      "format": languageJson["metadata"]["pasture_degraded"]["format"][language],
                      "region": languageJson["metadata"]["pasture_degraded"]["region"][language],
                      "period": languageJson["metadata"]["pasture_degraded"]["period"][language],
                      "scale": languageJson["metadata"]["pasture_degraded"]["scale"][language],
                      "system_coordinator": languageJson["metadata"]["pasture_degraded"]["system_coordinator"][language],
                      "cartographic_projection": languageJson["metadata"]["pasture_degraded"]["cartographic_projection"][language],
                      "cod_caracter": languageJson["metadata"]["pasture_degraded"]["cod_caracter"][language],
                      "fonte": languageJson["metadata"]["pasture_degraded"]["fonte"][language],
                      "contato":"lapig.cepf@gmail.com"
                   },
                   "columnsCSV": "area_ha"
                 }
							]
						},
						{
							"id": "mapa_pecuaria_censitaria",
							"label": languageJson["title_layer_label"]["pecuaria_censitaria"][language],
							"visible": false,
              "selectedType": 'lotacao_bovina_regions',
              "downloadSHP": false,
              "downloadCSV": true,
							"types": [
                {
                  "value": "lotacao_bovina_regions", 
                  "Viewvalue": languageJson["type_layer_viewvalue"]["rebanho_bovino"][language],
                  "visible": false, 
                  "opacity": 1,
                  "regionFilter": true,
                  "order": 4,
                  "typeLabel": languageJson["typelabel_layer"]["quantity"][language],
                  "timeLabel": languageJson["typelabel_layer"]["year"][language],
                  "timeSelected": "year=2019",
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
                    {"value": "year=2018", "Viewvalue": 2018},
                    {"value": "year=2019", "Viewvalue": 2019}
                  ],
                  "metadados": {
                    "title": languageJson["metadata"]["rebanho_bovino"]["title"][language],
                    "description": languageJson["metadata"]["rebanho_bovino"]["description"][language],
                    "format": languageJson["metadata"]["rebanho_bovino"]["format"][language],
                    "region": languageJson["metadata"]["rebanho_bovino"]["region"][language],
                    "period": languageJson["metadata"]["rebanho_bovino"]["period"][language],
                    "scale": languageJson["metadata"]["rebanho_bovino"]["scale"][language],
                    "system_coordinator": languageJson["metadata"]["rebanho_bovino"]["system_coordinator"][language],
                    "cartographic_projection": languageJson["metadata"]["rebanho_bovino"]["cartographic_projection"][language],
                    "cod_caracter": languageJson["metadata"]["rebanho_bovino"]["cod_caracter"][language],
                    "fonte": languageJson["metadata"]["rebanho_bovino"]["fonte"][language],
                    "contato":"lapig.cepf@gmail.com"
                  },
                  "columnsCSV": "n_kbcs, ua, year"
                },
                {
                  "value": "bi_ce_leite_quantidade_municipio_250_ibge",
                  "Viewvalue": languageJson["type_layer_viewvalue"]["producao_leite"][language],
                  "visible": false, 
                  "opacity": 1,
                  "regionFilter": true,
                  "order": 4,
                  "typeLabel": languageJson["typelabel_layer"]["quantity"][language],
                  "timeLabel": languageJson["typelabel_layer"]["year"][language],
                  "timeSelected": "year=2019",
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
                    {"value": "year=2018", "Viewvalue": 2018},
                    {"value": "year=2019", "Viewvalue": 2019}
                  ],
                  "metadados": {
                    "title": languageJson["metadata"]["producao_leite"]["title"][language],
                    "description": languageJson["metadata"]["producao_leite"]["description"][language],
                    "format": languageJson["metadata"]["producao_leite"]["format"][language],
                    "region": languageJson["metadata"]["producao_leite"]["region"][language],
                    "period": languageJson["metadata"]["producao_leite"]["period"][language],
                    "scale": languageJson["metadata"]["producao_leite"]["scale"][language],
                    "system_coordinator": languageJson["metadata"]["producao_leite"]["system_coordinator"][language],
                    "cartographic_projection": languageJson["metadata"]["producao_leite"]["cartographic_projection"][language],
                    "cod_caracter": languageJson["metadata"]["producao_leite"]["cod_caracter"][language],
                    "fonte": languageJson["metadata"]["producao_leite"]["fonte"][language],
                    "contato":"lapig.cepf@gmail.com"
                  },
                  "columnsCSV": "prod_leite, year"
                }
							]
            },
            {
							"id": "mapa_agricultura_censitaria",
							"label": languageJson["title_layer_label"]["agricultura_censitaria"][language],
							"visible": false,
              "selectedType": 'bi_ce_algodao_area_municipio_250_ibge',
              "downloadSHP": false,
              "downloadCSV": true,
							"types": [
                {
                  "value": "bi_ce_algodao_area_municipio_250_ibge", 
                  "Viewvalue": languageJson["type_layer_viewvalue"]["algodao"][language],
                  "visible": false, 
                  "opacity": 1,
                  "regionFilter": true,
                  "order": 3,
                  "typeLabel": languageJson["typelabel_layer"]["area_planted"][language],
                  "timeLabel": languageJson["typelabel_layer"]["year"][language],
                  "timeSelected": "year=2019",
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
                    {"value": "year=2018", "Viewvalue": 2018},
                    {"value": "year=2019", "Viewvalue": 2019}
                  ],
                  "metadados": {
                    "title": languageJson["metadata"]["area_algodao"]["title"][language],
                    "description": languageJson["metadata"]["area_algodao"]["description"][language],
                    "format": languageJson["metadata"]["area_algodao"]["format"][language],
                    "region": languageJson["metadata"]["area_algodao"]["region"][language],
                    "period": languageJson["metadata"]["area_algodao"]["period"][language],
                    "scale": languageJson["metadata"]["area_algodao"]["scale"][language],
                    "system_coordinator": languageJson["metadata"]["area_algodao"]["system_coordinator"][language],
                    "cartographic_projection": languageJson["metadata"]["area_algodao"]["cartographic_projection"][language],
                    "cod_caracter": languageJson["metadata"]["area_algodao"]["cod_caracter"][language],
                    "fonte": languageJson["metadata"]["area_algodao"]["fonte"][language],
                    "contato":"lapig.cepf@gmail.com"
                  },
                  "columnsCSV": "area_ha, year"
                },
                {
                  "value": "bi_ce_cana_area_municipio_250_ibge", 
                  "Viewvalue": languageJson["type_layer_viewvalue"]["cana"][language],
                  "visible": false, 
                  "opacity": 1,
                  "regionFilter": true,
                  "order": 3,
                  "typeLabel": languageJson["typelabel_layer"]["area_planted"][language],
                  "timeLabel": languageJson["typelabel_layer"]["year"][language],
                  "timeSelected": "year=2019",
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
                    {"value": "year=2018", "Viewvalue": 2018},
                    {"value": "year=2019", "Viewvalue": 2019}
                  ],
                  "metadados": {
                    "title": languageJson["metadata"]["area_cana"]["title"][language],
                    "description": languageJson["metadata"]["area_cana"]["description"][language],
                    "format": languageJson["metadata"]["area_cana"]["format"][language],
                    "region": languageJson["metadata"]["area_cana"]["region"][language],
                    "period": languageJson["metadata"]["area_cana"]["period"][language],
                    "scale": languageJson["metadata"]["area_cana"]["scale"][language],
                    "system_coordinator": languageJson["metadata"]["area_cana"]["system_coordinator"][language],
                    "cartographic_projection": languageJson["metadata"]["area_cana"]["cartographic_projection"][language],
                    "cod_caracter": languageJson["metadata"]["area_cana"]["cod_caracter"][language],
                    "fonte": languageJson["metadata"]["area_cana"]["fonte"][language],
                    "contato":"lapig.cepf@gmail.com"
                  },
                  "columnsCSV": "area_ha, year"
                },
                {
                  "value": "bi_ce_milho_area_municipio_250_ibge",
                  "Viewvalue": languageJson["type_layer_viewvalue"]["milho"][language],
                  "visible": false, 
                  "opacity": 1,
                  "regionFilter": true,
                  "order": 3,
                  "typeLabel": languageJson["typelabel_layer"]["area_planted"][language],
                  "timeLabel": languageJson["typelabel_layer"]["year"][language],
                  "timeSelected": "year=2019",
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
                    {"value": "year=2018", "Viewvalue": 2018},
                    {"value": "year=2019", "Viewvalue": 2019}
                  ],
                  "metadados": {
                    "title": languageJson["metadata"]["area_milho"]["title"][language],
                    "description": languageJson["metadata"]["area_milho"]["description"][language],
                    "format": languageJson["metadata"]["area_milho"]["format"][language],
                    "region": languageJson["metadata"]["area_milho"]["region"][language],
                    "period": languageJson["metadata"]["area_milho"]["period"][language],
                    "scale": languageJson["metadata"]["area_milho"]["scale"][language],
                    "system_coordinator": languageJson["metadata"]["area_milho"]["system_coordinator"][language],
                    "cartographic_projection": languageJson["metadata"]["area_milho"]["cartographic_projection"][language],
                    "cod_caracter": languageJson["metadata"]["area_milho"]["cod_caracter"][language],
                    "fonte": languageJson["metadata"]["area_milho"]["fonte"][language],
                    "contato":"lapig.cepf@gmail.com"
                  },
                  "columnsCSV": "area_ha, year"
                },
                {
                  "value": "bi_ce_soja_area_municipio_250_ibge",
                  "Viewvalue": languageJson["type_layer_viewvalue"]["soja"][language],
                  "visible": false, 
                  "opacity": 1,
                  "regionFilter": true,
                  "order": 3,
                  "typeLabel": languageJson["typelabel_layer"]["area_planted"][language],
                  "timeLabel": languageJson["typelabel_layer"]["year"][language],
                  "timeSelected": "year=2019",
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
                    {"value": "year=2018", "Viewvalue": 2018},
                    {"value": "year=2019", "Viewvalue": 2019}
                  ],
                  "metadados": {
                    "title": languageJson["metadata"]["area_soja"]["title"][language],
                    "description": languageJson["metadata"]["area_soja"]["description"][language],
                    "format": languageJson["metadata"]["area_soja"]["format"][language],
                    "region": languageJson["metadata"]["area_soja"]["region"][language],
                    "period": languageJson["metadata"]["area_soja"]["period"][language],
                    "scale": languageJson["metadata"]["area_soja"]["scale"][language],
                    "system_coordinator": languageJson["metadata"]["area_soja"]["system_coordinator"][language],
                    "cartographic_projection": languageJson["metadata"]["area_soja"]["cartographic_projection"][language],
                    "cod_caracter": languageJson["metadata"]["area_soja"]["cod_caracter"][language],
                    "fonte": languageJson["metadata"]["area_soja"]["fonte"][language],
                    "contato":"lapig.cepf@gmail.com"
                  },
                  "columnsCSV": "area_ha, year"
                },
                {
                  "value": "bi_ce_carvao_vegetal_quantidade_municipio_250_ibge",
                  "Viewvalue": languageJson["type_layer_viewvalue"]["carvao"][language],
                  "visible": false, 
                  "opacity": 1,
                  "regionFilter": true,
                  "order": 3,
                  "typeLabel": languageJson["typelabel_layer"]["production"][language],
                  "timeLabel": languageJson["typelabel_layer"]["year"][language],
                  "timeSelected": "year=2019",
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
                    {"value": "year=2018", "Viewvalue": 2018},
                    {"value": "year=2019", "Viewvalue": 2019}
                  ],
                  "metadados": {
                    "title": languageJson["metadata"]["producao_carvao"]["title"][language],
                    "description": languageJson["metadata"]["producao_carvao"]["description"][language],
                    "format": languageJson["metadata"]["producao_carvao"]["format"][language],
                    "region": languageJson["metadata"]["producao_carvao"]["region"][language],
                    "period": languageJson["metadata"]["producao_carvao"]["period"][language],
                    "scale": languageJson["metadata"]["producao_carvao"]["scale"][language],
                    "system_coordinator": languageJson["metadata"]["producao_carvao"]["system_coordinator"][language],
                    "cartographic_projection": languageJson["metadata"]["producao_carvao"]["cartographic_projection"][language],
                    "cod_caracter": languageJson["metadata"]["producao_carvao"]["cod_caracter"][language],
                    "fonte": languageJson["metadata"]["producao_carvao"]["fonte"][language],
                    "contato":"lapig.cepf@gmail.com"
                  },
                  "columnsCSV": "qto_produz, year"
                },
                {
                  "value": "bi_ce_lenha_quantidade_municipio_250_ibge",
                  "Viewvalue": languageJson["type_layer_viewvalue"]["lenha"][language],
                  "visible": false, 
                  "opacity": 1,
                  "regionFilter": true,
                  "order": 3,
                  "typeLabel": languageJson["typelabel_layer"]["production"][language],
                  "timeLabel": languageJson["typelabel_layer"]["year"][language],
                  "timeSelected": "year=2019",
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
                    {"value": "year=2018", "Viewvalue": 2018},
                    {"value": "year=2018", "Viewvalue": 2019}
                  ],
                  "metadados": {
                    "title": languageJson["metadata"]["producao_lenha"]["title"][language],
                    "description": languageJson["metadata"]["producao_lenha"]["description"][language],
                    "format": languageJson["metadata"]["producao_lenha"]["format"][language],
                    "region": languageJson["metadata"]["producao_lenha"]["region"][language],
                    "period": languageJson["metadata"]["producao_lenha"]["period"][language],
                    "scale": languageJson["metadata"]["producao_lenha"]["scale"][language],
                    "system_coordinator": languageJson["metadata"]["producao_lenha"]["system_coordinator"][language],
                    "cartographic_projection": languageJson["metadata"]["producao_lenha"]["cartographic_projection"][language],
                    "cod_caracter": languageJson["metadata"]["producao_lenha"]["cod_caracter"][language],
                    "fonte": languageJson["metadata"]["producao_lenha"]["fonte"][language],
                    "contato":"lapig.cepf@gmail.com"
                  },
                  "columnsCSV": "qto_produz, year"
                },
                {
                  "value": "bi_ce_madeira_quantidade_municipio_250_ibge",
                  "Viewvalue": languageJson["type_layer_viewvalue"]["madeira"][language],
                  "visible": false, 
                  "opacity": 1,
                  "regionFilter": true,
                  "order": 3,
                  "typeLabel": languageJson["typelabel_layer"]["production"][language],
                  "timeLabel": languageJson["typelabel_layer"]["year"][language],
                  "timeSelected": "year=2019",
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
                    {"value": "year=2018", "Viewvalue": 2018},
                    {"value": "year=2019", "Viewvalue": 2019}
                  ],
                  "metadados": {
                    "title": languageJson["metadata"]["producao_madeira"]["title"][language],
                    "description": languageJson["metadata"]["producao_madeira"]["description"][language],
                    "format": languageJson["metadata"]["producao_madeira"]["format"][language],
                    "region": languageJson["metadata"]["producao_madeira"]["region"][language],
                    "period": languageJson["metadata"]["producao_madeira"]["period"][language],
                    "scale": languageJson["metadata"]["producao_madeira"]["scale"][language],
                    "system_coordinator": languageJson["metadata"]["producao_madeira"]["system_coordinator"][language],
                    "cartographic_projection": languageJson["metadata"]["producao_madeira"]["cartographic_projection"][language],
                    "cod_caracter": languageJson["metadata"]["producao_madeira"]["cod_caracter"][language],
                    "fonte": languageJson["metadata"]["producao_madeira"]["fonte"][language],
                    "contato":"lapig.cepf@gmail.com"
                  },
                  "columnsCSV": "qto_produz, year"
                }
							]
						}
          ],
          "dataService": "/service/charts/farming"
        },
        {
          "id": "desmatamento_queimadas",
          "label": languageJson["title_group_label"]["desmatamentos_queimadas"][language],
          "group_expanded": false,
          "layers":[
            {
							"id": "mapa_desmatamento",
							"label": languageJson["title_layer_label"]["desmatamentos_queimadas"][language],
							"visible": false,
              "selectedType": 'desmatamento_prodes',
              "downloadSHP": false,
              "downloadCSV": true,
							"types": [
								{
                  "value": "desmatamento_prodes", 
                  "Viewvalue": languageJson["type_layer_viewvalue"]["prodes"][language],
                  "visible": false, 
                  "opacity": 1,
                  "regionFilter": true,
                  "order": 1,
                  "typeLabel": languageJson["typelabel_layer"]["fonte"][language],
                  "timeLabel": languageJson["typelabel_layer"]["year"][language],
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
                  ],
                  "metadados": {
                    "title": languageJson["metadata"]["desmatamento_prodes"]["title"][language],
                    "description": languageJson["metadata"]["desmatamento_prodes"]["description"][language],
                    "format": languageJson["metadata"]["desmatamento_prodes"]["format"][language],
                    "region": languageJson["metadata"]["desmatamento_prodes"]["region"][language],
                    "period": languageJson["metadata"]["desmatamento_prodes"]["period"][language],
                    "scale": languageJson["metadata"]["desmatamento_prodes"]["scale"][language],
                    "system_coordinator": languageJson["metadata"]["desmatamento_prodes"]["system_coordinator"][language],
                    "cartographic_projection": languageJson["metadata"]["desmatamento_prodes"]["cartographic_projection"][language],
                    "cod_caracter": languageJson["metadata"]["desmatamento_prodes"]["cod_caracter"][language],
                    "fonte": languageJson["metadata"]["desmatamento_prodes"]["fonte"][language],
                    "contato":"lapig.cepf@gmail.com"
                  },
                  "columnsCSV": "area_km2, view_date, year"
                 },
                 {
                  "value": "desmatamento_siad", 
                  "Viewvalue": languageJson["type_layer_viewvalue"]["siad"][language],
                  "visible": false, 
                  "opacity": 1,
                  "regionFilter": true,
                  "order": 2,
                  "typeLabel": languageJson["typelabel_layer"]["fonte"][language],
                  "timeLabel": languageJson["typelabel_layer"]["year"][language],
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
                  ],
                  "metadados": {
                    "title": languageJson["metadata"]["desmatamento_siad"]["title"][language],
                    "description": languageJson["metadata"]["desmatamento_siad"]["description"][language],
                    "format": languageJson["metadata"]["desmatamento_siad"]["format"][language],
                    "region": languageJson["metadata"]["desmatamento_siad"]["region"][language],
                    "period": languageJson["metadata"]["desmatamento_siad"]["period"][language],
                    "scale": languageJson["metadata"]["desmatamento_siad"]["scale"][language],
                    "system_coordinator": languageJson["metadata"]["desmatamento_siad"]["system_coordinator"][language],
                    "cartographic_projection": languageJson["metadata"]["desmatamento_siad"]["cartographic_projection"][language],
                    "cod_caracter": languageJson["metadata"]["desmatamento_siad"]["cod_caracter"][language],
                    "fonte": languageJson["metadata"]["desmatamento_siad"]["fonte"][language],
                    "contato":"lapig.cepf@gmail.com"
                  },
                  "columnsCSV": "area_km2, year"
                 },
                 {
                  "value": "desmatamento_glad", 
                  "Viewvalue": languageJson["type_layer_viewvalue"]["glad"][language],
                  "visible": false, 
                  "opacity": 1,
                  "regionFilter": true,
                  "order": 3,
                  "typeLabel": languageJson["typelabel_layer"]["fonte"][language],
                  "timeLabel": languageJson["typelabel_layer"]["year"][language],
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
                  ],
                  "metadados": {
                    "title": languageJson["metadata"]["desmatamento_glad"]["title"][language],
                    "description": languageJson["metadata"]["desmatamento_glad"]["description"][language],
                    "format": languageJson["metadata"]["desmatamento_glad"]["format"][language],
                    "region": languageJson["metadata"]["desmatamento_glad"]["region"][language],
                    "period": languageJson["metadata"]["desmatamento_glad"]["period"][language],
                    "scale": languageJson["metadata"]["desmatamento_glad"]["scale"][language],
                    "system_coordinator": languageJson["metadata"]["desmatamento_glad"]["system_coordinator"][language],
                    "cartographic_projection": languageJson["metadata"]["desmatamento_glad"]["cartographic_projection"][language],
                    "cod_caracter": languageJson["metadata"]["desmatamento_glad"]["cod_caracter"][language],
                    "fonte": languageJson["metadata"]["desmatamento_glad"]["fonte"][language],
                    "contato":"lapig.cepf@gmail.com"
                  },
                  "columnsCSV": "area_km2, year"
                 }
							]
            },
            {
							"id": "mapa_alertas_desmatamento",
							"label": languageJson["title_layer_label"]["alertas_desmatamentos"][language],
							"visible": false,
              "selectedType": 'alertas_desmatamento_deter',
              "downloadSHP": false,
              "downloadCSV": true, 
							"types": [
								{
                  "value": "alertas_desmatamento_deter", 
                  "Viewvalue": languageJson["type_layer_viewvalue"]["deter"][language],
                  "visible": false, 
                  "opacity": 1,
                  "regionFilter": true,
                  "order": 1,
                  "typeLabel": languageJson["typelabel_layer"]["fonte"][language],
                  "metadados": {
                    "title": languageJson["metadata"]["desmatamento_deter"]["title"][language],
                    "description": languageJson["metadata"]["desmatamento_deter"]["description"][language],
                    "format": languageJson["metadata"]["desmatamento_deter"]["format"][language],
                    "region": languageJson["metadata"]["desmatamento_deter"]["region"][language],
                    "period": languageJson["metadata"]["desmatamento_deter"]["period"][language],
                    "scale": languageJson["metadata"]["desmatamento_deter"]["scale"][language],
                    "system_coordinator": languageJson["metadata"]["desmatamento_deter"]["system_coordinator"][language],
                    "cartographic_projection": languageJson["metadata"]["desmatamento_deter"]["cartographic_projection"][language],
                    "cod_caracter": languageJson["metadata"]["desmatamento_deter"]["cod_caracter"][language],
                    "fonte": languageJson["metadata"]["desmatamento_deter"]["fonte"][language],
                    "contato":"lapig.cepf@gmail.com"
                  },
                  "columnsCSV": "area_km2, view_date, created_da, year"
                }
							]
            },
            {
							"id": "mapa_queimadas",
							"label": languageJson["title_layer_label"]["areas_queimadas"][language],
							"visible": false,
              "selectedType": 'queimadas_lapig',
              "downloadSHP": false,
              "downloadCSV": true,
							"types": [
                 {
                  "value": "queimadas_lapig", 
                  "Viewvalue": languageJson["type_layer_viewvalue"]["lapig"][language],
                  "visible": false, 
                  "opacity": 1,
                  "regionFilter": true,
                  "order": 5,
                  "typeLabel": languageJson["typelabel_layer"]["fonte"][language],
                  "timeLabel": languageJson["typelabel_layer"]["year"][language],
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
                  ],
                  "metadados": {
                    "title": languageJson["metadata"]["queimadas_lapig"]["title"][language],
                    "description": languageJson["metadata"]["queimadas_lapig"]["description"][language],
                    "format": languageJson["metadata"]["queimadas_lapig"]["format"][language],
                    "region": languageJson["metadata"]["queimadas_lapig"]["region"][language],
                    "period": languageJson["metadata"]["queimadas_lapig"]["period"][language],
                    "scale": languageJson["metadata"]["queimadas_lapig"]["scale"][language],
                    "system_coordinator": languageJson["metadata"]["queimadas_lapig"]["system_coordinator"][language],
                    "cartographic_projection": languageJson["metadata"]["queimadas_lapig"]["cartographic_projection"][language],
                    "cod_caracter": languageJson["metadata"]["queimadas_lapig"]["cod_caracter"][language],
                    "fonte": languageJson["metadata"]["queimadas_lapig"]["fonte"][language],
                    "contato":"lapig.cepf@gmail.com"
                  },
                  "columnsCSV": "area_km2, burndate, year"
                 }
							]
            }
          ]
        },
        {
          "id": "pontos_validacao",
          "label": languageJson["title_group_label"]["pontos_validacao"][language],
          "group_expanded": false,
          "layers":[
            {
							"id": "pontos_coletados_campo",
							"label": languageJson["title_layer_label"]["pontos_campo"][language],
							"visible": false,
              "selectedType": 'pontos_campo_sem_parada',
              "downloadSHP": true,
              "downloadCSV": true, 
							"types": [
								{
                  "value": "pontos_campo_parada", 
                  "Viewvalue": languageJson["type_layer_viewvalue"]["parada"][language],
                  "visible": false, 
                  "opacity": 1,
                  "regionFilter": true,
                  "order": 1,
                  "typeLabel": languageJson["typelabel_layer"]["type"][language],
                  "metadados": {
                    "title": languageJson["metadata"]["pontos_campo_parada"]["title"][language],
                    "description": languageJson["metadata"]["pontos_campo_parada"]["description"][language],
                    "format": languageJson["metadata"]["pontos_campo_parada"]["format"][language],
                    "region": languageJson["metadata"]["pontos_campo_parada"]["region"][language],
                    "period": languageJson["metadata"]["pontos_campo_parada"]["period"][language],
                    "scale": languageJson["metadata"]["pontos_campo_parada"]["scale"][language],
                    "system_coordinator": languageJson["metadata"]["pontos_campo_parada"]["system_coordinator"][language],
                    "cartographic_projection": languageJson["metadata"]["pontos_campo_parada"]["cartographic_projection"][language],
                    "cod_caracter": languageJson["metadata"]["pontos_campo_parada"]["cod_caracter"][language],
                    "fonte": languageJson["metadata"]["pontos_campo_parada"]["fonte"][language],
                    "contato":"lapig.cepf@gmail.com"
                  },
                  "columnsCSV": "cobertura, data, periodo, horario, latitude, longitude, altura, homoge, invasoras, gado, qtd_cupins, forrageira, cultivo, solo_exp, obs, condicao"
                  /* "timeLabel": languageJson["typelabel_layer"]["year"][language],
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
                  "Viewvalue": languageJson["type_layer_viewvalue"]["sem_parada"][language],
                  "visible": false, 
                  "opacity": 1,
                  "regionFilter": true,
                  "order": 2,
                  "typeLabel": languageJson["typelabel_layer"]["type"][language],
                  "metadados": {
                   "title": languageJson["metadata"]["pontos_campo_sem_parada"]["title"][language],
                     "description": languageJson["metadata"]["pontos_campo_sem_parada"]["description"][language],
                     "format": languageJson["metadata"]["pontos_campo_sem_parada"]["format"][language],
                     "region": languageJson["metadata"]["pontos_campo_sem_parada"]["region"][language],
                     "period": languageJson["metadata"]["pontos_campo_sem_parada"]["period"][language],
                     "scale": languageJson["metadata"]["pontos_campo_sem_parada"]["scale"][language],
                     "system_coordinator": languageJson["metadata"]["pontos_campo_sem_parada"]["system_coordinator"][language],
                     "cartographic_projection": languageJson["metadata"]["pontos_campo_sem_parada"]["cartographic_projection"][language],
                     "cod_caracter": languageJson["metadata"]["pontos_campo_sem_parada"]["cod_caracter"][language],
                     "fonte": languageJson["metadata"]["pontos_campo_sem_parada"]["fonte"][language],
                    "contato":"lapig.cepf@gmail.com"
                  },
                  "columnsCSV": "cobertura, data, periodo, horario, latitude, longitude, altura, homoge, invasoras, gado, qtd_cupins, forrageira, cultivo, solo_exp, obs, condicao"
                  /* "timeLabel": languageJson["typelabel_layer"]["year"][language],
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
							"label": languageJson["title_layer_label"]["pontos_inspecionados"][language],
							"visible": false,
              "selectedType": 'pontos_tvi_treinamento',
              "downloadSHP": true,
              "downloadCSV": true,
							"types": [
								{
                  "value": "pontos_tvi_treinamento", 
                  "Viewvalue": languageJson["type_layer_viewvalue"]["treinamento"][language],
                  "visible": false, 
                  "opacity": 1,
                  "regionFilter": true,
                  "order": 1,
                  "typeLabel": languageJson["typelabel_layer"]["type"][language],
                  "metadados": {
                    "title": languageJson["metadata"]["pontos_inspecionados_treinamento"]["title"][language],
                    "description": languageJson["metadata"]["pontos_inspecionados_treinamento"]["description"][language],
                    "format": languageJson["metadata"]["pontos_inspecionados_treinamento"]["format"][language],
                    "region": languageJson["metadata"]["pontos_inspecionados_treinamento"]["region"][language],
                    "period": languageJson["metadata"]["pontos_inspecionados_treinamento"]["period"][language],
                    "scale": languageJson["metadata"]["pontos_inspecionados_treinamento"]["scale"][language],
                    "system_coordinator": languageJson["metadata"]["pontos_inspecionados_treinamento"]["system_coordinator"][language],
                    "cartographic_projection": languageJson["metadata"]["pontos_inspecionados_treinamento"]["cartographic_projection"][language],
                    "cod_caracter": languageJson["metadata"]["pontos_inspecionados_treinamento"]["cod_caracter"][language],
                    "fonte": languageJson["metadata"]["pontos_inspecionados_treinamento"]["fonte"][language],
                    "contato":"lapig.cepf@gmail.com"
                  },
                  "columnsCSV": "index, lon, lat, cons_1985, cons_1986, cons_1987, cons_1988, cons_1989, cons_1990, cons_1991, cons_1992, cons_1993, cons_1994, cons_1995, cons_1996, cons_1997, cons_1998, cons_1999, cons_2000, cons_2001, cons_2002, cons_2003, cons_2004, cons_2005, cons_2006, cons_2007, cons_2008, cons_2009, cons_2010, cons_2011, cons_2012, cons_2013, cons_2014, cons_2015, cons_2016, cons_2017, pointedite"
                },
                {
                  "value": "pontos_tvi_validacao", 
                  "Viewvalue": languageJson["type_layer_viewvalue"]["validacao"][language],
                  "visible": false, 
                  "opacity": 1,
                  "regionFilter": true,
                  "order": 1,
                  "typeLabel": languageJson["typelabel_layer"]["type"][language],
                  "metadados": {
                    "title": languageJson["metadata"]["pontos_inspecionados_validacao"]["title"][language],
                    "description": languageJson["metadata"]["pontos_inspecionados_validacao"]["description"][language],
                    "format": languageJson["metadata"]["pontos_inspecionados_validacao"]["format"][language],
                    "region": languageJson["metadata"]["pontos_inspecionados_validacao"]["region"][language],
                    "period": languageJson["metadata"]["pontos_inspecionados_validacao"]["period"][language],
                    "scale": languageJson["metadata"]["pontos_inspecionados_validacao"]["scale"][language],
                    "system_coordinator": languageJson["metadata"]["pontos_inspecionados_validacao"]["system_coordinator"][language],
                    "cartographic_projection": languageJson["metadata"]["pontos_inspecionados_validacao"]["cartographic_projection"][language],
                    "cod_caracter": languageJson["metadata"]["pontos_inspecionados_validacao"]["cod_caracter"][language],
                    "fonte": languageJson["metadata"]["pontos_inspecionados_validacao"]["fonte"][language],
                    "contato":"lapig.cepf@gmail.com"
                  },
                  "columnsCSV": "index, lon, lat, cons_1985, cons_1986, cons_1987, cons_1988, cons_1989, cons_1990, cons_1991, cons_1992, cons_1993, cons_1994, cons_1995, cons_1996, cons_1997, cons_1998, cons_1999, cons_2000, cons_2001, cons_2002, cons_2003, cons_2004, cons_2005, cons_2006, cons_2007, cons_2008, cons_2009, cons_2010, cons_2011, cons_2012, cons_2013, cons_2014, cons_2015, cons_2016, cons_2017, pointedite"
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
              "viewValue": languageJson["basemap"]["geopolitico"][language],
              "visible": true
            },
            {
              "value":"satelite",
              "viewValue": languageJson["basemap"]["satelite"][language],
              "visible": false
            },
            {
              "value":"estradas",
              "viewValue": languageJson["basemap"]["estradas"][language],
              "visible": false
            },
            {
              "value":"relevo",
              "viewValue": languageJson["basemap"]["relevo"][language],
              "visible": false
            },
            {
              "value":"landsat",
              "viewValue": languageJson["basemap"]["landsat"][language],
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
              "Viewvalue": languageJson["limits"]["bioma"][language],
              "visible": true, 
              "layer_limits": true,
              "opacity": 1
            },
            {
              "value": "bi_ce_estados_250_2013_ibge",
              "Viewvalue": languageJson["limits"]["estados"][language],
              "visible": false, 
              "layer_limits": true,
              "opacity": 1
            },
						{
              "value": "bi_ce_municipios_250_2019_ibge",
              "Viewvalue": languageJson["limits"]["municipios"][language],
              "visible": false, 
              "layer_limits": true,
              "opacity": 1
            },
            {
              "value": "limites_areas_chave_biodiversidade",
              "Viewvalue": languageJson["limits"]["chaves_kba"][language],
              "visible": false,
              "layer_limits": true,
              "opacity": 1
            },
            {
              "value": "limites_assentamentos",
              "Viewvalue": languageJson["limits"]["assentamentos"][language],
              "visible": false,
              "layer_limits": true,
              "opacity": 1
            },
            {
              "value": "limites_cartas_ibge",
              "Viewvalue": languageJson["limits"]["cartas_ibge"][language],
              "visible": false,
              "layer_limits": true,
              "opacity": 1
            },
            {
              "value": "limites_corredores_prioritarios_cepf",
              "Viewvalue": languageJson["limits"]["corredores_cepf"][language],
              "visible": false,
              "layer_limits": true,
              "opacity": 1
            },
            {
              "value": "limites_regioes_hidrograficas",
              "Viewvalue": languageJson["limits"]["regioes_hidrograficas"][language],
              "visible": false,
              "layer_limits": true,
              "opacity": 1
            },
            {
              "value": "limites_terras_indigenas",
              "Viewvalue": languageJson["limits"]["terras_indigenas"][language],
              "visible": false,
              "layer_limits": true,
              "opacity": 1
            },
            {
              "value": "geo_car_imovel",
              "Viewvalue": languageJson["limits"]["terras_privadas"][language],
              "visible": false,
              "layer_limits": true,
              "opacity": 1
            },
            {
              "value": "limites_unidades_protecao_integral",
              "Viewvalue": languageJson["limits"]["conservacao_integral"][language],
              "visible": false,
              "layer_limits": true,
              "opacity": 1
            },
            {
              "value": "limites_unidades_planejamento_hidrico",
              "Viewvalue": languageJson["limits"]["planejamento_hidrico"][language],
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

  Controller.downloadCSV = function(request, response) {
    var file = request.param('layer', '') +'_'+request.param('regionName', '')+'_'+request.param('year', '')+'.csv';
    var queryResult = request.queryResult
    var result = []

    queryResult.forEach(function (row) {
      if (row) {
				result.push(row);
			}
    })

    var csv = json2csv(result);

    fs.writeFile(file, csv, function(err) {
      response.setHeader('Content-disposition', 'attachment; filename='+file);
      response.set('Content-Type', 'text/csv');
      response.send(csv);
      response.end();
    });
	}
  
  Controller.downloadSHP = function (request, response) {
    
    var pathFile;
		var layer = request.param('layer', '');
		var regionType = request.param('regionType', '');
		var region = request.param('region', '');
    var year = request.param('year', '');
		var fileParam = layer;

    if(year != '') {
      fileParam = layer+'_'+year;
    }
		
		var diretorio = config.downloadDir+layer+'/'+regionType+'/'+region+'/';
    var	pathFile = diretorio+fileParam;
    
    if(fileParam.indexOf("../") == 0){
			res.send('Arquivo inválido!')
			res.end();
		} else if(fs.existsSync(pathFile+'.shp')) {
			var nameFile = regionType+'_'+region+'_'+fileParam
			response.setHeader('Content-disposition', 'attachment; filename='+nameFile+'.zip');
			response.setHeader('Content-type', 'application/zip')

			var zipFile = archiver('zip');
			zipFile.pipe(response);

			fs.readdir(diretorio, (err, files) => {
			  files.forEach(fileresult => {

			  	if(fileresult.indexOf(fileParam) == 0){
			  		var pathFile = diretorio+fileresult;
						zipFile.file(pathFile, {name:fileresult});
			  	}

			  });

				zipFile.finalize();
			})

		}else {
			response.send("Arquivo indisponível");
  		response.end();
		}
  }

	return Controller;

}
