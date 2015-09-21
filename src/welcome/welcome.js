'use strict';

angular.module('propwareide.welcome', [
    'ngRoute',
    'angularModalService',
    'mc.resizer',
    'propwareide.login',
    'propwareide.openProject'
  ])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/welcome', {
      templateUrl: 'src/welcome/welcome.html',
      controller: 'WelcomeCtrl',
      controllerAs: 'welcome'
    });
  }])
  .controller('WelcomeCtrl', WelcomeCtrl);

function WelcomeCtrl($auth, ModalService, File, Project, DEFAULT_THEME, FILE_EXTENSION_MAP) {
  var vm = this;
  this.$auth = $auth;
  this.ModalService = ModalService;
  this.File = File;
  this.Project = Project;
  this.FILE_EXTENSION_MAP = FILE_EXTENSION_MAP;

  this.nav = {
    open: true
  };
  this.editor = {
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
  this.project = {};
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

WelcomeCtrl.prototype.find_theme = function (FILE_EXTENSION_MAP, file) {
  var extension = file.toLowerCase().split('.');
  extension = extension[extension.length - 1];

  for (var key in FILE_EXTENSION_MAP)
    if (FILE_EXTENSION_MAP.hasOwnProperty(key))
      if (-1 < FILE_EXTENSION_MAP[key].indexOf(extension))
        return key;

  return 'text';
};

WelcomeCtrl.prototype.login = function () {
  var vm = this;
  this.ModalService.showModal({
    templateUrl: 'src/login/login.html',
    controller: 'LoginCtrl',
    controllerAs: 'login'
  }).then(function (modal) {
    modal.element.modal();
    modal.close.then(function (user) {
      vm.user = user;
    });
  });
  //this.isAuthenticated = this.$auth.isAuthenticated();
};

WelcomeCtrl.prototype.logout = function () {
};

WelcomeCtrl.prototype.openProject = function () {
  var vm = this;
  this.ModalService
    .showModal({
      templateUrl: 'src/openProject/openProject.html',
      controller: 'OpenProjectCtrl',
      controllerAs: 'openProject',
      inputs: {
        user: vm.user
      }
    })
    .then(function (modal) {
      modal.element.modal();
      modal.close.then(function (project) {
        vm.project = vm.Project.get({
          user: vm.user,
          name: project
        });
      });
    });
};

WelcomeCtrl.prototype.openFile = function (fileName) {
  this.currentFile = this.project.files[fileName];
  this.editor.theme = this.find_theme(this.FILE_EXTENSION_MAP, fileName);
};

WelcomeCtrl.prototype.saveFile = function () {
  var vm = this;
  this.file.$save(function () {
    vm.originalContent = vm.file.contents;
  });
};
