/**
 * when the user hovers over a line, the circles on the end of the line and on the start
 * of the line should appear, so the user understands, that the he can drag the line on these
 * two points.
 */
modellingApp.directive('lineGroup', function () {
    return function (scope, element) {
        var el = element[0];

        element.css({
            cursor: 'crosshair'
        });

        el.addEventListener(
            'mousedown',
            function (e) {
                switch (e.which) {
                    case 1:
                        scope.markThisSymbol(el.getAttribute('uniqueId'));
                        break;
                    case 2:
                        break;
                    case 3:
                        if (e.preventDefault()) e.preventDefault();
                        break;
                    default:
                        break;
                }
                return false;
            },
            false
        );
    }
});