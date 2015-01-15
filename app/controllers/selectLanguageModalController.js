/**
 * Created by meberhard on 6/29/14.
 */
modellingApp.controller('SelectLanguageModalController', function ($scope, $modalInstance, modellingLanguages) {
    $scope.items = modellingLanguages;
    $scope.selected = {
        item: $scope.items[0]
    };

    $scope.ok = function (modellingLanguage) {
        $modalInstance.close(modellingLanguage);
    };

    $scope.cancel = function (modellingLanguage) {
        $modalInstance.close(modellingLanguage);
    };
});