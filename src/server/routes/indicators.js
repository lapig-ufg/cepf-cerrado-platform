module.exports = function (app) {

	var dataInjector = app.middleware.dataInjector;
	var indicators = app.controllers.indicators;

	app.get('/service/charts/lulc', dataInjector, indicators.chartslulc);
	app.get('/service/charts/farming', dataInjector, indicators.chartsFarming);
	app.get('/service/charts/deforestation', indicators.chartsDeforestation);

}