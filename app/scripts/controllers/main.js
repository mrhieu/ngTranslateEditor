'use strict';

/**
 
Synchronize and merge the tranlated text from 2 json files
1. Flatten the nested Object in to 1-key-value layer
2. Merge the 2 object. Take all the KEYs from the source file then fill up all the respective VALUEs taken from the 
dest file. If there is any KEYs insufficent, leave it blank for the editor to submit
3. Export the merged file into JSON file.
4. Cheers.

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
    $scope.data.files = {
      source: '',
      dest: ''
    }
    $scope.data.disableDownload = true;

    $scope.readFile = function (files, target) {
      var JsonObj = null,
          f = files[0],
          reader = new FileReader();

      // Closure to capture the file information.
      reader.onload = (function (theFile) {
        return function(e) {
          JsonObj = JSON.parse(e.target.result);

          $scope.data.files[target] = theFile.name;

          // Do something fun
          _processData(JsonObj, target);

          // If 2 files imported, start to do the most interesting thing
          if (!angular.equals($scope.data.items.source, {}) && !angular.equals($scope.data.items.dest, {})) {
            $scope.$apply(function() {
              $scope.data.finalJson = _mergeTranslation($scope.data.items.source, $scope.data.items.dest);
              $scope.data.disableDownload = false;
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
      var result = [];
      angular.forEach(s, function(value, key) {
        result.push({
          key: key,
          en: value,
          translate: (angular.isUndefined(d[key])?'':d[key])
        });
      })

      return result;
    }

    $scope.exportJson = function() {
      var str = _convertToJsonData($scope.data.finalJson);

      var uri = 'data:application/json;charset=utf-8,' + encodeURIComponent(str);
      var downloadLink = document.createElement("a");
      downloadLink.href = uri;
      downloadLink.download = $scope.data.files.dest;

      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }

    // TO-DO
    var _convertToJsonData = function(items) {
      var json = {};

      angular.forEach(items, function(item) {
        _assign(json, item.key.split('.'), item.translate);
      })

      return JSON.stringify(json, null, 2);
    }

    // src: http://stackoverflow.com/questions/5484673/javascript-how-to-dynamically-create-nested-objects-using-object-names-given-by
    function _assign(obj, keyPath, value) {
      var lastKeyIndex = keyPath.length - 1;
      for (var i = 0; i < lastKeyIndex; ++ i) {
        var key = keyPath[i];
        if (!(key in obj))
          obj[key] = {}
          obj = obj[key];
      }
      obj[keyPath[lastKeyIndex]] = value;
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
  });
