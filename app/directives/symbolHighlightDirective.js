modellingApp.directive('symbolHighlight', function () {
    return function (scope, element) {
        var el = element[0];

        scope.$on('markSymbolEvent', function (event, args) {
            if (parseInt(el.getAttribute('parentId')) === parseInt(args[0])) {
                el.setAttribute('stroke', "black");
                el.setAttribute('stroke-dasharray', "2,2");
                scope.updateProperties(args[0], "symbol");
            } else {
                el.removeAttribute('stroke');
                el.removeAttribute('stroke-dasharray');
            }
        });
    }
});