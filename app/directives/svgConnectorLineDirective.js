/**
 * when the start or end point of the line is moved, the line needs to be redrawn
 */
modellingApp.directive('svgConnectorLine', function () {
    return function (scope, element) {
        var el = element[0];

        scope.$on('updateSvgConnectorLine', function (event, args) {
            if (el.parentNode.getAttribute('uniqueId') === args[0]) {
                switch (args[3]) {
                    case "startPoint":
                        el.setAttribute('x1', args[1]);
                        el.setAttribute('y1', args[2]);
                        break;
                    case "endPoint":
                        el.setAttribute('x2', args[1]);
                        el.setAttribute('y2', args[2]);
                        break;
                }
            }
        });
    }
});