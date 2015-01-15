modellingApp.directive('myDraggable', function () {
    return function (scope, element) {
        var el = element[0];

        el.draggable = true;

        el.addEventListener(
            'dragstart',
            function (e) {
                e.dataTransfer.setData('Text', this.id);
                this.classList.add('drag');
                return false;
            },
            false
        );

        el.addEventListener(
            'dragend',
            function () {
                this.classList.remove('drag');
                return false;
            },
            false
        );
    }
});