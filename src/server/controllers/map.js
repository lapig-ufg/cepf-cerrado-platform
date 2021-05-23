var fs = require('fs')
    , archiver = require('archiver')
    , json2csv = require('json2csv').parse
    , languageJson = require('../assets/lang/language.json')
    , request = require('request')
    , Ows = require('../utils/ows');

module.exports = function(app) {
  var Controller = {}
  var config = app.config;

  var self = {};

  if (!fs.existsSync(config.downloadDataDir)) {
    fs.mkdirSync(config.downloadDataDir);
  }

  self.requestFileFromMapServ = async function (url, pathFile, response) {
    let file = fs.createWriteStream(pathFile + ".zip");

    await new Promise((resolve, reject) => {
        let stream = request({
            uri: url,
            gzip: true
          })
          .pipe(file)
          .on('finish', () => {
            response.download(pathFile + '.zip');
            resolve();
          })
          .on('error', (error) => {
            response.send(error)
            response.end();
            reject(error);
          })
      })
      .catch(error => {
        console.log(`Something happened: ${error}`);
      });
  };

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
              "downloadSHP": true,
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
							"label": languageJson["title_layer_label"]["ecorregioes"][language],
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
                "title": languageJson["metadata"]["bi_ce_ecorregioes_2019_5000_diversas"]["title"][language],
                "description": languageJson["metadata"]["bi_ce_ecorregioes_2019_5000_diversas"]["description"][language],
                "format": languageJson["metadata"]["bi_ce_ecorregioes_2019_5000_diversas"]["format"][language],
                "region": languageJson["metadata"]["bi_ce_ecorregioes_2019_5000_diversas"]["region"][language],
                "period": languageJson["metadata"]["bi_ce_ecorregioes_2019_5000_diversas"]["period"][language],
                "scale": languageJson["metadata"]["bi_ce_ecorregioes_2019_5000_diversas"]["scale"][language],
                "system_coordinator": languageJson["metadata"]["bi_ce_ecorregioes_2019_5000_diversas"]["system_coordinator"][language],
                "cartographic_projection": languageJson["metadata"]["bi_ce_ecorregioes_2019_5000_diversas"]["cartographic_projection"][language],
                "cod_caracter": languageJson["metadata"]["bi_ce_ecorregioes_2019_5000_diversas"]["cod_caracter"][language],
                "fonte": languageJson["metadata"]["bi_ce_ecorregioes_2019_5000_diversas"]["fonte"][language],
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
              "downloadSHP": true,
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
              "downloadSHP": true,
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
          "id": "areas_especiais",
          "label": languageJson["title_group_label"]["areas_especiais"][language],
          "group_expanded": false,
          "layers": [
            {
              "id": "assentamentos",
              "label": languageJson["title_layer_label"]["assentamentos"][language],
              "visible": false,
              "selectedType": 'assentamentos',
              "value": "assentamentos",
              "opacity": 1,
              "regionFilter": true,
              "order": 2,
              "timeHandler": "msfilter",
              "metadados": {
                "title": languageJson["metadata"]["assentamentos"]["title"][language],
                "description": languageJson["metadata"]["assentamentos"]["description"][language],
                "format": languageJson["metadata"]["assentamentos"]["format"][language],
                "region": languageJson["metadata"]["assentamentos"]["region"][language],
                "period": languageJson["metadata"]["assentamentos"]["period"][language],
                "scale": languageJson["metadata"]["assentamentos"]["scale"][language],
                "system_coordinator": languageJson["metadata"]["assentamentos"]["system_coordinator"][language],
                "cartographic_projection": languageJson["metadata"]["assentamentos"]["cartographic_projection"][language],
                "cod_caracter": languageJson["metadata"]["assentamentos"]["cod_caracter"][language],
                "fonte": languageJson["metadata"]["assentamentos"]["fonte"][language],
                "contato": "lapig.cepf@gmail.com"
              },
              "columnsCSV": "",
              "downloadSHP": true,
              "downloadCSV": true
            },
            {
              "id": "limites_terras_indigenas",
              "label": languageJson["title_layer_label"]["terras_indigenas"][language],
              "visible": false,
              "selectedType": 'limites_terras_indigenas',
              "value": "limites_terras_indigenas",
              "opacity": 1,
              "regionFilter": true,
              "order": 2,
              "timeHandler": "msfilter",
              "metadados": {
                "title": languageJson["metadata"]["terras_indigenas"]["title"][language],
                "description": languageJson["metadata"]["terras_indigenas"]["description"][language],
                "format": languageJson["metadata"]["terras_indigenas"]["format"][language],
                "region": languageJson["metadata"]["terras_indigenas"]["region"][language],
                "period": languageJson["metadata"]["terras_indigenas"]["period"][language],
                "scale": languageJson["metadata"]["terras_indigenas"]["scale"][language],
                "system_coordinator": languageJson["metadata"]["terras_indigenas"]["system_coordinator"][language],
                "cartographic_projection": languageJson["metadata"]["terras_indigenas"]["cartographic_projection"][language],
                "cod_caracter": languageJson["metadata"]["terras_indigenas"]["cod_caracter"][language],
                "fonte": languageJson["metadata"]["terras_indigenas"]["fonte"][language],
                "contato": "lapig.cepf@gmail.com"
              },
              "columnsCSV": "",
              "downloadSHP": true,
              "downloadCSV": true
            },
            {
              "id": "geo_car_imovel",
              "label": languageJson["title_layer_label"]["terras_privadas"][language],
              "visible": false,
              "selectedType": 'geo_car_imovel',
              "value": "geo_car_imovel",
              "opacity": 1,
              "regionFilter": true,
              "order": 2,
              "timeHandler": "msfilter",
              "metadados": {
                "title": languageJson["metadata"]["terras_privadas"]["title"][language],
                "description": languageJson["metadata"]["terras_privadas"]["description"][language],
                "format": languageJson["metadata"]["terras_privadas"]["format"][language],
                "region": languageJson["metadata"]["terras_privadas"]["region"][language],
                "period": languageJson["metadata"]["terras_privadas"]["period"][language],
                "scale": languageJson["metadata"]["terras_privadas"]["scale"][language],
                "system_coordinator": languageJson["metadata"]["terras_privadas"]["system_coordinator"][language],
                "cartographic_projection": languageJson["metadata"]["terras_privadas"]["cartographic_projection"][language],
                "cod_caracter": languageJson["metadata"]["terras_privadas"]["cod_caracter"][language],
                "fonte": languageJson["metadata"]["terras_privadas"]["fonte"][language],
                "contato": "lapig.cepf@gmail.com"
              },
              "columnsCSV": "",
              "downloadSHP": false,
              "downloadCSV": false
            },
            {
              "id": "unidades_planejamento_hidrico",
              "label": languageJson["title_layer_label"]["unidades_planejamento_hidrico"][language],
              "visible": false,
              "selectedType": 'unidades_planejamento_hidrico',
              "value": "unidades_planejamento_hidrico",
              "opacity": 1,
              "regionFilter": true,
              "order": 2,
              "timeHandler": "msfilter",
              "metadados": {
                "title": languageJson["metadata"]["unidades_planejamento_hidrico"]["title"][language],
                "description": languageJson["metadata"]["unidades_planejamento_hidrico"]["description"][language],
                "format": languageJson["metadata"]["unidades_planejamento_hidrico"]["format"][language],
                "region": languageJson["metadata"]["unidades_planejamento_hidrico"]["region"][language],
                "period": languageJson["metadata"]["unidades_planejamento_hidrico"]["period"][language],
                "scale": languageJson["metadata"]["unidades_planejamento_hidrico"]["scale"][language],
                "system_coordinator": languageJson["metadata"]["unidades_planejamento_hidrico"]["system_coordinator"][language],
                "cartographic_projection": languageJson["metadata"]["unidades_planejamento_hidrico"]["cartographic_projection"][language],
                "cod_caracter": languageJson["metadata"]["unidades_planejamento_hidrico"]["cod_caracter"][language],
                "fonte": languageJson["metadata"]["unidades_planejamento_hidrico"]["fonte"][language],
                "contato": "lapig.cepf@gmail.com"
              },
              "columnsCSV": "",
              "downloadSHP": true,
              "downloadCSV": true
            }
          ]
        },
        {
          "id": "biodiversidade",
          "label": languageJson["title_group_label"]["biodiversidade"][language],
          "group_expanded": false,
          "layers": [
            {
              "id": "bi_ce_fauna_na_na_sibbr",
              "label": languageJson["title_layer_label"]["fauna"][language],
              "visible": false,
              "selectedType": 'bi_ce_fauna_na_na_sibbr',
              "value": "bi_ce_fauna_na_na_sibbr",
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
                "title": languageJson["metadata"]["bi_ce_fauna_na_na_sibbr"]["title"][language],
                "description": languageJson["metadata"]["bi_ce_fauna_na_na_sibbr"]["description"][language],
                "format": languageJson["metadata"]["bi_ce_fauna_na_na_sibbr"]["format"][language],
                "region": languageJson["metadata"]["bi_ce_fauna_na_na_sibbr"]["region"][language],
                "period": languageJson["metadata"]["bi_ce_fauna_na_na_sibbr"]["period"][language],
                "scale": languageJson["metadata"]["bi_ce_fauna_na_na_sibbr"]["scale"][language],
                "system_coordinator": languageJson["metadata"]["bi_ce_fauna_na_na_sibbr"]["system_coordinator"][language],
                "cartographic_projection": languageJson["metadata"]["bi_ce_fauna_na_na_sibbr"]["cartographic_projection"][language],
                "cod_caracter": languageJson["metadata"]["bi_ce_fauna_na_na_sibbr"]["cod_caracter"][language],
                "fonte": languageJson["metadata"]["bi_ce_fauna_na_na_sibbr"]["fonte"][language],
                "contato": "lapig.cepf@gmail.com"
              },
              "columnsCSV": "scientific, reino, filo, classe, ordem, familia, genero, especies, year",
              "downloadSHP": true,
              "downloadCSV": true
            },
            {
              "id": "bi_ce_flora_na_na_sibbr",
              "label": languageJson["title_layer_label"]["flora"][language],
              "visible": false,
              "selectedType": 'bi_ce_flora_na_na_sibbr',
              "value": "bi_ce_flora_na_na_sibbr",
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
                "title": languageJson["metadata"]["bi_ce_flora_na_na_sibbr"]["title"][language],
                "description": languageJson["metadata"]["bi_ce_flora_na_na_sibbr"]["description"][language],
                "format": languageJson["metadata"]["bi_ce_flora_na_na_sibbr"]["format"][language],
                "region": languageJson["metadata"]["bi_ce_flora_na_na_sibbr"]["region"][language],
                "period": languageJson["metadata"]["bi_ce_flora_na_na_sibbr"]["period"][language],
                "scale": languageJson["metadata"]["bi_ce_flora_na_na_sibbr"]["scale"][language],
                "system_coordinator": languageJson["metadata"]["bi_ce_flora_na_na_sibbr"]["system_coordinator"][language],
                "cartographic_projection": languageJson["metadata"]["bi_ce_flora_na_na_sibbr"]["cartographic_projection"][language],
                "cod_caracter": languageJson["metadata"]["bi_ce_flora_na_na_sibbr"]["cod_caracter"][language],
                "fonte": languageJson["metadata"]["bi_ce_flora_na_na_sibbr"]["fonte"][language],
                "contato": "lapig.cepf@gmail.com"
              },
              "columnsCSV": "n_cientifi, reino, filo, classe, ordem, familia, genero, especie, year",
              "downloadSHP": true,
              "downloadCSV": true
            },
            {
              "id": "bi_ce_reserva_biosfera_2018_1000_greentec",
              "label": languageJson["title_layer_label"]["reserva_biosfera"][language],
              "visible": false,
              "selectedType": 'bi_ce_reserva_biosfera_2018_1000_greentec',
              "value": "bi_ce_reserva_biosfera_2018_1000_greentec",
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
                "title": languageJson["metadata"]["bi_ce_reserva_biosfera_2018_1000_greentec"]["title"][language],
                "description": languageJson["metadata"]["bi_ce_reserva_biosfera_2018_1000_greentec"]["description"][language],
                "format": languageJson["metadata"]["bi_ce_reserva_biosfera_2018_1000_greentec"]["format"][language],
                "region": languageJson["metadata"]["bi_ce_reserva_biosfera_2018_1000_greentec"]["region"][language],
                "period": languageJson["metadata"]["bi_ce_reserva_biosfera_2018_1000_greentec"]["period"][language],
                "scale": languageJson["metadata"]["bi_ce_reserva_biosfera_2018_1000_greentec"]["scale"][language],
                "system_coordinator": languageJson["metadata"]["bi_ce_reserva_biosfera_2018_1000_greentec"]["system_coordinator"][language],
                "cartographic_projection": languageJson["metadata"]["bi_ce_reserva_biosfera_2018_1000_greentec"]["cartographic_projection"][language],
                "cod_caracter": languageJson["metadata"]["bi_ce_reserva_biosfera_2018_1000_greentec"]["cod_caracter"][language],
                "fonte": languageJson["metadata"]["bi_ce_reserva_biosfera_2018_1000_greentec"]["fonte"][language],
                "contato": "lapig.cepf@gmail.com"
              },
              "columnsCSV": "area_ha, area_km2, nome_uc, categoria, ano_cria, grupo, ato_legal, status, esfera, classe",
              "downloadSHP": true,
              "downloadCSV": true
            },
            {
              "id": "or_vp_pato_mergulhao_2019_na_iat",
              "label": languageJson["title_layer_label"]["pato_mergulhao"][language],
              "visible": false,
              "selectedType": 'or_vp_pato_mergulhao_2019_na_iat',
              "value": "or_vp_pato_mergulhao_2019_na_iat",
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
                "title": languageJson["metadata"]["or_vp_pato_mergulhao_2019_na_iat"]["title"][language],
                "description": languageJson["metadata"]["or_vp_pato_mergulhao_2019_na_iat"]["description"][language],
                "format": languageJson["metadata"]["or_vp_pato_mergulhao_2019_na_iat"]["format"][language],
                "region": languageJson["metadata"]["or_vp_pato_mergulhao_2019_na_iat"]["region"][language],
                "period": languageJson["metadata"]["or_vp_pato_mergulhao_2019_na_iat"]["period"][language],
                "scale": languageJson["metadata"]["or_vp_pato_mergulhao_2019_na_iat"]["scale"][language],
                "system_coordinator": languageJson["metadata"]["or_vp_pato_mergulhao_2019_na_iat"]["system_coordinator"][language],
                "cartographic_projection": languageJson["metadata"]["or_vp_pato_mergulhao_2019_na_iat"]["cartographic_projection"][language],
                "cod_caracter": languageJson["metadata"]["or_vp_pato_mergulhao_2019_na_iat"]["cod_caracter"][language],
                "fonte": languageJson["metadata"]["or_vp_pato_mergulhao_2019_na_iat"]["fonte"][language],
              },
              "columnsCSV": "ano, mês, rio, local, adultos, filhotes, ppch, agro, boi, desmata, dtur, fogo, altitude, risco1, risco2, risco3, risco4, impactos_o",
              "downloadSHP": true,
              "downloadCSV": true
            },
            {
              "id": "areas_chave_biodiversidade",
              "label": languageJson["title_layer_label"]["chaves_kba"][language],
              "visible": false,
              "selectedType": 'areas_chave_biodiversidade',
              "value": "areas_chave_biodiversidade",
              "opacity": 1,
              "regionFilter": true,
              "order": 2,
              "timeHandler": "msfilter",
              "metadados": {
                "title": languageJson["metadata"]["areas_chave_biodiversidade"]["title"][language],
                "description": languageJson["metadata"]["areas_chave_biodiversidade"]["description"][language],
                "format": languageJson["metadata"]["areas_chave_biodiversidade"]["format"][language],
                "region": languageJson["metadata"]["areas_chave_biodiversidade"]["region"][language],
                "period": languageJson["metadata"]["areas_chave_biodiversidade"]["period"][language],
                "scale": languageJson["metadata"]["areas_chave_biodiversidade"]["scale"][language],
                "system_coordinator": languageJson["metadata"]["areas_chave_biodiversidade"]["system_coordinator"][language],
                "cartographic_projection": languageJson["metadata"]["areas_chave_biodiversidade"]["cartographic_projection"][language],
                "cod_caracter": languageJson["metadata"]["areas_chave_biodiversidade"]["cod_caracter"][language],
                "fonte": languageJson["metadata"]["areas_chave_biodiversidade"]["fonte"][language],
              },
              "columnsCSV": "otto, cod, p_p_ra, p_pe_ra, fa_vu, fa_en, fa_cr, fa_i_vu, fa_i_en, fa_i_cr, flo_vu, flo_en, flo_cr, irre_tt, flo_i_vu, flo_i_en, flo_i_cr, pc_p_ra, pc_pe_ra, pc_fa_vu, pc_fa_cr, pc_fa_en, g_fa_mma, pc_g_fa_mm, pc_i_fa_vu, pc_i_fa_cr, pc_i_fa_en, g_fa_iucn, pc_g_fa_iu, g_fa_mm_iu, pc_g_mm_iu, pc_fl_vu, pc_fl_en, pc_fl_cr, g_fl_cnc, pc_g_fl_cn, pc_i_fl_vu, pc_i_fl_en, pc_i_fl_cr, g_fl_iucn, pc_g_fl_iu, g_fl_cn_iu, pc_g_cn_iu, pc_irre, biologico, p_biologic, fid_1, otto_1, cod_1, shape_le_2, shape_ar_1, a_kba_ha, reman, ipa, csc, agua, pc_reman, pc_ipa, pc_csc, pc_agua, g_pro_pri, pc_pro_pri, paisagem, p_paisagem, g_bio_pais, fim_bio_pa, class, area, shape_leng, kba, uf, nome, codigo, shape_le_1, shape_area",
              "downloadSHP": true,
              "downloadCSV": true
            },
            {
              "id": "bi_ce_iba_250_2009_savebrasil",
              "label": languageJson["title_layer_label"]["ibas"][language],
              "visible": false,
              "selectedType": 'bi_ce_iba_250_2009_savebrasil',
              "value": "bi_ce_iba_250_2009_savebrasil",
              "opacity": 1,
              "regionFilter": true,
              "order": 2,
              "timeHandler": "msfilter",
              "metadados": {
                "title": languageJson["metadata"]["bi_ce_iba_250_2009_savebrasil"]["title"][language],
                "description": languageJson["metadata"]["bi_ce_iba_250_2009_savebrasil"]["description"][language],
                "format": languageJson["metadata"]["bi_ce_iba_250_2009_savebrasil"]["format"][language],
                "region": languageJson["metadata"]["bi_ce_iba_250_2009_savebrasil"]["region"][language],
                "period": languageJson["metadata"]["bi_ce_iba_250_2009_savebrasil"]["period"][language],
                "scale": languageJson["metadata"]["bi_ce_iba_250_2009_savebrasil"]["scale"][language],
                "system_coordinator": languageJson["metadata"]["bi_ce_iba_250_2009_savebrasil"]["system_coordinator"][language],
                "cartographic_projection": languageJson["metadata"]["bi_ce_iba_250_2009_savebrasil"]["cartographic_projection"][language],
                "cod_caracter": languageJson["metadata"]["bi_ce_iba_250_2009_savebrasil"]["cod_caracter"][language],
                "fonte": languageJson["metadata"]["bi_ce_iba_250_2009_savebrasil"]["fonte"][language],
              },
              "columnsCSV": "codigo, nome, area",
              "downloadSHP": true,
              "downloadCSV": true
            },
            {
              "id": "corredores_prioritarios_cepf",
              "label": languageJson["title_layer_label"]["corredores_prioritarios_cepf"][language],
              "visible": false,
              "selectedType": 'corredores_prioritarios_cepf',
              "value": "corredores_prioritarios_cepf",
              "opacity": 1,
              "regionFilter": true,
              "order": 2,
              "timeHandler": "msfilter",
              "metadados": {
                "title": languageJson["metadata"]["corredores_prioritarios_cepf"]["title"][language],
                "description": languageJson["metadata"]["corredores_prioritarios_cepf"]["description"][language],
                "format": languageJson["metadata"]["corredores_prioritarios_cepf"]["format"][language],
                "region": languageJson["metadata"]["corredores_prioritarios_cepf"]["region"][language],
                "period": languageJson["metadata"]["corredores_prioritarios_cepf"]["period"][language],
                "scale": languageJson["metadata"]["corredores_prioritarios_cepf"]["scale"][language],
                "system_coordinator": languageJson["metadata"]["corredores_prioritarios_cepf"]["system_coordinator"][language],
                "cartographic_projection": languageJson["metadata"]["corredores_prioritarios_cepf"]["cartographic_projection"][language],
                "cod_caracter": languageJson["metadata"]["corredores_prioritarios_cepf"]["cod_caracter"][language],
                "fonte": languageJson["metadata"]["corredores_prioritarios_cepf"]["fonte"][language],
              },
              "columnsCSV": "nom_corred, priority",
              "downloadSHP": true,
              "downloadCSV": true
            },
            {
              "id": "unidades_protecao_integral",
              "label": languageJson["title_layer_label"]["unidades_protecao_integral"][language],
              "visible": false,
              "selectedType": 'unidades_protecao_integral',
              "value": "unidades_protecao_integral",
              "opacity": 1,
              "regionFilter": true,
              "order": 2,
              "timeHandler": "msfilter",
              "metadados": {
                "title": languageJson["metadata"]["unidades_protecao_integral"]["title"][language],
                "description": languageJson["metadata"]["unidades_protecao_integral"]["description"][language],
                "format": languageJson["metadata"]["unidades_protecao_integral"]["format"][language],
                "region": languageJson["metadata"]["unidades_protecao_integral"]["region"][language],
                "period": languageJson["metadata"]["unidades_protecao_integral"]["period"][language],
                "scale": languageJson["metadata"]["unidades_protecao_integral"]["scale"][language],
                "system_coordinator": languageJson["metadata"]["unidades_protecao_integral"]["system_coordinator"][language],
                "cartographic_projection": languageJson["metadata"]["unidades_protecao_integral"]["cartographic_projection"][language],
                "cod_caracter": languageJson["metadata"]["unidades_protecao_integral"]["cod_caracter"][language],
                "fonte": languageJson["metadata"]["unidades_protecao_integral"]["fonte"][language],
              },
              "columnsCSV": "nome, categoria, administra, ano_criaca, atolegal",
              "downloadSHP": true,
              "downloadCSV": true
            }
          ]
          // "dataService": "/service/charts/farming"
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
              "downloadSHP": true,
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
              "downloadSHP": true,
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
              "selectedType": 'bi_ce_queimadas_250_lapig',
              "downloadSHP": true,
              "downloadCSV": true,
							"types": [
                 {
                  "value": "bi_ce_queimadas_250_lapig",
                  "Viewvalue": languageJson["type_layer_viewvalue"]["lapig"][language],
                  "visible": false, 
                  "opacity": 1,
                  "regionFilter": true,
                  "order": 5,
                  "typeLabel": languageJson["typelabel_layer"]["fonte"][language],
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
                    "title": languageJson["metadata"]["bi_ce_queimadas_250_lapig"]["title"][language],
                    "description": languageJson["metadata"]["bi_ce_queimadas_250_lapig"]["description"][language],
                    "format": languageJson["metadata"]["bi_ce_queimadas_250_lapig"]["format"][language],
                    "region": languageJson["metadata"]["bi_ce_queimadas_250_lapig"]["region"][language],
                    "period": languageJson["metadata"]["bi_ce_queimadas_250_lapig"]["period"][language],
                    "scale": languageJson["metadata"]["bi_ce_queimadas_250_lapig"]["scale"][language],
                    "system_coordinator": languageJson["metadata"]["bi_ce_queimadas_250_lapig"]["system_coordinator"][language],
                    "cartographic_projection": languageJson["metadata"]["bi_ce_queimadas_250_lapig"]["cartographic_projection"][language],
                    "cod_caracter": languageJson["metadata"]["bi_ce_queimadas_250_lapig"]["cod_caracter"][language],
                    "fonte": languageJson["metadata"]["bi_ce_queimadas_250_lapig"]["fonte"][language],
                    "contato":"lapig.cepf@gmail.com"
                  },
                  "columnsCSV": "area_km2, burndate, year"
                 }
							]
            }
          ]
        },
        {
          "id": "geofisico",
          "label": languageJson["title_group_label"]["geofisico"][language],
          "group_expanded": false,
          "layers": [
            {
              "id": "regioes_hidrograficas",
              "label": languageJson["title_layer_label"]["regioes_hidrograficas"][language],
              "visible": false,
              "selectedType": 'regioes_hidrograficas',
              "value": "regioes_hidrograficas",
              "opacity": 1,
              "regionFilter": true,
              "order": 2,
              "timeHandler": "msfilter",
              "metadados": {
                "title": languageJson["metadata"]["regioes_hidrograficas"]["title"][language],
                "description": languageJson["metadata"]["regioes_hidrograficas"]["description"][language],
                "format": languageJson["metadata"]["regioes_hidrograficas"]["format"][language],
                "region": languageJson["metadata"]["regioes_hidrograficas"]["region"][language],
                "period": languageJson["metadata"]["regioes_hidrograficas"]["period"][language],
                "scale": languageJson["metadata"]["regioes_hidrograficas"]["scale"][language],
                "system_coordinator": languageJson["metadata"]["regioes_hidrograficas"]["system_coordinator"][language],
                "cartographic_projection": languageJson["metadata"]["regioes_hidrograficas"]["cartographic_projection"][language],
                "cod_caracter": languageJson["metadata"]["regioes_hidrograficas"]["cod_caracter"][language],
                "fonte": languageJson["metadata"]["regioes_hidrograficas"]["fonte"][language],
                "contato": "lapig.cepf@gmail.com"
              },
              "columnsCSV": "rhi_sg, rhi_cd, rhi_nm, rhi_ar_km2, rhi_ar_ha, rhi_gm_are, rhi_gm_per, rhi_ve, rhi_cheia2, rhi_seca20",
              "downloadSHP": true,
              "downloadCSV": true
            },
          ]
        },
        {
          "id": "social",
          "label": languageJson["title_group_label"]["social"][language],
          "group_expanded": false,
					"layers": [
            {
							"id": "mapa_area_conflitos",
							"label": languageJson["title_layer_label"]["areas_conflitos"][language],
							"visible": false,
              "selectedType": 'bi_ce_area_conflito_250_cpt',
              "value": "bi_ce_area_conflito_250_cpt",
              "opacity": 1,
              "regionFilter": true,
              "order": 2,
              "typeLabel": languageJson["typelabel_layer"]["type"][language],
              "timeLabel": languageJson["typelabel_layer"]["year"][language],
              "timeSelected": "year=2016",
              "timeHandler": "msfilter",
              "times": [
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
                  {"value": "year=2016", "Viewvalue": 2016}
              ],
              "metadados": {
                "title": languageJson["metadata"]["bi_ce_area_conflito_250_cpt"]["title"][language],
                "description": languageJson["metadata"]["bi_ce_area_conflito_250_cpt"]["description"][language],
                "format": languageJson["metadata"]["bi_ce_area_conflito_250_cpt"]["format"][language],
                "region": languageJson["metadata"]["bi_ce_area_conflito_250_cpt"]["region"][language],
                "period": languageJson["metadata"]["bi_ce_area_conflito_250_cpt"]["period"][language],
                "scale": languageJson["metadata"]["bi_ce_area_conflito_250_cpt"]["scale"][language],
                "system_coordinator": languageJson["metadata"]["bi_ce_area_conflito_250_cpt"]["system_coordinator"][language],
                "cartographic_projection": languageJson["metadata"]["bi_ce_area_conflito_250_cpt"]["cartographic_projection"][language],
                "cod_caracter": languageJson["metadata"]["bi_ce_area_conflito_250_cpt"]["cod_caracter"][language],
                "fonte": languageJson["metadata"]["bi_ce_area_conflito_250_cpt"]["fonte"][language],
                "contato":"lapig.cepf@gmail.com"
              },
              "columnsCSV": "area_ha, year",
              "downloadSHP": true,
              "downloadCSV": true
						},
						{
							"id": "mapa_conflitos_agua",
							"label": languageJson["title_layer_label"]["conflitos_agua"][language],
							"visible": false,
              "selectedType": 'bi_ce_conflito_agua_250_cpt',
              "downloadSHP": true,
              "downloadCSV": true,
							"types": [
                {
                  "value": "bi_ce_conflito_agua_250_cpt", 
                  "Viewvalue": languageJson["type_layer_viewvalue"]["ocorrencias"][language],
                  "visible": false, 
                  "opacity": 1,
                  "regionFilter": true,
                  "order": 4,
                  "typeLabel": languageJson["typelabel_layer"]["type"][language],
                  "timeLabel": languageJson["typelabel_layer"]["year"][language],
                  "timeSelected": "year=2017",
                  "timeHandler": "msfilter",
                  "times": [
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
                    "title": languageJson["metadata"]["bi_ce_conflito_agua_250_cpt"]["title"][language],
                    "description": languageJson["metadata"]["bi_ce_conflito_agua_250_cpt"]["description"][language],
                    "format": languageJson["metadata"]["bi_ce_conflito_agua_250_cpt"]["format"][language],
                    "region": languageJson["metadata"]["bi_ce_conflito_agua_250_cpt"]["region"][language],
                    "period": languageJson["metadata"]["bi_ce_conflito_agua_250_cpt"]["period"][language],
                    "scale": languageJson["metadata"]["bi_ce_conflito_agua_250_cpt"]["scale"][language],
                    "system_coordinator": languageJson["metadata"]["bi_ce_conflito_agua_250_cpt"]["system_coordinator"][language],
                    "cartographic_projection": languageJson["metadata"]["bi_ce_conflito_agua_250_cpt"]["cartographic_projection"][language],
                    "cod_caracter": languageJson["metadata"]["bi_ce_conflito_agua_250_cpt"]["cod_caracter"][language],
                    "fonte": languageJson["metadata"]["bi_ce_conflito_agua_250_cpt"]["fonte"][language],
                    "contato":"lapig.cepf@gmail.com"
                  },
                  "columnsCSV": "conflitos, year"
                },
                {
                  "value": "bi_ce_conflito_agua_pessoas_250_cpt",
                  "Viewvalue": languageJson["type_layer_viewvalue"]["pessoas"][language],
                  "visible": false, 
                  "opacity": 1,
                  "regionFilter": true,
                  "order": 4,
                  "typeLabel": languageJson["typelabel_layer"]["type"][language],
                  "timeLabel": languageJson["typelabel_layer"]["year"][language],
                  "timeSelected": "year=2016",
                  "timeHandler": "msfilter",
                  "times": [
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
                    {"value": "year=2016", "Viewvalue": 2016}
                  ],
                  "metadados": {
                    "title": languageJson["metadata"]["bi_ce_conflito_agua_pessoas_250_cpt"]["title"][language],
                    "description": languageJson["metadata"]["bi_ce_conflito_agua_pessoas_250_cpt"]["description"][language],
                    "format": languageJson["metadata"]["bi_ce_conflito_agua_pessoas_250_cpt"]["format"][language],
                    "region": languageJson["metadata"]["bi_ce_conflito_agua_pessoas_250_cpt"]["region"][language],
                    "period": languageJson["metadata"]["bi_ce_conflito_agua_pessoas_250_cpt"]["period"][language],
                    "scale": languageJson["metadata"]["bi_ce_conflito_agua_pessoas_250_cpt"]["scale"][language],
                    "system_coordinator": languageJson["metadata"]["bi_ce_conflito_agua_pessoas_250_cpt"]["system_coordinator"][language],
                    "cartographic_projection": languageJson["metadata"]["bi_ce_conflito_agua_pessoas_250_cpt"]["cartographic_projection"][language],
                    "cod_caracter": languageJson["metadata"]["bi_ce_conflito_agua_pessoas_250_cpt"]["cod_caracter"][language],
                    "fonte": languageJson["metadata"]["bi_ce_conflito_agua_pessoas_250_cpt"]["fonte"][language],
                    "contato":"lapig.cepf@gmail.com"
                  },
                  "columnsCSV": "pessoas, year"
                }
							]
            },
            {
							"id": "mapa_conflitos_terra",
							"label": languageJson["title_layer_label"]["conflitos_terra"][language],
							"visible": false,
              "selectedType": 'bi_ce_conflito_terra_250_cpt',
              "downloadSHP": true,
              "downloadCSV": true,
							"types": [
                {
                  "value": "bi_ce_conflito_terra_250_cpt", 
                  "Viewvalue": languageJson["type_layer_viewvalue"]["ocorrencias"][language],
                  "visible": false, 
                  "opacity": 1,
                  "regionFilter": true,
                  "order": 4,
                  "typeLabel": languageJson["typelabel_layer"]["type"][language],
                  "timeLabel": languageJson["typelabel_layer"]["year"][language],
                  "timeSelected": "year=2019",
                  "timeHandler": "msfilter",
                  "times": [
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
                    "title": languageJson["metadata"]["bi_ce_conflito_terra_250_cpt"]["title"][language],
                    "description": languageJson["metadata"]["bi_ce_conflito_terra_250_cpt"]["description"][language],
                    "format": languageJson["metadata"]["bi_ce_conflito_terra_250_cpt"]["format"][language],
                    "region": languageJson["metadata"]["bi_ce_conflito_terra_250_cpt"]["region"][language],
                    "period": languageJson["metadata"]["bi_ce_conflito_terra_250_cpt"]["period"][language],
                    "scale": languageJson["metadata"]["bi_ce_conflito_terra_250_cpt"]["scale"][language],
                    "system_coordinator": languageJson["metadata"]["bi_ce_conflito_terra_250_cpt"]["system_coordinator"][language],
                    "cartographic_projection": languageJson["metadata"]["bi_ce_conflito_terra_250_cpt"]["cartographic_projection"][language],
                    "cod_caracter": languageJson["metadata"]["bi_ce_conflito_terra_250_cpt"]["cod_caracter"][language],
                    "fonte": languageJson["metadata"]["bi_ce_conflito_terra_250_cpt"]["fonte"][language],
                    "contato":"lapig.cepf@gmail.com"
                  },
                  "columnsCSV": "conflitos, year"
                },
                {
                  "value": "bi_ce_conflito_terra_pessoas_250_cpt",
                  "Viewvalue": languageJson["type_layer_viewvalue"]["pessoas"][language],
                  "visible": false, 
                  "opacity": 1,
                  "regionFilter": true,
                  "order": 4,
                  "typeLabel": languageJson["typelabel_layer"]["type"][language],
                  "timeLabel": languageJson["typelabel_layer"]["year"][language],
                  "timeSelected": "year=2019",
                  "timeHandler": "msfilter",
                  "times": [
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
                    "title": languageJson["metadata"]["bi_ce_conflito_terra_pessoas_250_cpt"]["title"][language],
                    "description": languageJson["metadata"]["bi_ce_conflito_terra_pessoas_250_cpt"]["description"][language],
                    "format": languageJson["metadata"]["bi_ce_conflito_terra_pessoas_250_cpt"]["format"][language],
                    "region": languageJson["metadata"]["bi_ce_conflito_terra_pessoas_250_cpt"]["region"][language],
                    "period": languageJson["metadata"]["bi_ce_conflito_terra_pessoas_250_cpt"]["period"][language],
                    "scale": languageJson["metadata"]["bi_ce_conflito_terra_pessoas_250_cpt"]["scale"][language],
                    "system_coordinator": languageJson["metadata"]["bi_ce_conflito_terra_pessoas_250_cpt"]["system_coordinator"][language],
                    "cartographic_projection": languageJson["metadata"]["bi_ce_conflito_terra_pessoas_250_cpt"]["cartographic_projection"][language],
                    "cod_caracter": languageJson["metadata"]["bi_ce_conflito_terra_pessoas_250_cpt"]["cod_caracter"][language],
                    "fonte": languageJson["metadata"]["bi_ce_conflito_terra_pessoas_250_cpt"]["fonte"][language],
                    "contato":"lapig.cepf@gmail.com"
                  },
                  "columnsCSV": "pessoas, year"
                }
							]
            },
            {
							"id": "mapa_trabalho_escravo",
							"label": languageJson["title_layer_label"]["trabalho_escravo"][language],
							"visible": false,
              "selectedType": 'bi_ce_trabalho_escravo_250_cpt',
              "value": "bi_ce_trabalho_escravo_250_cpt",
              "opacity": 1,
              "regionFilter": true,
              "order": 2,
              "typeLabel": languageJson["typelabel_layer"]["type"][language],
              "timeLabel": languageJson["typelabel_layer"]["year"][language],
              "timeSelected": "year=2017",
              "timeHandler": "msfilter",
              "times": [
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
                "title": languageJson["metadata"]["bi_ce_trabalho_escravo_250_cpt"]["title"][language],
                "description": languageJson["metadata"]["bi_ce_trabalho_escravo_250_cpt"]["description"][language],
                "format": languageJson["metadata"]["bi_ce_trabalho_escravo_250_cpt"]["format"][language],
                "region": languageJson["metadata"]["bi_ce_trabalho_escravo_250_cpt"]["region"][language],
                "period": languageJson["metadata"]["bi_ce_trabalho_escravo_250_cpt"]["period"][language],
                "scale": languageJson["metadata"]["bi_ce_trabalho_escravo_250_cpt"]["scale"][language],
                "system_coordinator": languageJson["metadata"]["bi_ce_trabalho_escravo_250_cpt"]["system_coordinator"][language],
                "cartographic_projection": languageJson["metadata"]["bi_ce_trabalho_escravo_250_cpt"]["cartographic_projection"][language],
                "cod_caracter": languageJson["metadata"]["bi_ce_trabalho_escravo_250_cpt"]["cod_caracter"][language],
                "fonte": languageJson["metadata"]["bi_ce_trabalho_escravo_250_cpt"]["fonte"][language],
                "contato":"lapig.cepf@gmail.com"
              },
              "columnsCSV": "pessoas, year",
              "downloadSHP": true,
              "downloadCSV": true
						},
            {
							"id": "mapa_idhm",
							"label": languageJson["title_layer_label"]["idhm"][language],
							"visible": false,
              "selectedType": 'bi_ce_idhm_250_pnud',
              "value": "bi_ce_idhm_250_pnud",
              "opacity": 1,
              "regionFilter": true,
              "order": 2,
              "typeLabel": languageJson["typelabel_layer"]["type"][language],
              "timeLabel": languageJson["typelabel_layer"]["year"][language],
              "timeSelected": "year=2010",
              "timeHandler": "msfilter",
              "times": [
                  {"value": "year=1991", "Viewvalue": 1991},
                  {"value": "year=2000", "Viewvalue": 2000},
                  {"value": "year=2010", "Viewvalue": 2010}
              ],
              "metadados": {
                "title": languageJson["metadata"]["bi_ce_idhm_250_pnud"]["title"][language],
                "description": languageJson["metadata"]["bi_ce_idhm_250_pnud"]["description"][language],
                "format": languageJson["metadata"]["bi_ce_idhm_250_pnud"]["format"][language],
                "region": languageJson["metadata"]["bi_ce_idhm_250_pnud"]["region"][language],
                "period": languageJson["metadata"]["bi_ce_idhm_250_pnud"]["period"][language],
                "scale": languageJson["metadata"]["bi_ce_idhm_250_pnud"]["scale"][language],
                "system_coordinator": languageJson["metadata"]["bi_ce_idhm_250_pnud"]["system_coordinator"][language],
                "cartographic_projection": languageJson["metadata"]["bi_ce_idhm_250_pnud"]["cartographic_projection"][language],
                "cod_caracter": languageJson["metadata"]["bi_ce_idhm_250_pnud"]["cod_caracter"][language],
                "fonte": languageJson["metadata"]["bi_ce_idhm_250_pnud"]["fonte"][language],
                "contato":"lapig.cepf@gmail.com"
              },
              "columnsCSV": "idhm, year",
              "downloadSHP": true,
              "downloadCSV": true
						}
          ]
          // "dataService": "/service/charts/farming"
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
              "value": "limites_cartas_ibge",
              "Viewvalue": languageJson["limits"]["cartas_ibge"][language],
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

  Controller.downloadSHPAuto = function (request, response) {

    let layer = request.body.layer;
    let region = request.body.selectedRegion;
    let time = request.body.times;
    let typeShape = request.body.typeshape;

    let owsRequest = new Ows(typeShape);
    owsRequest.setTypeName(layer);

    let diretorio = '';
    let fileParam = '';
    let pathFile = '';

    // console.log(layer, owsRequest)

    // let layersSkipFilters = ['terra_indigena', 'quilombola', 'ucs']

    if (typeShape == 'shp') {
      // owsRequest.addFilter('1', '1');

      if (region.type == 'municipio') {
        owsRequest.addFilter('cd_geocmu', "'" + region.value + "'");
      } else if (region.type == 'estado') {
        owsRequest.addFilter('uf', "'" + region.value + "'");
      }else {
        owsRequest.addFilter('bioma', "'CERRADO'");
      }

      if (time != undefined) {
        owsRequest.addFilterDirect(time.value);
        fileParam = layer + "_" + time.Viewvalue;
      } else {
        fileParam = layer;
      }

      diretorio = config.downloadDataDir + region.type + '/' + region.value + '/' + typeShape + '/' + layer + '/';

    } else {
      diretorio = config.downloadDataDir + '/' + typeShape + '/' + layer + '/';
      fileParam = layer;
    }

    pathFile = diretorio + fileParam;

    if (!fs.existsSync(diretorio)) {
      fs.mkdirSync(diretorio, {
        recursive: true
      });
    }

    if (fs.existsSync(pathFile + '.zip')) {
      response.download(pathFile + '.zip');
    } else {
      self.requestFileFromMapServ(owsRequest.get(), pathFile, response);
    }
  };

	return Controller;

}
