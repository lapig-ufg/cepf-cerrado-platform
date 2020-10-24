module.exports = function (app) {

    var Internal = {}
    var Query = {};

    Query.defaultParams = {
    }


    Query.regionreport = function (params) {

        var type = params['type']
        var region = params['region']

        let regionfilter = ""
        if (type.toLowerCase() == "municipio")
            regionfilter = "municipio"
        else if (type.toLowerCase() == "estado")
            regionfilter = "uf"
        else
            return ''

        console.log(type, region, regionfilter)

        return [
            {
                id: 'box_region',
                sql: "select rect_bbox(geometry) as bbox, text from regions_geom_cerrado where type ilike '" + regionfilter + "' AND text ilike '" + region + "' ",
                mantain: true
            }
        ]

    };




    return Query;

}