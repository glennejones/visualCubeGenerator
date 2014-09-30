(function (angular) {
  'use strict';
  angular.module('visualCubeGenerator.main.solve', ['ui.router'])

  .config(function ($stateProvider) {

    $stateProvider
      .state('visualCubeGenerator.main.solve', {
        url: '/solve',
        templateUrl: 'app/solve/solve.tpl.html',
        controller: 'SolveController'
      });
  })

  .controller('SolveController', ['$scope', 'solves', function ($scope, solves) {
      $scope.solves = solves.solves();
      $scope.averages = solves.averages();

      $scope.delete = function(solve) {
        solves.delete(solve).then(function() {
          $scope.$broadcast('solve-deleed', solve);
        });
      };
  }])

})(angular);