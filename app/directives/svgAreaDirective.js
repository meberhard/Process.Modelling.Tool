modellingApp.directive('svgArea', function ($compile, serviceCurrentModel) {
    return function (scope, element) {
        var el = element[0];

        /**
         * on event 'loadModelEvent' the svg area will be replaced with the saved model
         */
        scope.$on('loadModelEvent', function (event, args) {

            // the next line informs the controller, that we removed the elementContainer - the controller will
            // broadcast an event which will destroy the svgArea element and its scope
            scope.destroySvgArea();
            var newSvgArea = $compile((new DOMParser()).parseFromString(args[0], "image/svg+xml").documentElement)(scope);
            el.appendChild(newSvgArea[0]);
            serviceCurrentModel.setCurrentModel(newSvgArea[0]);
        });

        scope.$on('insertMarkerDef', function (event, args) {
            var markerDef = $compile((new DOMParser()).parseFromString(args[0], "image/svg+xml").documentElement)(scope);
            el.appendChild(markerDef[0]);
        });
    }
});