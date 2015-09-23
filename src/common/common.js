'use strict';

angular.module('propwareide.common', [
    'ngResource'
  ])
  .constant('FILE_EXTENSION_MAP', {
    c_cpp: [
      'c',
      'cc',
      'cpp',
      'cxx',
      'cogc',
      'cogcpp',
      'ecogc',
      'ecogcpp'
    ],
    assembly_x86: [
      's'
    ],
    markdown: [
      'md'
    ],
    d: [
      'd'
    ]
  })
  //.constant('SERVICE_URL', 'http://localhost:8080/propwareide/file-server/jas')
  .constant('SERVICE_URL', 'http://david.zemon.name:8080/propwareide/file-server/jas')
  .constant('DEFAULT_THEME', 'eclipse')
  .factory('File', File)
  .factory('Project', Project)
  .service('projectBuilder', ProjectBuilder);

function File($resource, SERVICE_URL) {
  return $resource(SERVICE_URL + '/file/:name', {
    name: '@name'
  }, {
    'get': {method: 'GET'},
    'save': {method: 'POST'},
    'query': {method: 'GET', isArray: true},
    'delete': {method: 'DELETE'},
    'create': {method: 'PUT'}
  });
}

function Project($resource, SERVICE_URL) {
  return $resource(SERVICE_URL + '/project/:name', {
    name: '@name'
  }, {
    'get': {method: 'GET'},
    'save': {method: 'POST'},
    'query': {method: 'GET', isArray: true},
    'delete': {method: 'DELETE'},
    'create': {method: 'PUT'}
  });
}

function ProjectBuilder($http, SERVICE_URL) {
  this.$http = $http;
  this.SERVICE_URL = SERVICE_URL;
}

ProjectBuilder.prototype.build = function (user, project) {
  return this._build(user, project, 'all');
};

ProjectBuilder.prototype.clean = function (user, project) {
  return this._build(user, project, 'clean');
};

ProjectBuilder.prototype._build = function (user, project, target) {
  this.$http({
    url: [this.SERVICE_URL, 'build', user, project].join('/'),
    params: {
      target: target
    },
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    responseType: 'arraybuffer'
  }).success(function (data) {
    var blob = new Blob([data], {type: 'application/octet-stream'});
    var objectUrl = URL.createObjectURL(blob);
    window.open(objectUrl);
  }).error(function () {
    // TODO: Handle errors
  });
};
