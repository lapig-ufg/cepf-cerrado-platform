module.exports = function(app) {

	var Dictionary = {};

	Dictionary.descriptor = function(request, response) {
		var data = {
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

		response.send(data)
		response.end()
	}

	return Dictionary;

}
