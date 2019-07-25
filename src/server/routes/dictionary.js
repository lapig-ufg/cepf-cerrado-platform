module.exports = function (app) {

	var dictionary = app.controllers.dictionary;

	app.get('/service/app-descriptor', dictionary.descriptor);

}