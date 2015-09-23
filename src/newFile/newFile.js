'use strict';

angular.module('propwareide.newFile', [])
  .controller('NewFileCtrl', NewFileCtrl);

function NewFileCtrl($timeout, close, defaultFileName) {
  var vm = this;

  this.close = close;
  $timeout(function () {
    vm.focus = true;
  }, 500);
  this.filename = defaultFileName;
}

NewFileCtrl.prototype.create = function () {
  this.close(this.filename.replace(/\./g, '$'), 200);
};
