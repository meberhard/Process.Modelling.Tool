/**
 * This directive is added to the <script> tag, which adds the constraints of the current modelling language to the
 * page. After the last constraint is added (last iteration of ng-repeat), the function will call
 * 'setConstraintHelperScriptPath' of the mainController. This will cause the "constraintHelper.js" script to be
 * added, which will inject the loaded constraints into the controller. (compare app/utility/constraintHelper.js)
 *
 */
modellingApp.directive('constraintHelper', function ($timeout) {
    return function (scope,attr) {
        if (scope.$last === true) {
            $timeout(function() {
                scope.loadConstraints();
            });
        }
    }
});