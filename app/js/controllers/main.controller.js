'use strict';
angular
  .module('logicToolsApp')
  .controller('MainCtrl', function ($location) {
        this.goToTruth = function() {
            $location.path('/truth-tables');
        };
        this.goToFitch = function() {
            $location.path('/fitch');
        };
  });
