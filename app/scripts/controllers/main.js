'use strict';

/**
 * @ngdoc function
 * @name translatorApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the translatorApp
 */
angular.module('translatorApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
