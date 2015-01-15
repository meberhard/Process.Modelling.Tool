modellingApp.directive('myDroppable', function () {
    return {
        scope: {
            drop: '&'
        },
        link: function (scope, element) {
            var el = element[0];

            el.addEventListener(
                'dragover',
                function (e) {
                    e.dataTransfer.dropEffect = 'move';
                    if (e.preventDefault()) e.preventDefault();
                    this.classList.add('over');
                    return false;
                },
                false
            );

            el.addEventListener(
                'dragenter',
                function () {
                    this.classList.add('over');
                    return false;
                },
                false
            );

            el.addEventListener(
                'dragleave',
                function () {
                    this.classList.remove('over');
                    return false;
                },
                false
            );

            el.addEventListener(
                'drop',
                function (e) {
                    if (e.stopPropagation()) e.stopPropagation();
                    this.classList.remove('over');
                    var item = document.getElementById(e.dataTransfer.getData('Text'));
                    var elPos = getPos(el);
                    var xCoord = e.clientX - elPos[0];
                    var yCoord = e.clientY - elPos[1];
                    scope.$apply(function (scope) {
                        var fn = scope.drop();
                        if ('undefined' !== typeof fn) {
                            fn(item.id, xCoord, yCoord, item.parentNode.id);
                        }
                    });
                    return false;
                },
                false
            );

            /**
             * Helper function for the dragDrop(ev): Gets the current x and y coordinates of the mouse, so the element
             * is dropped into the working area on the position of the mouse cursor
             * @param {Object} ele The DOM Element
             * @return {Object} An array, containing the x and y coordinates [x, y]
             */
            function getPos(ele) {
                var x = 0;
                var y = 0;
                while (true) {
                    x += ele.offsetLeft;
                    y += ele.offsetTop;
                    if (ele.offsetParent === null) {
                        break;
                    }
                    ele = ele.offsetParent;
                }
                return [x, y];
            }
        }
    }
});