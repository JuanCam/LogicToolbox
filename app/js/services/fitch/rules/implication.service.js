'use strict';

angular.module('logicToolsApp')
    .service('fitchImplication', function (Premise, formula) {

    	this.introduction = function(scope, lastScope) {
            var headPremise, lastPremise, headValue, lastValue;
            headPremise = lastScope.head;
            lastPremise = lastScope.last;
            headValue = (headPremise.isCompound(headPremise.value))
                            ? '(' + headPremise.value + ')'
                            : headPremise.value;
            lastValue = (lastPremise.isCompound(lastPremise.value))
                            ? '(' + lastPremise.value + ')'
                            : lastPremise.value;
			return Premise.new({
				scopeLayer: scope.layer,
				scopeId: scope.id,
				value: headValue + '=>' + lastValue
			});
    	};

    	this.elimination = function(premiseOne, premiseTwo, scope) {
    		var newPremise = eliminate(premiseTwo, premiseOne, scope) || eliminate(premiseOne, premiseTwo, scope);
    		newPremise.scopeLayer = scope.layer;
    		newPremise.scopeId = scope.id;
            return newPremise;
    	};

    	function eliminate(premiseOne, premiseTwo, scope) {
        var assumption, conclusion, structure, assumptionNegated;
        structure = premiseOne.digest();
        assumption = premiseOne.getAssumption(structure);
        assumptionNegated = premiseOne.hasNegation(assumption);
        assumption = premiseOne.expand(assumption);
        assumption = (assumptionNegated)
        ? assumption
        : premiseOne.unwrap(assumption);

  			if (assumption === premiseTwo.value) {
          conclusion = premiseOne.getConclusion(structure);
  				return Premise.new({
  					scopeLayer : scope.layer,
  					scopeId : scope.id,
  					value: premiseOne.expand(conclusion)
  				});
  			}
    		return null;
    	}
    });
