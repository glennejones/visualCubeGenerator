/* global scramblers:false */
'use strict';
(function (angular) {
  angular.module('cube.scramble.services', [])

  .factory('Scrambler333', function() {
    scramblers['333'].initialize(null, Math);
    return scramblers['333'];
  })

  .factory('scrambles', function(Scrambler333, $q, $timeout) {
    var scrambler = Scrambler333;
    var generateScrambles = function(max) {
      var scrambles = [];
      for (var count = 0; count < max; count++) {
        // Generate a random scramble
        var scrambleLoop = scrambler.getRandomScramble();
        var randomScramble = {
          /* jshint -W106 */
          moves: scrambleLoop.scramble_string.trim(),
          /* jshint +W106 */
          state: scrambleLoop.state,
        };
        scrambles.push(randomScramble);
      }
      return scrambles;
    };

    var scrambles = generateScrambles(5);

    return {
      all: function() {
        return scrambles;
      },
      get: function(index) {
        return scrambles[index];
      },
      regenerate: function() {
        var deferred = $q.defer();
        $timeout(function() {
          try {
            scrambles = generateScrambles(5);
            deferred.resolve('Scrambles generated');
          } catch(error) {
            deferred.reject(error);
          }
        }, 10);
        return deferred.promise;
      }
    };
  })

  .directive('scrambleView', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        scramble: '=scramble'
      },
      templateUrl: 'cube/scramble/scramble-view.tpl.html',
      link: function (scope, element, attrs) {
        scope.width = attrs.width;
      }
    };
  })

  .directive('scrambleGraphic', function($timeout, Scrambler333) {
    var scrambler = Scrambler333;
    return {
      restrict: 'E',
      replace: true,
      scope: {
        state: '=state'
      },
      link: function (scope, element, attrs) {
        scope.$watch('state', function() {
          if (!scope.state) return;
          var div = angular.element('<div class="graphic"/>');
          if (attrs.class) {
            div.addClass(attrs.class);
          }
          element.append(div);
          $timeout(function(){
          var width = div[0].offsetWidth,
            height = Math.round(width * 2.0 / 3.0);
            scrambler.drawScramble(div[0], scope.state, width, height);
          });
        });
      }
    };
  })

  .directive('scrambleMoves', function($document) {
    return {
      restrict: 'E',
      scope: {
        moves: '=moves'
      },

      link: function (scope, element, attrs) {
        scope.$watch('moves', function() {
          if (!scope.moves) {
            return;
          }
          var outer = angular.element('<div class="moves"/>');
          if (attrs.class) {
            outer.addClass(attrs.class);
          }
          var chunkLength = 4;
          var chunks = scope.moves.split(/\s+/);
          var inner;
          for (var i = 0; i < chunks.length; i++) {
            if ((i) % chunkLength === 0) {
              inner = angular.element('<span class="chunk"/>');
              outer.append(inner);
              outer.append($document[0].createTextNode(' '));
            }
            inner.text(inner.text() + ' ' + chunks[i]);
          }
          element.append(outer);
        });
      }
    };
  })

  .directive('scrambleState', function($document) {
    return {
      restrict: 'E',
      scope: {
        state: '=state'
      },
      link: function (scope, element, attrs) {
        scope.$watch('state', function() {
          var cube = angular.element('<div class="cubeState"/>');
          if (attrs.class) {
            cube.addClass(attrs.class);
          }
          var rowLength = 3;
          var faceLength = 9;
          var tiles = scope.state;
          var face, row;
          for (var i = 0; i < tiles.length; i++) {
            if ((i) % faceLength === 0) {
              face = angular.element('<span class="cubeFace"/>');
              cube.append(face);
              cube.append($document[0].createTextNode(' '));
            }
            if ((i) % rowLength === 0) {
              row = angular.element('<span class="cubeRow"/>');
              face.append(row);
              face.append($document[0].createTextNode(' '));
            }
            row.text(row.text() + ' ' + tiles[i]);
          }
          element.append(cube);
        });
      }
    };
  })
  ;
})(angular);
