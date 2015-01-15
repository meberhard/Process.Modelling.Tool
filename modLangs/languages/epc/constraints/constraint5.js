/**
 * Constraint C5
 * Function and process interfaces can only be connected to operators, if the symbol after is an event
 *
 * @param symbol
 * @param edges
 * @param symbols
 */
var constraint5 = function (symbol, edges, symbols) {
    var operatorHasOnlyIncomingEvents = function(id) {
        for (var key in edges) {
            if (edges[key].symbolOnEnd.symbolId === id && edges[key].symbolOnStart.symbolType !== "event") {
                return false;
            } else {
                return true;
            }
        }
    };

    var operatorHasOnlyOutgoingEvents = function (id) {
        for (var key in edges) {
            if (edges[key].symbolOnStart.symbolId === id && edges[key].symbolOnEnd.symbolType !== "event") {
                return false;
            } else {
                return true;
            }
        }
    };

    for (var key in edges) {
        if (edges[key].symbolOnEnd.symbolId === symbol.id && (edges[key].symbolOnStart.symbolType === "andOperator" ||
            edges[key].symbolOnStart.symbolType === "orOperator" || edges[key].symbolOnStart.symbolType === "xorOperator")) {
            if (!operatorHasOnlyIncomingEvents(edges[key].symbolOnStart.symbolId)) {
                return false;
            }
        } else if (edges[key].symbolOnStart.symbolId === symbol.id && (edges[key].symbolOnEnd.symbolType === "andOperator" ||
            edges[key].symbolOnEnd.symbolType === "orOperator" || edges[key].symbolOnEnd.symbolType === "xorOperator")) {
            if (!operatorHasOnlyOutgoingEvents(edges[key].symbolOnEnd.symbolId)) {
                return false;
            }
        }
    }

    return true;

};
appConstraints["constraint5"] = constraint5;