'use strict';

angular.module('logicToolsApp')
    .factory('formula', function(ALIASES) {

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
          break: function (value) {
            return value.match(/[(]{1}[\w~<=>|&]+(?=[)]{1})[)]{1}/g);
          },
          operation: function(assumption) {
              var operation = 'single';
              if (isBicon(assumption.value)) {
                  operation = 'bicondition';
              } else if (isThen(assumption.value)) {
                  operation = 'implication';
              } else if (isAnd(assumption.value)) {
                  operation = 'and';
              } else if (isOr(assumption.value)) {
                  operation = 'or';
              }
              return operation;
          },
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
