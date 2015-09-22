'use strict';
/**
 * Created by david on 9/19/15.
 */

angular.module('propwareide', [
    'angulartics',
    'angulartics.google.analytics',
    'ui.ace',
    'ui.bootstrap',
    'cfp.hotkeys',
    'propwareide.common',
    'propwareide.welcome'
  ])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.otherwise({redirectTo: '/welcome'});
  }])
  .directive('syncFocusWith', function () {
    return {
      restrict: 'A',
      scope: {
        focusValue: '=syncFocusWith'
      },
      link: function ($scope, $element) {
        $scope.$watch('focusValue', function (currentValue, previousValue) {
          if (currentValue === true && !previousValue) {
            $element[0].focus();
          } else if (currentValue === false && previousValue) {
            $element[0].blur();
          }
        });
      }
    };
  });
