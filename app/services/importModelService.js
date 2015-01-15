/**
 * Created by meberhard on 6/29/14.
 */
modellingApp.service('serviceImportModel', function () {
    var serviceImportModel = {};
    var importModel;

    serviceImportModel.setImportModel = function (model) {
        importModel = model;
    };

    serviceImportModel.getImportModel = function () {
        return importModel;
    };

    return serviceImportModel;
});