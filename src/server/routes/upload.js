module.exports = function (app) {

	var filesAccepted = app.middleware.file;
	var uploader = app.controllers.upload;
	var dataInjector = app.middleware.dataInjector

	app.post('/service/upload/spatial-file', filesAccepted, uploader.getGeoJson);
	app.get('/service/upload/initialanalysis', dataInjector, uploader.initialanalysis);
	app.get('/service/upload/analysisarea', dataInjector, uploader.analysisarea);
	app.get('/service/upload/findgeojsonbytoken', dataInjector, uploader.findGeoJsonByToken);
}
