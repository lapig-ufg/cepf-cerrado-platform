module.exports = function (app) {

	var filesAccepted = app.middleware.file;
	var uploader = app.controllers.upload;
	var dataInjector = app.middleware.dataInjector

	app.post('/service/upload/spatial-file', filesAccepted, uploader.getGeoJson);
	app.get('/service/upload/initialanalysis', dataInjector, uploader.initialanalysis);
	app.get('/service/upload/analysisarea', dataInjector, uploader.analysisarea);
	app.get('/service/upload/findgeojsonbytoken', dataInjector, uploader.findGeoJsonByToken);
	app.get('/service/upload/queimadas', dataInjector, uploader.queimadas);
	app.get('/service/upload/pastagem', dataInjector, uploader.pastagem);
	app.get('/service/upload/terraclass', dataInjector, uploader.terraclass);
	app.get('/service/upload/mapbiomas', dataInjector, uploader.mapbiomas);
	app.get('/service/upload/prodes', dataInjector, uploader.prodes);
}
