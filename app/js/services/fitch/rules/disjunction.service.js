'use strict';

angular.module('logicToolsApp')
    .service('fitchDisjunction', function (Premise) {
      this.elimination = function (premises, scope) {
          var uniqueConclusions, assumptions;
          assumptions = _getAssumptions(premises.implications);
          uniqueConclusions = _getUniqueConclusions(premises.implications);
      }

      function _getUniqueConclusions(implications) {
          return _.chain(premises.implications)
                  .map(function (premise) {
                      return premise.expand(premise.getConclusion(premise.digest()));
                  })
                  .uniq()
                  .value();
      }

      function _getAssumptions(implications) {
          return _.map(implications, function (premise) {
                       return premise.expand(premise.getAssumption(premise.digest()));
                  });
      }

    });
