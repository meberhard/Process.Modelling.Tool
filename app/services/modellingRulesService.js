modellingApp.service('serviceModellingRules', function () {
    var serviceModellingRules = {};
    var rules;

    serviceModellingRules.setRules = function (newRules) {
        rules = newRules;
    };

    serviceModellingRules.getRules = function () {
        return rules;
    };

//    serviceModellingRules.getModellingRuleForSymbolAndConnector = function (symbolType, connectorType) {
//        console.log(rules);
//        return rules[symbolType].rules[connectorType];
//    };

    /**
     * Gets the modelling rules for a certain type
     *
     * @param symbolType the type of the symbol
     * @param inOrOut should be either "in" or "out"
     */
    serviceModellingRules.getRulesForType = function (symbolType, inOrOut) {
        if (inOrOut !== "in" && inOrOut !== "out") {
            console.warn("The parameter 'inOrOut' in the function 'getRulesForType' should be either 'in' or 'out' " +
                ", no other values are allowed");
        } else {
            return rules[symbolType].rules[inOrOut];
        }
    };

    serviceModellingRules.getParentTypes = function (symbolType) {
        return rules[symbolType].parentTypes;
    };

    /**
     * Returns the constraints for the requested symbol type
     *
     * @param symbolType
     * @param constraints
     * @returns {Array}
     */
    serviceModellingRules.getConstraintsForType = function (symbolType, constraints) {
        var returnArray = [];
        var constraintsForType = rules[symbolType].constraints;
        for (var i = 0; i < constraints.length; i++) {
            if (constraintsForType.indexOf(constraints[i].name) > -1) {
                returnArray.push(constraints[i]);
            }
        }
        return returnArray;
    };

    /**
     * Returns the adHoc constraints for the requested symbol type
     *
     * @param symbolType
     * @param constraints
     * @returns {Array}
     */
    serviceModellingRules.getAdHocConstraintsForType = function (symbolType, constraints) {
        var returnArray = [];
        var constraintsForType = rules[symbolType].constraints;
        for (var i = 0; i < constraints.length; i++) {
            if (constraintsForType.indexOf(constraints[i].name) > -1 && constraints[i].adHoc) {
                returnArray.push(constraints[i]);
            }
        }
        return returnArray;
    };

    /**
     * Returns all the global constraints
     *
     * @param constraints
     */
    serviceModellingRules.getGlobalConstraints = function (constraints) {
        var returnArray = [];
        for (var i = 0; i < constraints.length; i++) {
            if (constraints[i].global) {
                returnArray.push(constraints[i]);
            }
        }
        return returnArray;
    };

    return serviceModellingRules;
});