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
    'propwareide.welcome',
    'propwareide.login'
  ])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.otherwise({redirectTo: '/welcome'});
  }]);
