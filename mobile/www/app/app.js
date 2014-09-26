// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('visualCubeGenerator', ['ionic', 'ngCordova', 'cube.solve', 'cube.scramble', 'cube.scrambles'])

.run(function($ionicPlatform, $cordovaSplashscreen) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    if (window.navigator && window.navigator.splashscreen) {
      $cordovaSplashscreen.hide();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    // setup an abstract state for the tabs directive
    .state('tab', {
      url: "/tab",
      abstract: true,
      templateUrl: "app/tabs.html"
    })

    // Each tab has its own nav history stack:

    .state('tab.dash', {
      url: '/dash',
      views: {
        'tab-dash': {
          templateUrl: 'app/solve/tab-dash.html',
          controller: 'SolvesCtrl'
        }
      }
    })

    .state('tab.scrambles', {
      url: '/scrambles',
      views: {
        'tab-scrambles': {
          templateUrl: 'app/scramble/list/tab-scrambles.html',
          controller: 'ScramblesCtrl'
        }
      }
    })
    .state('tab.scramble-detail', {
      url: '/scramble/:scrambleId',
      views: {
        'tab-scrambles': {
          templateUrl: 'app/scramble/detail/scramble-detail.html',
          controller: 'ScrambleCtrl'
        }
      }
    })

    .state('tab.account', {
      url: '/account',
      views: {
        'tab-account': {
          templateUrl: 'app/account/tab-account.html'
          // controller: 'AccountCtrl'
        }
      }
    })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/scrambles');

});
