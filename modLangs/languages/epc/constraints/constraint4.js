/**
 * Constraint C4
 * An operator (and, xor, or) has either one incoming edge and many outgoing edges,
 * or many incoming edges and one outgoing edge
 *
 * @param symbol
 * @param edges
 * @param symbols
 */
var constraint4 = function (symbol, edges, symbols) {
    var counterIn = 0;
    var counterOut = 0;

    for (var key in edges) {
        if (edges[key].symbolOnEnd.symbolId === symbol.id) {
            counterIn++;
        } else if (edges[key].symbolOnStart.symbolId === symbol.id) {
            counterOut++;
        }
    }

    if (counterIn===1) {
        return (counterOut>1);
    } else if (counterOut===1) {
        return (counterIn>1);
    } else {
        return false;
    }

};
appConstraints["constraint4"] = constraint4;