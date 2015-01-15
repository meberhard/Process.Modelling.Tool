/**
 * Constraint C8
 * A process contains at least one start event and one terminal event (a start event only has an outgoing edge, while a
 * terminal event only has an incoming edge)
 *
 * @param edges
 * @param symbols
 */
var constraint8 = function (edges, symbols) {
    var hasStartEvent = false;
    var hasTerminalEvent = false;

    var checkIfStartEvent = function (id) {
        var inCounter = 0;
        var outCounter = 0;
        for (var key in edges) {
            if (edges[key].symbolOnEnd.symbolId === id) {
                inCounter++;
            } else if (edges[key].symbolOnStart.symbolId === id) {
                outCounter++;
            }
        }
        if ((inCounter===0)&&(outCounter>0)) {
            hasStartEvent = true;
        }
    };

    var checkIfTerminalEvent = function (id) {
        var inCounter = 0;
        var outCounter = 0;
        for (var key in edges) {
            if (edges[key].symbolOnEnd.symbolId === id) {
                inCounter++;
            } else if (edges[key].symbolOnStart.symbolId === id) {
                outCounter++;
            }
        }
        if ((inCounter>0)&&(outCounter===0)) {
            hasTerminalEvent = true;
        }
    };

    for (var key in symbols) {
        if (symbols[key].type === "event") {
            checkIfStartEvent(symbols[key].id);
            checkIfTerminalEvent(symbols[key].id);
        }
    }

    return hasStartEvent&&hasTerminalEvent;

};
appConstraints["constraint8"] = constraint8;