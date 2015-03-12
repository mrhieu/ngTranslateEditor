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
    var _path = [];

    $scope.data = {};
    // $scope.data.originalJson = null;
    $scope.data.items = {
      source: {},
      dest: {}
    };
    $scope.data.finalJson = {};

    $scope.readFile = function (files, target) {
      var JsonObj = null,
          f = files[0],
          reader = new FileReader();

      // Closure to capture the file information.
      reader.onload = (function (theFile) {
        return function(e) {
          JsonObj = JSON.parse(e.target.result);

          // Do something fun
          _processData(JsonObj, target);

          // If 2 files imported, start to do the most interesting thing
          if (!angular.equals($scope.data.items.source, {}) && !angular.equals($scope.data.items.dest, {})) {
            $scope.$apply(function() {
              $scope.data.finalJson = _mergeTranslation($scope.data.items.source, $scope.data.items.dest);
            });
          }
        };
      })(f);

      // Read in the image file as text
      reader.readAsText(f);
    }

    var _processData = function(jsonObj, target) {
      $scope.data.items[target] = {};
      _traverse(jsonObj, _log, target);
    }

    var _mergeTranslation = function(s, d) {
      var result = {};
      angular.forEach(s, function(value, key) {
        result[key] = d[key];
      })

      return result;
    }

    $scope.exportJson = function() {
      var str = _convertToJsonData($scope.data.finalJson);

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
      // var jsonObj = {};
      // var index = -1;

      // var _traverse2 = function (o) {
      //   for (var i in o) {

      //     if (typeof o[i] == 'string') {
      //       index++;

      //     }

      //     if (o[i] !== null && typeof(o[i]) == 'object') {
      //       //going on step down in the object tree!!
      //       _traverse2(o[i]);
      //     }
      //   }
      // }  

      // // _traverse2($scope.data.originalJson);   


      return JSON.stringify(angular.copy(items), null, 2);
    }

    //called with every property and it's value
    function _log(key, value, target) {
      if (typeof value === 'string') {
        if (_path.length) {
          key = _path.join('.') + '.' + key;
        }

        // console.log(key + " : " + value);
        $scope.data.items[target][key] = value;
      }
    }
    
    var _traverse = function (o, callback, target) {
      for (var i in o) {
        callback.apply(this, [i, o[i], target]);

        if (o[i] !== null && typeof(o[i]) == 'object') {
          _path.push(i);
          //going on step down in the object tree!!
          _traverse(o[i], callback, target);
          _path.splice(_path.length - 1, 1);
        }
      }
    }

    var _deep_value = function(obj, _path){
      for (var i=0, _path=_path.split('.'), len=_path.length; i<len; i++){
        obj = obj[_path[i]];
      };
      return obj;
    };

    var _init = function() {
      // Test with the intial json file
      $http.get('en.json')
        .then(function (response) {
          _traverse(response.data, _log, 'source');
        })
    }
    // _init();
  });
