'use strict';

/**
 * @ngdoc function
 * @name translatorApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the translatorApp
 */
angular.module('translatorApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
