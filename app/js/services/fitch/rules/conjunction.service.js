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
      })
    }
  });
