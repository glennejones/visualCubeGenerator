'use strict';
(function (angular) {
  angular.module('visualCubeGenerator.main.solve.list', ['ui.router'])

  .config(function ($stateProvider) {
    $stateProvider
      .state('visualCubeGenerator.main.solve-list', {
        url: '/solves',
        templateUrl: 'app/solve/list/solve-list.tpl.html',
        controller: 'SolveListController'
      });
  })

  .controller('SolveListController', function ($scope, solveModel) {
    $scope.solveModel = solveModel;
  });
})(angular);
