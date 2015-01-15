/**
 * Created by meberhard on 6/29/14.
 */
modellingApp.controller('ImportModalController', function ($scope, $modalInstance) {
    $scope.ok = function () {
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});