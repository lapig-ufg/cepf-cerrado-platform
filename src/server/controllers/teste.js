var languageJson = require('../assets/lang/language.json');

module.exports = function(app) {
    var Controller = {}
    var Internal = {}

    Controller.largest = function(request, response) {

        var rows = request.queryResult['largest_cities'];

        response.send(rows);
        response.end();

    }

    return Controller;

}