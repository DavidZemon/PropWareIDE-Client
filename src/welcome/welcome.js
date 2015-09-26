'use strict';

angular.module('propwareide.welcome', [
    'ngRoute',
    'angularModalService',
    'mc.resizer',
    'propwareide.login',
    'propwareide.userInput',
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

function WelcomeCtrl($rootScope, $auth, ModalService, File, Project, projectBuilder, DEFAULT_THEME, FILE_EXTENSION_MAP) {
  var vm = this;
  this.$rootScope = $rootScope;
  this.$auth = $auth;
  this.ModalService = ModalService;
  this.File = File;
  this.Project = Project;
  this.projectBuilder = projectBuilder;
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
  this.cmakeOptions = {
    MODEL: 'lmm'
  };
  this.makeOptions = {};
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
  this.editor.commands.addCommand({
    name: 'build',
    bindKey: {
      win: 'Ctrl-B',
      mac: 'Command-B'
    },
    exec: function () {
      vm.build();
    }
  });
  this.setEditorReadOnlyStatus();
};

WelcomeCtrl.prototype.findTheme = function (FILE_EXTENSION_MAP, file) {
  var extension = file.toLowerCase().split('$');
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
        user: vm.user.toLowerCase()
      }
    })
    .then(function (modal) {
      modal.element.modal();
      modal.close.then(function (project) {
        vm.project = vm.Project.get({
          user: vm.user.toLowerCase(),
          name: project
        });
        vm.files = vm.File.query({
          user: vm.user.toLowerCase(),
          project: project
        }, function (files) {
          console.log(files);
        });
      });
    });
};

WelcomeCtrl.prototype.closeProject = function () {
  if (this.attemptFileClose()) {
    this.project = {};
  }
};

WelcomeCtrl.prototype.newProject = function () {
  var vm = this;
  this.ModalService.showModal({
    templateUrl: 'src/userInput/userInput.html',
    controller: 'UserInputCtrl',
    controllerAs: 'userInput',
    inputs: {
      header: 'Create new project',
      prompt: 'Project name',
      placeholder: 'New_Project'
    }
  }).then(function (modal) {
    modal.element.modal();
    modal.close.then(function (projectName) {
      if (projectName) {
        var project = new vm.Project();
        project.name = projectName;
        project.fileNames = [];
        project.$create({
          user: vm.user.toLowerCase(),
          name: project.name
        }, function () {
          vm.project = project;
          vm.files = vm.File.query({
            user: vm.user.toLowerCase(),
            project: project.name
          });
        }, function () {
          // TODO: Handle errors
        });
      }
    });
  });

};

WelcomeCtrl.prototype.openFile = function (file) {
  if (file.name !== this.currentFile.name)
    if (this.attemptFileClose()) {
      this.currentFile = {
        name: file.name,
        content: file.content
      };
      this.editorSettings.mode = this.findTheme(this.FILE_EXTENSION_MAP, this.currentFile.name);
      this.setEditorReadOnlyStatus();
      this.$rootScope.filename = ' - ' + this.currentFile.name.replace(/\$/g, '.');
    }
};

WelcomeCtrl.prototype._getFileContentByName = function (fileName) {
  var index = -1;
  this.files.some(function (file, i) {
    if (file.name === fileName) {
      index = i;
      return true;
    }
  });
  return this.files[index].content;
};

WelcomeCtrl.prototype._getFileIndexByName = function (fileName) {
  var index;
  this.files.some(function (file, i) {
    if (file.name === fileName) {
      index = i;
      return true;
    }
  });
  return index;
};

WelcomeCtrl.prototype.attemptFileClose = function () {
  if (this.isFileOpen())
    if (!this.isFilePristine())
      if (!this.hasUserConfirmedClose())
        return false;
  this._closeFile();
  return true;
};

WelcomeCtrl.prototype.isFileOpen = function () {
  return this.currentFile.name;
};

WelcomeCtrl.prototype.isFilePristine = function () {
  if (this.currentFile.name)
    return this.currentFile.content === this._getFileContentByName(this.currentFile.name);
  else
    return true;
};

WelcomeCtrl.prototype.hasUserConfirmedClose = function () {
  return confirm('Are you sure you want to close ' + this.currentFile.name.replace(/\$/g, '.') + ' without saving?');
};

WelcomeCtrl.prototype._closeFile = function () {
  this.currentFile = {};
  this.setEditorReadOnlyStatus();
  this.$rootScope.filename = '';
};

WelcomeCtrl.prototype.saveFile = function () {
  var index = this._getFileIndexByName(this.currentFile.name);
  var fileToSave = this.files[index];
  var originalContent = fileToSave.content;
  fileToSave.content = this.currentFile.content;
  return fileToSave.$save({
    user: this.user.toLowerCase(),
    project: this.project.name
  }, function () {
  }, function () {
    // TODO: Present the error to the user
    fileToSave.content = originalContent;
  });
};

WelcomeCtrl.prototype.newFile = function () {
  var vm = this;
  this.ModalService.showModal({
    templateUrl: 'src/userInput/userInput.html',
    controller: 'UserInputCtrl',
    controllerAs: 'userInput',
    inputs: {
      header: 'Create new file',
      prompt: 'File name',
      placeholder: 'Untitled.cpp'
    }
  }).then(function (modal) {
    modal.element.modal();
    modal.close.then(function (filename) {
      if (filename) {
        var file = new vm.File();
        file.name = filename;
        file.content = '';
        file.$create({
          user: vm.user.toLowerCase(),
          project: vm.project.name,
          name: filename
        }, function () {
          vm.files.push(file);
          vm.project.files.push(filename);
        }, function () {
          // TODO: Handle errors
        });
      }
    });
  });
};

WelcomeCtrl.prototype.renameFile = function () {
  var vm = this;
  this.ModalService.showModal({
    templateUrl: 'src/userInput/userInput.html',
    controller: 'UserInputCtrl',
    controllerAs: 'userInput',
    inputs: {
      header: 'Rename file',
      prompt: 'File name',
      placeholder: 'NewFileName.cpp'
    }
  }).then(function (modal) {
    modal.element.modal();
    modal.close.then(function (filename) {
      if (filename) {
        var file = new vm.File();
        file.name = filename;
        file.content = '';
        file.$create({
          user: vm.user.toLowerCase(),
          project: vm.project.name,
          name: filename
        }, function () {
          vm.files.push(file);
          vm.project.fileNames.push(filename);
          file.content = vm.currentFile.content;
          file.$save({
            user: vm.user.toLowerCase(),
            project: vm.project.name
          }, function () {
            vm.deleteFile(false);
            vm.openFile(file);
          }, function () {
            // TODO: Present the error to the user
          });
        }, function () {
          // TODO: Handle errors
        });
      }
    });
  });
};

WelcomeCtrl.prototype.deleteFile = function (shouldConfirm) {
  var fileNameToDelete = this.currentFile.name;

  if (typeof shouldConfirm === 'undefined' || shouldConfirm)
    if (!confirm('Are you sure you want to delete ' + fileNameToDelete.replace(/\$/g, '.') + '?'))
      return false;

  var vm = this;
  var fileToDelete = this.files[this._getFileIndexByName(fileNameToDelete)];
  fileToDelete.$delete({
    user: this.user.toLowerCase(),
    project: this.project.name
  }, function () {
    var projectFilesIndex = vm.project.fileNames.indexOf(fileNameToDelete);
    vm.project.fileNames.splice(projectFilesIndex, 1);

    // Since this call is async, it's possible that another file was already opened. If that's the case, don't close
    // the current file
    if (vm.currentFile.name === fileNameToDelete)
      vm.currentFile = {};
    vm.files.splice(vm._getFileIndexByName(fileNameToDelete), 1);
    vm.setEditorReadOnlyStatus();
  }, function () {
    // TODO: Handle error
  });
  return true;
};

WelcomeCtrl.prototype.build = function () {
  this.projectBuilder.build(this.user.toLowerCase(), this.project.name, this.cmakeOptions, this.makeOptions);
};
