/**
 * Constraint C6
 * Events can only be connected to operators, if the symbol following the connector is either a function or process Interface
 *
 * @param symbol
 * @param edges
 * @param symbols
 */
var constraint6 = function (symbol, edges, symbols) {
    var operatorHasOnlyIncomingFunctionsOrInterfaces = function (id) {
        for (var key in edges) {
            if (edges[key].symbolOnEnd.symbolId === id && (edges[key].symbolOnStart.symbolType !== "function" &&
                edges[key].symbolOnStart.symbolType !== "pInterface")) {
                return false;
            } else {
                return true;
            }
        }
    };

    var operatorHasOnlyOutgoingFunctionsOrInterfaces = function (id) {
        for (var key in edges) {
            if (edges[key].symbolOnStart.symbolId === id && (edges[key].symbolOnEnd.symbolType !== "function" &&
                edges[key].symbolOnEnd.symbolType !== "pInterface")) {
                return false;
            } else {
                return true;
            }
        }
    };

    for (var key in edges) {
        if (edges[key].symbolOnEnd.symbolId === symbol.id && (edges[key].symbolOnStart.symbolType === "andOperator" ||
            edges[key].symbolOnStart.symbolType === "orOperator" || edges[key].symbolOnStart.symbolType === "xorOperator")) {
            if (!operatorHasOnlyIncomingFunctionsOrInterfaces(edges[key].symbolOnStart.symbolId)) {
                return false;
            }
        } else if (edges[key].symbolOnStart.symbolId === symbol.id && (edges[key].symbolOnEnd.symbolType === "andOperator" ||
            edges[key].symbolOnEnd.symbolType === "orOperator" || edges[key].symbolOnEnd.symbolType === "xorOperator")) {
            if (!operatorHasOnlyOutgoingFunctionsOrInterfaces(edges[key].symbolOnEnd.symbolId)) {
                return false;
            }
        }
    }

    return true;

};
appConstraints["constraint6"] = constraint6;