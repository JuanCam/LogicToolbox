'use strict';

angular.module('logicToolsApp')
    .factory('formula', function() {

        function isThen(premise) {
            return /[=][>]/g.exec(premise);
        }
        function isAnd(premise) {
            return /[&]/g.exec(premise);
        }
        function isOr(premise) {
            return /[|]/g.exec(premise);
        }
        function isBicon(premise) {
            return /[<][=][>]/g.exec(premise);
        }
        return {
          /*Truth table methods*/
          resultFn: function(premise) {
              var getResult;
              if (isBicon(premise)) {
                  getResult = function(a, b) {
                      return (!a || b) && (!b || a);
                  }
              } else if (isThen(premise)) {
                  getResult = function(a, b) {
                      return !a || b;
                  }
              } else if (isAnd(premise)) {
                  getResult = function(a, b) {
                      return a && b;
                  }
              } else if (isOr(premise)) {
                  getResult = function(a, b) {
                      return a || b;
                  }
              }
              return getResult;
          }
        }
    });
