module.exports = function (app) {

    var dataInjector = app.middleware.dataInjector;
    var controllers = app.controllers.analysis;

    app.get('/service/analysis/regionreport', dataInjector, controllers.regionreport);
}