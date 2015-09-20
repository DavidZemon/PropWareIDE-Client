'use strict';
/**
 * Created by david on 9/19/15.
 */

angular.module('propwareide', [
    'ui.ace',
    'cfp.hotkeys',
    'propwareide.common',
    'propwareide.welcome'
  ])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.otherwise({redirectTo: '/welcome'});
  }]);
