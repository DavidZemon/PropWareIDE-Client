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
    x86: [
      's'
    ]
  })
  .constant('SERVICE_URL', 'http://localhost:8080/propwareide/server/jas')
  .constant('DEFAULT_THEME', 'monokai')
  .factory('File', File);

function File($resource, SERVICE_URL) {
  return $resource(SERVICE_URL + '/file');
}
