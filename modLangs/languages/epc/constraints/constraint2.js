/**
 * Constraint C2
 * The current symbol has exactly one incoming and/or one outgoing edge
 *
 * @param symbol
 * @param edges
 * @param symbols
 */
var constraint2 = function (symbol, edges, symbols) {
    var counterIn = 0;
    var counterOut = 0;

    for (var key in edges) {
        if (edges[key].symbolOnEnd.symbolId === symbol.id) {
            counterIn++;
        } else if (edges[key].symbolOnStart.symbolId === symbol.id) {
            counterOut++;
        }
    }

    return ((counterIn===1 && counterOut===1) || (counterIn===1 && counterOut===0) || (counterIn===0 && counterOut===1));

};
appConstraints["constraint2"] = constraint2;