module.exports = function (app) {

    var Internal = {}
    var Query = {};

    Query.initialanalysis = function (params) {

        return [
            {
                id: 'regions_pershape',
                sql: "select s.text, s.type, s.value, s.uf from search s inner join regions_geom_cerrado r on r.text = s.value INNER JOIN upload_shapes up on ST_Intersects(up.geom, ST_Transform(r.geometry,4674) ) where s.type not in ('região de fronteira', 'bioma') AND up.token= ${token} order by 1 asc",
                mantain: true
            },
            {
                id: 'area_upload',
                sql: "select token, SUM((ST_AREA(geom::GEOGRAPHY) / 1000000.0)*100.0) as area_upload from upload_shapes where token= ${token} group by 1",
                mantain: true
            },
            {
                id: 'geojson_upload',
                sql: "select  ST_ASGEOJSON(ST_Transform(ST_Multi(ST_Union(geom)), 4674)) as geojson from upload_shapes where token= ${token} ",
                mantain: true
            }

        ]

    }


    Query.analysisarea = function (params) {

        var token = params['token']
        console.log(token)
        return [
            {
                id: 'queimadas',
                sql: "SELECT p.year, SUM((ST_AREA(ST_Intersection(p.geom,up.geom)::GEOGRAPHY) / 1000000.0)*100.0) as area_queimada FROM queimadas_lapig p INNER JOIN upload_shapes up on ST_INTERSECTS(p.geom, up.geom) where p.year IS NOT NULL and up.token= ${token} GROUP BY 1 order by 1 desc",
                mantain: true
            },
            {
                id: 'pastagem',
                sql: "SELECT p.year, SUM((ST_AREA(ST_Intersection(p.wkb_geometry,up.geom)::GEOGRAPHY) / 1000000.0)*100.0) as area_pastagem FROM pasture p INNER JOIN upload_shapes up on ST_INTERSECTS(p.wkb_geometry, up.geom) where p.year IS NOT NULL and up.token= ${token} GROUP BY 1 order by 1 desc"
            },
            {
                id: 'terraclass',
                sql: "SELECT b.name as lulc, b.color as color, SUM((ST_AREA(safe_intersection(p.geom,up.geom)::GEOGRAPHY) / 1000000.0)*100.0) as area_lulc FROM uso_solo_terraclass p INNER JOIN graphic_colors b on unaccent(b.name) ilike unaccent(p.classe) AND b.table_rel = 'uso_solo_terraclass' " +
                    " INNER JOIN upload_shapes up on ST_INTERSECTS(p.geom, up.geom) " +
                    " where up.token= ${token} and ST_ISVALID(p.geom) " +
                    " GROUP BY 1,2 ORDER BY 3 DESC",
                mantain: true
            }
        ]
    }

    Query.findgeojsonbytoken = function (params) {
        return [
            {
                id: 'area_upload',
                sql: "select token, SUM((ST_AREA(geom::GEOGRAPHY) / 1000000.0)*100.0) as area_upload from upload_shapes where token= ${token} group by 1",
                mantain: true
            },
            {
                id: 'geojson_upload',
                sql: "select ST_ASGEOJSON(ST_Transform(ST_Multi(ST_Union(geom)), 4674)) as geojson from upload_shapes where token= ${token}",
                mantain: true
            }

        ]
    }


    return Query;

};