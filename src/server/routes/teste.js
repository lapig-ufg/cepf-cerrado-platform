module.exports = function(app) {

    var dataInjector = app.middleware.dataInjector;
    var controllers = app.controllers.teste;

    app.get('/service/teste/largest', dataInjector, controllers.largest);


}