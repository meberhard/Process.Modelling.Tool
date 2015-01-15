/**
 * The constraintHelper is responsible to take the loaded constraints for the current modelling language
 * and send them back to the controller. Overriding controller data outside of the controller is not the best decision,
 * but works in this case.
 *
 * In a later stage of development other methods for injecting constraints defined as javascript should
 * be researched.
 *
 * The main controller of the application is loaded in the body-tag (see file index.html), the method angular.element
 * will search for the controller inside this element. After, the scope of the controller is accessible, so we
 * use scope.$apply to give the constraints to the controller.
 */

var scope = angular.element(document.getElementById("mainController")).scope();
scope.$apply(function(){
    scope.setConstraints(appConstraints);
});