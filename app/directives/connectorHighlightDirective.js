modellingApp.directive('connectorHighlight', function () {
        return function (scope, element) {
            var el = element[0];

            scope.$on('markSymbolEvent', function (event, args) {
                if (el.getAttribute('parentId') === args[0]) {
                    //el.style.display = 'block';
                    scope.updateProperties(args[0], "connector");
                } else {
                    //el.style.display = 'none';
                }
            });

            scope.$on('updateSvgConnectorLine', function (event, args) {
                    if (el.getAttribute('parentId') === args[0]) {
                        switch (args[3]) {
                            case "startPoint":
                                el.setAttribute('lineX1', args[1]);
                                el.setAttribute('lineY1', args[2]);
                                break;
                            case "endPoint":
                                el.setAttribute('lineX2', args[1]);
                                el.setAttribute('lineY2', args[2]);
                                break;
                            default:
                                break;
                        }
                        var xForRect = Math.min(parseInt(el.getAttribute('lineX1')), parseInt(el.getAttribute('lineX2'))) - 3;
                        var yForRect = Math.min(parseInt(el.getAttribute('lineY1')), parseInt(el.getAttribute('lineY2'))) - 3;
                        el.setAttribute('x', xForRect.toString());
                        el.setAttribute('y', yForRect.toString());
                        el.setAttribute('width', (Math.max(parseInt(el.getAttribute('lineX1')), parseInt(el.getAttribute('lineX2'))) - xForRect + 10).toString());
                        el.setAttribute('height', (Math.max(parseInt(el.getAttribute('lineY1')), parseInt(el.getAttribute('lineY2'))) - yForRect + 10).toString());
                    }
                }
            );
        }
    }
);