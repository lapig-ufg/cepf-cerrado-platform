module.exports = function (app) {
    var Controller = {}
    var Internal = {}

    Controller.regionreport = function (request, response) {

        var type = request.param('type')
        var region = request.param('region')

        let sizeSrc = 768;
        let sizeThumb = 400;

        var queryBox = request.queryResult['box_region'];

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
        for (let y = 1985; y <= 2019; y++) {
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
            legendMapbiomas: app.config.ows_host + "/ows?TRANSPARENT=TRUE&VERSION=1.1.1&SERVICE=WMS&REQUEST=GetLegendGraphic&layer=uso_solo_mapbiomas&format=image/png",
            legendRegion: app.config.ows_host + "/ows?TRANSPARENT=TRUE&VERSION=1.1.1&SERVICE=WMS&REQUEST=GetLegendGraphic&layer=regions_cepf_realce_maior&format=image/png",
            legendTerraclass: app.config.ows_host + "/ows?TRANSPARENT=TRUE&VERSION=1.1.1&SERVICE=WMS&REQUEST=GetLegendGraphic&layer=uso_solo_terraclass&format=image/png",
        }

        let box = anual_statistic[0].box;
        let metadata = {
            region_display: queryBox[0]['text'] + (queryBox[0]['type'] == 'municipio' ? ' - ' + queryBox[0]['uf'] : ''),
            area: queryBox[0]['area']
        }

        let urlTerraclass = {
            imgSmall: app.config.ows_host + "/ows?SERVICE=WMS&REQUEST=GetMap&VERSION=1.1.1&layers=uso_solo_terraclass,regions_cepf_realce_maior&bbox=" + box + "&TRANSPARENT=TRUE&srs=EPSG:4674&width=" +
                sizeThumb + "&height=" + sizeThumb + "&format=image/png&styles=&ENHANCE=TRUE&MSFILTER=" + regionfilter.msfilter + " ilike '" + region + "'&MSREGION=type='" + regionfilter.msregion + "' and text ilike '" + region + "'",
            imgLarge: app.config.ows_host + "/ows?SERVICE=WMS&REQUEST=GetMap&VERSION=1.1.1&layers=uso_solo_terraclass,regions_cepf_realce_maior&bbox=" + box + "&TRANSPARENT=TRUE&srs=EPSG:4674&width=" +
                sizeSrc + "&height=" + sizeSrc + "&format=image/png&styles=&ENHANCE=TRUE&MSFILTER=" + regionfilter.msfilter + " ilike '" + region + "'&MSREGION=type='" + regionfilter.msregion + "' and text ilike '" + region + "'",
        };

        var queryResult = request.queryResult['queimadas']

        var queimadasByYear = []
        queryResult.forEach(function (row) {

            var year = Number(row['year'])
            var area = Number(row['area_queimada'])

            queimadasByYear.push({
                'area_queimada': area,
                'year': year
            })
        });

        var queryResult = request.queryResult['pastagem']

        var pastagemByYear = []
        queryResult.forEach(function (row) {

            var year = Number(row['year'])
            var area = Number(row['area_pastagem'])

            queimadasByYear.push({
                'area_pastagem': area,
                'year': year
            })
        });

        const groupByKey = (list, key, { omitKey = false }) => list.reduce((hash, { [key]: value, ...rest }) => ({ ...hash, [value]: (hash[value] || []).concat(omitKey ? { ...rest } : { [key]: value, ...rest }) }), {})

        // Group by color as key to the person array
        const areasGroupedByYear = groupByKey(queimadasByYear, 'year', { omitKey: true });
        // const areasGroupedByYear = groupBy(queimadasByYear, 'year');
        let arrayAreasGrouped = []
        for (let key of Object.keys(areasGroupedByYear)) {
            arrayAreasGrouped.push({
                year: key,
                area_pastagem: areasGroupedByYear[key][0].hasOwnProperty('area_pastagem') ? areasGroupedByYear[key][0]['area_pastagem'] : areasGroupedByYear[key][1]['area_pastagem'],
                area_queimada: areasGroupedByYear[key][0].hasOwnProperty('area_queimada') ? areasGroupedByYear[key][0]['area_queimada'] : null
            })
        }

        let graphQueimadasPastagem = {
            "title": "Dados",
            "type": "line",
            "pointStyle": 'rect',
            "options": {
                title: {
                    display: false,
                },
                legend: {
                    labels: {
                        usePointStyle: true,
                        fontColor: "#85560c"
                    },
                    position: "bottom"
                },
                tooltips: {}
            },
            "data": {
                labels: arrayAreasGrouped.map(e => e.year),
                datasets: [
                    {
                        data: arrayAreasGrouped.map(e => e.area_pastagem),
                        borderColor: 'rgb(231, 187, 2)',
                        label: "Area de Pastagem",
                        fill: false
                    },
                    {
                        data: arrayAreasGrouped.map(e => e.area_queimada),
                        borderColor: 'rgb(110, 101, 101)',
                        label: "Area Queimada",
                        fill: false
                    }
                ]
            }
        }


        response.send({
            anual_statistic: anual_statistic,
            legendas: legendas,
            terraclass: urlTerraclass,
            metadata: metadata,
            chart_pastagem_queimadas_peryear: graphQueimadasPastagem,
            table_pastagem_queimadas_peryear: arrayAreasGrouped,
        });
        response.end();

    };

    return Controller;

}