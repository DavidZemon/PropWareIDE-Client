'use strict';

angular.module('propwareide.login', [
  ])
  .controller('LoginCtrl', LoginCtrl);

function LoginCtrl(close) {
  this.close = close;
}

LoginCtrl.prototype.dismissModal = function (result) {
  this.close(result, 200);
};
