modellingApp.directive('downloadLink', function () {
    return function (scope, element) {
        var el = element[0];

        scope.$on('downloadModelEvent', function (event, args) {
            el.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(args[0])));
            el.setAttribute('download', args[0].key + '.json');
            el.click();
        });
    }
});