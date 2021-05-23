module.exports = function (app) {

    var Internal = {}
    var Query = {};

    Query.defaultParams = {
    }


    Query.regionreport = function (params) {

        var type = params['type']
        var region = params['region'].toUpperCase()

        let regionfilter = {
            box_region: "",
            other: ""
        }
        if (type.toLowerCase() == "municipio") {
            regionfilter = {
                box_region: "municipio",
                other: "cd_geocmu"
            }
        }
        else if (type.toLowerCase() == "estado") {
            regionfilter = {
                box_region: "estado",
                other: "uf"
            }
        }
        else
            return ''

        return [
            {
                id: 'box_region',
                sql: "select rect_bbox(r.geometry) as bbox, s.text, s.type, s.value, s.uf, (ST_AREA(r.geometry::GEOGRAPHY) / 1000000.0) * 100.0 as area from search s inner join regions_geom_cerrado r on r.text = s.value where s.type not in ('região de fronteira', 'bioma') AND r.type ilike '" + regionfilter.box_region + "' AND r.text ilike '" + region + "' ",
                mantain: true
            },
            {
                id: 'queimadas',
                sql: "SELECT p.year, SUM(p.area_km2)*100.0 as area_queimada FROM bi_ce_queimadas_250_lapig p where p.year IS NOT NULL AND " + regionfilter.other + "='" + region + "' GROUP BY 1 order by 1 desc",
                mantain: true
            },
            {
                id: 'pastagem',
                sql: "SELECT p.year, SUM(p.area_ha) as area_pastagem FROM pasture p where p.year IS NOT NULL AND " + regionfilter.other + "='" + region + "' GROUP BY 1 order by 1 desc"
            },

        ]

    };




    return Query;

}