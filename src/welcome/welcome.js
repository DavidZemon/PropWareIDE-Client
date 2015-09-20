'use strict';

angular.module('propwareide.welcome', [
    'ngRoute',
    'satellizer',
    'angularModalService',
    'mc.resizer'
  ])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/welcome', {
      templateUrl: 'src/welcome/welcome.html',
      controller: 'WelcomeCtrl',
      controllerAs: 'welcome'
    });
  }])
  .config(['$authProvider', function ($authProvider) {
    $authProvider.google({
      clientId: '57771016196-026qf5kvh98gvk1rlktf38790g355u9p.apps.googleusercontent.com'
    });
    $authProvider.github({
      clientId: 'bfcbfb3817bb92c6d5aa'
    });
  }])
  .controller('WelcomeCtrl', WelcomeCtrl);

function WelcomeCtrl($auth, ModalService, File, DEFAULT_THEME, FILE_EXTENSION_MAP) {
  var vm = this;
  this.$auth = $auth;
  this.ModalService = ModalService;

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

  for (var key in FILE_EXTENSION_MAP)
    if (FILE_EXTENSION_MAP.hasOwnProperty(key))
      if (-1 < FILE_EXTENSION_MAP[key].indexOf(extension))
        return key;

  return 'text';
};

WelcomeCtrl.prototype.login = function (provider) {
  this.user = this.$auth.authenticate(provider);
};

WelcomeCtrl.prototype.logout = function () {
  this.ModalService.showModal({
    templateUrl: 'src/login/login.html',
    controller: 'LoginCtrl',
    controllerAs: 'login'
  }).then(function (modal) {
    modal.element.modal();
    modal.close.then(function (result) {
    });
  });
};
