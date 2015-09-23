'use strict';

angular.module('propwareide.userInput', [])
  .controller('UserInputCtrl', UserInputCtrl);

function UserInputCtrl($timeout, close, header, prompt, placeholder) {
  var vm = this;

  this.close = close;
  this.header = header;
  this.prompt = prompt;
  this.placeholder = placeholder;
  this.userInput = '';
  $timeout(function () {
    vm.focus = true;
  }, 500);
}

UserInputCtrl.prototype.submit = function () {
  this.close(this.userInput.replace(/\./g, '$'), 200);
};
