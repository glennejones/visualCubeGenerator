angular.module('cube.services', [])

.factory("Scrambler333", function() {
  scramblers["333"].initialize(null, Math);
  return scramblers["333"];
})

.factory("Scrambles", ['Scrambler333', function(scrambler) {
  var formatScramble = function(scrambleString) {
    var newString = "";
    var chunkLength = 4;
    var chunks = scrambleString.split(/\s+/);
    for (var i = 0; i < chunks.length; i++) {
      if (i === 0) {
        newString = newString.concat("<span class='chunk'>");
      } else if (i === chunks.length -1) {
        newString = newString.concat("</span>");
      } else {
        if ((i) % chunkLength == 0) {
          newString = newString.concat("</span> <span class='chunk'>");
        } else {
          newString = newString.concat(" ");
        }
      }
      newString = newString.concat(chunks[i]);
    }
    return newString;
  };

  var generateScrambles = function(max) {
    var scrambles = [];
    for (var count = 0; count < max; count++) {
      // Generate a random scramble
      var randomScramble = {
        id: count,
        moves: scrambler.getRandomScramble().scramble_string,
        state: scrambler.getRandomScramble().state,
        movesFormatted: formatScramble(scrambler.getRandomScramble().scramble_string)
      }
      scrambles.push(randomScramble);
    }
    return scrambles;
  }

  var scrambles = generateScrambles(5);

  return {
    all: function() {
      return scrambles;
    },
    get: function(id) {
      return scrambles[id];
    },
    regenerate: function() {
      scrambles = generateScrambles(5);
    }
  };
}])

.directive("scramble", ["Scrambler333", "Scrambles", function(scrambler, scrambles) {
  return {
    restrict: 'E',
    replace: true,
    require: '^scrambleModel',
    scope: {
      scrambleModel: '='
    },
    templateUrl: "templates/scramble.html",
    link: function (scope, element, attrs) {
      scope.width = attrs.width;
    }
  }
}])

.directive("scrambleGraphic", ["Scrambler333", function(scrambler) {
  return {
    restrict: 'E',
    replace: true,
    require: '^scrambleState',
    scope: {
      scrambleState: '='
    },
    link: function (scope, element, attrs) {
      var div = angular.element("<div class='graphic'/>");
      element.append(div);
      var width = div[0].offsetWidth,
         height = Math.round(width * 2.0 / 3.0);
      scrambler.drawScramble(div[0], scope.scrambleState, width, height);
    }
  }
}])

.directive("scrambleModel", function() {
  return {
    restrict: 'A',
    controller: function($scope) {

    }
  }
})

.directive("scrambleState", function() {
  return {
    restrict: 'A',
    controller: function($scope) {

    }
  }
})

// Takes a time in millisecons and diplays it as m:ss.mils
.filter('time', function () {
  var pad = function(input) {
    var n = input;
    return (n < 10) ? '0' + n : n;
  };

  return function (input) {
    var minutes = Math.floor(input/60000);
    var seconds = Math.floor((input % 60000)/1000);
    var millis = input % 60000 - seconds*1000;
    return minutes + ":" + pad(seconds) + "." + millis;
  }
})
;