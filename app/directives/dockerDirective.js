modellingApp.directive('docker', function () {
    return function (scope, element) {
        var el = element[0];
        scope.$on('showDockersOnGroupEvent', function (event, args) {
            if (parseInt(args[0]) === parseInt(el.parentNode.getAttribute('uniqueId'))) {
                el.setAttribute('opacity', '1.0');
            }
        });
        scope.$on('hideDockersOnGroupEvent', function (event, args) {
            if (parseInt(args[0]) === parseInt(el.parentNode.getAttribute('uniqueId'))) {
                el.setAttribute('opacity', '0.0');
            }
        });
    }
});