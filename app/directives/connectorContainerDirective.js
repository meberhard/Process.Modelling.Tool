modellingApp.directive('connectorContainer', function ($compile, $timeout, serviceCurrentModel, serviceElements, serviceUniqueId) {
    return function (scope, element) {
        var el = element[0];
        /**
         * The following variable 'newScope' is used to take the existing scope and bind it to a new variable
         * Since the svgArea is changed (for example, when a model is loaded) we need to destroy the existing scope,
         * in order to prevent memory leaks.
         * @type {*|Object}
         */
        var newScope = scope.$new();

        /**
         * on event 'addSvgElementEvent' the defined svg element will be inserted
         * @param event
         * @param args Note: args[0] is the itemId, args[1] the x-coordinate of the mouse pointer,
         * args[2] the y-coordinate of the mouse pointer and args[3] is the type
         */
        var cleanUpAddSvgElementEvent = newScope.$on('addConnectorEvent', function (event, args) {
            // @TODO: Show points on line on mousover, not all the time

            // Update the coordinates in relation to the scale:
            args[1] = (args[1] / scope.currentScale) - newScope.translateX;
            args[2] = (args[2] / scope.currentScale) - newScope.translateY;
            var id = serviceUniqueId.generateUniqueId();
            var gElement = document.createElementNS("http://www.w3.org/2000/svg", "g");
            gElement.setAttribute('transform', "translate(0 0)");
            gElement.setAttribute('uniqueId', id);
            gElement.setAttribute('id', id);
            gElement.setAttribute('line-group', '');

            $compile(gElement)(newScope);
            el.appendChild(gElement);

            var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute('transform', "translate(0 0)");
            line.setAttribute('x1', args[1]);
            line.setAttribute('y1', args[2]);
            line.setAttribute('x2', args[1] + 200);
            line.setAttribute('y2', args[2]);
            line.setAttribute('style', newScope.getEdgeStyle(args[0]))
            line.setAttribute('svg-connector-line', '');


            $compile(line)(newScope);
            gElement.appendChild(line);

            var selectionRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            selectionRect.setAttribute('x', (args[1] - 4).toString());
            selectionRect.setAttribute('y', (args[2] - 7).toString());
            selectionRect.setAttribute('stroke', "black");
            selectionRect.setAttribute('stroke-dasharray', "2,2");
            selectionRect.setAttribute('fill-opacity', "0.0");
            selectionRect.setAttribute('style', 'display:none');
            selectionRect.setAttribute('parentId', id);
            selectionRect.setAttribute('connector-highlight', '');
            selectionRect.setAttribute('lineX1', args[1]);
            selectionRect.setAttribute('lineX2', args[1] + 200);
            selectionRect.setAttribute('lineY1', args[2]);
            selectionRect.setAttribute('lineY2', args[2]);

            $compile(selectionRect)(newScope);
            gElement.appendChild(selectionRect);

            var startPoint = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            startPoint.setAttribute('cx', '0');
            startPoint.setAttribute('cy', '0');
            startPoint.setAttribute('transform', "translate(" + args[1] + " " + args[2] + ")");
            startPoint.setAttribute('r', '8');
            startPoint.setAttribute('stroke', "black");
            startPoint.setAttribute('opacity', '0.0');
            startPoint.setAttribute('my-svg-element', '');
            startPoint.setAttribute('line-start-Point', id);
            startPoint.setAttribute('line-point', id);

            $compile(startPoint)(newScope);
            gElement.appendChild(startPoint);

            var endPoint = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            endPoint.setAttribute('cx', '0');
            endPoint.setAttribute('cy', '0');
            endPoint.setAttribute('transform', "translate(" + (args[1] + 200) + " " + args[2] + ")");
            endPoint.setAttribute('r', '8');
            endPoint.setAttribute('stroke', "black");
            endPoint.setAttribute('opacity', '0.0');
            endPoint.setAttribute('my-svg-element', '');
            endPoint.setAttribute('line-end-Point', id);
            endPoint.setAttribute('line-point', id);

            $compile(endPoint)(newScope);
            gElement.appendChild(endPoint);

            // insert the height and width after the other elements are drawn!
            selectionRect.setAttribute('height', (gElement.getBoundingClientRect().height / newScope.currentScale).toString());
            selectionRect.setAttribute('width', (gElement.getBoundingClientRect().width / newScope.currentScale ).toString());

            serviceElements.addConnector(id, scope.getConnectorAttributes(args[0]), scope.getConnectorType(args[0]));
            serviceCurrentModel.setCurrentModel(el.parentNode);
        });

        var cleanUpRemoveSvgElementEvent = newScope.$on('removeSvgElementEvent', function (event, args) {
            if (args[1] === "connectors") {
                var elementToRemove = document.getElementById(args[0]);
                el.removeChild(elementToRemove);
                serviceCurrentModel.setCurrentModel(el.parentNode);
                scope.updateProperties(undefined, undefined);
            }
        });

        /**
         * on event 'resetWorkspaceEvent' all current elements will be reset
         */
        var cleanUpResetWorkspaceEvent = newScope.$on('resetWorkspaceEvent', function () {
            while (el.firstChild) {
                el.removeChild(el.firstChild);
            }
            serviceCurrentModel.setCurrentModel(undefined);
        });

        /**
         * On event 'destroySvgAreaEvent' all listeners will be unregistered (including 'destroySvgAreaEvent'
         * itself, the current scope is destroyed and the element removed)
         * @type {*|function()}
         */
        var cleanUpDestroySvgAreaEvent = newScope.$on('destroySvgAreaEvent', function () {
            $timeout(function () {
                cleanUpAddSvgElementEvent();
                cleanUpResetWorkspaceEvent();
                cleanUpDestroySvgAreaEvent();
                cleanUpRemoveSvgElementEvent();
                newScope.$destroy();
                element.remove();
            });
        });
    }
});