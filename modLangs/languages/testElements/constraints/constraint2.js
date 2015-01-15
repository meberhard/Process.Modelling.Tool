/**
 * Constraint C2
 * A designed model needs to contain two instances of orangeSymbol
 *
 * Iterate over the symbols, count the occurrences of the type "orangeSymbol" and check, if the counter is at least 2
 *
 * @param symbol
 * @param edges
 * @param symbols
 */
var constraint2 = function (edges, symbols) {
    var counter = 0;

    for (var key in symbols) {
        if (symbols[key].type === "orangeSymbol") {
            counter++;
        }
    }

    return (counter > 1);
};
appConstraints["constraint2"] = constraint2;