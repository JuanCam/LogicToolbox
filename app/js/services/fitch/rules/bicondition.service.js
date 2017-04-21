angular
  .module('logicToolsApp')
  .service('fitchBicondition', function (Premise) {
    this.introduction = function (premises, scope) {
      if (!_validatePremises(premises[0], premises[1])) {
        return null;
      }
      if (!_validImplications(premises[0], premises[1])) {
        return null;
      }
      return _getBiconditions(premises, scope);
    };

    function _validatePremises(firstPremise, secondPremise) {
      return firstPremise.isImplication(firstPremise.digest()) && secondPremise.isImplication(secondPremise.digest());
    }
    function _validImplications(firstPremise, secondPremise) {
      var firstConclusion, firstAssumption, secondConclusion, secondAssumption;
      firstConclusion = firstPremise.getConclusion();
      firstAssumption = firstPremise.getAssumption();
      secondConclusion = secondPremise.getConclusion();
      secondAssumption = secondPremise.getAssumption();
      return firstConclusion === secondAssumption && secondConclusion === firstAssumption;
    }
    function _getBiconditions(premises, scope) {
      return _.map(premises, function (premise) {
        return Premise.new({
          scopeLayer: scope.layer,
          scopeId: scope.id,
          value: premise.getConclusion() + '<=>' + premise.getAssumption()
        })
      });
    }
  });
