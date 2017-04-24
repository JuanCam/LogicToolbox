angular
  .module('logicToolsApp')
  .service('fitchBicondition', function (Premise) {
    this.introduction = function (premises, scope) {
      if (!_validatePremises(premises[0], premises[1])) {
        return null;
      }
      if (!_validateImplications(premises[0], premises[1])) {
        return null;
      }
      return _getBiconditions(premises, scope);
    };

    this.elimination = function (premise, scope) {
      var digested = premise.digest();
      if (!premise.isBicon(digested)) {
        return null;
      }

      return _getImplications(premise, digested, scope);
    }

    function _validatePremises(firstPremise, secondPremise) {
      var firstValue, secondValue;
      firstValue = firstPremise.digest();
      secondValue = secondPremise.digest();
      return firstPremise.isImplication(firstValue) && secondPremise.isImplication(secondValue);
    }
    function _validateImplications(firstPremise, secondPremise) {
      var firstValue, secondValue, firstConclusion, firstAssumption,
          secondConclusion, secondAssumption;
      firstValue = firstPremise.digest();
      secondValue = secondPremise.digest();
      firstConclusion = firstPremise.getExpandedConclusion(firstValue);
      firstAssumption = firstPremise.getExpandedAssumption(firstValue);
      secondConclusion = secondPremise.getExpandedConclusion(secondValue);
      secondAssumption = secondPremise.getExpandedAssumption(secondValue);
      return firstConclusion === secondAssumption && secondConclusion === firstAssumption;
    }
    function _getImplications(premise, digested, scope) {
      var atomics, index;
      atomics = digested.split(/[<][=][>]/g);
      index = atomics.length;
      return _.map(atomics, function (atomicPremise) {
        index--;
        return Premise.new({
          scopeLayer: scope.layer,
          scopeId: scope.id,
          value: premise.expand(atomicPremise) + '=>' + premise.expand(atomics[index])
        });
      });
    }
    function _getBiconditions(premises, scope) {
      return _.map(premises, function (premise) {
        var value = premise.digest()
        return Premise.new({
          scopeLayer: scope.layer,
          scopeId: scope.id,
          value: premise.getExpandedConclusion(value) + '<=>' + premise.getExpandedAssumption(value)
        })
      });
    }
  });
