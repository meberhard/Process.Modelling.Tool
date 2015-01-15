/**
 * Created by meberhard on 6/29/14.
 */
/**
 * @TODO: idea: get the saved models before actually calling the modal, so we can wait for the models to be loaded
 * before actually opening the modal
 */
modellingApp.controller('LoadModalController', function ($scope, $modalInstance, modelStore) {
    modelStore.getAll(function (returnValue) {
        $scope.items = returnValue;
        $scope.selected = {
            item: $scope.items[0]
        };
    });

    $scope.ok = function (modelEntry) {
        $modalInstance.close(modelEntry);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});