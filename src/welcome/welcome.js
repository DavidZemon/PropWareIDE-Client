'use strict';

angular.module('propwareide.welcome', [
    'ngRoute',
    'ui.bootstrap',
    'mc.resizer'
  ])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/welcome', {
      templateUrl: 'src/welcome/welcome.html',
      controller: 'WelcomeCtrl',
      controllerAs: 'welcome'
    });
  }])
  .controller('WelcomeCtrl', WelcomeCtrl);

function WelcomeCtrl(File, DEFAULT_THEME, FILE_EXTENSION_MAP) {
  var vm = this;

  this.nav = {
    open: true
  };
  this.editor = {
    mode: this.find_theme(FILE_EXTENSION_MAP, 'Sample.cpp'),
    theme: DEFAULT_THEME,
    onLoad: function (editor) {
      vm.aceLoaded(editor);
    },
    require: [
      'ace/ext/language_tools'
    ],
    advanced: {
      fontSize: '13pt',
      enableSnippets: true,
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true
    }
  };
  this.project = {
    user: 'davidz',
    name: 'Sample',
    fileNames: [
      'Sample.cpp',
      'functions.cpp'
    ]
  };

  this.file = File.get({
    user: 'davidz',
    project: 'Sample',
    file: 'Sample.cpp'
  }, function (originalContent) {
    vm.originalContent = originalContent;
  });
}
WelcomeCtrl.prototype.aceLoaded = function (editor) {
  var vm = this;
  editor.commands.addCommand({
    name: 'save',
    bindKey: {
      win: 'Ctrl-S',
      mac: 'Command-S'
    },
    exec: function () {
      vm.saveFile();
    }
  });
};

WelcomeCtrl.prototype.saveFile = function () {
  this.file.$save();
};

WelcomeCtrl.prototype.find_theme = function (FILE_EXTENSION_MAP, file) {
  var extension = file.toLowerCase().split('.');
  extension = extension[extension.length - 1];

  console.log(extension);

  for (var key in FILE_EXTENSION_MAP)
    if (FILE_EXTENSION_MAP.hasOwnProperty(key))
      if (-1 < FILE_EXTENSION_MAP[key].indexOf(extension))
        return key;

  return 'text';
};

WelcomeCtrl.prototype.login = function () {

};

WelcomeCtrl.prototype.logout = function () {

};
