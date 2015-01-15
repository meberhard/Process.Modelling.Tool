modellingApp.directive('showDockers', function () {
    return function (scope, element) {
        var el = element[0];

        element.bind('mouseenter', function () {
            scope.showDockersOnGroup(el.getAttribute('uniqueId'));
        });

        element.bind('mouseleave', function () {
            scope.hideDockersOnGroup(el.getAttribute('uniqueId'));
        });
    }
});