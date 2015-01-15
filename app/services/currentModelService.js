/**
 * This service is used to save the currentModel, via dependency injection different controllers and directives
 * are able to access it.
 */
modellingApp.service('serviceCurrentModel', function () {
    var serviceCurrentModel = {};
    var currentModel;

    serviceCurrentModel.setCurrentModel = function (model) {
        currentModel = model;
    };

    serviceCurrentModel.getCurrentModel = function () {
        return currentModel;
    };

    return serviceCurrentModel;
});