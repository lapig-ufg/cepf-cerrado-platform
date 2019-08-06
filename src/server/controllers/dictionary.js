module.exports = function(app) {

	var Dictionary = {};

	Dictionary.descriptor = function(request, response) {
		
    var dataCEPF = {
      "regionFilterDefault": "&MSFILTER=bioma='CERRADO'",
      "groups": [
        {
          "id": "agropecuaria",
          "label": "Agropecuária", 
          "group_expanded": true,
          "layers": [
            {
              "id": "mapa_pastagem",
              "label": "Pastagem Lapig",
              "visible": true,
              "selectedType": 'pasture', 
              "types": [
                {
                  "value": "pasture", 
                  "Viewvalue": "Regular", 
                  "visible": true, 
                  "opacity": 1,
                  "timeLabel": "Ano",
                  "timeSelected": "year=2018",
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
                   "visible": false, 
                   "opacity": 1, 
                   "layerfilter": "AND category='1'"
                 }
              ]
            },
            {
              "id": "mapa_pecuaria_censitaria",
              "label": "Pecuária Censitária",
              "visible": false,
              "selectedType": 'lotacao_bovina_regions',
              "types": [
                {
                  "value": "lotacao_bovina_regions", 
                  "Viewvalue": "Rebanho Bovino", 
                  "visible": false, 
                  "opacity": 1,
                  "timeLabel": "Ano",
                  "timeSelected": "year=2017",
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
                    {"value": "year=2017", "Viewvalue": 2017}
                  ]
                }
              ]
            }
          ]
          },
        {
          "id": "desmatamento_queimadas",
          "label": "Desmatamentos/Queimadas",
          "group_expanded": false,
          "layers":[]
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
              "viewValue": "Landsat - 2017",
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
            }
          ],
          "selectedType": 'biomas',
        }
      ]
    }

    var data = {
      "regionFilterDefault": "",
			"groups": [
				{
          "id": "desmatamento",
          "label": "Desmatamento", 
          "group_expanded": true,
					"layers": [
						{
							"id": "desmatamento",
							"label": "Desmatamentos - PRODES-Cerrado",
							"visible": true,
              "selectedType": 'bi_ce_prodes_desmatamento_100_fip', 
							"types": [
								{
                  "value": "bi_ce_prodes_desmatamento_100_fip", 
                  "Viewvalue": "Polígonos", 
                  "opacity": 1,
                  "order": 1,
                  "timeLabel": "Período",
                  "timeSelected": "year=2018",
                  "timeHandler": "msfilter",
                  "times": [
                     { "value": "year=2002", "Viewvalue": "2000/2002" } ,
                     { "value": "year=2004", "Viewvalue": "2002/2004" } ,
                     { "value": "year=2006", "Viewvalue": "2004/2006" } ,
                     { "value": "year=2008", "Viewvalue": "2006/2008" } ,
                     { "value": "year=2010", "Viewvalue": "2008/2010" } ,
                     { "value": "year=2012", "Viewvalue": "2010/2012" } ,
                     { "value": "year=2013", "Viewvalue": "2012/2013" } ,
                     { "value": "year=2014", "Viewvalue": "2013/2014" } ,
                     { "value": "year=2015", "Viewvalue": "2014/2015" } ,
                     { "value": "year=2016", "Viewvalue": "2015/2016" } ,
                     { "value": "year=2017", "Viewvalue": "2016/2017" } ,
                     { "value": "year=2018", "Viewvalue": "2017/2018" }
                  ]
                 }
							]
						},
            {
              "id": "",
              "label": "Susceptibilidade a Desmatamentos",
              "visible": false,
              "selectedType": 'bi_ce_susceptibilidade_desmatamento_maiores_100_na_lapig', 
              "types": [
                {
                  "value": "bi_ce_susceptibilidade_desmatamento_menores_100_na_lapig", 
                  "Viewvalue": "Polígonos pequenos (< 0.5 km2)", 
                  "order": 5,
                  "opacity": 1
                 },
                 {
                  "value": "bi_ce_susceptibilidade_desmatamento_maiores_100_na_lapig", 
                  "Viewvalue": "Polígonos grandes (> 0.5 km2)", 
                  "order": 5,
                  "opacity": 1
                 }
              ]
            }
					]
        },
        {
          "id": "uso_da_terra",
          "label": "Uso da Terra", 
          "group_expanded": false,
          "layers": [
            {
              "id": "antropico",
              "label": "Antrópico - PRODES-Cerrado",
              "visible": false,
              "selectedType": 'bi_ce_prodes_antropico_100_fip', 
              "types": [
                {
                  "value": "bi_ce_prodes_antropico_100_fip", 
                  "Viewvalue": "Polígonos", 
                  "opacity": 0.8,
                  "order": 2,
                  "timeLabel": "Período",
                  "timeSelected": "year < 2018",
                  "timeHandler": "msfilter",
                  "times": [
                     { "value": "year < 2002", "Viewvalue": "até 2002" } ,
                     { "value": "year < 2004", "Viewvalue": "até 2004" } ,
                     { "value": "year < 2006", "Viewvalue": "até 2006" } ,
                     { "value": "year < 2008", "Viewvalue": "até 2008" } ,
                     { "value": "year < 2010", "Viewvalue": "até 2010" } ,
                     { "value": "year < 2012", "Viewvalue": "até 2012" } ,
                     { "value": "year < 2013", "Viewvalue": "até 2013" } ,
                     { "value": "year < 2014", "Viewvalue": "até 2014" } ,
                     { "value": "year < 2015", "Viewvalue": "até 2015" } ,
                     { "value": "year < 2016", "Viewvalue": "até 2016" } ,
                     { "value": "year < 2017", "Viewvalue": "até 2017" } ,
                     { "value": "year < 2018", "Viewvalue": "até 2018" }
                  ]
                 }
              ]
            }
          ]
        },
        {
          "id": "Imagens",
          "label": "Acervo de Imagens",
          "group_expanded": false,
          "layers":[
            {
              "id": "satelite",
              "label": "Mosaico de Imagens",
              "visible": true,
              "selectedType": 'landsat', 
              "types": [
                {
                  "value": "landsat", 
                  "Viewvalue": "Landsat",
                  "order": 10,
                  "opacity": 1,
                  "timeLabel": "Ano",
                  "timeSelected": "bi_ce_mosaico_landsat_completo_30_2018_fip",
                  "timeHandler": "layername",
                  "times": [
                     { "value": 'bi_ce_mosaico_landsat_completo_30_2000_fip', "Viewvalue": "2000" } ,
                     { "value": 'bi_ce_mosaico_landsat_completo_30_2002_fip', "Viewvalue": "2002" } ,
                     { "value": 'bi_ce_mosaico_landsat_completo_30_2004_fip', "Viewvalue": "2004" } ,
                     { "value": 'bi_ce_mosaico_landsat_completo_30_2006_fip', "Viewvalue": "2006" } ,
                     { "value": 'bi_ce_mosaico_landsat_completo_30_2008_fip', "Viewvalue": "2008" } ,
                     { "value": 'bi_ce_mosaico_landsat_completo_30_2010_fip', "Viewvalue": "2010" } ,
                     { "value": 'bi_ce_mosaico_landsat_completo_30_2012_fip', "Viewvalue": "2012" } ,
                     { "value": 'bi_ce_mosaico_landsat_completo_30_2013_fip', "Viewvalue": "2013" } ,
                     { "value": 'bi_ce_mosaico_landsat_completo_30_2014_fip', "Viewvalue": "2014" } ,
                     { "value": 'bi_ce_mosaico_landsat_completo_30_2015_fip', "Viewvalue": "2015" } ,
                     { "value": 'bi_ce_mosaico_landsat_completo_30_2016_fip', "Viewvalue": "2016" } ,
                     { "value": 'bi_ce_mosaico_landsat_completo_30_2017_fip', "Viewvalue": "2017" } ,
                     { "value": 'bi_ce_mosaico_landsat_completo_30_2018_fip', "Viewvalue": "2018" }
                  ]
                },
                {
                  "value": "sentinel", 
                  "Viewvalue": "Sentinel",
                  "order": 10,
                  "opacity": 1,
                  "timeLabel": "Ano",
                  "timeSelected": "bi_ce_mosaico_sentinel_10_2017_lapig",
                  "timeHandler": "layername",
                  "times": [
                     { "value": 'bi_ce_mosaico_sentinel_10_2016_lapig', "Viewvalue": "2016" } ,
                     { "value": 'bi_ce_mosaico_sentinel_10_2017_lapig', "Viewvalue": "2017" } ,
                  ]
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
            }
					],
					"selectedType": 'biomas',
				}
			]
		}

		response.send(data)
		response.end()
	}

	return Dictionary;

}
