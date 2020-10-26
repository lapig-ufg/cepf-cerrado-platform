var fs = require('fs')
    , archiver = require('archiver')
    , json2csv = require('json2csv').parse;

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
              "selectedType": 'uso_solo_mapbiomas',
              "downloadSHP": false,
              "downloadCSV": true,
              "types": [
								{
                  "value": "uso_solo_mapbiomas", 
                  "Viewvalue": "Mapbiomas", 
                  "visible": true, 
                  "opacity": 1,
                  "regionFilter": true,
                  "order": 1,
                  "typeLabel": "Tipo",
                  "timeLabel": "Ano",
                  "timeSelected": "year=2018",
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
                    {"value": "year=2018", "Viewvalue": 2018}
                  ],
                  "metadados": {
                    "title": "Cobertura e Uso do Solo do Brasil - Mapbiomas",
                    "description": "O Projeto de Mapeamento Anual da Cobertura e Uso do Solo do Brasil é uma iniciativa que envolve uma rede colaborativa com especialistas nos biomas, usos da terra, sensoriamento remoto, SIG e ciência da computação que utiliza processamento em nuvem e classificadores automatizados desenvolvidos e operados a partir da plataforma Google Earth Engine para gerar uma série histórica de mapas anuais de cobertura e uso da terra doBrasil.",
                    "link_description": "https://mapbiomas-br-site.s3.amazonaws.com/ATBD_Collection_4_v2_Dez2019.pdf",
                    "format": "Shapefile (*.SHP), com arquivos complementares (*.PRJ, *DBF, *.SHX, *.SBX, *MAP). Comma-separated values (*.CSV).",
                    "region": "Bioma Cerrado, permitindo analisar as classes de uso do solo por outras regiões de interesse como: estados e municípios.",
                    "period": "1985 à 2018, Coleção 4.",
                    "scale": "30 metros",
                    "system_coordinator": "Superfície de referência SIRGAS 2000, sistema de coordenadas em grau.",
                    "cartographic_projection": "Universal de Mercator.",
                    "cod_caracter": "Latin 1.",
                    "fonte": "Laboratório de Processamento de Imagens e Geoprocessamento – Lapig (geração do dado). Projeto Spatial metrics and baselines of degradation patterns and provision of ecosystem services by pastures in Brazil. (viabilizador).",
                    "contato": "Fernanda Stefani - fer.stefani.souza@gmail.com<br /> Lana Teixeira - lanamarast @gmail.com"
                  },
                  "columnsCSV": "area_ha, classe, year"
                },
                {
                  "value": "uso_solo_terraclass", 
                  "Viewvalue": "Terraclass",
                  "typeLabel": "Tipo",
                  "visible": false, 
                  "opacity": 1,
                  "regionFilter": true,
                  "order": 1,
                  "metadados": {
                    "title": "Mapeamento do Uso e Cobertura Vegetal do Cerrado – TerraClass Cerrado",
                    "description": "Mapeamento do Uso e Cobertura Vegetal do Cerrado - TerraClass Cerrado, utiliza como base de mapeamento 118 cenas do satélite Landsat 8, sensor Operational Land Imager ( OLI), do ano de 2013 que recobrem todo o bioma. A área mínima mapeável é de 6,25 hectares.",
                    "format": "Shapefile (*.SHP), com arquivos complementares (*.PRJ, *DBF, *.SHX, *.SBX, *MAP). Comma-separated values (*.CSV).",
                    "region": "Bioma Cerrado, permitindo analisar as classes de uso do solo por outras regiões de interesse como: estados e municípios.",
                    "period": "2013",
                    "scale": "1:250.000",
                    "system_coordinator": "Superfície de referência SIRGAS 2000, sistema de coordenadas em grau.",
                    "cartographic_projection": "Universal de Mercator",
                    "cod_caracter": "Latin 1",
                    "fonte": "UFG, IBAMA CSR, INPE OBT e CRA, EMBRAPA MONITORAMENTO POR SATÉLITE, EMBRAPA INFORMÁTICA AGROPECUÁRIA, UFU. Programa conduzido pelo Ministério de Meio Ambiente (MMA) e conta com recursos financeiros oriundos do Global Environment Facility (GEF) por meio do Banco Mundial e do Fundo Brasileiro para a Biodiversidade (Funbio). Para acessar a publicação completa do projeto, clique aqui!",
                    "link_fonte": "https://www.mma.gov.br/images/arquivo/80049/Cerrado/publicacoes/Livro%20EMBRAPA-WEB-1-TerraClass%20Cerrado.pdf",
                    "contato": "Fernanda Stefani - fer.stefani.souza@gmail.com <br /> Lana Teixeira - lanamarast @gmail.com"
                  },
                  "columnsCSV": "area_ha, classe"
                },
                {
                  "value": "uso_solo_probio", 
                  "Viewvalue": "PROBIO",
                  "typeLabel": "Tipo",
                  "visible": false, 
                  "opacity": 1,
                  "regionFilter": true,
                  "order": 1,
                  "metadados": {
                    "title": "",
                    "description": "",
                    "format": "Shapefile (*.SHP), com arquivos complementares (*.PRJ, *DBF, *.SHX, *.SBX, *MAP). Comma-separated values (*.CSV).",
                    "region": "Bioma Cerrado, permitindo analisar as classes de uso do solo por outras regiões de interesse como: estados e municípios.",
                    "period": "",
                    "scale": "",
                    "system_coordinator": "",
                    "cartographic_projection": "",
                    "cod_caracter": "",
                    "fonte": "",
                    "contato": "lapig.cepf@gmail.com"
                  },
                  "columnsCSV": "area_ha, classe"
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
              ],
              "metadados": {
                "title": "Agrosatelite",
                "description": "",
                "format": "Shapefile (*.SHP), com arquivos complementares (*.PRJ, *DBF, *.SHX, *.SBX, *MAP). Comma-separated values (*.CSV).",
                "region": "Bioma Cerrado, permitindo analisar as classes de uso do solo por outras regiões de interesse como: estados e municípios.",
                "period": "",
                "scale": "",
                "system_coordinator": "",
                "cartographic_projection": "",
                "cod_caracter": "",
                "fonte": "",
                "contato": "lapig.cepf@gmail.com"
              },
              "columnsCSV": "area_ha, classe, year",
              "downloadSHP": true,
              "downloadCSV": true
						},
						{
							"id": "mapa_pastagem",
							"label": "Pastagem - Lapig",
							"visible": false,
              "selectedType": 'pasture',
              "downloadSHP": true,
              "downloadCSV": true,
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
                    {"value": "year=2018", "Viewvalue": 2018},
                    {"value": "year=2019", "Viewvalue": 2019}
                  ],
                  "metadados": {
                    "title": "Áreas de Pastagens do Brasil",
                    "description": "Mapeamento anual das pastagens brasileiras, realizado através do uso de séries de dados Landsat de 1985 a 2018. Utilizando abordagens de classificação supervisionada (Random Forest) através da plataforma Earth Engine da Google.",
                    "link_description": "https://mapbiomas-br-site.s3.amazonaws.com/ATBD_Collection_4_v2_Dez2019.pdf",
                    "format": "Shapefile (*.SHP), com arquivos complementares (*.PRJ, *DBF, *.SHX, *.SBX, *MAP). Comma-separated values (*.CSV).",
                    "region": "Bioma Cerrado, permitindo analisar as classes de uso do solo por outras regiões de interesse como: estados e municípios.",
                    "period": "De 1985 a 2018.",
                    "scale": "30 metros.",
                    "system_coordinator": "Superfície de referência SIRGAS 2000, sistema de coordenadas em graus.",
                    "cartographic_projection": "Universal de Mercator.",
                    "update": "Anual",
                    "cod_caracter": "Latin 1.",
                    "fonte": "Laboratório de Processamento de Imagens e Geoprocessamento - Lapig (geração do dado). Projeto de Mapeamento Anual da Cobertura e Uso do Solo do Brasil - MapBiomas (viabilizador). ",
                    "contato": "lapig.cepf@gmail.com"
                  },
                  "columnsCSV": "area_ha, year"
                 },
								 {
                   "value": "classes_degradacao_pastagem", 
                   "Viewvalue": "Classes degradação",
                   "typeLabel": "Tipo", 
                   "visible": false, 
                   "opacity": 1,
                   "regionFilter": true,
                   "order": 10,
                   //"layerfilter": "category='1'",
                   "metadados": {
                     "title": "Indícios de degradação das pastagens brasileiras",
                     "description": "Mapeamento da qualidade de pastagens, gerado pelo Lapig, onde foram analisados os dados de pastagens pixel a pixel para o período de 2011 a 2016, por meio de análise de tendências em anomalias acumuladas. A análise foi baseado em dados satelitários (NDVI/MOD13Q1), e avalia perdas ou ganho em produtividade. As áreas com tendência significativas de perda em produtividade (p < 0.05) foram consideradas áreas com indícios de degradação.",
                     "format": "Shapefile (*.SHP), com arquivos complementares (*.PRJ, *DBF, *.SHX, *.SBX, *MAP). Comma-separated values (*.CSV).",
                     "region": "Bioma Cerrado, permitindo analisar as classes de uso do solo por outras regiões de interesse como: estados e municípios.",
                     "period": "2017",
                     "scale": "1:250.000 ",
                     "system_coordinator": "Superfície de referência SIRGAS 2000, sistema de coordenadas em graus.",
                     "cartographic_projection": "Universal de Mercator.",
                     "cod_caracter": "Latin 1",
                     "fonte": "Laboratório de Processamento de Imagens e Geoprocessamento - Lapig",
                     "contato": "lapig.cepf@gmail.com"
                   },
                   "columnsCSV": "area_ha"
                 }
							]
						},
						{
							"id": "mapa_pecuaria_censitaria",
							"label": "Pecuária Censitária - IBGE",
							"visible": false,
              "selectedType": 'lotacao_bovina_regions',
              "downloadSHP": false,
              "downloadCSV": true,
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
                  ],
                  "metadados": {
                    "title": "Rebanho Bovino em Unidades Animal (UA)",
                    "description": "Cálculo realizado considerando a composição do rebanho para o censo agropecuário. Para os anos de 1986 a 1999, utilizou-se os dados do censo agropecuário de 1996. Para os anos de 2000 a 2018. utilizou-se os dados do censo agropecuário de 2006. Sendo que uma Unidade Animal (UA), equivale a um animal de 450 kg vivo.",
                    "format": "Shapefile (*.SHP), com arquivos complementares (*.PRJ, *DBF, *.SHX, *.SBX, *MAP). Comma-separated values (*.CSV).",
                    "region": "Bioma Cerrado, permitindo analisar as classes de uso do solo por outras regiões de interesse como: estados e municípios.",
                    "period": "1985 á 2018.",
                    "scale": "1:250.000",
                    "system_coordinator": "Superfície de referência SIRGAS 2000, sistema de coordenadas em grau.",
                    "cartographic_projection": "Universal de Mercator.",
                    "cod_caracter": "Latin 1.",
                    "fonte": "Laboratório de Processamento de Imagens e Geoprocessamento - Lapig (geração do dado).",
                    "contato": "lapig.cepf@gmail.com"
                  },
                  "columnsCSV": "n_kbcs, ua, year"
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
                  ],
                  "metadados": {
                    "title": "Produção de Leite por Municípios do Brasil",
                    "description": "Quantidade de Leite produzido por municípios do Brasil, em Litros, no período de 1974 a 2018, conforme dados da Pesquisa da Pecuária Municipal.",
                    "format": "Shapefile (*.SHP), com arquivos complementares (*.PRJ, *DBF, *.SHX, *.SBX, *MAP). Comma-separated values (*.CSV).",
                    "region": "Bioma Cerrado, permitindo analisar as classes de uso do solo por outras regiões de interesse como: estados e municípios.",
                    "period": "2000 a 2018",
                    "scale": "1:250.000",
                    "system_coordinator": "Superfície de referência SIRGAS 2000, sistema de coordenadas em graus.",
                    "cartographic_projection": "Universal de Mercator.",
                    "cod_caracter": "Latin 1",
                    "fonte": "SIDRA / IBGE",
                    "contato": "lapig.cepf@gmail.com"
                  },
                  "columnsCSV": "prod_leite, year"
                }
							]
            },
            {
							"id": "mapa_agricultura_censitaria",
							"label": "Agricultura Censitária - IBGE",
							"visible": false,
              "selectedType": 'area_plantada_algodao_censo',
              "downloadSHP": false,
              "downloadCSV": true,
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
                  ],
                  "metadados": {
                    "title": "Áreas de Plantação de Algodão por Municípios do Brasil",
                    "description": "Áreas de plantação de algodão em caroço por municípios do Brasil, por hectares, no período de 2000 a 2018, conforme dados da Pesquisa Agrícola Municipal",
                    "format": "Shapefile (*.SHP), com arquivos complementares (*.PRJ, *DBF, *.SHX, *.SBX, *MAP). Comma-separated values (*.CSV).",
                    "region": "Bioma Cerrado, permitindo analisar as classes de uso do solo por outras regiões de interesse como: estados e municípios.",
                    "period": "2000 a 2018.",
                    "scale": "1:250.000",
                    "system_coordinator": "Superfície de referência SIRGAS 2000, sistema de coordenadas em graus.",
                    "cartographic_projection": "Universal de Mercator",
                    "cod_caracter": "Latin 1",
                    "fonte": "SIDRA / IBGE",
                    "contato": "lapig.cepf@gmail.com"
                  },
                  "columnsCSV": "area_ha, year"
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
                  ],
                  "metadados": {
                    "title": "Áreas de Plantação de Cana-de-açúcar por Municípios do Brasil",
                    "description": "Áreas de plantação de cana-de-açúcar por municípios do Brasil, por hectares, no período de 2000 a 2018, conforme dados da Pesquisa Agrícola Municipal.",
                    "format": "Shapefile (*.SHP), com arquivos complementares (*.PRJ, *DBF, *.SHX, *.SBX, *MAP). Comma-separated values (*.CSV).",
                    "region": "Bioma Cerrado, permitindo analisar as classes de uso do solo por outras regiões de interesse como: estados e municípios.",
                    "period": "2000 a 2018.",
                    "scale": "1:250.000",
                    "system_coordinator": "Superfície de referência SIRGAS 2000, sistema de coordenadas em graus",
                    "cartographic_projection": "Universal de Mercator.",
                    "cod_caracter": "Latin 1",
                    "fonte": "SIDRA / IBGE",
                    "contato": "lapig.cepf@gmail.com"
                  },
                  "columnsCSV": "area_ha, year"
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
                  ],
                  "metadados": {
                    "title": "Áreas de Plantação de Milho por Municípios do Brasil",
                    "description": "Áreas de plantação de milho por municípios do Brasil, por hectares, no período de 2000 a 2018, conforme dados da Pesquisa Agrícola Municipal.",
                    "format": "Shapefile (*.SHP), com arquivos complementares (*.PRJ, *DBF, *.SHX, *.SBX, *MAP). Comma-separated values (*.CSV).",
                    "region": "Bioma Cerrado, permitindo analisar as classes de uso do solo por outras regiões de interesse como: estados e municípios.",
                    "period": "2000 a 2018.",
                    "scale": "1:250.000",
                    "system_coordinator": "Superfície de referência SIRGAS 2000, sistema de coordenadas em graus.",
                    "cartographic_projection": "Universal de Mercator.",
                    "cod_caracter": "Latin 1",
                    "fonte": "SIDRA / IBGE",
                    "contato": "lapig.cepf@gmail.com"
                  },
                  "columnsCSV": "area_ha, year"
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
                  ],
                  "metadados": {
                    "title": "Áreas de Plantação de Soja por Municípios do Brasil",
                    "description": "Áreas de plantação de soja por municípios do Brasil, por hectares, no período de 2000 a 2018, conforme dados da Pesquisa Agrícola Municipal.",
                    "format": "Shapefile (*.SHP), com arquivos complementares (*.PRJ, *DBF, *.SHX, *.SBX, *MAP). Comma-separated values (*.CSV).Shapefile (*.SHP), com arquivos complementares (*.PRJ, *DBF, *.SHX, *.SBX, *MAP). Comma-separated values (*.CSV).",
                    "region": "Bioma Cerrado, permitindo analisar as classes de uso do solo por outras regiões de interesse como: estados e municípios.",
                    "period": "2000 a 2018.",
                    "scale": "1:250.000",
                    "system_coordinator": "Superfície de referência SIRGAS 2000, sistema de coordenadas em graus.",
                    "cartographic_projection": "Universal de Mercator.",
                    "cod_caracter": "Latin 1",
                    "fonte": "SIDRA / IBGE",
                    "contato": "lapig.cepf@gmail.com"
                  },
                  "columnsCSV": "area_ha, year"
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
                  ],
                  "metadados": {
                    "title": "Produção de Carvão por Municípios do Brasil",
                    "description": "Quantidade de carvão vegetal produzido por municípios do brasil, em Toneladas, no período de 2000 a 2018, conforme dados da Produção de Extração Vegetal e da Silvicultura.",
                    "format": "Shapefile (*.SHP), com arquivos complementares (*.PRJ, *DBF, *.SHX, *.SBX, *MAP). Comma-separated values (*.CSV).",
                    "region": "Bioma Cerrado, permitindo analisar as classes de uso do solo por outras regiões de interesse como: estados e municípios.",
                    "period": "2000 a 2018.",
                    "scale": "1:250.000",
                    "system_coordinator": "Superfície de referência SIRGAS 2000, sistema de coordenadas em graus.",
                    "cartographic_projection": "Universal de Mercator.",
                    "cod_caracter": "Latin 1",
                    "fonte": "SIDRA / IBGE",
                    "contato": "lapig.cepf@gmail.com"
                  },
                  "columnsCSV": "qto_produz, year"
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
                  ],
                  "metadados": {
                    "title": "Produção de Lenha por Municípios do Brasil",
                    "description": "Quantidade de Lenha produzida por municípios do brasil, em Metros Cúbicos, no período de 2000 a 2018, conforme dados da Produção de Extração Vegetal e da Silvicultura.",
                    "format": "Shapefile (*.SHP), com arquivos complementares (*.PRJ, *DBF, *.SHX, *.SBX, *MAP). Comma-separated values (*.CSV).",
                    "region": "Bioma Cerrado, permitindo analisar as classes de uso do solo por outras regiões de interesse como: estados e municípios.",
                    "period": "2000 a 2018.",
                    "scale": "1:250.000",
                    "system_coordinator": "Superfície de referência SIRGAS 2000, sistema de coordenadas em graus.",
                    "cartographic_projection": "Universal de Mercator.",
                    "cod_caracter": "Latin 1",
                    "fonte": "SIDRA / IBGE",
                    "contato": "lapig.cepf@gmail.com"
                  },
                  "columnsCSV": "qto_produz, year"
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
                  ],
                  "metadados": {
                    "title": "Produção de Madeira por Municípios do Brasil",
                    "description": "Quantidade de Madeira produzida por municípios do brasil, em Metros Cúbicos, no período de 2000 a 2018, conforme dados da Produção de Extração Vegetal e da Silvicultura.",
                    "format": "Shapefile (*.SHP), com arquivos complementares (*.PRJ, *DBF, *.SHX, *.SBX, *MAP). Comma-separated values (*.CSV).",
                    "region": "Bioma Cerrado, permitindo analisar as classes de uso do solo por outras regiões de interesse como: estados e municípios.",
                    "period": "2000 a 2018.",
                    "scale": "1:250.000",
                    "system_coordinator": "Superfície de referência SIRGAS 2000, sistema de coordenadas em graus.",
                    "cartographic_projection": "Universal de Mercator.",
                    "cod_caracter": "Latin 1",
                    "fonte": "SIDRA / IBGE",
                    "contato": "lapig.cepf@gmail.com"
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
          "label": "Desmatamentos/Queimadas",
          "group_expanded": false,
          "layers":[
            {
							"id": "mapa_desmatamento",
							"label": "Áreas Desmatamento",
							"visible": false,
              "selectedType": 'desmatamento_prodes',
              "downloadSHP": false,
              "downloadCSV": true,
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
                  ],
                  "metadados": {
                    "title": "Monitoramento do Desmatamento no Cerrado Brasileiro por Satélite",
                    "description": "Área desmatada a partir de 2000 discretizadas em uma séria histórica bienal para o período de 2000 a 2012 e anual para os anos de 2013 a 2018. O mapeamento utiliza imagens do satélite Landsat ou similares, para registrar e quantificar as áreas desmatadas maiores que 1 hectare. O PRODES considera como desmatamento a remoção completa da cobertura florestal primária por corte raso, independentemente da futura utilização destas áreas",
                    "format": "Shapefile (*.SHP), com arquivos complementares (*.PRJ, *DBF, *.SHX, *.SBX, *MAP). Comma-separated values (*.CSV).",
                    "region": "Bioma Cerrado, permitindo analisar as classes de uso do solo por outras regiões de interesse como: estados e municípios.",
                    "period": "Bienal de 2000 a 2012 e anual de 2013 a 2018.",
                    "scale": "1:250.000",
                    "system_coordinator": "Superfície de referência SIRGAS 2000, sistema de coordenadas em graus.",
                    "cartographic_projection": "Universal de Mercator.",
                    "cod_caracter": "Latin 1.",
                    "fonte": "Programa conduzido pelo Ministério de Meio Ambiente (MMA) e o Ministério da Ciência, Tecnologia, Inovação e Comunicações (MCTIC) contando com recursos financeiros oriundos do Banco Mundial (World Bank – IBRD-IDA), além das instituições alemães KfW e GIZ.",
                    "contato": "lapig.cepf@gmail.com"
                  },
                  "columnsCSV": "area_km2, view_date, year"
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
                  ],
                  "metadados": {
                    "title": "Áreas de Desmatamento no Cerrado",
                    "description": "Dados de desmatamentos ocorridos no Bioma Cerrado, disponibilizados anualmente, no período de 2003 a 2017, produzidos a partir de imagens MODIS (MOD13Q1), sendo utilizadas imagens LANDSAT e CBERS para validação.",
                    "format": "Shapefile (*.SHP), com arquivos complementares (*.PRJ, *DBF, *.SHX, *.SBX, *MAP). Comma-separated values (*.CSV).",
                    "region": "Bioma Cerrado, permitindo analisar as classes de uso do solo por outras regiões de interesse como: estados e municípios.",
                    "period": "",
                    "scale": "",
                    "system_coordinator": "",
                    "cartographic_projection": "",
                    "cod_caracter": "",
                    "fonte": "",
                    "contato": "lapig.cepf@gmail.com"
                  },
                  "columnsCSV": "area_km2, year"
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
                  ],
                  "metadados": {
                    "title": "",
                    "description": "",
                    "format": "Shapefile (*.SHP), com arquivos complementares (*.PRJ, *DBF, *.SHX, *.SBX, *MAP). Comma-separated values (*.CSV).",
                    "region": "Bioma Cerrado, permitindo analisar as classes de uso do solo por outras regiões de interesse como: estados e municípios.",
                    "period": "",
                    "scale": "",
                    "system_coordinator": "",
                    "cartographic_projection": "",
                    "cod_caracter": "",
                    "fonte": "",
                    "contato": "lapig.cepf@gmail.com"
                  },
                  "columnsCSV": "area_km2, year"
                 }
							]
            },
            {
							"id": "mapa_alertas_desmatamento",
							"label": "Alertas Desmatamento",
							"visible": false,
              "selectedType": 'alertas_desmatamento_deter',
              "downloadSHP": false,
              "downloadCSV": true, 
							"types": [
								{
                  "value": "alertas_desmatamento_deter", 
                  "Viewvalue": "DETER", 
                  "visible": false, 
                  "opacity": 1,
                  "regionFilter": true,
                  "order": 1,
                  "typeLabel": "Fonte",
                  "metadados": {
                    "title": "",
                    "description": "",
                    "format": "Shapefile (*.SHP), com arquivos complementares (*.PRJ, *DBF, *.SHX, *.SBX, *MAP). Comma-separated values (*.CSV).",
                    "region": "Bioma Cerrado, permitindo analisar as classes de uso do solo por outras regiões de interesse como: estados e municípios.",
                    "period": "",
                    "scale": "",
                    "system_coordinator": "",
                    "cartographic_projection": "",
                    "cod_caracter": "",
                    "fonte": "",
                    "contato": "lapig.cepf@gmail.com"
                  },
                  "columnsCSV": "area_km2, view_date, created_da, year"
                }
							]
            },
            {
							"id": "mapa_queimadas",
							"label": "Áreas de Queimadas",
							"visible": false,
              "selectedType": 'queimadas_lapig',
              "downloadSHP": false,
              "downloadCSV": true,
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
                  ],
                  "metadados": {
                    "title": "Áreas de Queimadas do Cerrado",
                    "description": "Dados de queimadas ocorridos no Brasil, para o período de 2002 à 2018, produzidos a partir de imagens MODIS (MCD45A1).",
                    "format": "Shapefile (*.SHP), com arquivos complementares (*.PRJ, *DBF, *.SHX, *.SBX, *MAP). Comma-separated values (*.CSV).",
                    "region": "Bioma Cerrado, permitindo analisar as classes de uso do solo por outras regiões de interesse como: estados e municípios.",
                    "period": "2000 a 2018.",
                    "scale": "1:500.000 ",
                    "system_coordinator": "Superfície de referência SIRGAS 2000, sistema de coordenadas em graus.",
                    "cartographic_projection": "Universal de Mercator.",
                    "cod_caracter": "Latin 1.",
                    "fonte": "LAPIG / UFG.",
                    "contato": "lapig.cepf@gmail.com"
                  },
                  "columnsCSV": "area_km2, burndate, year"
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
              "downloadSHP": true,
              "downloadCSV": true, 
							"types": [
								{
                  "value": "pontos_campo_parada", 
                  "Viewvalue": "Parada", 
                  "visible": false, 
                  "opacity": 1,
                  "regionFilter": true,
                  "order": 1,
                  "typeLabel": "Tipo",
                  "metadados": {
                    "title": "Pontos de Campo",
                    "description": "Com o propósito de validar mapas produzidos pelo LAPIG-UFG no âmbito do MapBiomas e de subsidiar pesquisas voltadas à qualificação das pastagens brasileiras, seis atividades de campo foram realizadas durante os anos de 2017 e 2018. Um grande conjunto de pontos georreferenciados foi formado e organizado com dados de uso/cobertura do solo e indicativos de qualidade das pastagens.",
                    "format": "Shapefile (*.SHP), com arquivos complementares (*.PRJ, *DBF, *.SHX, *.SBX, *MAP). Comma-separated values (*.CSV).",
                    "region": "Bioma Cerrado, permitindo analisar as classes de uso do solo por outras regiões de interesse como: estados e municípios.",
                    "period": "2017",
                    "scale": "1:250.000",
                    "system_coordinator": "Superfície de referência SIRGAS 2000, sistema de coordenadas em graus.",
                    "cartographic_projection": "Universal de Mercator.",
                    "cod_caracter": "Latin 1.",
                    "fonte": "Laboratório de Processamento de Imagens e Geoprocessamento – Lapig (geração do dado). Projeto Spatial metrics and baselines of degradation patterns and provision of ecosystem services by pastures in Brazil. (viabilizador).",
                    "contato": "lapig.cepf@gmail.com"
                  },
                  "columnsCSV": "cobertura, data, periodo, horario, latitude, longitude, altura, homoge, invasoras, gado, qtd_cupins, forrageira, cultivo, solo_exp, obs, condicao"
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
                  "metadados": {
                    "title": "Pontos de Campo",
                    "description": "Com o propósito de validar mapas produzidos pelo LAPIG-UFG no âmbito do MapBiomas e de subsidiar pesquisas voltadas à qualificação das pastagens brasileiras, seis atividades de campo foram realizadas durante os anos de 2017 e 2018. Um grande conjunto de pontos georreferenciados foi formado e organizado com dados de uso/cobertura do solo e indicativos de qualidade das pastagens.",
                    "format": "Shapefile (*.SHP), com arquivos complementares (*.PRJ, *DBF, *.SHX, *.SBX, *MAP). Comma-separated values (*.CSV).",
                    "region": "Bioma Cerrado, permitindo analisar as classes de uso do solo por outras regiões de interesse como: estados e municípios.",
                    "period": "2017",
                    "scale": "1:250.000",
                    "system_coordinator": "Superfície de referência SIRGAS 2000, sistema de coordenadas em graus.",
                    "cartographic_projection": "Universal de Mercator.",
                    "cod_caracter": "Latin 1.",
                    "fonte": "Laboratório de Processamento de Imagens e Geoprocessamento – Lapig (geração do dado). Projeto Spatial metrics and baselines of degradation patterns and provision of ecosystem services by pastures in Brazil. (viabilizador).",
                    "contato": "lapig.cepf@gmail.com"
                  },
                  "columnsCSV": "cobertura, data, periodo, horario, latitude, longitude, altura, homoge, invasoras, gado, qtd_cupins, forrageira, cultivo, solo_exp, obs, condicao"
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
              "downloadSHP": true,
              "downloadCSV": true,
							"types": [
								{
                  "value": "pontos_tvi_treinamento", 
                  "Viewvalue": "Treinamento", 
                  "visible": false, 
                  "opacity": 1,
                  "regionFilter": true,
                  "order": 1,
                  "typeLabel": "Tipo",
                  "metadados": {
                    "title": "Pontos Visualmente Inspecionados",
                    "description": "Conjunto georreferenciado de pontos para todo o território brasileiro, sendo atribuídas classes de uso e cobertura do solo referente a cada ano no período de 1985 a 2017. Foram utilizadas imagens Landsat provenientes dos sensores TM, ETM+ e OLI. Buscou-se também abordar os critérios adotados, dificuldades e especificidades encontradas quanto a interpretação de imagens em cada um dos 6 biomas brasileiros.",
                    "format": "Shapefile (*.SHP), com arquivos complementares (*.PRJ, *DBF, *.SHX, *.SBX, *MAP). Comma-separated values (*.CSV).",
                    "region": "Bioma Cerrado, permitindo analisar as classes de uso do solo por outras regiões de interesse como: estados e municípios.",
                    "period": "1985 à 2017.",
                    "scale": "não se aplica",
                    "system_coordinator": "Superfície de referência SIRGAS 2000, sistema de coordenadas em graus.",
                    "cartographic_projection": "Universal de Mercator.",
                    "cod_caracter": "Latin 1.",
                    "fonte": "Laboratório de Processamento de Imagens e Geoprocessamento – Lapig (geração do dado). Projeto Spatial metrics and baselines of degradation patterns and provision of ecosystem services by pastures in Brazil. (viabilizador).",
                    "contato": "lapig.cepf@gmail.com"
                  },
                  "columnsCSV": "index, lon, lat, cons_1985, cons_1986, cons_1987, cons_1988, cons_1989, cons_1990, cons_1991, cons_1992, cons_1993, cons_1994, cons_1995, cons_1996, cons_1997, cons_1998, cons_1999, cons_2000, cons_2001, cons_2002, cons_2003, cons_2004, cons_2005, cons_2006, cons_2007, cons_2008, cons_2009, cons_2010, cons_2011, cons_2012, cons_2013, cons_2014, cons_2015, cons_2016, cons_2017, pointedite"
                },
                {
                  "value": "pontos_tvi_validacao", 
                  "Viewvalue": "Validação", 
                  "visible": false, 
                  "opacity": 1,
                  "regionFilter": true,
                  "order": 1,
                  "typeLabel": "Tipo",
                  "metadados": {
                    "title": "Pontos Visualmente Inspecionados",
                    "description": "Conjunto georreferenciado de pontos para todo o território brasileiro, sendo atribuídas classes de uso e cobertura do solo referente a cada ano no período de 1985 a 2017. Foram utilizadas imagens Landsat provenientes dos sensores TM, ETM+ e OLI. Buscou-se também abordar os critérios adotados, dificuldades e especificidades encontradas quanto a interpretação de imagens em cada um dos 6 biomas brasileiros.",
                    "format": "Shapefile (*.SHP), com arquivos complementares (*.PRJ, *DBF, *.SHX, *.SBX, *MAP). Comma-separated values (*.CSV).",
                    "region": "Bioma Cerrado, permitindo analisar as classes de uso do solo por outras regiões de interesse como: estados e municípios.",
                    "period": "1985 à 2017.",
                    "scale": "não se aplica",
                    "system_coordinator": "Superfície de referência SIRGAS 2000, sistema de coordenadas em graus.",
                    "cartographic_projection": "Universal de Mercator.",
                    "cod_caracter": "Latin 1.",
                    "fonte": "Laboratório de Processamento de Imagens e Geoprocessamento – Lapig (geração do dado). Projeto Spatial metrics and baselines of degradation patterns and provision of ecosystem services by pastures in Brazil. (viabilizador).",
                    "contato": "lapig.cepf@gmail.com"
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
              "Viewvalue": "Biomas", 
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
              "value": "municipios_cerrado",
              "Viewvalue": "Municípios", 
              "visible": false, 
              "layer_limits": true,
              "opacity": 1
            },
            {
              "value": "limites_areas_chave_biodiversidade",
              "Viewvalue": "Áreas Chaves de Biodiversidade - KBA's",
              "visible": false,
              "layer_limits": true,
              "opacity": 1
            },
            {
              "value": "limites_assentamentos",
              "Viewvalue": "Assentamentos",
              "visible": false,
              "layer_limits": true,
              "opacity": 1
            },
            {
              "value": "limites_cartas_ibge",
              "Viewvalue": "Cartas IBGE",
              "visible": false,
              "layer_limits": true,
              "opacity": 1
            },
            {
              "value": "limites_corredores_prioritarios_cepf",
              "Viewvalue": "Corredores Prioritários CEPF",
              "visible": false,
              "layer_limits": true,
              "opacity": 1
            },
            {
              "value": "limites_regioes_hidrograficas",
              "Viewvalue": "Regiões Hidrográficas",
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
              "Viewvalue": "Unidades de Conservação Integral",
              "visible": false,
              "layer_limits": true,
              "opacity": 1
            },
            {
              "value": "limites_unidades_planejamento_hidrico",
              "Viewvalue": "Unidades de Planejamento Hídrico",
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
