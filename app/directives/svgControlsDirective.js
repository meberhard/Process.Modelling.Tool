modellingApp.directive('svgControls', function () {
    return function (scope, element) {
        var el = element[0];

        scope.$on('zoom', function (event, args) {
            var scale = args[0];
            //el.setAttributeNS(null, 'transform', "matrix(" + scale + " 0 0 " + scale + " 0 0)");
            el.setAttributeNS(null, 'transform', "scale(" + scale + ")");
        });

    }
});