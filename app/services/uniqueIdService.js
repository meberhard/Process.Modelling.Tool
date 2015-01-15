/**
 * Created by meberhard on 6/29/14.
 */
modellingApp.service('serviceUniqueId', function () {
    var serviceUniqueId = {};
    var id = 0;

    serviceUniqueId.setStartId = function (startId) {
        id = startId;
    };

    serviceUniqueId.getCurrentId = function () {
        return id;
    };

    serviceUniqueId.generateUniqueId = function () {
        return id++;
    };

    return serviceUniqueId;
});