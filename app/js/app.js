'use strict';

angular
    .module('logicToolsApp', ['ui.router'])
    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('main', {
                url: '/',
                templateUrl: 'templates/main.html',
                controller: 'MainCtrl as main'
            })
            .state('truthTables', {
                url: '/truth-tables',
                templateUrl: 'templates/truth-table.html',
                controller: 'TruthTableCtrl as table'
            })
            .state('fitchSystems', {
                url: '/fitch',
                templateUrl: 'templates/fitch.html',
                controller: 'FitchCtrl as fitch'
            });
    })
