/**
 * Created by meberhard on 6/29/14.
 */
modellingApp.controller('ExportModalController', function ($scope, $modalInstance, modelStore) {
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