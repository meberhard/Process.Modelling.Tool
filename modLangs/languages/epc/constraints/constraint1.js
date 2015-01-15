/**
 * Constraint C1
 * The current symbol has exactly one incoming and one outgoing edge
 *
 * @param symbol
 * @param edges
 * @param symbols
 */
var constraint1 = function (symbol, edges, symbols) {
    var counterIn = 0;
    var counterOut = 0;

    for (var key in edges) {
        if (edges[key].symbolOnEnd.symbolId === symbol.id) {
            counterIn++;
        } else if (edges[key].symbolOnStart.symbolId === symbol.id) {
            counterOut++;
        }
    }

    return (counterIn===1 && counterOut===1);

};
appConstraints["constraint1"] = constraint1;