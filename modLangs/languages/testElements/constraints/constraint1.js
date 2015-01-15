/**
 * Constraint C1 - ad hoc
 * If a blueSymbol has an incoming edge from orangeSymbol, it must have an outgoing edge to a greySymbol
 *
 * Iterate over the edges, choose the edges where the current symbol sits on the start, count how many times type event
 * or type branching sits on the end. This counter should be max 1.
 *
 * @param symbol
 * @param edges
 * @param symbols
 */
var constraint1 = function (symbol, edges, symbols) {
    var hasEdgeFromOrange = false;
    var hasEdgeToGrey = false;

    for (var key in edges) {
        if (edges[key].symbolOnEnd.symbolId === symbol.id && edges[key].symbolOnStart.symbolType === "orangeSymbol") {
            hasEdgeFromOrange = true;
        } else if (edges[key].symbolOnStart.symbolId === symbol.id && edges[key].symbolOnEnd.symbolType === "greySymbol") {
            hasEdgeToGrey = true;
        }
    }

    if (!hasEdgeFromOrange) {
        return true;
    } else {
        return hasEdgeFromOrange && hasEdgeToGrey;
    }

};
appConstraints["constraint1"] = constraint1;