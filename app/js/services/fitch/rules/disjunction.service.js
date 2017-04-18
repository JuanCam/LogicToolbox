'use strict';

angular
  .module('logicToolsApp')
  .service('fitchDisjunction', function (Premise) {

    this.elimination = function (premises, scope) {
      var uniqueConclusions, assumptions, disjunction;
      assumptions = _getAssumptions(premises.implications);
      uniqueConclusions = _getUniqueConclusions(premises.implications);

      if(uniqueConclusions.length !== 1) {
        return null;
      }

      if(!_isValidOperation(assumptions, premises.disjunctions[0])) {
        return null;
      }

      return Premise.new({
        scopeLayer: scope.layer,
        scopeId: scope.id,
        value: uniqueConclusions[0]
      });

    }

    this.introduction = function (value, selected, scope) {
      var selectedValues, finalValue;
      selectedValues = _.map(selected, function (premise) {
          return (premise.isCompound())
                    ? '(' + premise.value + ')'
                    : premise.value;
      });
      finalValue = [value].concat(selectedValues);
      return Premise.new({
        scopeLayer: scope.layer,
        scopeId: scope.id,
        value: finalValue.join('|')
      });
    }

    function _getUniqueConclusions(implications) {
      return _.chain(implications)
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

    function _isValidOperation(premises, disjunction) {
      var structure, assumptions;
      structure = disjunction.digest();
      assumptions = premises.slice();

      return _.filter(structure.split(/\|+/), function(label) {
          return assumptions.indexOf(disjunction.expand(label)) !== -1
      }).length === premises.length;
    }

  });
