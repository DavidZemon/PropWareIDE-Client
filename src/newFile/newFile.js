'use strict';

angular.module('propwareide.newFile', [])
  .controller('NewFileCtrl', NewFileCtrl);

function NewFileCtrl($timeout, close) {
  var vm = this;

  this.close = close;
  $timeout(function () {
    vm.focus = true;
  }, 500);
  this.filename = 'untitled';
}

NewFileCtrl.prototype.create = function () {
  this.close(this.filename, 200);
};
