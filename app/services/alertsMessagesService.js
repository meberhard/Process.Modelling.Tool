modellingApp.service('serviceAlertMessages', function () {
    var serviceAlertMessages = {};
    var alert;

    serviceAlertMessages.sendMessage = function (type, msg) {
        alert = {
            type: type,
            msg: msg
        }
    };

    serviceAlertMessages.getAlert = function () {
        return alert;
    };

    return serviceAlertMessages;
});