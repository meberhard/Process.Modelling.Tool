modellingApp.directive('linePoint', function () {
    return function (scope, element) {
        var el = element[0];

        scope.$watch('showPointsOnLine', function () {
            if (scope.showPointsOnLine === el.getAttribute('line-point')) {
                while (scope.showPointsOnLine !== undefined) {
                    el.setAttribute('class', '');
                }
            }
        });
    }
});