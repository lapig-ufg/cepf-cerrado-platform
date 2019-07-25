module.exports = function(app) {

	var Dictionary = {};

	Dictionary.descriptor = function(request, response) {
		var data = {
			"disableYears": {
				'pasture_degraded': true
			},
			"groups": [
				{
					"label": "Agropecuária",
					"id": "agropecuaria",
					"layerDefault": 'pasture',
					"layers": [
						{
							"id": "mapa_pastagem",
							"label": "Pastagem Lapig",
							"visible": true,
							"url": "?layers=pasture&MSFILTER=year=2018 AND bioma='CERRADO'&mode=tile&tile={x}+{y}+{z}&tilemode=gmap&map.imagetype=png",
							"types": [
								{"value": "pasture", "Viewvalue": "Regular", "visible": true, "opacity": 1, "layerfilter": "yearsAndRegions", "yearSelected": 2018},
								{"value": "pasture_degraded", "Viewvalue": "Degradada", "visible": false, "opacity": 1, "layerfilter": "pasture_degraded"}
							],
							"selectedType": 'pasture',
							"yearSelected": 2018,
							"years": [
								{"value": 1985, "Viewvalue": 1985},
								{"value": 1986, "Viewvalue": 1986},
								{"value": 1987, "Viewvalue": 1987},
								{"value": 1988, "Viewvalue": 1988},
								{"value": 1989, "Viewvalue": 1989},
								{"value": 1990, "Viewvalue": 1990},
								{"value": 1991, "Viewvalue": 1991},
								{"value": 1992, "Viewvalue": 1992},
								{"value": 1993, "Viewvalue": 1993},
								{"value": 1994, "Viewvalue": 1994},
								{"value": 1995, "Viewvalue": 1995},
								{"value": 1996, "Viewvalue": 1996},
								{"value": 1997, "Viewvalue": 1997},
								{"value": 1998, "Viewvalue": 1998},
								{"value": 1999, "Viewvalue": 1999},
								{"value": 2000, "Viewvalue": 2000},
								{"value": 2001, "Viewvalue": 2001},
								{"value": 2002, "Viewvalue": 2002},
								{"value": 2003, "Viewvalue": 2003},
								{"value": 2004, "Viewvalue": 2004},
								{"value": 2005, "Viewvalue": 2005},
								{"value": 2006, "Viewvalue": 2006},
								{"value": 2007, "Viewvalue": 2007},
								{"value": 2008, "Viewvalue": 2008},
								{"value": 2009, "Viewvalue": 2009},
								{"value": 2010, "Viewvalue": 2010},
								{"value": 2011, "Viewvalue": 2011},
								{"value": 2012, "Viewvalue": 2012},
								{"value": 2013, "Viewvalue": 2013},
								{"value": 2014, "Viewvalue": 2014},
								{"value": 2015, "Viewvalue": 2015},
								{"value": 2016, "Viewvalue": 2016},
								{"value": 2017, "Viewvalue": 2017},
								{"value": 2018, "Viewvalue": 2018}
							]
						},
						{
							"id": "mapa_pecuaria_censitaria",
							"label": "Pecuária Censitária",
							"visible": false,
							"url": "?layers=pasture&MSFILTER=year=2018 AND bioma='CERRADO'&mode=tile&tile={x}+{y}+{z}&tilemode=gmap&map.imagetype=png",
							"types": [
								{"value": "lotacao_bovina_regions", "Viewvalue": "Rebanho Bovino", "visible": false, "opacity": 1, "layerfilter": "yearsAndRegions", "yearSelected": 2017}
							],
							"selectedType": 'lotacao_bovina_regions',
							"yearSelected": 2017,
							"years": [
								{"value": 1985, "Viewvalue": 1985},
								{"value": 1986, "Viewvalue": 1986},
								{"value": 1987, "Viewvalue": 1987},
								{"value": 1988, "Viewvalue": 1988},
								{"value": 1989, "Viewvalue": 1989},
								{"value": 1990, "Viewvalue": 1990},
								{"value": 1991, "Viewvalue": 1991},
								{"value": 1992, "Viewvalue": 1992},
								{"value": 1993, "Viewvalue": 1993},
								{"value": 1994, "Viewvalue": 1994},
								{"value": 1995, "Viewvalue": 1995},
								{"value": 1996, "Viewvalue": 1996},
								{"value": 1997, "Viewvalue": 1997},
								{"value": 1998, "Viewvalue": 1998},
								{"value": 1999, "Viewvalue": 1999},
								{"value": 2000, "Viewvalue": 2000},
								{"value": 2001, "Viewvalue": 2001},
								{"value": 2002, "Viewvalue": 2002},
								{"value": 2003, "Viewvalue": 2003},
								{"value": 2004, "Viewvalue": 2004},
								{"value": 2005, "Viewvalue": 2005},
								{"value": 2006, "Viewvalue": 2006},
								{"value": 2007, "Viewvalue": 2007},
								{"value": 2008, "Viewvalue": 2008},
								{"value": 2009, "Viewvalue": 2009},
								{"value": 2010, "Viewvalue": 2010},
								{"value": 2011, "Viewvalue": 2011},
								{"value": 2012, "Viewvalue": 2012},
								{"value": 2013, "Viewvalue": 2013},
								{"value": 2014, "Viewvalue": 2014},
								{"value": 2015, "Viewvalue": 2015},
								{"value": 2016, "Viewvalue": 2016},
								{"value": 2017, "Viewvalue": 2017}
							]
						}
					]
				}
			],
			"limits": [
				{
					"id": "limits_bioma",
					"types": [
						{"value": "biomas", "Viewvalue": "Cerrado", "visible": true, "opacity": 1, "layerfilter": "biomaCerrado"},
						{"value": "estados", "Viewvalue": "Estados", "visible": false, "opacity": 1, "layerfilter": "biomaCerrado"},
						{"value": "municipios", "Viewvalue": "Municípios", "visible": false, "opacity": 1, "layerfilter": "biomaCerrado"}
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
