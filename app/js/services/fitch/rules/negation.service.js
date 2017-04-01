'use strict';

angular.module('logicToolsApp')
    .service('fitchNegation', function (Premise) {
      this.introduction = function(premiseOne, premiseTwo, scope) {
        var newValue;

    	if (!_validImplications(premiseOne, premiseTwo)) {
			return null;
		}
		if (!_validPremises(premiseOne, premiseTwo)) {
			return null;
		}
		if (!_validNegations(premiseOne, premiseTwo)) {
			return null;
		}
		if (!_validConclusions(premiseOne, premiseTwo)) {
			return null;
		}

        newValue = _getAssumption(premiseOne);

        return Premise.new({
          scopeLayer: scope.layer,
          scopeId: scope.id,
    	  value: '~' + newValue
        });
    };

	this.elimination = function(premise, scope) {
        var structure, newValue, negations;
        structure = premise.digest();
        negations = premise.value.match(/^\~+/)[0];

        if (negations.length <= 1) {
            return;
        }

        newValue = negations.slice(2) + premise.removeNegation(structure);
        newValue = (!premise.hasNegation(newValue))
        ? premise.unwrap(premise.expand(newValue))
        : premise.expand(newValue);

		return Premise.new({
          scopeLayer: scope.layer,
          scopeId: scope.id,
          value: newValue
        })
	};

	function _validImplications(premiseOne, premiseTwo) {
		return premiseOne.isImplication() && premiseTwo.isImplication();
	}

	function _validPremises(premiseOne, premiseTwo) {
		return _getAssumption(premiseOne) === _getAssumption(premiseTwo);
	}

	function _validNegations(premiseOne, premiseTwo) {
		return _validNegation(premiseOne, premiseTwo) || _validNegation(premiseTwo, premiseOne);
	}

	function _validConclusions(premiseOne, premiseTwo) {
		return _validConclusion(premiseOne, premiseTwo) || _validConclusion(premiseTwo, premiseOne);
	}

	function _validConclusion(premiseOne, premiseTwo) {
		return _removeNegation(_getConclusion(premiseOne)) === _getConclusion(premiseTwo);
	}

	function _validNegation(premiseOne, premiseTwo) {
        var conclusionOne, conclusionTwo;
        conclusionOne = _getRawConclusion(premiseOne);
        conclusionTwo = _getRawConclusion(premiseTwo);
		return premiseOne.hasNegation(conclusionOne) && !premiseOne.hasNegation(conclusionTwo);
	}

    function _removeNegation(premise) {
        return premise.replace(/\~+/g,'');
    }

    function _getAssumption(premise) {
        var structure, assumption;
        structure = premise.digest();
        assumption = premise.getAssumption(structure);
        return premise.expand(assumption);
    }

    function _getConclusion(premise) {
        var structure, conclusion, expanded;
        structure = premise.digest();
        conclusion = premise.getConclusion(structure);
        expanded = premise.expand(_removeNegation(conclusion));
        return (premise.hasNegation(conclusion)) 
        ? '~' + expanded
        : expanded;
    }

    function _getRawConclusion(premise, structure) {
        var structure, conclusion;
        structure = premise.digest();
        conclusion = premise.getConclusion(structure);
        return conclusion;
    }

});
