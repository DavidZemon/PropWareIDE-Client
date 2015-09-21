'use strict';

angular.module('propwareide.openProject', [
  ])
  .controller('OpenProjectCtrl', OpenProjectCtrl);

function OpenProjectCtrl(close, Project, user) {
  this.close = close;

  this.projects = Project.query({
    user: user
  });
}

