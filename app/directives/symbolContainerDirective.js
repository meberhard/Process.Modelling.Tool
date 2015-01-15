modellingApp.directive('symbolContainer', function ($compile, $timeout, serviceCurrentModel, serviceElements, serviceUniqueId, attributeList) {
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
        var cleanUpAddSvgElementEvent = newScope.$on('addSvgElementEvent', function (event, args) {
            newScope.getSvg(args[0], function (returnValue) {
                var newElement = (new DOMParser()).parseFromString(returnValue, "image/svg+xml").documentElement;

                var uniqueId = serviceUniqueId.generateUniqueId();

                // Update the coordinates in relation to the scale:
                args[1] = (args[1] / scope.currentScale) - newScope.translateX;
                args[2] = (args[2] / scope.currentScale) - newScope.translateY;

                // wrap the new element into a <g> element and do all the transformation on the <g> element
                // this makes it easier to load any kind of <svg> and <path> structures
                var gElement = document.createElementNS("http://www.w3.org/2000/svg", "g");
                gElement.setAttribute('transform', "translate(" + args[1] + " " + args[2] + ")");
                gElement.setAttribute('my-svg-element', '');
                gElement.setAttribute('uniqueId', uniqueId);
                gElement.setAttribute('id', uniqueId);
                gElement.setAttribute('show-dockers', '');
                gElement.setAttribute('fill', 'white');

                gElement.appendChild(newElement);

                $compile(gElement)(newScope);
                el.appendChild(gElement);

                var elementWidth = (gElement.getBoundingClientRect().width / scope.currentScale);
                var elementHeight = (gElement.getBoundingClientRect().height / scope.currentScale);

                //var dockers = serviceElements.calculateDockerPositions(elementWidth, elementHeight, args[1], args[2]);

                var dockersWidth = elementWidth + 6;
                var dockersHeight = elementHeight + 6;
                var dockersX = args[1];
                var dockersY = args[2];
                var tempX = -3;
                var tempY = -3;

                var selectionRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                if (elementWidth < 20) {
                    tempX = -3 - ((20 - elementWidth)/2);
                    dockersWidth = elementWidth + 6 + (20 - elementWidth);
                    dockersX = args[1] - tempX;
                    selectionRect.setAttribute('x', tempX.toString());
                    selectionRect.setAttribute('width', dockersWidth.toString());
                } else {
                    selectionRect.setAttribute('x', tempX.toString());
                    selectionRect.setAttribute('width', dockersWidth.toString());
                }

                if (elementHeight < 20) {
                    tempY = -3 - ((20 - elementHeight)/2);
                    dockersHeight = elementHeight + 6 + (20 - elementHeight);
                    dockersY = args[2] - tempY;
                    selectionRect.setAttribute('y', tempY.toString());
                    selectionRect.setAttribute('height', dockersHeight.toString());
                } else {
                    selectionRect.setAttribute('y', tempY.toString());
                    selectionRect.setAttribute('height', dockersHeight.toString());
                }

                selectionRect.setAttribute('fill-opacity', "0.0");
                selectionRect.setAttribute('symbol-highlight', '');
                selectionRect.setAttribute('parentId', uniqueId);

                $compile(selectionRect)(newScope);
                gElement.appendChild(selectionRect);

                var dockers = serviceElements.calculateDockerPositions(dockersWidth, dockersHeight, dockersX, dockersY, tempX, tempY);

                dockers.forEach(function (dockerPosition) {
                    var docker = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                    docker.setAttribute('cx', '0');
                    docker.setAttribute('cy', '0');
                    docker.setAttribute('transform', "translate(" + dockerPosition.relativeX + " " + dockerPosition.relativeY + ")");
                    docker.setAttribute('r', '3');
                    docker.setAttribute('stroke', "black");
                    docker.setAttribute('opacity', '0.0');
                    docker.setAttribute('docker', dockerPosition.position);
                    docker.setAttribute('parentId', uniqueId);

                    $compile(docker)(newScope);
                    gElement.appendChild(docker);
                });

                var symbolType = scope.getSymbolType(args[0]);

                serviceElements.addSymbol(uniqueId, dockers, args[1], args[2], elementWidth,
                    elementHeight, tempX, tempY, dockersWidth, dockersHeight, attributeList.importAllAttributes(scope.symbolTypes[symbolType].attributes), scope.getSymbolType(args[0]));
                serviceCurrentModel.setCurrentModel(el.parentNode);
            });

        });

        var cleanUpRemoveSvgElementEvent = newScope.$on('removeSvgElementEvent', function (event, args) {
            if (args[1] === "symbols") {
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
            scope.updateProperties(undefined, undefined);
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