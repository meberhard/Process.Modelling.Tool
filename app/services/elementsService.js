modellingApp.service('serviceElements', function (serviceModellingRules, serviceAlertMessages, attributeList) {
    var serviceElements = {};
    var elements = {
        "symbols": {},
        "edges": {}
    };

    /**
     * Returns the elements which are handled by the service
     *
     * @returns {{symbols: {}, edges: {}}}
     */
    serviceElements.getElements = function () {
        return elements;
    };

    /**
     * Sets the elements which are handled by the service
     *
     * @param newElements
     */
    serviceElements.setElements = function (newElements) {
        for (var symbolId in newElements.symbols) {
            newElements.symbols[symbolId].attributes = attributeList.prepareAttributes(newElements.symbols[symbolId].attributes);
        }
        elements = newElements;
    };

    /**
     * Resets the elements, which are handled by the service
     */
    serviceElements.resetElements = function () {
        elements = {
            "symbols": {},
            "edges": {}
        };
    };

    /**
     * Returns the symbol with the given ID
     *
     * @param id Id of the symbol
     * @returns {*} returns the symbol if it is found, else undefined
     */
    serviceElements.getSymbol = function (id) {
        return elements.symbols[id];
    };

    /**
     * This function adds a new symbol
     *
     * @param id
     * @param dockers
     * @param leftX
     * @param topY
     * @param width
     * @param height
     * @param rectRelX
     * @param rectRelY
     * @param rectWidth
     * @param rectHeight
     * @param attributes
     * @param type
     */
    serviceElements.addSymbol = function (id, dockers, leftX, topY, width, height, rectRelX, rectRelY, rectWidth, rectHeight, attributes, type) {
        elements.symbols[id] = {
            "id": id,
            "attributes": attributes,
            "dockers": dockers,
            "type": type,
            "position": {
                "leftX": leftX,
                "topY": topY,
                "width": width,
                "height": height
            },
            "rect": {
                "relX": rectRelX,
                "relY": rectRelY,
                "width": rectWidth,
                "height": rectHeight
            }
        };
    };

    /**
     * This function updates the attributes of a symbol
     *
     * @param id
     * @param attributes
     */
    serviceElements.updateAttributes = function (id, attributes) {
        elements.symbols[id].attributes = attributes;
    };

    /**
     * This function removes a symbol
     *
     * @param id
     */
    serviceElements.removeSymbol = function (id) {
        delete elements.symbols[id];
    };

    //@TODO: take the current scale in account
    /**
     * This function calculates the positions of the dockers for a certain symbol
     *
     * @param width
     * @param height
     * @param absX
     * @param absY
     * @returns {*[]}
     */
    serviceElements.calculateDockerPositions = function (width, height, absX, absY, relX, relY) {
        return [
            {
                "position": "leftTop",
                "relativeX": 0 + relX,
                "relativeY": 0 + relY,
                "absoluteX": absX,
                "absoluteY": absY
            },
            {
                "position": "midTop",
                "relativeX": (width / 2) + relX,
                "relativeY": 0 + relY,
                "absoluteX": (width / 2) + absX,
                "absoluteY": absY
            },
            {
                "position": "rightTop",
                "relativeX": width + relX,
                "relativeY": 0 + relY,
                "absoluteX": width + absX,
                "absoluteY": absY
            },
            {
                "position": "rightMid",
                "relativeX": width + relX,
                "relativeY": (height / 2) + relY,
                "absoluteX": width + absX,
                "absoluteY": (height / 2) + absY
            },
            {
                "position": "rightBottom",
                "relativeX": width + relX,
                "relativeY": height + relY,
                "absoluteX": width + absX,
                "absoluteY": height + absY
            },
            {
                "position": "midBottom",
                "relativeX": (width / 2) + relX,
                "relativeY": height + relY,
                "absoluteX": (width / 2) + absX,
                "absoluteY": height + absY
            },
            {
                "position": "leftBottom",
                "relativeX": 0 + relX,
                "relativeY": height + relY,
                "absoluteX": 0 + absX,
                "absoluteY": height + absY
            },
            {
                "position": "leftMid",
                "relativeX": 0 + relX,
                "relativeY": (height / 2) + relY,
                "absoluteX": absX,
                "absoluteY": (height / 2) + absY
            }
        ];
    };

    /**
     * This function returns the docker for a symbol and position
     *
     * @param symbolId
     * @param position
     * @returns {*}
     */
    serviceElements.getDockerForSymbolAndPosition = function (symbolId, position) {
        for (var i = 0; i < elements.symbols[symbolId].dockers.length; i++) {
            if (elements.symbols[symbolId].dockers[i].position === position) {
                return elements.symbols[symbolId].dockers[i];
            }
        }
        return undefined;
    };

    /**
     * The edge connects to notation symbols. The edge object saves the id of the edge, the properties and the
     * notation symbols connected to the start and the end of the edge.
     *
     * @TODO validate that all edges have a notation symbol on the start and the end
     * @TODO remove type? possible?
     * @TODO rename connector to edge application wide
     *
     * @param id
     * @param properties
     * @param type
     */
    serviceElements.addConnector = function (id, attributes, type) {
        elements.edges[id] = {
            "id": id,
            "symbolOnStart": {},
            "symbolOnEnd": {},
            "attributes": attributes,
            "type": type
        };
    };

    /**
     * This function returns the edge
     *
     * @param id
     * @returns {*}
     */
    serviceElements.getConnector = function (id) {
        return elements.edges[id];
    };

    /**
     * This function returns all edges
     *
     * @returns {*}
     */
    serviceElements.getConnectors = function () {
        return elements.edges;
    };

    /**
     * This function removes the edge with the given id
     *
     * @param id
     */
    serviceElements.removeConnector = function (id) {
        delete elements.edges[id];
    };

    /**
     * Adds or updates a property of the element
     * @param elementType either symbols or connectors
     * @param id
     * @param propertyName
     * @param propertyVal
     */
    serviceElements.addElementProperty = function (elementType, id, propertyName, propertyVal) {
        elements[elementType][id].attributes[propertyName] = propertyVal;
    };

    /**
     * Connects a connector to a symbol.
     * @param edgeId the id of the connector
     * @param symbolId the id of the symbol
     * @param edgePlace the connector place, could be the start point or the end point of the connector
     * @param docker the docker of the symbol, to which the connector connects
     * @param symbolType the type of the symbol
     */
    serviceElements.connectToSymbol = function (edgeId, symbolId, edgePlace, docker, symbolType, parentTypes) {
        switch (edgePlace) {
            case "startPoint":
                elements.edges[edgeId].symbolOnStart = {
                    "symbolId": symbolId,
                    "symbolType": symbolType,
                    "parentTypes": parentTypes,
                    "docker": docker
                };
                break;
            case "endPoint":
                elements.edges[edgeId].symbolOnEnd = {
                    "symbolId": symbolId,
                    "symbolType": symbolType,
                    "parentTypes": parentTypes,
                    "docker": docker
                };
                break;
            default:
                break;
        }
    };


    /**
     * Ad-hoc validation, when an edge is connected to a notation symbol - symbol on the start point of the edge
     *
     * @param edgeId
     * @param symbolId
     * @param symbolType
     * @param lastCall
     * @returns {boolean}
     */
    serviceElements.validateEdgeStartConnectToSymbol = function (edgeId, symbolId, symbolType, lastCall) {
        var isValid = false;

        // check type of the symbol on the end of the edge
        var symIdEdgeEnd = elements.edges[edgeId].symbolOnEnd.symbolId;
        var symTypeEdgeEnd = elements.edges[edgeId].symbolOnEnd.symbolType;

        // if the end of the edge is not connected yet, no further validation is required
        if (symTypeEdgeEnd === undefined) {
            return true;
        }

        // get parentTypes
        var relevantTypes = serviceModellingRules.getParentTypes(symTypeEdgeEnd).slice(0);
        relevantTypes.push(symTypeEdgeEnd);

        // we are connecting the start point of the edge, ergo we need to get the rules for connection going 'out'
        // from the regarded symboltype
        var modRules = serviceModellingRules.getRulesForType(symbolType, "out");

        // checking, if rules are defined for the regarded types
        for (var i = 0; i < relevantTypes.length; i++) {
            if (relevantTypes[i] in modRules) {

                var minValue = modRules[relevantTypes[i]].min;
                var maxValue = modRules[relevantTypes[i]].max;

                if (maxValue === "*" || minValue > 0) {
                    //return true;
                    isValid = true;
                } else {

                    // check how many symbols of the same type are already connected to the symbols, with outgoing edges
                    var val = serviceElements.countEdgesResolvingInType(symbolId, symTypeEdgeEnd);
                    //if ((val + 1 >= minValue) && (val + 1 <= maxValue)) {
                    if ((val >= minValue) && (val <= maxValue)) {
                        //return true;
                        isValid = true;
                    } else {
                        serviceAlertMessages.sendMessage('danger', modRules[relevantTypes[i]].alert);
                        return false;
                    }
                }
            }
        }

        // if isValid is true, we also need to check the other side of the edge
        if (isValid && lastCall) {
            return true;
        } else if (isValid && serviceElements.validateEdgeEndConnectToSymbol(edgeId, symIdEdgeEnd, symTypeEdgeEnd, true)) {
            return true;
        }

        //if (isValid && serviceElements.validateEdgeEndConnectToSymbol(edgeId, symIdEdgeEnd, symTypeEdgeEnd)) {
        //    return true;
        //}

        // if no rules were specified, we assume a violation of the rules
        serviceAlertMessages.sendMessage('danger', "A notation symbol of the type " + symTypeEdgeEnd + " can not " +
            "follow a notation symbol of the type " + symbolType);
        return false;

    };

    /**
     * Ad-hoc validation, when an edge is connected to a notation symbol - symbol on the end point of the edge
     *
     * @param edgeId
     * @param symbolId
     * @param symbolType
     * @param lastCall
     * @returns {boolean}
     */
    serviceElements.validateEdgeEndConnectToSymbol = function (edgeId, symbolId, symbolType, lastCall) {

        var isValid = false;

        // check type of the symbol on the start of the edge
        var symIdEdgeStart = elements.edges[edgeId].symbolOnStart.symbolId;
        var symTypeEdgeStart = elements.edges[edgeId].symbolOnStart.symbolType;

        // if the start of the edge is not connected yet, no further validation is required
        if (symTypeEdgeStart === undefined) {
            return true;
        }

        // get parentTypes
        var relevantTypes = serviceModellingRules.getParentTypes(symTypeEdgeStart).slice(0);
        relevantTypes.push(symTypeEdgeStart);

        // we are connecting the end point of the edge, ergo we need to get the rules for connection going 'in'
        // to the regarded type of the symbol
        var modRules = serviceModellingRules.getRulesForType(symbolType, "in");

        // checking, if rules are defined for the regarded types
        for (var i = 0; i < relevantTypes.length; i++) {
            if (relevantTypes[i] in modRules) {
                var minValue = modRules[relevantTypes[i]].min;
                var maxValue = modRules[relevantTypes[i]].max;

                if (maxValue === "*" || minValue > 0) {
                    isValid = true;
                } else {

                    // check how many symbols of the same type are already connected to the symbols, with outgoing edges
                    var val = serviceElements.countEdgesStartingFromType(symbolId, symTypeEdgeStart);
                    //if ((val + 1 >= minValue) && (val + 1 <= maxValue)) {
                    if ((val >= minValue) && (val <= maxValue)) {
                        //return true;
                        isValid = true;
                    } else {
                        serviceAlertMessages.sendMessage('danger', modRules[relevantTypes[i]].alert);
                        return false;
                    }
                }
            }
        }

        if (isValid && lastCall) {
            return true;
        } else if (isValid && serviceElements.validateEdgeStartConnectToSymbol(edgeId, symIdEdgeStart, symTypeEdgeStart, true)) {
            return true;
        }

        //if (isValid && serviceElements.validateEdgeStartConnectToSymbol(edgeId, symIdEdgeStart, symTypeEdgeStart)) {
        //    return true;
        //}

        // if no rules were specified, we assume a violation of the rules
        serviceAlertMessages.sendMessage('danger', "A notation symbol of the type " + symbolType + " can not " +
            "follow a notation symbol of the type " + symTypeEdgeStart );
        return false;
    };

    /**
     * This function loops through all symbols on the business process and checks, if the cardinalities of
     * the metamodel are kept. This method also checks, if there are any symbols, which are not connected to
     * an edge, or if there are any edges, which are missing a symbol on either end.
     *
     * The reason we need this method is the following: Some of the cardinalities can't be checked "ad hoc". For example:
     * The type "branching" includes two instances of "Branch". When the first Branch is connected to the Branching,
     * the ad hoc validation will return false, because it expects two instances of "Branch". Such validations are
     * excluded while the business process is created. The following method includes such validations and may be
     * triggered manually from the user - the user interface should implement a button "validate" which triggers
     * this function.
     */
    serviceElements.postValidateMetamodel = function () {
        var connectedSymbolIds = [];

        if (Object.keys(elements.symbols).length === 0 && Object.keys(elements.edges).length === 0) {
            serviceAlertMessages.sendMessage('danger', "Workspace is empty - please create a model before" +
                " starting to validate it.");
            return false;
        }

        for (var edgeId in elements.edges) {
            if (!elements.edges[edgeId].symbolOnStart.hasOwnProperty("symbolId") || !elements.edges[edgeId].symbolOnEnd.hasOwnProperty("symbolId")) {
                serviceAlertMessages.sendMessage('danger', "Not all edges are connected to an element");
                return false;
            } else {
                 if (!serviceElements.postValidateEdgeStartHelper(elements.edges[edgeId].symbolOnStart.symbolId,
                    elements.edges[edgeId].symbolOnStart.symbolType, elements.edges[edgeId].symbolOnEnd.symbolType)) {
                     return elements.edges[edgeId].symbolOnStart.symbolId;
                 }
                 if (!serviceElements.postValidateEdgeEndHelper(elements.edges[edgeId].symbolOnEnd.symbolId,
                    elements.edges[edgeId].symbolOnStart.symbolType, elements.edges[edgeId].symbolOnEnd.symbolType)) {
                     return elements.edges[edgeId].symbolOnEnd.symbolId;
                 }
            }
            if ((elements.edges[edgeId].symbolOnStart.symbolId !== undefined) && (connectedSymbolIds.indexOf(elements.edges[edgeId].symbolOnStart.symbolId) === -1)) {
                connectedSymbolIds.push(elements.edges[edgeId].symbolOnStart.symbolId);
            }
            if ((elements.edges[edgeId].symbolOnEnd.symbolId !== undefined) && (connectedSymbolIds.indexOf(elements.edges[edgeId].symbolOnEnd.symbolId) === -1)) {
                connectedSymbolIds.push(elements.edges[edgeId].symbolOnEnd.symbolId);
            }
        }

        //last step: Check for symbols, which are not connected yet
        for (var symbolId in elements.symbols) {
            if (connectedSymbolIds.indexOf(parseInt(symbolId)) === -1) {
                serviceAlertMessages.sendMessage('danger', "The process model contains symbols, which are not connected.");
                return parseInt(symbolId);
            }
        }

    };

    /**
     * The following method is a helper function for "postValidateMetamodel", it checks, if the two connected symbols
     * match the metamodel.
     *
     * @param symbolId
     * @param symbolTypeOnStart
     * @param symbolTypeOnEnd
     * @returns {boolean}
     */
    serviceElements.postValidateEdgeStartHelper = function (symbolId, symbolTypeOnStart, symbolTypeOnEnd) {
        // we are connecting the start point of the edge, ergo we need to get the rules for connection going 'out'
        // from the regarded symboltype
        var modRules = serviceModellingRules.getRulesForType(symbolTypeOnStart, "out");

        // get parentTypes
        var relevantTypes = serviceModellingRules.getParentTypes(symbolTypeOnEnd).slice(0);
        relevantTypes.push(symbolTypeOnEnd);

        // checking, if rules are defined for the regarded types
        for (var i = 0; i < relevantTypes.length; i++) {
            if (relevantTypes[i] in modRules) {
                var minValue = modRules[relevantTypes[i]].min;
                var maxValue = modRules[relevantTypes[i]].max;

                // check how many symbols of the same type are already connected to the symbols, with outgoing edges
                var val = serviceElements.countEdgesResolvingInType(symbolId, symbolTypeOnEnd);
                if ((val >= minValue) && ((val <= maxValue) || (maxValue === "*"))) {
                    return true;
                } else {
                    serviceAlertMessages.sendMessage('danger', modRules[relevantTypes[i]].alert);
                    return false;
                }
            }
        }

        // if no rules were specified, we assume a violation of the rules
        serviceAlertMessages.sendMessage('danger', "A notation symbol of the type " + symbolTypeOnEnd + " can not " +
            "follow a notation symbol of the type " + symbolTypeOnStart);
        return false;
    };

    /**
     * The following method is a helper function for "postValidateMetamodel", it checks, if the two connected symbols
     * match the metamodel.
     *
     * @param symbolId
     * @param symbolTypeOnStart
     * @param symbolTypeOnEnd
     * @returns {boolean}
     */
    serviceElements.postValidateEdgeEndHelper = function (symbolId, symbolTypeOnStart, symbolTypeOnEnd) {
        var modRules = serviceModellingRules.getRulesForType(symbolTypeOnEnd, "in");

        // get parentTypes
        var relevantTypes = serviceModellingRules.getParentTypes(symbolTypeOnStart).slice(0);
        relevantTypes.push(symbolTypeOnStart);

        // checking, if rules are defined for the regarded types
        for (var i = 0; i < relevantTypes.length; i++) {
            if (relevantTypes[i] in modRules) {
                var minValue = modRules[relevantTypes[i]].min;
                var maxValue = modRules[relevantTypes[i]].max;

                // check how many symbols of the same type are already connected to the symbols, with outgoing edges
                var val = serviceElements.countEdgesStartingFromType(symbolId, symbolTypeOnStart);
                if ((val >= minValue) && ((val <= maxValue) || (maxValue === "*"))) {
                    return true;
                } else {
                    serviceAlertMessages.sendMessage('danger', modRules[relevantTypes[i]].alert);
                    return false;
                }
            }
        }

        // if no rules were specified, we assume a violation of the rules
        serviceAlertMessages.sendMessage('danger', "A notation symbol of the type " + symbolTypeOnStart + " can not " +
            "follow a notation symbol of the type " + symbolTypeOnEnd);
        return false;

    };

    /**
     * This function checks, how many symbols of type 'symTypeEdgeEnd' are connected to the symbol with the id 'symbolId',
     * where the symbol with the id 'symbolId' is on the start of the edge and the symbol with type 'symTypeEdgeEnd'
     * on the end
     *
     * @param symbolId
     * @param symTypeEdgeEnd
     * @returns {number}
     */
    serviceElements.countEdgesResolvingInType = function (symbolId, symTypeEdgeEnd) {
        //@TODO: add also parent types for checking
        var counter = 0;
        for (var key in elements.edges) {
            if (elements.edges[key].symbolOnStart.symbolId === symbolId) {
                var typesToCheck = elements.edges[key].symbolOnEnd.parentTypes.slice(0);
                typesToCheck.push(elements.edges[key].symbolOnEnd.symbolType);
                if (typesToCheck.indexOf(symTypeEdgeEnd) > -1) {
                    counter++;
                }
            }
        }

        return counter;

    };

    /**
     * This function checks, how many symbols of type 'symTypeEdgeStart' are connected to the symbol with the id 'symbolId',
     * where the symbol with the id 'symbolId' is on the end of the edge and the symbol with type 'symTypeEdgeEnd'
     * on the start
     *
     * @param symbolId
     * @param symTypeEdgeStart
     * @returns {number}
     */
    serviceElements.countEdgesStartingFromType = function (symbolId, symTypeEdgeStart) {
        //@TODO: add also parent types for checking

        var counter = 0;
        for (var key in elements.edges) {
            if (parseInt(elements.edges[key].symbolOnEnd.symbolId) === parseInt(symbolId)) {
                var typesToCheck = elements.edges[key].symbolOnStart.parentTypes.slice(0);
                typesToCheck.push(elements.edges[key].symbolOnStart.symbolType);
                if (typesToCheck.indexOf(symTypeEdgeStart) > -1) {
                    counter++;
                }
            }
        }

        return counter;
    };

    /**
     * This function validates the ad hoc constraints for the current type of the symbol.
     *
     * @param symbol
     * @param edgeId
     * @param edgePlace
     * @param dockerPosition
     * @param constraints
     * @param constraintFunctions
     * @returns {boolean}
     */
    serviceElements.validateAdHocConstraints = function (symbol, edgeId, edgePlace, dockerPosition, constraints, constraintFunctions) {
        // make the needed connection and disconnect again at the end
        //serviceElements.connectToSymbol(edgeId, symbol.id, edgePlace, dockerPosition, symbol.type);

        var constraintsForType = serviceModellingRules.getAdHocConstraintsForType(symbol.type, constraints);
        for (var i = 0; i < constraintsForType.length; i++) {
            if (!constraintFunctions[constraintsForType[i].name](angular.copy(symbol), angular.copy(elements.edges), angular.copy(elements.symbols))) {
                serviceAlertMessages.sendMessage('danger', constraintsForType[i].alert);
                //serviceElements.disconnectFromSymbol(edgeId, symbol.id);
                return false;
            }
        }

        //serviceElements.disconnectFromSymbol(edgeId, symbol.id);
        return true;
    };

    /**
     * Additional function, which validates the attributes of the notation symbol against the constraint, when
     * an attribute is changed.
     *
     * @param symbol
     * @param constraints
     * @param constraintFunctions
     * @returns {boolean}
     */
    serviceElements.validateAdHocConstraintsAttributes = function (symbol, constraints, constraintFunctions) {
        var constraintsForType = serviceModellingRules.getAdHocConstraintsForType(symbol.type, constraints);
        for (var i = 0; i < constraintsForType.length; i++) {
            if (!constraintFunctions[constraintsForType[i].name](angular.copy(symbol), angular.copy(elements.edges), angular.copy(elements.symbols))) {
                serviceAlertMessages.sendMessage('danger', constraintsForType[i].alert);
                return false;
            }
        }

        return true;
    };

    /**
     * This functions validates the constraints of every symbol on the current model
     *
     * @param constraints
     * @param constraintFunctions
     * @returns {boolean}
     */
    serviceElements.postConstraintValidation = function (constraints, constraintFunctions) {
        for (var key in elements.symbols) {
            var constraintsForType = serviceModellingRules.getConstraintsForType(elements.symbols[key].type, constraints);
            for (var i = 0; i < constraintsForType.length; i++) {;
                if (!constraintFunctions[constraintsForType[i].name](angular.copy(elements.symbols[key]), angular.copy(elements.edges), angular.copy(elements.symbols))) {
                    serviceAlertMessages.sendMessage('danger', constraintsForType[i].alert);
                    return elements.symbols[key].id;
                }
            }
        }

        //validate global constraints
        var globalConstraints = serviceModellingRules.getGlobalConstraints(constraints);
        for (var i = 0; i < globalConstraints.length; i++) {
            if (!constraintFunctions[globalConstraints[i].name](angular.copy(elements.edges), angular.copy(elements.symbols))) {
                serviceAlertMessages.sendMessage('danger', globalConstraints[i].alert);
                return false;
            }
        }

        serviceAlertMessages.sendMessage('success', 'The designed process is valid.');
        return true;
    };

    /**
     * This function disconnects an Edge from a Symbol
     *
     * @param edgeId
     * @param symbolId
     */
    serviceElements.disconnectFromSymbol = function (edgeId, symbolId) {
        if (elements.edges[edgeId].symbolOnStart.symbolId === symbolId) {
            elements.edges[edgeId].symbolOnStart = {};
        } else if (elements.edges[edgeId].symbolOnEnd.symbolId === symbolId) {
            elements.edges[edgeId].symbolOnEnd = {};
        } else {
            console.warn("Fail in disconnectFromSymbol. edgeId: " + edgeId + " symbolId: " + symbolId);
        }
    };

    /**
     * This function checks, if there is a symbol on the start of the edge. If there is any, the function returns
     * the id of that symbol. If there isn't, this function returns 'undefined'.
     *
     * @param edgeId
     * @returns {*}
     */
    serviceElements.getSymbolOnEdgeStart = function (edgeId) {
        if (elements.edges[edgeId].symbolOnStart.hasOwnProperty("symbolId")) {
            return elements.edges[edgeId].symbolOnStart.symbolId;
        } else {
            return undefined;
        }
    };

    /**
     * This function checks, if there is a symbol on the end of the edge. If there is any, the function returns
     * the id of that symbol. If there isn't, this function returns 'undefined'.
     *
     * @param edgeId
     * @returns {*}
     */
    serviceElements.getSymbolOnEdgeEnd = function (edgeId) {
        if (elements.edges[edgeId].symbolOnEnd.hasOwnProperty("symbolId")) {
            return elements.edges[edgeId].symbolOnEnd.symbolId;
        } else {
            return undefined;
        }
    };

    /**
     * This function checks, to what edges the symbol is connected and returns the ids of the edges with the
     * symbolOnStart or symbolOnEnd as value.
     *
     * @param symbolId
     * @returns {{}}
     */
    serviceElements.getEdgesConnectedToSymbol = function (symbolId) {
        var edges = {};
        for (var key in elements.edges) {
            if (parseInt(elements.edges[key].symbolOnStart.symbolId) === parseInt(symbolId)) {
                edges[key] = elements.edges[key].symbolOnStart;
                edges[key].connectorPlace = "startPoint";
            } else if (parseInt(elements.edges[key].symbolOnEnd.symbolId) === parseInt(symbolId)) {
                edges[key] = elements.edges[key].symbolOnEnd;
                edges[key].connectorPlace = "endPoint";
            }
        }
        return edges;
    };

    /**
     * This function gets the closest docker of a symbol on the position (xCoord/yCoord)
     *
     * @param symbolId
     * @param xCoord
     * @param yCoord
     * @returns {undefined}
     */
    serviceElements.getClosestDocker = function (symbolId, xCoord, yCoord) {
        var closestDocker = undefined, xOffSet, yOffSet, minValue;
        elements.symbols[symbolId].dockers.forEach(function (docker) {
            if (closestDocker === undefined) {
                closestDocker = docker;
                xOffSet = Math.max(docker.absoluteX, xCoord) - Math.min(docker.absoluteX, xCoord);
                yOffSet = Math.max(docker.absoluteY, yCoord) - Math.min(docker.absoluteY, yCoord);
                minValue = xOffSet + yOffSet;
            } else {
                xOffSet = Math.max(docker.absoluteX, xCoord) - Math.min(docker.absoluteX, xCoord);
                yOffSet = Math.max(docker.absoluteY, yCoord) - Math.min(docker.absoluteY, yCoord);
                if ((xOffSet + yOffSet) < minValue) {
                    minValue = xOffSet + yOffSet;
                    closestDocker = docker;
                }
            }
        });
        return closestDocker;
    };

    /**
     * This function updates the positions of the dockers of a symbol
     *
     * @param symbolId
     * @param absX
     * @param absY
     */
    serviceElements.updateSymbolDockers = function (symbolId, absX, absY) {
        elements.symbols[symbolId].dockers.forEach(function (docker) {
            docker.absoluteX = docker.relativeX + absX;
            docker.absoluteY = docker.relativeY + absY;
        });
    };

    /**
     * This function checks, if there is any symbol on the position (x/y)
     *
     * @param x
     * @param y
     * @returns {*}
     */
    serviceElements.checkPositionForSymbol = function (x, y) {
        for (var key in elements.symbols) {
            var xMin = elements.symbols[key].position.leftX + elements.symbols[key].rect.relX;
            var xMax = xMin + elements.symbols[key].rect.width;
            var yMin = elements.symbols[key].position.topY + elements.symbols[key].rect.relY;
            var yMax = yMin + elements.symbols[key].rect.height;
            if ((xMin <= x && x <= xMax) && (yMin <= y && y <= yMax)) {
                return elements.symbols[key];
            }
        }
        return undefined;
    };

    /**
     * This function updates the position of a symbol
     *
     * @param symbolId
     * @param leftX
     * @param topY
     */
    serviceElements.updatePositionOfSymbol = function (symbolId, leftX, topY) {
        elements.symbols[symbolId].position.leftX = leftX;
        elements.symbols[symbolId].position.topY = topY;
    };

    return serviceElements;
});