modellingApp.directive('mySvgElement', function ($document, serviceCurrentModel, serviceElements, serviceModellingRules) {
    return function (scope, element) {
        var el = element[0];
        var x = 0, y = 0, linePointX = 0, linePointY = 0, lastSymbolId = undefined;

        element.css({
            cursor: 'move'
        });

        el.addEventListener(
            'mousedown',
            function (e) {
                // e.which gets, if the left, middle or right mouse button
                // was clicked. We only want to move the element, if the
                // left mouse button was clicked.
                switch (e.which) {
                    case 1:
                        // save the coordinates of the line point, so we can move it back in case of validation failure
                        // when the user tries to connect it to an item he is not supposed to
                        if (el.hasAttribute('line-point')) {
                            var translation = el.getAttributeNS(null, "transform").slice(10, -1).split(' ');
                            linePointX = parseInt(translation[0]);
                            linePointY = parseInt(translation[1]);
                        }
                        $document.off('mousemove', moveElement);
                        scope.markThisSymbol(el.getAttribute('uniqueId'));
                        if (e.preventDefault()) e.preventDefault();
                        x = e.clientX / scope.currentScale;
                        y = e.clientY / scope.currentScale;
                        $document.on('mousemove', moveElement);
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

        /**
         * @TODO: get the currentmodel with another service or directive, rather than chaining parentNode
         * @TODO: needs to be completely changed, now this is a mess with mixed connector and symbol logic
         * seperate them!
         */
        el.addEventListener(
            'mouseup',
            function () {
                $document.off('mousemove', moveElement);

                var translation = el.getAttributeNS(null, "transform").slice(10, -1).split(' ');

                // This handles moving the symbols
                if (!el.hasAttribute('line-point')) {
                    var edgesOnSymbol = serviceElements.getEdgesConnectedToSymbol(el.getAttribute('uniqueId'));
                    serviceElements.updateSymbolDockers(el.getAttribute('uniqueId'), parseInt(translation[0]), parseInt(translation[1]));
                    serviceElements.updatePositionOfSymbol(el.getAttribute('uniqueId'), parseInt(translation[0]), parseInt(translation[1]));
                    for (var key in edgesOnSymbol) {
                        var docker = serviceElements.getDockerForSymbolAndPosition(edgesOnSymbol[key].symbolId, edgesOnSymbol[key].docker);
                        scope.redrawConnectorLine(key, docker.absoluteX, docker.absoluteY, edgesOnSymbol[key].connectorPlace);
                        scope.$apply();
                    }
                    serviceCurrentModel.setCurrentModel(el.parentNode.parentNode);
                    return false;
                }

                // This handles moving the start and end points of a connector line
                if (el.hasAttribute('line-start-Point')) {
                    var symbol = serviceElements.checkPositionForSymbol(parseInt(translation[0]), parseInt(translation[1]));
                    if (symbol) {
                        if (serviceElements.getSymbolOnEdgeStart(el.getAttribute('line-start-Point')) !== undefined) {
                            serviceElements.disconnectFromSymbol(el.getAttribute('line-start-Point'), serviceElements.getSymbolOnEdgeStart(el.getAttribute('line-start-Point')));
                        }
                        var closestDocker = serviceElements.getClosestDocker(symbol.id, parseInt(translation[0]), parseInt(translation[1]));
                        // next line is new
                        serviceElements.connectToSymbol(el.getAttribute('line-point'), symbol.id, "startPoint", closestDocker.position, symbol.type, serviceModellingRules.getParentTypes(symbol.type));
                        if (!serviceElements.validateEdgeStartConnectToSymbol(el.getAttribute('line-point'), symbol.id, symbol.type, false) || !serviceElements.validateAdHocConstraints(symbol, el.getAttribute('line-start-Point'), "startPoint", closestDocker.position, scope.constraints, scope.modLangConstraints)) {
                            scope.redrawConnectorLine(el.getAttribute('line-start-Point'), linePointX, linePointY, "startPoint");
                            serviceElements.disconnectFromSymbol(el.getAttribute('line-start-Point'), symbol.id);
                            scope.$apply();
                            return false;
                        }
                        scope.redrawConnectorLine(el.getAttribute('line-start-Point'), closestDocker.absoluteX, closestDocker.absoluteY, "startPoint");
                        scope.$apply();
                    } else {
                        if (serviceElements.getSymbolOnEdgeStart(el.getAttribute('line-start-Point')) !== undefined) {
                            serviceElements.disconnectFromSymbol(el.getAttribute('line-start-Point'), serviceElements.getSymbolOnEdgeStart(el.getAttribute('line-start-Point')));
                        }
                        scope.redrawConnectorLine(el.getAttribute('line-start-Point'), parseInt(translation[0]), parseInt(translation[1]), "startPoint");
                    }
                } else if (el.hasAttribute('line-end-Point')) {
                    var symbol = serviceElements.checkPositionForSymbol(parseInt(translation[0]), parseInt(translation[1]));
                    if (symbol) {
                        if (serviceElements.getSymbolOnEdgeEnd(el.getAttribute('line-end-Point')) !== undefined) {
                            serviceElements.disconnectFromSymbol(el.getAttribute('line-end-Point'), serviceElements.getSymbolOnEdgeEnd(el.getAttribute('line-end-Point')));
                        }
                        var closestDocker = serviceElements.getClosestDocker(symbol.id, parseInt(translation[0]), parseInt(translation[1]));
                        // next line is new
                        serviceElements.connectToSymbol(el.getAttribute('line-point'), symbol.id, "endPoint", closestDocker.position, symbol.type, serviceModellingRules.getParentTypes(symbol.type));
                        if (!serviceElements.validateEdgeEndConnectToSymbol(el.getAttribute('line-point'), symbol.id, symbol.type, false) ||
                            !serviceElements.validateAdHocConstraints(symbol, el.getAttribute('line-end-Point'), "endPoint", closestDocker.position, scope.constraints, scope.modLangConstraints)) {
                            // next line is new
                            serviceElements.disconnectFromSymbol(el.getAttribute('line-end-Point'), symbol.id);
                            scope.redrawConnectorLine(el.getAttribute('line-end-Point'), linePointX, linePointY, "endPoint");
                            scope.$apply();
                            return false;
                        }
                        //serviceElements.connectToSymbol(el.getAttribute('line-point'), symbol.id, "endPoint", closestDocker.position, symbol.type, serviceModellingRules.getParentTypes(symbol.type));
                        scope.redrawConnectorLine(el.getAttribute('line-end-Point'), closestDocker.absoluteX, closestDocker.absoluteY, "endPoint");
                        scope.$apply();
                    } else {
                        if (serviceElements.getSymbolOnEdgeEnd(el.getAttribute('line-end-Point')) !== undefined) {
                            serviceElements.disconnectFromSymbol(el.getAttribute('line-end-Point'), serviceElements.getSymbolOnEdgeEnd(el.getAttribute('line-end-Point')));
                        }
                        scope.redrawConnectorLine(el.getAttribute('line-end-Point'), parseInt(translation[0]), parseInt(translation[1]), "endPoint");
                    }
                }

                //hide dockers if there are still any shown
                if (lastSymbolId !== undefined) {
                    scope.hideDockersOnGroup(lastSymbolId);
                }

                serviceCurrentModel.setCurrentModel(el.parentNode.parentNode.parentNode);
                return false;
            },
            false
        );

        /**
         * Moves the svg element on the area in relation to the current scale
         *
         * @TODO Better solution for the current scale
         * @param e
         */
        function moveElement(e) {
            var translation = el.getAttributeNS(null, "transform").slice(10, -1).split(' ');
            var sx = parseFloat(translation[0]);
            var sy = parseFloat(translation[1]);
            if (el.hasAttribute('line-point')) {
                var symbol = serviceElements.checkPositionForSymbol(sx, sy);
                if (symbol) {
                    lastSymbolId = symbol.id;
                    scope.showDockersOnGroup(symbol.id);
                } else if (lastSymbolId !== undefined) {
                    scope.hideDockersOnGroup(lastSymbolId);
                    lastSymbolId = undefined;
                }
            }

            // in case we move a notation symbol
            var connectedEdges = serviceElements.getEdgesConnectedToSymbol(el.getAttribute('uniqueId'));
            for (var key in connectedEdges) {
                var tempDocker = serviceElements.getDockerForSymbolAndPosition(el.getAttribute('uniqueId'), connectedEdges[key].docker);
                scope.redrawConnectorLine(key, sx+tempDocker.relativeX, sy+tempDocker.relativeY, connectedEdges[key].connectorPlace);
            }

            // in case we move an edge
            if (el.hasAttribute('line-start-Point')) {
                scope.redrawConnectorLine(el.getAttribute('line-start-Point'), sx, sy, 'startPoint');
            } else if (el.hasAttribute('line-end-Point')) {
                scope.redrawConnectorLine(el.getAttribute('line-end-Point'), sx, sy, 'endPoint');
            }

            el.setAttributeNS(null, "transform", "translate(" + (sx + (e.clientX / scope.currentScale) - x) + " " + (sy + (e.clientY / scope.currentScale) - y) + ")");
            x = e.clientX / scope.currentScale;
            y = e.clientY / scope.currentScale;
        }

    }
});