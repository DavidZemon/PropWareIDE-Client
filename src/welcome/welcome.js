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

function WelcomeCtrl($rootScope, $auth, ModalService, File, Project, DEFAULT_THEME, FILE_EXTENSION_MAP) {
  var vm = this;
  this.$rootScope = $rootScope;
  this.$auth = $auth;
  this.ModalService = ModalService;
  this.File = File;
  this.Project = Project;
  this.FILE_EXTENSION_MAP = FILE_EXTENSION_MAP;

  this.nav = {
    open: true
  };
  this.editorSettings = {
    theme: DEFAULT_THEME,
    onLoad: function (editor) {
      vm.aceLoaded(editor);
    },
    readOnly: true,
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
  this.currentFile = {};
}

WelcomeCtrl.prototype.aceLoaded = function (editor) {
  var vm = this;
  this.editor = editor;
  this.editor.commands.addCommand({
    name: 'save',
    bindKey: {
      win: 'Ctrl-S',
      mac: 'Command-S'
    },
    exec: function () {
      vm.saveFile();
    }
  });
  this.setEditorReadOnlyStatus();
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

WelcomeCtrl.prototype.setEditorReadOnlyStatus = function () {
  this.editor.setReadOnly(!this.currentFile.name);
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
  this.attemptFileClose();
  this.project = {};
  this.user = '';
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
  this.currentFile = {
    content: this.project.files[fileName],
    name: fileName
  };
  this.editorSettings.mode = this.find_theme(this.FILE_EXTENSION_MAP, this.currentFile.name);
  this.setEditorReadOnlyStatus();
  this.$rootScope.filename = ' - ' + fileName;
};

WelcomeCtrl.prototype.attemptFileClose = function () {
  if (this.currentFile.name) {
    if (this.currentFile.content !== this.project.files[this.currentFile.name]) {
      if (confirm('Are you sure you want to close ' + this.currentFile.name + '?'))
        this._closeFile();
    } else {
      this._closeFile();
    }
  }
};

WelcomeCtrl.prototype._closeFile = function () {
  this.currentFile = {};
  this.setEditorReadOnlyStatus();
  this.$rootScope.filename = '';
};

WelcomeCtrl.prototype.saveFile = function () {
  var vm = this;
  return this.file.$save(function () {
    vm.originalContent = vm.file.contents;
  });
};

WelcomeCtrl.prototype.newFile = function () {
  var vm = this;
  this.ModalService.showModal({
    templateUrl: 'src/login/login.html',
    controller: 'LoginCtrl',
    controllerAs: 'login'
  }).then(function (modal) {
    modal.element.modal();
    modal.close.then(function (filename) {
      vm.project.files[filename] = '';
    });
  });
};
