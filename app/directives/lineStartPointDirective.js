/**
 * on connecting a line to a notation symbol, the two points on the line
 * need to be moved to the new position
 */
modellingApp.directive('lineStartPoint', function () {
    return function (scope, element) {
        var el = element[0];

        scope.$on('updateSvgConnectorLine', function (event, args) {
            if (el.getAttribute('line-start-Point') === args[0] && 'startPoint' === args[3]) {
                el.setAttributeNS(null, "transform", "translate(" + args[1] + " " + args[2] + ")");
            }
        });
    }
});