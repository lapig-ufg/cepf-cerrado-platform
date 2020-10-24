module.exports = function (app) {
    var Controller = {}
    var Internal = {}

    Controller.regionreport = function (request, response) {

        var type = request.param('type')
        var region = request.param('region')

        let sizeSrc = 768;
        let sizeThumb = 400;

        var queryBox = request.queryResult['box_region'];

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
            legendMapbiomas: app.config.ows_host + "/ows?TRANSPARENT=TRUE&VERSION=1.1.1&SERVICE=WMS&REQUEST=GetLegendGraphic&layer=uso_solo_mapbiomas&format=image/png",
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