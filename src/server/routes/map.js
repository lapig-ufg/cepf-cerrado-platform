module.exports = function (app) {

	var map = app.controllers.map;
	
	app.get('/service/map/extent', map.extent);
	app.get('/service/map/search', map.search);
}
