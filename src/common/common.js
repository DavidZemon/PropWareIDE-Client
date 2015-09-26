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

ProjectBuilder.prototype.build = function (user, project, cmakeOptions, makeOptions) {
  return this._build(user, project, cmakeOptions, makeOptions, ['all']);
};

ProjectBuilder.prototype._build = function (user, project, cmakeOptions, makeOptions, targets) {
  var _this = this;
  this.$http({
    url: [this.SERVICE_URL, 'build', user, project].join('/'),
    method: 'POST',
    data: {
      cmakeOptions: !!cmakeOptions ? cmakeOptions : {},
      makeOptions: !!makeOptions ? makeOptions : {},
      targets: targets
    },
    headers: {
      'Content-type': 'application/json'
    }
  }).success(function (buildResponse) {
    console.log(buildResponse.cmakeResult.output);
    console.log(buildResponse.makeResult.output);

    if (buildResponse.binary) {
      var blob = _this.b64toBlob(buildResponse.binary);
      var elfUrl = URL.createObjectURL(blob);
      var anchor = document.createElement('a');
      anchor.download = project + '.elf';
      anchor.href = elfUrl;
      anchor.click();
    }
  }).error(function () {
    // TODO: Handle errors
  });
};

ProjectBuilder.prototype.b64toBlob = function (b64Data) {
  var sliceSize = 512;

  var byteCharacters = atob(b64Data);
  var byteArrays = [];

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize);

    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    var byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, {type: 'application/octet-stream'});
};
