angular
  .module('logicToolsApp')
  .service('fitchConjunction', function (Premise) {
    this.introduction = function (premises, scope) {
      var premiseValue = _.map(premises, function (premise) {
          return (premise.isCompound())
                    ? '(' + premise.value + ')'
                    : premise.value;
      })
      return Premise.new({
        scopeLayer: scope.layer,
        scopeId: scope.id,
        value: premiseValue.join('&')
      });
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
  });
