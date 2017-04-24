angular
  .module('logicToolsApp')
  .service('fitchConjunction', function (Premise) {
    this.introduction = function (premises, scope) {
      var selectedValues = _.map(premises, function (premise) {
          return (premise.isCompound())
                    ? '(' + premise.value + ')'
                    : premise.value;
      })
      return _getConjuctions(selectedValues, scope);
    }
    this.elimination = function (premise, scope) {
      var digestedPremise = premise.digest();
      return _.chain(digestedPremise)
              .split(/\&+/)
              .map(function (simplePremise) {
                var expanded = premise.expand(simplePremise)
                return Premise.new({
                  scopeLayer: scope.layer,
                  scopeId: scope.id,
                  value: premise.unwrap(expanded)
                });
              })
              .value();
    }

    function _getConjuctions(premisesValue, scope) {
      return _.chain(premisesValue)
              .map(function (premiseValue) {
                return _getPosibleJoins(premiseValue, premisesValue, scope);
              })
              .flattenDeep()
              .value();
    }

    function _getPosibleJoins(value, premisesValue, scope) {
      return _.map(premisesValue, function (premiseValue) {
        return Premise.new({
          scopeLayer: scope.layer,
          scopeId: scope.id,
          value: value + '&' + premiseValue
        });
      });
    }
  });
