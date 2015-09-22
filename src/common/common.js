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
  .constant('SERVICE_URL', 'http://localhost:8080/propwareide/server/jas')
  //.constant('SERVICE_URL', 'http://david.zemon.name:8080/propwareide/server/jas')
  .constant('DEFAULT_THEME', 'eclipse')
  .factory('File', File)
  .factory('Project', Project);

function File($resource, SERVICE_URL) {
  return $resource(SERVICE_URL + '/file/:name', {
    name: '@name'
  }, {
    'get':    {method:'GET'},
    'save':   {method:'POST'},
    'query':  {method:'GET', isArray:true},
    'delete': {method:'DELETE'},
    'create': {method:'PUT'}
  });
}

function Project($resource, SERVICE_URL) {
  return $resource(SERVICE_URL + '/project/:name', {
    name: '@name'
  }, {
    'get':    {method:'GET'},
    'save':   {method:'POST'},
    'query':  {method:'GET', isArray:true},
    'delete': {method:'DELETE'},
    'create': {method:'PUT'}
  });
}
