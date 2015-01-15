modellingApp.directive('fileupload', function (serviceImportModel) {
    return function (scope, element) {
        element.bind("change", function (e) {
            serviceImportModel.setImportModel(e.target.files[0]);
        });
    }
});