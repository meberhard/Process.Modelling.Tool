/**
 * Constraint C7
 * Events can not be followed by XOR or OR split operators (a split operator has 1 incoming edge and several outgoing edges)
 *
 * @param symbol
 * @param edges
 * @param symbols
 */
var constraint7 = function (symbol, edges, symbols) {

    var isSplitOperator = function (id) {
        var counterIn = 0;
        var counterOut = 0;
        for (var key in edges) {
            if (edges[key].symbolOnEnd.symbolId === id) {
                counterIn++;
            } else if (edges[key].symbolOnStart.symbolId === id) {
                counterOut++;
            }
        }
        return ((counterIn===1)&&(counterOut>1));
    };

    for (var key in edges) {
        if (edges[key].symbolOnStart.symbolId === symbol.id && (edges[key].symbolOnEnd.symbolType === "orOperator" ||
            edges[key].symbolOnEnd.symbolType === "xorOperator")) {
            if (isSplitOperator(edges[key].symbolOnEnd.symbolId)) {
                return false;
            }
        }
    }

    return true;

};
appConstraints["constraint7"] = constraint7;