/**
 * This directive is used to validate against the constraints whenever the attributes of a notation symbol are changed.
 * In order to achieve this, we change the attributes as altered and validate against the constraints. If the
 * validation passes, this function will return true. If not, the attribute is changed back and the user interface
 * rendered accordingly.
 */
modellingApp.directive('validateAttribute', function (serviceElements) {
    return {
        require: 'ngModel',
        link: function (scope, elem, attr, ngModel) {

            ngModel.$parsers.unshift(function (newValue) {
                var oldValue;
                var symbol = serviceElements.getSymbol(scope.currentSelectedElement.id);

                for (var attrKey in symbol.attributes) {
                    if (symbol.attributes[attrKey].key === attr.validateAttribute) {
                        oldValue = symbol.attributes[attrKey].value;
                        symbol.attributes[attrKey].value = newValue;
                    }
                }

                var isValid = serviceElements.validateAdHocConstraintsAttributes(symbol, scope.constraints, scope.modLangConstraints);

                if (!isValid) {
                    for (var attrKey in symbol.attributes) {
                        if (symbol.attributes[attrKey].key === attr.validateAttribute) {
                            symbol.attributes[attrKey].value = oldValue;
                        }
                    }
                    ngModel.$setViewValue(oldValue);
                    ngModel.$render();
                    return oldValue;
                }

                return isValid ? newValue : oldValue;
            });

        }
    }
});