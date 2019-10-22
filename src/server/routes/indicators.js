module.exports = function (app) {

	var dataInjector = app.middleware.dataInjector;
	var indicators = app.controllers.indicators;
	
  app.get('/service/indicators/teste', indicators.teste);
	app.get('/service/charts/lulc', dataInjector, indicators.chartslulc);
	app.get('/service/charts/farming', dataInjector, indicators.chartsFarming);
	/*app.get('/service/indicators/search', dataInjector, indicators.search); */
}