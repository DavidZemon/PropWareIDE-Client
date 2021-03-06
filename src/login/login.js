'use strict';

angular.module('propwareide.login', [
    'satellizer'
  ])
  .config(['$authProvider', function ($authProvider) {
    $authProvider.google({
      clientId: '57771016196-026qf5kvh98gvk1rlktf38790g355u9p.apps.googleusercontent.com'
    });
    $authProvider.github({
      clientId: 'bfcbfb3817bb92c6d5aa'
    });
  }])
  .controller('LoginCtrl', LoginCtrl);

function LoginCtrl($timeout, $auth, close) {
  var vm = this;

  this.close = close;
  this.$auth = $auth;
  this.username = '';
  $timeout(function () {
    vm.focus = true;
  }, 500);

}

LoginCtrl.prototype.dismissModal = function () {
  this.close('', 200);
};

LoginCtrl.prototype.login = function (provider) {
  //var vm = this;
  //this.$auth.authenticate(provider)
  //  .then(function (response) {
  //    console.log(response);
  //    vm.close(response, 200);
  //  })
  //  .catch(function (error) {
  //    console.log(error);
  //    vm.close({}, 200);
  //  });
  this.close(this.username, 200);
};
