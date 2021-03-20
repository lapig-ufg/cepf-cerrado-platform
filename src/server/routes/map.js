module.exports = function (app) {

	var dataInjector = app.middleware.dataInjector;
	var map = app.controllers.map;

	app.get('/service/map/descriptor', map.descriptor);
	app.get('/service/map/extent', dataInjector, map.extent);
	app.get('/service/map/search', dataInjector, map.search);
	app.get('/service/map/fieldPoints', dataInjector, map.fieldPoints);
	app.get('/service/map/downloadCSV', dataInjector, map.downloadCSV);
	app.get('/service/map/downloadSHP', map.downloadSHP);
	app.post('/service/map/downloadSHPAuto', map.downloadSHPAuto);
	app.get('/service/map/searchregion', dataInjector);
}
