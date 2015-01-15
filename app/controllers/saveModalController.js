/**
 * Created by meberhard on 6/29/14.
 */
modellingApp.controller('SaveModalController', function ($scope, $modalInstance, modelStore, currentModel, currentModellingLanguage, serviceElements, serviceUniqueId) {
    modelStore.getAllByLanguage(currentModellingLanguage, function (models) {
        $scope.items = models;
    });

    $scope.ok = function (modelName, modelInformation) {
        modelStore.saveModel(modelName, modelInformation, currentModellingLanguage, currentModel, serviceElements.getElements(), serviceUniqueId.getCurrentId());
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss();
    };
});