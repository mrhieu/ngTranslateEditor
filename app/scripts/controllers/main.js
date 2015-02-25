'use strict';

/**
 * @ngdoc function
 * @name translatorApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the translatorApp
 */
angular.module('translatorApp')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.data = {};
    $scope.data.originalJson = null;
    $scope.data.items = [];

    $scope.readFile = function (files) {
      var JsonObj = null,
          f = files[0],
          reader = new FileReader();

      // Closure to capture the file information.
      reader.onload = (function (theFile) {
        return function(e) {
          JsonObj = JSON.parse(e.target.result);

          // Do something fun
          $scope.data.originalJson = JsonObj;
          _processData(JsonObj);
        };
      })(f);

      // Read in the image file as text
      reader.readAsText(f);
    }

    var _processData = function(jsonObj) {
      $scope.data.items = [];
      _traverse(jsonObj,log);
    }

    $scope.exportJson = function() {
      var str = _convertToJsonData($scope.data.items);

      var uri = 'data:application/json;charset=utf-8,' + escape(str);
      var downloadLink = document.createElement("a");
      downloadLink.href = uri;
      downloadLink.download = "data.json";

      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }

    // TO-DO
    var _convertToJsonData = function(items) {
      var jsonObj = {};
      var index = -1;

      var _traverse2 = function (o) {
        for (var i in o) {

          if (typeof o[i] == 'string') {
            index++;

          }

          if (o[i] !== null && typeof(o[i]) == 'object') {
            //going on step down in the object tree!!
            _traverse2(o[i]);
          }
        }
      }  

      _traverse2($scope.data.originalJson);   


      return JSON.stringify(angular.copy(items), null, 2);
    }

    //called with every property and it's value
    function log(key, value) {
      if (typeof value === 'string') {
        console.log(key + " : " + value);

        if (path.length) {
          key = path.join('.') + '.' + key;
        }

        $scope.data.items.push({
          key: key,
          en: value,
          translate: value
        });
      }
    }

    var path = [];
    var _traverse = function (o, func) {
      for (var i in o) {

        func.apply(this, [i, o[i]]);

        if (o[i] !== null && typeof(o[i]) == 'object') {
          path.push(i);
          //going on step down in the object tree!!
          _traverse(o[i], func);
          path.splice(path.length - 1, 1);
        }
      }
    }

    var _init = function() {
      $http.get('en.json')
        .then(function (response) {
          $scope.data.items = [];
          $scope.data.originalJson = response.data;
          _traverse(response.data, log);
        })
    }
    _init();
    
  });
